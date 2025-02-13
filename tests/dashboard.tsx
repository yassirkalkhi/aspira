"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { listenForAuthChanges } from "@/features/auth/authSlice";
import { checkRole } from "@/sessions/sessions";
import toast from "react-hot-toast";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore"; 
import {db } from '@/lib/firebase'
import { auth } from "@/lib/firebase";



const page = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [newRequirement, setNewRequirement] = useState("");
  const [blocked , setBlocked] = useState(false);
  const Router = useRouter();
  const user = useSelector((state: { auth: { user: any } }) => state.auth.user);
  useEffect(() => {
    dispatch(listenForAuthChanges());
  }, [dispatch]);

    useEffect(() => {
          const initializeAuth = async () => {
            setLoading(true);
              const session = await checkRole("admin");
              if(!session){
                toast.error('You are not authorized to access this page');
                setLoading(false);
              }else{
                toast.success('You have  access to  this page');
                setLoading(false);
              }
          };
          initializeAuth();
        }, []);


  // Fetch Data
  const fetchUsers = async () => {
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    const usersData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(usersData);
  };

  const fetchPosts = async () => {
    const q = query(collection(db, "posts"));
    const querySnapshot = await getDocs(q);
    setPosts(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const fetchJobs = async () => {
    const q = query(collection(db, "jobs"));
    const querySnapshot = await getDocs(q);
    setJobs(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  // Update User Status
  const updateUserStatus = async (userId: string, newStatus: boolean) => {
    try {
      await updateDoc(doc(db, "users", userId), { isOnline: newStatus });
      toast.success("User status updated");
    } catch (error) {
      toast.error("Error updating user status");
    }
  };

  // Delete Content
  const deleteContent = async (collectionName: string, docId: string) => {
    try {
      await deleteDoc(doc(db, collectionName, docId));
      toast.success("Item deleted successfully");
      switch (collectionName) {
        case "posts":
          await fetchPosts();
          break;
        case "jobs":
          await fetchJobs();
          break;
      }
    } catch (error) {
      toast.error("Error deleting item");
    }
  };

  // Delete User
  const deleteUser = async (userId: string) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      await deleteDoc(doc(db, "profiles", userId));
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Error deleting user");
    }
  };

  // Edit User
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await updateDoc(doc(db, "users", editingUser.id), {
        email: editingUser.email,
        username: editingUser.username,
        firstname: editingUser.firstname,
        lastname: editingUser.lastname,
        role: editingUser.role,
      });
      toast.success("User updated successfully");
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      toast.error("Error updating user");
    }
  };

  // Edit Post
  const handleEditPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    try {
      await updateDoc(doc(db, "posts", editingPost.id), {
        content: editingPost.content,
        media: editingPost.media || [], // Ensure media is an array
      });
      toast.success("Post updated successfully");
      setEditingPost(null);
      fetchPosts();
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Error updating post");
    }
  };

  // Edit Job
  const handleEditJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    // Validate expiration date
    if (!editingJob.expressAt) {
      toast.error("Expiration date is required");
      return;
    }

    try {
      const expirationDate =
        editingJob.expressAt instanceof Timestamp
          ? editingJob.expressAt
          : Timestamp.fromDate(new Date(editingJob.expressAt));

      await updateDoc(doc(db, "jobs", editingJob.id), {
        ...editingJob,
        expressAt: expirationDate,
        salary: Number(editingJob.salary),
        requirements: editingJob.requirements || [],
      });

      toast.success("Job updated successfully");
      setEditingJob(null);
      fetchJobs();
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("Error updating job. Check console for details.");
    }
  };

  // Job Requirements Management
  const addRequirement = () => {
    if (newRequirement.trim()) {
      setEditingJob({
        ...editingJob,
        requirements: [...(editingJob.requirements || []), newRequirement],
      });
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    const updatedRequirements = editingJob.requirements.filter(
      (_: string, i: number) => i !== index
    );
    setEditingJob({ ...editingJob, requirements: updatedRequirements });
  };

  useEffect(() => {
    dispatch(listenForAuthChanges());

    const verifyAdmin = async () => {
      const isAdmin = await checkRole("admin");
      if (!isAdmin) {
        toast.error("Unauthorized access");
        setBlocked(true);
      } else {
        fetchUsers();
        fetchPosts();
        fetchJobs();
      }
      setLoading(false);
    };

    verifyAdmin();
  }, []);

 
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">cheking permission...</div>;
  }
  if(blocked){
    return <div className="flex items-center justify-center min-h-screen">Access denied...</div>;
  }
  return (
    <div className="min-h-screen bg-dark-secondary text-gray-100">
      <header className="p-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </header>

      <div className="flex border-b border-teal-500">
        {["users", "posts", "jobs"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 capitalize ${
              activeTab === tab
                ? "border-b-2 font-semibold text-teal-400 border-teal-400"
                : "hover:bg-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* Users Table */}
        {activeTab === "users" && (
          <div className="overflow-x-auto">
            <table className="w-full bg-dark-primary rounded-lg">
              <thead>
                <tr>
                  <th className="p-3 text-left">Username</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-teal-500">
                    <td className="p-3">{user.username}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3">
                      <span
                        onClick={() => updateUserStatus(user.id, !user.isOnline)}
                        className={`cursor-pointer inline-block w-3 h-3 rounded-full ${
                          user.isOnline ? "bg-green-500" : "bg-gray-500"
                        }`}
                      />
                    </td>
                    <td className="p-3 space-x-3">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="px-3 py-1 rounded bg-theme-primary mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="px-3 py-1 rounded bg-red-600 hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Posts Management */}
        {activeTab === "posts" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <div key={post.id} className="p-4 rounded-lg bg-dark-primary">
                <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                <p className="text-sm mb-4">{post.content?.substring(0, 100)}...</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingPost(post)}
                    className="px-2 py-1 rounded bg-theme-primary hover:bg-teal-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteContent("posts", post.id)}
                    className="px-2 py-1 rounded bg-red-600 hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Jobs Management */}
        {activeTab === "jobs" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <div key={job.id} className="p-4 rounded-lg bg-dark-primary">
                <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
                <p className="text-sm mb-2">{job.company}</p>
                <p className="text-sm mb-4">{job.description?.substring(0, 100)}...</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingJob(job)}
                    className="px-2 py-1 rounded bg-theme-primary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteContent("jobs", job.id)}
                    className="px-2 py-1 rounded bg-red-600 hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-dark-primary rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl mb-4">Edit User</h2>
            <form onSubmit={handleEditUser} className="space-y-4">
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  value={editingUser.email || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  className="w-full p-2 rounded mt-1 bg-dark-secondary text-white"
                />
              </div>
              <div>
                <label>Username:</label>
                <input
                  value={editingUser.username || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, username: e.target.value })
                  }
                  className="w-full p-2 rounded mt-1 bg-dark-secondary text-white"
                />
              </div>
              <div>
                <label>First Name:</label>
                <input
                  value={editingUser.firstname || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, firstname: e.target.value })
                  }
                  className="w-full p-2 rounded mt-1 bg-dark-secondary text-white"
                />
              </div>
              <div>
                <label>Last Name:</label>
                <input
                  value={editingUser.lastname || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, lastname: e.target.value })
                  }
                  className="w-full p-2 rounded mt-1 bg-dark-secondary text-white"
                />
              </div>
              <div>
                <label>Role:</label>
                <select
                  value={editingUser.role || "user"}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                  className="w-full p-2 rounded mt-1 bg-dark-secondary text-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-theme-primary hover:bg-teal-500"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-dark-primary rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl mb-4">Edit Post</h2>
            <form onSubmit={handleEditPost} className="space-y-4">
              <div>
                <label>Content:</label>
                <textarea
                  value={editingPost.content || ""}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, content: e.target.value })
                  }
                  className="w-full p-2 rounded mt-1 h-32 bg-dark-secondary text-white"
                />
              </div>
              <div>
                <label>Media URL:</label>
                <input
                  value={editingPost.media?.[0]?.url || ""}
                  onChange={(e) =>
                    setEditingPost({
                      ...editingPost,
                      media: [{ ...editingPost.media[0], url: e.target.value }],
                    })
                  }
                  className="w-full p-2 rounded mt-1 bg-dark-secondary text-white"
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-theme-primary"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {editingJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-dark-primary rounded-lg p-6 w-full max-w-lg overflow-y-auto" style={{ maxHeight: "90vh" }}>
            <h2 className="text-xl mb-4">Edit Job</h2>
            <form onSubmit={handleEditJob} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label>Job Title:</label>
                  <input
                    value={editingJob.title || ""}
                    onChange={(e) =>
                      setEditingJob({ ...editingJob, title: e.target.value })
                    }
                    className="w-full p-2 rounded mt-1 bg-dark-secondary text-white"
                  />
                </div>

                <div>
                  <label>Company:</label>
                  <input
                    value={editingJob.company || ""}
                    onChange={(e) =>
                      setEditingJob({ ...editingJob, company: e.target.value })
                    }
                    className="w-full p-2 rounded mt-1 bg-dark-secondary text-white"
                  />
                </div>

                <div>
                  <label>Location:</label>
                  <input
                    value={editingJob.location || ""}
                    onChange={(e) =>
                      setEditingJob({ ...editingJob, location: e.target.value })
                    }
                    className="w-full p-2 rounded mt-1 bg-dark-secondary text-white"
                  />
                </div>

                <div>
                  <label>Salary:</label>
                  <input
                    type="number"
                    value={editingJob.salary || ""}
                    onChange={(e) =>
                      setEditingJob({ ...editingJob, salary: e.target.value })
                    }
                    className="w-full p-2 rounded mt-1 bg-dark-secondary text-white"
                  />
                </div>

                <div>
                  <label>Expiration Date:</label>
                  <input
                    type="datetime-local"
                    value={editingJob.expressAt?.toDate().toISOString().slice(0, 16) || ""}
                    onChange={(e) =>
                      setEditingJob({
                        ...editingJob,
                        expressAt: Timestamp.fromDate(new Date(e.target.value)),
                      })
                    }
                    className="w-full p-2 rounded mt-1 bg-dark-secondary text-white"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label>Requirements:</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {editingJob.requirements?.map((requirement: string, index: number) => (
                      <div key={index} className="flex items-center bg-dark-secondary rounded px-2 py-1">
                        <span>{requirement}</span>
                        <button
                          type="button"
                          onClick={() => removeRequirement(index)}
                          className="ml-2 text-red-500 hover:text-red-400"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex mt-2">
                    <input
                      type="text"
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      className="w-full p-2 rounded bg-dark-secondary text-white"
                      placeholder="Add a new requirement"
                    />
                    <button
                      type="button"
                      onClick={addRequirement}
                      className="ml-2 px-4 py-2 rounded bg-theme-primary hover:bg-teal-500"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-theme-primary hover:bg-teal-500"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;