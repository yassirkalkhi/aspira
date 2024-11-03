import AddPost from './AddPost';
import { Heart, MessageCircle, Share2, Repeat2, Building2, Users, Sparkles } from 'lucide-react';

const PostsList = ({ posts }) => {
    const renderPostAlert = (source) => {
      const alertConfig = {
        friend: {
          icon: Users,
          text: 'Posted by someone in your network'
        },
        suggested: {
          icon: Sparkles,
          text: 'Suggested post based on your interests'
        },
        company: {
          icon: Building2,
          text: 'From a company you follow'
        }
      };

      const config = alertConfig[source];
      if (!config) return null;

      const Icon = config.icon;
      
      return (
        <div className="flex items-center gap-2 py-2 px-4 text-xs text-gray-500 
                     dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
          <Icon className="h-3.5 w-3.5" />
          <span>{config.text}</span>
        </div>
      );
    };

    const renderPostContent = (post) => {
      switch (post.type) {
        case 'video':
          return (
            <div className="mt-2">
              <p className="mb-2 text-gray-700 dark:text-gray-300">{post.content}</p>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                <video
                  src={post.videoUrl}
                  controls
                  controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
                  className="w-full h-full object-cover"
                  poster={post.thumbnailUrl}
                  playsInline
                >
                  <source src={post.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          );
        case 'image':
          return (
            <div className="mt-2">
              <p className="mb-2 text-gray-700 dark:text-gray-300">{post.content}</p>
              <img 
                src={post.imageUrl} 
                alt="Post content" 
                className="rounded-lg w-full"
              />
            </div>
          );
        default:
          return (
            <p className="mt-2 text-gray-700 dark:text-gray-300">{post.content}</p>
          );
      }
    };

    const renderFollowButton = (author) => {
      if (author.isFollowing) return null;
      
      return (
        <button className="text-xs font-medium px-3 py-1 rounded-full 
                       border border-gray-200 dark:border-gray-700
                       hover:bg-gray-100 dark:hover:bg-gray-800 
                       text-gray-900 dark:text-gray-100
                       transition-colors">
          Follow
        </button>
      );
    };

    return (
      <div className="space-y-6">
        <AddPost />
        {posts.map((post) => (
          <div key={post.id}>
            {/* Source Alert at Top */}
            {renderPostAlert(post.source)}
            
            {/* Main Post Content */}
            <div className="bg-white dark:bg-[#2F2F2F] rounded-b-lg shadow-sm p-4">
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
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {post.author.name}
                        </h3>
                        {renderFollowButton(post.author)}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                        {post.author.title}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                      {post.timestamp}
                    </span>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="w-full">
                {renderPostContent(post)}
              </div>

              {/* Engagement Stats */}
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500 
                           dark:text-gray-400 pb-3 border-b dark:border-gray-700">
                <span>{post.likes} likes</span>
                <div className="flex gap-4">
                  <span>{post.comments} comments</span>
                  <span>{post.shares} shares</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-1 flex items-center justify-between">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg 
                               text-gray-900 dark:text-gray-100 hover:bg-gray-100 
                               dark:hover:bg-[#18181A] transition-colors group">
                  <Heart className="h-5 w-5 text-gray-500 group-hover:text-gray-900 
                                dark:text-gray-400 dark:group-hover:text-gray-100" />
                  <span className="text-sm font-medium">Like</span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 rounded-lg 
                               text-gray-900 dark:text-gray-100 hover:bg-gray-100 
                               dark:hover:bg-[#18181A] transition-colors group">
                  <MessageCircle className="h-5 w-5 text-gray-500 group-hover:text-gray-900 
                                        dark:text-gray-400 dark:group-hover:text-gray-100" />
                  <span className="text-sm font-medium">Comment</span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 rounded-lg 
                               text-gray-900 dark:text-gray-100 hover:bg-gray-100 
                               dark:hover:bg-[#18181A] transition-colors group">
                  <Repeat2 className="h-5 w-5 text-gray-500 group-hover:text-gray-900 
                                  dark:text-gray-400 dark:group-hover:text-gray-100" />
                  <span className="text-sm font-medium">Repost</span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 rounded-lg 
                               text-gray-900 dark:text-gray-100 hover:bg-gray-100 
                               dark:hover:bg-[#18181A] transition-colors group">
                  <Share2 className="h-5 w-5 text-gray-500 group-hover:text-gray-900 
                                 dark:text-gray-400 dark:group-hover:text-gray-100" />
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
export default PostsList;