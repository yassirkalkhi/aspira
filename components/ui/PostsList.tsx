    import { useEffect, useState } from 'react';
    import { db } from '@/lib/firebase';
    import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
    import { Post } from '@/types/types';
    import { Heart, ThumbsUp, MessageCircle, Share2, Repeat2, Building2, Users, Sparkles } from 'lucide-react';

    const PostsList = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [error,setError] = useState<string | null>(null)
    useEffect(() => {
        try{
            const postsRef = collection(db, 'posts');
            const q = query(postsRef, orderBy('timestamp', 'desc'));
          
            const unsubscribe = onSnapshot(q, (snapshot) => {
              const postsData = snapshot.docs.map((doc) => {
                const data = doc.data();
                console.log(data);
                const formatNumber = (num: number) => {
                    if (num >= 1000000) {
                        return (num / 1000000).toFixed(1) + 'M';
                    }
                    if (num >= 1000) {
                        return (num / 1000).toFixed(1) + 'K';
                    }
                    return num.toString();
                };
    
                return {
                    id: doc.id,
                    type: data.type,
                    source: data.source,
                    author: {
                        name: data.author.name,  
                        avatar: data.author.avatar,
                        title: data.author.title,
                    },
                    content: data.content,
                    mediaURL: data.mediaURL,
                    timestamp: data.timestamp.toDate().toLocaleString('en-US', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
                    likes: formatNumber(data.likes),
                    comments: formatNumber(data.comments),
                    shares: formatNumber(data.shares),
                };    });
              setPosts(postsData);
            });
          
            return () => unsubscribe();
        }catch(e : any){
           setError("Error getting Posts")
        }
        
      }, []);
      

    const renderPostAlert = (source: string) => {
        const alertConfig = {
        friend: { icon: Users, text: 'Posted by someone in your network' },
        suggested: { icon: Sparkles, text: 'Suggested post based on your interests' },
        company: { icon: Building2, text: 'From a company you follow' },
        };

        const config = alertConfig[source as keyof typeof alertConfig];
        if (!config) return null;

        const Icon = config.icon;

        return (
        <div className="flex items-center gap-2 py-2 px-4 text-xs text-gray-500 dark:text-[#8b949e] bg-gray-50 dark:bg-dark-secondary rounded-t-lg">
            <Icon className="h-3.5 w-3.5" />
            <span>{config.text}</span>
        </div>
        );
    };

    const renderPostContent = (post: Post) => {
        if (post.type === 'video') {
        return (
            <div className="mt-2">
            <p className="mb-2 text-gray-700 dark:text-[#c9d1d9]">{post.content}</p>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-[#21262d]">
                <video
                src={post.mediaURL || ''}
                controls
                controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
                className="w-full h-full object-cover"
                playsInline
                >
                Your browser does not support the video tag.
                </video>
            </div>
            </div>
        );
        }

        if (post.type === 'image' && post.mediaURL) {
        return (
            <div className="mt-2">
            <p className="mb-2 text-gray-700 dark:text-[#c9d1d9]">{post.content}</p>
            <img src={post.mediaURL} alt="Post content" className="rounded-lg w-full" />
            </div>
        );
        }

        return <p className="mt-2 text-gray-700 dark:text-[#c9d1d9]">{post.content}</p>;
    };

    const renderFollowButton = (author: any) => {
        if (author.isFollowing) return null;

        return (
        <button className="text-[0.6rem] px-2 py-1 rounded-full bg-theme-primary text-white/90">
            Follow
        </button>
        );
    };

    const actionButtons = [
        { label: 'Like', icon: ThumbsUp },
        { label: 'Comment', icon: MessageCircle },
        { label: 'Repost', icon: Repeat2 },
        { label: 'Share', icon: Share2 },
    ];

    return (
        <div className="space-y-6 mt-16 ">
             {posts.length < 1 && <span>No Posts Available</span>}
             {error  && <span>{error}</span>}
        {posts.map((post) => (
            <div key={post.id}>
            {renderPostAlert(post.source)}

            <div className="bg-white dark:bg-dark-primary rounded-lg shadow-sm p-4">
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
                        <h3 className="font-medium text-gray-900 dark:text-[#c9d1d9]">{post.author.name }</h3>
                        {renderFollowButton(post.author)}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-[#8b949e] line-clamp-1 mt-0.5">
                        {post.author.title}
                        </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-[#8b949e] shrink-0">
                        {post.timestamp}
                    </span>
                    </div>
                </div>
                </div>

                {/* Post Content */}
                <div className="w-full">{renderPostContent(post)}</div>

                {/* Engagement Stats */}
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-[#8b949e] pb-3 border-b dark:border-[#21262d]">
                <span className="flex items-center gap-1">
                    <ThumbsUp className="h-[10px] w-[10px] text-theme-primary" /> {post.likes} likes
                </span>
                <div className="flex gap-4">
                    <span>{post.comments} comments</span>
                    <span>{post.shares} shares</span>
                </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-1 grid grid-cols-4 divide divide-dark-secondary ">
                {actionButtons.map(({ label, icon: Icon }) => (
                    <button
                    key={label}
                    className="flex items-center justify-center gap-2 px-2 py-2.5 text-gray-500 dark:text-[#8b949e] hover:bg-gray-50 dark:hover:bg-dark-secondary rounded-lg hover:text-gray-900 dark:hover:text-[#c9d1d9]"
                    >
                    <Icon className="h-5 w-5 transition-none" />
                    <span className="text-sm font-medium">{label}</span>
                    </button>
                ))}
               
                
                </div>
            </div>
            </div>
        ))}
        </div>
    );
    };

    export default PostsList;
