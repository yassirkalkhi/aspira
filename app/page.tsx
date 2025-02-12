'use client';
import React, { useEffect } from 'react';
import MessagesList from '@/components/ui/Messages/MessagesList';
import {popularJobs, trending} from '@/data/mockData'
import PostsList from '@/components/ui/Posts/PostsList';
import PopularJobs from '@/components/ui/Jobs/PopularJobs';
import Links from '@/components/ui/Links/Links';
import AddPost from '@/components/ui/Posts/AddPost';
import TrendingTopics from '@/components/ui/Jobs/Trending';
import withAuth from '@/components/auth/withAuth';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { listenForAuthChanges } from '@/features/auth/authSlice';

 function Home() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(listenForAuthChanges());
  }, [dispatch]);

  
  return (
    <>
      <div className="w-[100vw] bg-dark-secondary fixed ">
        <div className="max-w-7xl mx-auto px-4 overflow-hidden grid grid-cols-1 md:grid-cols-7 gap-6 h-screen">
          {/* Left Sidebar - Fixed */}
          <div
            className="hidden md:block md:col-span-2 sticky h-fit max-h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-[#30363d] scrollbar-track-transparent noScrollBar">
            <div className="py-6 noScrollBar">
              <PopularJobs jobs={popularJobs} />
              <Links></Links>
            </div>
          </div>

          {/* Main Content - Scrollable */}
          <div className="md:col-span-3 h-screen overflow-y-auto py-6 px-1 main pb-24 text-[#c9d1d9] scrollbar-thin  scrollbar-thumb-[#30363d] scrollbar-track-transparent noScrollBar">
            <AddPost/>
            <PostsList  />
          </div>

          {/* Right Sidebar - Fixed */}
          <div
            className="hidden md:block md:col-span-2 sticky  h-fit max-h-screen overflow-y-auto scrollbar-thin  scrollbar-thumb-[#30363d] scrollbar-track-transparent noScrollBar">
            <div className="py-6 space-y-6 noScrollBar">
              <MessagesList />
              <TrendingTopics topics={trending} />
            </div>
          </div>
        </div>

      
      </div>
    </>
  );
}

export default withAuth(Home);