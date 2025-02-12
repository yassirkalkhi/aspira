'use client'
import React, { useState, useEffect } from 'react';
import { UserData, Post } from '@/types/types';
import { MapPin, Link as LinkIcon, Briefcase, ThumbsUp, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import renderPostAlert from '@/components/ui/Posts/PostParts/PostAlert';
import renderFollowButton from '@/components/ui/Posts/PostParts/PostFollowButton';
import renderPostContent from '@/components/ui/Posts/PostParts/PostContent';
import Actions from '@/components/ui/Posts/PostActions';
import { useParams } from 'next/navigation';
const defaultImages = {
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  cover: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1500&h=400&fit=crop",
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [user, setUser] = useState<UserData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const username = params.username as string;


  
  function formatNumber(number : number) {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + "K";
    } else {
      return number.toString();
    }
  }
  const fetchUserData = async () => {
    try {
      const q = query(
        collection(db, 'profiles'),
        where('username', '==', username)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const userData = doc.data();
  
        const processedData: UserData = {
          id: userData.id,
          username: userData.username || '',
          avatar: userData.avatar || defaultImages.avatar,
          cover: userData.cover || defaultImages.cover,
          bio: userData.bio || '',
          position: userData.position || '',
          company: userData.company || '',
          location: userData.location || '',
          website: userData.website || '',
          joinDate: userData.joinDate ? 
            new Timestamp(userData.joinDate.seconds, userData.joinDate.nanoseconds).toDate().toLocaleString() : '',
          following: userData.following || 0,
          followers: userData.followers || 0,
          about: userData.about || '',
          skills: userData.skills || [],
        };
        setUser(processedData);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch user data, Please try again', {
        duration: 4000,
        position: 'bottom-right',
      });
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

 const fetchUserPosts = async()=>{
     try{
      console.log(user?.id)
      if(user?.id){
        const q = query(collection(db,'posts'),where('author.id','==',user?.id));
        const posts = await getDocs(q);
        posts.forEach((p)=>{
                 const data = p.data()
                 const post = {
                  id: p.id,
                  source : data.source,
                  author: {
                    name: data.author.name,
                    avatar: data.author.avatar,
                    title:data.author.title,
                    id : data.author.id,
                  },
                  content: data.content,
                  medias : data.medias,
                  timestamp: data.timestamp
                          ? data.timestamp.toDate().toLocaleString('en-US', {
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                            })
                          : 'Just now',
                  likes: data.like,
                  comments: data.comments ,
                  shares: data.shares,
                 }
                 setPosts(prevPosts => [...prevPosts,post])
        })
      }
     
     }catch(e){
           console.log(e)
           toast.error('Error getting user Posts')
     }
 } 

  useEffect(() => {
    if (username) {
      fetchUserData();}
  }, [username]);
  
  useEffect(()=>{
    if(username){
      fetchUserPosts()
    }
  },[user?.id])


  if (loading) {
    return (
      <div className="min-h-screen bg-dark-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-gray-500">User not found</div>
      </div>
    );
  }



  const tabs = [
    { id: 'posts', label: 'Posts', count: posts.length },
    { id: 'projects', label: 'Projects', count: 0 },
    { id: 'about', label: 'More' },
  ];

  return (
    <div className="min-h-screen bg-dark-secondary p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-dark-primary rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
          <div 
            className="h-48 sm:h-64 w-full rounded-t-lg relative bg-cover bg-center"
            style={{ backgroundImage: `url(${defaultImages.cover})` }}
          >
            <div className="absolute inset-0 bg-black/70 rounded-t-lg"></div>
           
          </div>

          <div className="px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between relative">
              <div className="flex items-end -mt-16 sm:-mt-20 mb-4 sm:mb-6">
                <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-[#1a1a1a] 
                             bg-[#242424] overflow-hidden shadow-lg relative z-20">
                  <img 
                    src={user.avatar}
                    alt={user.username}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4 pb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-100">
                    {user.username}
                </h1>
                  <p className="text-gray-400">{user.bio}</p>
              </div>

              <div className="flex flex-wrap gap-4">
                  <>
                    {user.position && user.company && (
                      <span className="text-gray-400 flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {user.position} at {user.company}
                      </span>
                    )}
                  </>
             
                 { user.location && (
                    <span className="text-gray-400 flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {user.location}
                    </span>)}
                  
                 { user.website && (
                    <span className="text-gray-400 flex items-center gap-1">
                      <LinkIcon className="h-4 w-4" />
                      <a href={`https://${user.website}`} target='_blank' rel="noopener noreferrer">{user.website}</a>
                    </span>
                  )}
  
              </div>

              <div className="flex gap-4">
                <span className="text-gray-400">
                  <strong className="text-gray-100">{formatNumber(user.following)}</strong> Following
                </span>
                <span className="text-gray-400">
                  <strong className="text-gray-100">{formatNumber(user.followers)}</strong> Followers
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-800 sticky top-0 bg-dark-primary z-10 py-2 rounded-lg  px-6 pt-6">
          <nav className="flex gap-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 relative ${
                  activeTab === tab.id
                    ? 'text-gray-100'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  {tab.label}
                  {(tab.count ?? 0) > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-theme-primary text-white/80">
                      {tab.count}
                    </span>
                  )}
                </span>
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
        {activeTab === 'posts' && 
          <div className="space-y-6 mt-6">
            {posts.length < 0 && !loading && <span>No Posts Available</span>}
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
                                        {post.timestamp.toString()}
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
        
          }

          {activeTab === 'projects' && (
            <div className="grid gap-6">
              
            </div>
          )}
          {activeTab === 'about' && (
            <div className="bg-dark-primary rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6">
              {  user.about && (
                  <>
                    <h3 className="text-gray-100 font-semibold text-lg mb-4">
                      About 
                    </h3>
                    <div className="space-y-4">
                      <p className="text-gray-400">
                        {user.about}
                      </p>
                    </div>
                  </>
                )}
              <div className="mt-6">
                <h4 className="text-gray-100 font-semibold mb-2">
                  Skills
                </h4>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <span key={index} className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-theme-primary text-white/80">
                        {skill}
                      </span>
                    ))}
                  </div>  
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;

/// profile  
/// everything elese done