'use client';
import React, { useState } from 'react';
import MessagesList from '@/components/ui/Messages/MessagesList';
import {popularJobs, posts, trending} from '@/data/mockData'
import PostsList from '@/components/ui/Posts/PostsList';
import PopularJobs from '@/components/ui/Jobs/PopularJobs';
import Links from '@/components/ui/Links/Links';
import AddPost from '@/components/ui/Posts/AddPost';
import TrendingTopics from '@/components/ui/Jobs/Trending';

export default function Home() {
  
  return (
    <>
      <div className="w-[100vw] bg-gray-50 dark:bg-dark-secondary fixed ">
        <div className="max-w-7xl mx-auto px-4 overflow-hidden grid grid-cols-1 md:grid-cols-7 gap-6 h-screen">
          {/* Left Sidebar - Fixed */}
          <div
            className="hidden md:block md:col-span-2 sticky top-6 h-fit max-h-screen overflow-y-auto
                     scrollbar-thin scrollbar-thumb-[#8b949e] dark:scrollbar-thumb-[#30363d]
                     scrollbar-track-transparent"
          >
            <div className="py-6">
              <PopularJobs jobs={popularJobs} />
              <Links></Links>
            </div>
          </div>

          {/* Main Content - Scrollable */}
          <div
            className="md:col-span-3 h-screen overflow-y-auto py-6 px-1 main pt-20 pb-24
                      dark:text-[#c9d1d9]
                      scrollbar-thin scrollbar-thumb-[#8b949e] dark:scrollbar-thumb-[#30363d]
                      scrollbar-track-transparent noScrollBar" 
          >
            <AddPost/>
            <PostsList  />
          </div>

          {/* Right Sidebar - Fixed */}
          <div
            className="hidden md:block md:col-span-2 sticky top-6 h-fit max-h-screen overflow-y-auto
                     scrollbar-thin scrollbar-thumb-[#8b949e] dark:scrollbar-thumb-[#30363d]
                     scrollbar-track-transparent"
          >
            <div className="py-6 space-y-6">
              <MessagesList />
              <TrendingTopics topics={trending} />
            </div>
          </div>
        </div>

      
      </div>
    </>
  );
}
