import React, { useState, useEffect } from 'react';
import { useUser } from '../Context/UserContext';
import { useParams } from 'react-router-dom';
import { userData } from '../data/mockdata';
import { MapPin, Mail, Link as LinkIcon, Calendar, Edit, Plus, Briefcase, Heart, Share2, MessageCircle, Github, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';


const defaultImages = {
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  cover: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1500&h=400&fit=crop",
};

const PostCard = ({ post }) => (
  <div className="bg-white dark:bg-dark-primary rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6">
    {post?.image && (
      <img 
        src={post.image} 
        alt={post.title}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
    )}
    <div className="flex items-start justify-between mb-3">
      <div>
        <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-lg mb-2">
          {post?.title}
        </h3>
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          {post?.date || 'Recently'}
        </span>
      </div>
      <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#242424] text-gray-600 dark:text-gray-400">
        <Share2 className="h-5 w-5" />
      </button>
    </div>
    <p className="text-gray-600 dark:text-gray-400">
      {post?.content}
    </p>
    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
      <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200">
        <Heart className="h-5 w-5" />
        <span>{post?.likes || 0}</span>
      </button>
      <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200">
        <MessageCircle className="h-5 w-5" />
        <span>{post?.comments || 0}</span>
      </button>
    </div>
  </div>
);

const ProjectCard = ({ project }) => (
  <div className="group bg-white dark:bg-dark-primary rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
    <div className="relative">
      <img 
        src={project?.image} 
        alt={project?.title}
        className="w-full h-48 object-cover"
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4">
        {project?.githubUrl && (
          <a 
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <Github className="h-5 w-5" />
          </a>
        )}
        {project?.liveUrl && (
          <a 
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ExternalLink className="h-5 w-5" />
          </a>
        )}
      </div>
      <div className="absolute top-2 right-2">
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-theme-primary text-gray-600 dark:text-white/80">
          {project?.status}
        </span>
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-lg mb-2">
        {project?.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {project?.description}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project?.technologies?.map((tech, index) => (
          <span key={index} className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-theme-primary text-gray-600 dark:text-white/80">
            {tech}
          </span>
        ))}
      </div>
      <div className="flex gap-4">
        {project?.githubUrl && (
          <a 
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm font-medium hover:underline text-gray-700 dark:text-gray-300"
          >
            <Github className="h-4 w-4" />
            View Code
          </a>
        )}
        {project?.liveUrl && (
          <a 
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm font-medium hover:underline text-gray-700 dark:text-gray-300"
          >
            <ExternalLink className="h-4 w-4" />
            Live Demo
          </a>
        )}
      </div>
    </div>
  </div>
);

const Profile = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState('posts');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        setUser(data);
        console.log('Fetched user data:', data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        // Set mock data as fallback
        setUser(userData);
        // Show error toast
        toast.error('Using offline data: Unable to connect to server', {
          duration: 4000,
          position: 'bottom-right',
        });
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserData();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#121212] flex items-center justify-center">
        <div className="text-gray-500">User not found</div>
      </div>
    );
  }

  const userImage = user.avatar || defaultImages.avatar;
  const coverImage = user.cover || defaultImages.cover;
  const isOwnProfile = user.id === "logged-in-user-id"; // Replace with actual auth check

  const tabs = [
    { id: 'posts', label: 'Posts', count: user.posts?.length },
    { id: 'projects', label: 'Projects', count: user.projects?.length },
    { id: 'about', label: 'More' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-secondary p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-white dark:bg-dark-primary rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
          {/* Cover Image */}
          <div 
            className="h-48 sm:h-64 w-full rounded-t-lg relative bg-cover bg-center"
            style={{ backgroundImage: `url(${coverImage})` }}
          >
            <div className="absolute inset-0 bg-black/70 rounded-t-lg"></div>
            {isOwnProfile && (
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#242424] text-gray-700 dark:text-gray-300 absolute bottom-4 right-4 z-10">
                <Edit className="h-4 w-4" />
                Edit Cover
              </button>
            )}
          </div>

          <div className="px-4 sm:px-6">
            {/* Profile Picture & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between relative">
              <div className="flex items-end -mt-16 sm:-mt-20 mb-4 sm:mb-6">
                <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white dark:border-[#1a1a1a] 
                               bg-white dark:bg-[#242424] overflow-hidden shadow-lg relative z-20">
                  <img 
                    src={userImage}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                {isOwnProfile ? (
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#242424] text-gray-700 dark:text-gray-300 ml-auto sm:ml-4 mb-1">
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-3 ml-auto sm:ml-4 mb-1">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-black dark:bg-white text-white dark:text-black hover:opacity-90">
                      <Plus className="h-4 w-4" />
                      Follow
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-secondary text-gray-700 dark:text-gray-300">
                      <Mail className="h-4 w-4" />
                      Message
                    </button>
                  </div>
                )}
              </div>
              {!isOwnProfile && (
                <div className="flex gap-3 mb-4 sm:mb-6 sm:hidden">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-black dark:bg-white text-white dark:text-black hover:opacity-90">
                    <Plus className="h-4 w-4" />
                    Follow
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#242424] text-gray-700 dark:text-gray-300">
                    <Mail className="h-4 w-4" />
                    Message
                  </button>
                </div>
              )}
            </div> 
            {/* Profile Info */}
            <div className="space-y-4 pb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {user.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {user.bio}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  {user.position} at {user.company}
                </span>
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {user.location}
                </span>
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <LinkIcon className="h-4 w-4" />
                  {user.website}
                </span>
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {user.joinDate}
                </span>
              </div>

              <div className="flex gap-4">
                <span className="text-gray-600 dark:text-gray-400">
                  <strong className="text-gray-900 dark:text-gray-100">{user.following}</strong> Following
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  <strong className="text-gray-900 dark:text-gray-100">{user.followers}</strong> Followers
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-gray-50 dark:bg-dark-primary z-10 py-2 rounded-lg p-6">
          <nav className="flex gap-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 relative ${
                  activeTab === tab.id
                    ? 'text-gray-900 dark:text-gray-100'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  {tab.label}
                  {tab.count && (
                    <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-theme-primary text-gray-600 dark:text-white/80">
                      {tab.count}
                    </span>
                  )}
                </span>
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black dark:bg-white" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'posts' && (
            <div className="grid gap-6">
              {user.posts?.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="grid gap-6">
              {user.projects?.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="bg-white dark:bg-dark-primary rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6">
              <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-lg mb-4">
                About 
              </h3>
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  {user.about}
                </p>
                <div>
                  <h4 className="text-gray-900 dark:text-gray-100 font-semibold mb-2">
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {user.skills?.map((skill, index) => (
                      <span key={index} className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-theme-primary text-gray-600 dark:text-white/80">
                        {skill}
                      </span>
                    ))}
                  </div>
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