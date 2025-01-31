import React, { useState } from 'react'
import { collection, addDoc, Timestamp, updateDoc, increment, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const ApplyModal = ({ setIsApplicationModalOpen,isApplicationModalOpen ,currentJobId, setError }: { setIsApplicationModalOpen: (isOpen: boolean) => void,isApplicationModalOpen : boolean, currentJobId: string | null, setError: (error: string) => void }) => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [motivationLetter, setMotivationLetter] = useState<string>('');
    
    const user = {
        uid: "id1",
        photoURL: "https://example.com/photo.jpg" 
    }; 
        // Handle job application
        const handleApply = async () => {
            if (!user || !currentJobId) {
                setError('You must be logged in to apply for a job.');
                return;
            }
            if (!name || !email || !motivationLetter) {
                setError('All fields are required.');
                return;
            }
            try {
                await addDoc(collection(db, 'applications'), {
                    jobId: currentJobId,
                    userId: user.uid,
                    name,
                    email,
                    motivationLetter,
                    avatar: user.photoURL,
                    appliedAt: Timestamp.now(),
                });
                await updateDoc(doc(db,'jobs',currentJobId),{
                    applicants : increment(1)
                })
                setIsApplicationModalOpen(false);
                setName('');
                setEmail('');
                setMotivationLetter('');
                alert('Application submitted successfully!');
            } catch (err) {
                setError('Failed to submit application. Please try again.');
            }
        };


  return (
     <AnimatePresence> 
     {isApplicationModalOpen && (
         <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
         >
             <motion.div
                 initial={{ scale: 0.9 }}
                 animate={{ scale: 1 }}
                 exit={{ scale: 0.9 }}
                 className="bg-dark-primary rounded-lg shadow-lg p-6 w-full max-w-md"
             >
                 <div className="flex justify-between items-center mb-4">
                     <h2 className="text-xl font-semibold text-gray-100">Apply for Job</h2>
                     <button onClick={() => setIsApplicationModalOpen(false)} className="text-gray-500 hover:text-gray-300">
                         <X className="h-6 w-6" />
                     </button>
                 </div>
                 <form
                     onSubmit={(e) => {
                         e.preventDefault();
                         handleApply();
                     }}
                     className="space-y-4"
                 >
                     <div>
                         <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                         <input
                             type="text"
                             value={name}
                             onChange={(e) => setName(e.target.value)}
                             className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-dark-secondary text-gray-100 focus:outline-none"
                             required
                         />
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                         <input
                             type="email"
                             value={email}
                             onChange={(e) => setEmail(e.target.value)}
                             className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-dark-secondary text-gray-100 focus:outline-none"
                             required
                         />
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-300 mb-1">Motivation Letter</label>
                         <textarea
                             value={motivationLetter}
                             onChange={(e) => setMotivationLetter(e.target.value)}
                             className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-dark-secondary text-gray-100 focus:outline-none"
                             rows={4}
                             required
                         />
                     </div>
                     <button
                         type="submit"
                         className="w-full bg-theme-primary hover:opacity-90 text-white px-4 py-2 rounded-lg transition-opacity"
                     >
                         Submit Application
                     </button>
                 </form>
             </motion.div>
         </motion.div>
     )}
 </AnimatePresence>
  )
}

export default ApplyModal