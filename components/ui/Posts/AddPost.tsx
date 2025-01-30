import { useState, useRef } from 'react';
import { Image, X } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import axios from 'axios';

const PostJob = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [content, setContent] = useState('');
    const [files, setFiles] = useState<{ url: string; file: File }[]>([]);
    const [isPosting, setIsPosting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const currentUser = {
        uid: 'id1',
        displayName: 'John Doe',
        photoURL: 'https://github.com/shadcn.png',
        title: 'Software Engineer',
    };

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
        if (!content.trim() && files.length === 0) return;

        setIsPosting(true);
        setErrorMessage(null);

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
                            setErrorMessage(`Error uploading file: ${error.response?.data?.message || 'Unknown error'}`);
                        } else {
                            console.error('Unknown error:', error);
                            setErrorMessage(`Error uploading file: ${fileObj.file.name}`);
                        }
                    }
                })
            );

            const validFiles = uploadedFiles.filter(Boolean) as string[];

            await addDoc(collection(db, 'posts'), {
                author: {
                    name: currentUser.displayName,
                    avatar: currentUser.photoURL,
                    title: currentUser.title, 
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
            setErrorMessage('Error creating post. Please try again later.');
            console.error('Error posting:', error);
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="bg-white dark:bg-dark-primary rounded-lg shadow-sm">
            <div className="p-4">
                <div className="flex gap-3">
                    <img
                        src={currentUser.photoURL}
                        alt="User avatar"
                        className="h-12 w-12 rounded-full"
                    />
                    <button
                        onClick={() => setIsExpanded(true)}
                        className={`flex-1 text-left px-4 py-3 rounded-full border border-gray-300 dark:border-dark-secondary
                                         hover:bg-gray-100 dark:hover:bg-dark-secondary text-gray-500 dark:text-white/50 transition-colors
                                         ${isExpanded ? 'bg-gray-100 dark:bg-dark-secondary' : ''}`}
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
                            className="w-full bg-transparent resize-none outline-none text-gray-700 dark:text-[#c9d1d9]
                                             placeholder-gray-500 dark:placeholder-[#8b949e] min-h-[120px]"
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

            <div className="border-t dark:border-[#21262d] px-4 py-2">
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
                                                 hover:bg-gray-100 dark:hover:bg-dark-secondary group"
                        >
                            <Image className="h-5 w-5 text-gray-900/60 dark:text-[#c9d1d9]" />
                            <span className="text-sm hidden sm:block text-gray-900 dark:text-[#c9d1d9]">Media</span>
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
                                className="px-3 py-1.5 text-sm font-medium text-gray-900 dark:text-[#c9d1d9]
                                                 hover:bg-gray-100 dark:hover:bg-dark-secondary rounded transition-colors"
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
                {errorMessage && (
                    <div className="mt-2 text-red-600 dark:text-red-400">
                        {errorMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostJob;
