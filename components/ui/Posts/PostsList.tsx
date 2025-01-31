import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Post } from '@/types/types';
import { ThumbsUp,RotateCcw, Loader } from 'lucide-react';
import Actions from './PostActions';
import renderPostContent from './PostParts/PostContent';
import renderPostAlert from './PostParts/PostAlert';
import renderFollowButton from './PostParts/PostFollowButton';

const PostsList = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    

    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    // Fetch Posts function
    const fetchPosts = async () => {
        setLoading(true);
        setError(null); 
        try {
            const postsRef = collection(db, 'posts');
            const q = query(postsRef, orderBy('timestamp', 'desc'));
            const snapshot = await getDocs(q); 
            
            const postsData = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    source: data.source,
                    author: {
                        name: data.author.name,
                        avatar: data.author.avatar,
                        title: data.author.title,
                    },
                    content: data.content,
                    medias: data.medias,
                    timestamp: data.timestamp
                        ? data.timestamp.toDate().toLocaleString('en-US', {
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                          })
                        : 'Just now',
                    likes: formatNumber(data.likes),
                    comments: formatNumber(data.comments),
                    shares: formatNumber(data.shares),
                };
            });
    
            setPosts(postsData);
        } catch (e: any) {
            setError("Error getting Posts");
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchPosts(); // Fetch posts initially
    }, []);
    



    return (
        <div className="space-y-6 mt-6">
            <span onClick={fetchPosts} className="w-full flex justify-between px-2 text-white rounded-lg">
               <span className='text-white '>Feed</span> 
                 <RotateCcw  width={20} />
            </span>
            {posts.length < 0 && !loading && <span>No Posts Available</span>}
            {error && <span>{error}</span>}
            {loading && <span className='w-full flex items-center justify-center'><Loader  className='animate-spin'/></span>} {/* Loading Indicator */}
    
            {posts.map((post) => (
                <div key={post.id}>
                    {renderPostAlert(post.source)}

                    <div className="bg-dark-primary rounded-lg shadow-sm p-4 pb-0">
                        {/* Author Info */}
                        <div className="flex items-start gap-3 mb-4">
                            <img
                                src={post.author.avatar}
                                alt={post.author.name}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-medium text-[#c9d1d9]">
                                                {post.author.name}
                                            </h3>
                                            {renderFollowButton(post.author)}
                                        </div>
                                        <p className="text-xs text-[#8b949e] line-clamp-1 mt-0.5">
                                            {post.author.title}
                                        </p>
                                    </div>
                                    <span className="text-xs text-[#8b949e] shrink-0">
                                        {post.timestamp}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Post Content */}
                        <div className="w-full">{renderPostContent(post)}</div>

                        {/* Engagement Stats */}
                        <div className="mt-4 flex items-center justify-between text-sm text-[#8b949e] pb-3    border-b border-[#21262d]">
                            <span className="flex items-center gap-1">
                                <ThumbsUp className="h-[10px] w-[10px] text-theme-primary" /> {post.likes} likes
                            </span>
                            <div className="flex gap-4">
                                <span>{post.comments} comments</span>
                                <span>{post.shares} reposts</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                       <Actions postId={post.id}  userId='5UFmay1soARhvs7SZwS0mn5l1q93'></Actions>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PostsList;



