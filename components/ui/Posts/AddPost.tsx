import { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, getDocs, where } from 'firebase/firestore';
import axios from 'axios';
import {  useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { listenForAuthChanges } from '@/features/auth/authSlice';
import { AppDispatch } from '@/redux/store';
import toast from 'react-hot-toast';

const PostJob = () => {
    const [currentUser,setCurrentUser] = useState<any>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [content, setContent] = useState('');
    const [files, setFiles] = useState<{ url: string; file: File }[]>([]);
    const [isPosting, setIsPosting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const Router = useRouter();
    const dispatch = useDispatch<AppDispatch>()
    const { user } = useSelector((state: { auth: { user: any } }) => state.auth);



    useEffect(()=>{
    const fetchUser = async () => {
        if(user === null) return;
        const q = query(collection(db, 'profiles'), where('id', '==', user?.uid));
        const querySnapshot = await getDocs(q);
        console.log('fetched fb')
        if (querySnapshot.empty) return null;
        setCurrentUser({
            uid : querySnapshot.docs[0].data().id,
            role : querySnapshot.docs[0].data().role,
            firstname  : querySnapshot.docs[0].data().firstname,
            lastname  : querySnapshot.docs[0].data().lastname,
            avatar : querySnapshot.docs[0].data().avatar,
            title : querySnapshot.docs[0].data().position,
        });
      };
      fetchUser();
},[user])
  

    const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
        if (files.length + selectedFiles.length > 5) {
            alert('You can upload a maximum of 5 files.');
            return;
        }

        setFiles((prev) => [
            ...prev,
            ...selectedFiles.map((file) => ({ url: URL.createObjectURL(file), file }))
        ]);
        setIsExpanded(true);
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    // Handle post submission
    const handlePost = async () => {
          dispatch(listenForAuthChanges());
                    if(!user){
                        Router.push('/login')
                    }else{
                  
        if (!content.trim() && files.length === 0) return;
        setIsPosting(true);

        try {
            const uploadedFiles = await Promise.all(
                files.map(async (fileObj) => {
                    const formData = new FormData();
                    formData.append('file', fileObj.file);  
                    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
                    formData.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!);
                    try {
                        const uploadEndpoint = fileObj.file.type.startsWith('video/')
                            ? `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`
                            : `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

                        const response = await axios.post(uploadEndpoint, formData);
                        console.log('Uploaded File URL:', response.data.secure_url);
                        return response.data.secure_url;
                    } catch (error) {
                        if (axios.isAxiosError(error)) {
                            console.error('Axios error:', error.response?.data);  
                            toast.error('Error uploading files');
                        } else {
                            console.error('Unknown error:', error);
                            toast.error('Error uploading files');
                        }
                    }
                })
            );

            const validFiles = uploadedFiles.filter(Boolean) as string[];

            await addDoc(collection(db, 'posts'), {
                source : currentUser.role,
                author: {
                    name: currentUser.firstname + ' ' + currentUser.lastname,
                    avatar: currentUser.avatar,
                    title: currentUser.title, 
                    id: currentUser.uid
                },
                content: content.trim(),
                medias: validFiles.map((url, index) => ({
                    type: files[index].file.type.startsWith('video/') ? 'video' : 'image',
                    url,
                })),
                thumbnailUrl: '', 
                comments: 0, 
                likes: 0, 
                shares: 0, 
                timestamp: serverTimestamp(), 
            });

            setContent('');
            setFiles([]);
            setIsExpanded(false);
        } catch (error) {
            toast.error('Error creating post. Please try again later.');
            console.error('Error posting:', error);
        } finally {
            setIsPosting(false);
        }
    };
    };

    return (
        <div className="bg-dark-primary rounded-lg shadow-sm">
            <div className="p-4">
                <div className="flex gap-3">
                    {currentUser?.avatar ? (
                        <div className="h-12 w-12 rounded-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${currentUser.avatar})` }}></div>
                    ) : (
                        <svg
                            className="h-12 w-12 rounded-full bg-gray-300"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 14l9-5-9-5-9 5 9 5z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5a12.083 12.083 0 01-6.16-10.922L12 14z"
                            />
                        </svg>
                    )}
                    <button
                        onClick={() => setIsExpanded(true)}
                        className={`flex-1 text-left px-4 py-3 rounded-full border border-dark-secondary
                                         hover:bg-dark-secondary text-white/50 transition-colors
                                         ${isExpanded ? 'bg-dark-secondary' : ''}`}
                    >
                        Start a post
                    </button>
                </div>

                {isExpanded && (
                    <div className="mt-4">
                        <textarea
                            autoFocus
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What do you want to talk about?"
                            className="w-full bg-transparent resize-none outline-none text-[#c9d1d9]
                                             placeholder-[#8b949e] min-h-[120px]"
                            rows={4}
                            maxLength={500}
                        />
                        {files.length > 0 && (
                            <div className="mt-3 grid grid-cols-2 gap-2">
                                {files.map((file, index) => (
                                    <div key={index} className="relative group">
                                        <img src={file.url} alt="Preview" className="rounded-lg w-full h-32 object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="absolute top-2 right-2 p-1 rounded-full bg-[#0d1117]/75 text-[#c9d1d9] opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="border-t border-[#21262d] px-4 py-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center -ml-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelection}
                            multiple
                            accept="image/*,video/*"
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center p-2 rounded transition-colors gap-2
                                                 hover:bg-dark-secondary group"
                        >
                            <ImageIcon className="h-5 w-5 text-[#c9d1d9]" />
                            <span className="text-sm hidden sm:block text-[#c9d1d9]">Media</span>
                        </button>
                    </div>
                    {isExpanded && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setIsExpanded(false);
                                    setContent('');
                                    setFiles([]);
                                }}
                                className="px-3 py-1.5 text-sm font-medium text-[#c9d1d9]
                                                 hover:bg-dark-secondary rounded transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePost}
                                disabled={isPosting || (!content.trim() && files.length === 0)}
                                className="px-4 py-1.5 text-sm font-medium bg-theme-primary text-white rounded disabled:opacity-50 transition-all"
                            >
                                {isPosting ? 'Posting...' : 'Post'}
                            </button>
                        </div>
                    )}
                </div>
            
            </div>
        </div>
    );
};

export default PostJob;
