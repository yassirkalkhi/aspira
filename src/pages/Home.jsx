import React, { useState } from 'react';
import { popularJobs, posts, messages, trending } from '../data/mockdata';
import ChatBox from '../components/chat/ChatBox';
import PopularJobs from '../components/jobs/PopularJobs';
import MessagesList from '../components/messages/MessagesList';
import TrendingTopics from '../components/trending/TrendingTopics';
import PostsList from '../components/posts/PostsList';

const Home = () => {
  const [activeChat, setActiveChat] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#18181A]">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-7 gap-6 h-screen">
        {/* Left Sidebar - Fixed */}
        <div className="hidden md:block md:col-span-2 sticky top-6 h-fit max-h-screen overflow-y-auto 
                     scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          <div className="py-6">
            <PopularJobs jobs={popularJobs} />
          </div>
        </div>
        
        {/* Main Content - Scrollable */}
        <div className="md:col-span-3 h-screen overflow-y-auto py-6 px-1
                     scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          <PostsList posts={posts} />
        </div>
        
        {/* Right Sidebar - Fixed */}
        <div className="hidden md:block md:col-span-2 sticky top-6 h-fit max-h-screen overflow-y-auto 
                     scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          <div className="py-6 space-y-6">
            <MessagesList messages={messages} onChatOpen={setActiveChat} />
            <TrendingTopics topics={trending} />
          </div>
        </div>
      </div>

      {/* Chat Popup */}
      {activeChat && (
        <ChatBox 
          userId={activeChat} 
          messages={messages}
          onClose={() => setActiveChat(null)} 
        />
      )}
    </div>
  );
};

export default Home;