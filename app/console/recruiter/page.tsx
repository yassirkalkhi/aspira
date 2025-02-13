"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { auth } from "@/lib/firebase";
import withAuth from "@/components/auth/withAuth";

const db = getFirestore();

const RecruiterDashboard = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [motivationLetter, setMotivationLetter] = useState<string | null>(null); 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        toast.error("User not logged in");
        router.push("/login"); 
      } else {
        fetchJobs(); 
      }
    });

    return () => unsubscribe(); 
  }, [router]);

  const fetchJobs = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("User not logged in");
        return;
      }

      const q = query(collection(db, "jobs"), where("recruiterId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const jobsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(jobsData);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (jobId: string) => {
    try {
      const q = query(collection(db, "applications"), where("jobId", "==", jobId));
      const querySnapshot = await getDocs(q);
      const applicationsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setApplications(applicationsData);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to fetch applications");
    }
  };

  const approveApplication = async (applicationId: string, userId: string) => {
    try {
      await updateDoc(doc(db, "applications", applicationId), {
        approved: true,
      });

      const job = jobs.find((job) => job.id === selectedJobId);
      await addNotification(userId, `Your application for the job "${job?.title}" has been approved!`);
      toast.success("Application approved");
      fetchApplications(selectedJobId!); 
    } catch (error) {
      console.error("Error approving application:", error);
      toast.error("Failed to approve application");
    }
  };

  // Add Notification
  const addNotification = async (userId: string, message: string) => {
    try {
      await addDoc(collection(db, "notifications"), {
        receiveId: userId,
        content: message,
        header: "Application Approved",
        read: false,
        time: new Date(),
      });
    } catch (error) {
      toast.error("Error sending notification:");
    }
  };

  // Open Motivation Letter Modal
  const openMotivationLetter = (letter: string) => {
    setMotivationLetter(letter);
  };

  // Close Motivation Letter Modal
  const closeMotivationLetter = () => {
    setMotivationLetter(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-primary text-white">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-secondary text-gray-100">
      <header className="p-6 bg-dark-secondary">
        <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
      </header>

      <div className="p-6">
        <h2 className="text-xl mb-4">Your Posted Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id} className="p-4 rounded-lg bg-dark-primary">
                <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
                <p className="text-sm mb-2">{job.company}</p>
                <p className="text-sm mb-4">{job.description?.substring(0, 100)}...</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setSelectedJobId(job.id);
                      fetchApplications(job.id);
                    }}
                    className="px-2 py-1 rounded bg-theme-primary hover:bg-theme-primary/80"
                  >
                    View Applications
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No jobs posted yet.</p>
          )}
        </div>
      </div>

      {/* Applications Modal */}
      {selectedJobId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-dark-primary rounded-lg p-6 w-full max-w-2xl overflow-y-auto" style={{ maxHeight: "90vh" }}>
            <h2 className="text-xl mb-4">Applications for Job</h2>
            <div className="space-y-4 overflow-y-auto ">
              {applications.length > 0 ? (
                applications.map((application) => (
                    <div key={application.id} className="p-4 rounded-lg bg-dark-secondary flex items-start justify-between">
                      <div className="w-full">
                      <h3 className="text-lg font-semibold"> {application.name}</h3>
                      <p className="text-sm"> {application.email}</p>
                      </div>
                      <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => openMotivationLetter(application.motivationLetter)}
                        className="px-2 py-1  w-28 text-xs rounded bg-theme-primary hover:bg-theme-primary/80"
                      >
                         Motivation Letter
                      </button><button
                        onClick={() => approveApplication(application.id, application.userId)}
                        className="px-2 py-2 text-xs rounded bg-green-600 hover:bg-green-500"
                        disabled={application.approved}
                      >
                        {application.approved ? "Approved" : "Approve"}
                      </button>
                      </div>
                    </div>
                ))
              ) : (
                <p className="text-gray-400">No applications found for this job.</p>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedJobId(null)}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Motivation Letter Modal */}
      {motivationLetter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-dark-primary rounded-lg p-6 w-full max-w-2xl overflow-y-auto" style={{ maxHeight: "90vh" }}>
            <h2 className="text-xl mb-4">Motivation Letter</h2>
            <div className="whitespace-pre-wrap text-gray-100">{motivationLetter}</div>
            <div className="flex justify-end mt-6">
              <button
                onClick={closeMotivationLetter}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(RecruiterDashboard);