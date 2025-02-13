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

      // Send a notification to the user
      await addNotification(userId, "Your application has been approved!");

      toast.success("Application approved");
      fetchApplications(selectedJobId!); // Refresh the applications list
    } catch (error) {
      console.error("Error approving application:", error);
      toast.error("Failed to approve application");
    }
  };

  // Add Notification
  const addNotification = async (userId: string, message: string) => {
    try {
      await addDoc(collection(db, "notifications"), {
        userId,
        content: message,
        header: "Application Approved",
        read: false,
        time: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error sending notification:", error);
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
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="p-6 bg-gray-800">
        <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
      </header>

      <div className="p-6">
        <h2 className="text-xl mb-4">Your Posted Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id} className="p-4 rounded-lg bg-gray-800">
                <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
                <p className="text-sm mb-2">{job.company}</p>
                <p className="text-sm mb-4">{job.description?.substring(0, 100)}...</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setSelectedJobId(job.id);
                      fetchApplications(job.id);
                    }}
                    className="px-2 py-1 rounded bg-teal-600 hover:bg-teal-500"
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
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl overflow-y-auto" style={{ maxHeight: "90vh" }}>
            <h2 className="text-xl mb-4">Applications for Job</h2>
            <div className="space-y-4">
              {applications.length > 0 ? (
                applications.map((application) => (
                  <div key={application.id} className="p-4 rounded-lg bg-gray-700">
                    <h3 className="text-lg font-semibold">{application.name}</h3>
                    <p className="text-sm">{application.email}</p>
                    <div className="mt-2">
                      <button
                        onClick={() => openMotivationLetter(application.motivationLetter)}
                        className="px-2 py-1 rounded bg-teal-600 hover:bg-teal-500 mr-2"
                      >
                        View Motivation Letter
                      </button>
                      <button
                        onClick={() => approveApplication(application.id, application.userId)}
                        className="px-2 py-1 rounded bg-green-600 hover:bg-green-500"
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
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl overflow-y-auto" style={{ maxHeight: "90vh" }}>
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

export default RecruiterDashboard;