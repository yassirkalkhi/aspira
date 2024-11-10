import React, { useState, useEffect } from 'react';
import { Search, Briefcase, ChevronDown, BookmarkPlus, Send, Clock, Calendar, Users, MapPin } from 'lucide-react';
import { jobs, messages } from '../data/mockdata';
import PostJobModal from '../components/jobs/PostJobModal';
import MessagesList from '../components/messages/MessagesList';
import Chatbox from '../components/chat/Chatbox';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow, format, isValid } from 'date-fns';

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedJobs, setExpandedJobs] = useState({});
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [jobType, setJobType] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [datePosted, setDatePosted] = useState('');

  const handleSearch = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const results = jobs.filter(job => {
        const matchesSearch = !searchQuery || 
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesLocation = !locationQuery ||
          job.location.toLowerCase().includes(locationQuery.toLowerCase());

        return matchesSearch && matchesLocation;
      });

      setFilteredJobs(results);
      setIsLoading(false);
    }, 500);
  };

  const toggleJobExpansion = (jobId) => {
    setExpandedJobs(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery, locationQuery]);

  console.log('Messages:', messages);

  const clearFilters = () => {
    setJobType('');
    setSalaryRange('');
    setDatePosted('');
  };

  return ( 
    <div className="lg:h-[93.5vh] w-full bg-gray-50 dark:bg-dark-secondary p-4 sm:p-6 lg:p-8 lg:fixed">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Ready to Hire Section - Mobile */}
        <div className="lg:hidden">
          <div className="bg-white dark:bg-dark-primary rounded-lg shadow-sm">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-[#c9d1d9] mb-2">
                Ready to hire?
              </h3>
              <p className="text-sm text-gray-600 dark:text-[#8b949e] mb-4">
                Post your job to reach thousands of qualified candidates.
              </p>
              <button
                onClick={() => setIsPostJobModalOpen(true)}
                className="w-full bg-theme-primary  hover:bg-opacity-80 text-white
                         py-3 rounded-lg transition-all duration-200 font-medium"
              >
                Post a Job
              </button>
            </div>
            
            {/* Quick Stats */}
            <div className="border-t border-gray-200 dark:border-[#21262d] px-6 py-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-[#c9d1d9]">5k+</div>
                  <div className="text-xs text-gray-500 dark:text-[#8b949e]">Active Users</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-[#c9d1d9]">24h</div>
                  <div className="text-xs text-gray-500 dark:text-[#8b949e]">Avg. Response</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-[#c9d1d9]">98%</div>
                  <div className="text-xs text-gray-500 dark:text-[#8b949e]">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job List Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-dark-primary rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                {/* Job Search Input */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-[#8b949e]" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 
                             border border-gray-200 dark:border-[#30363d] 
                             rounded-lg focus:outline-none 
                             bg-white dark:bg-dark-secondary
                             text-gray-900 dark:text-[#c9d1d9]
                             placeholder-gray-400 dark:placeholder-[#8b949e]"
                  />
                </div>

                {/* Location Search Input */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Location..."
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 
                             border border-gray-200 dark:border-gray-600 
                             rounded-lg focus:outline-none
                             bg-white dark:bg-dark-secondary
                             text-gray-900 dark:text-gray-100
                             placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Filters Section */}
              <div className="pt-4 border-t border-gray-200 dark:border-[#21262d]">
                <div className="flex flex-wrap gap-4">
                  {/* Job Type Filter */}
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Job Type
                    </label>
                    <select
                      className="w-full px-3 py-2 rounded-lg 
                               border border-gray-200 dark:border-gray-600 
                               bg-white dark:bg-dark-secondary
                               text-gray-900 dark:text-gray-100
                               focus:outline-none"
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value)}
                    >
                      <option value="">All Types</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="freelance">Freelance</option>
                    </select>
                  </div>

                  {/* Salary Range Filter */}
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Salary Range
                    </label>
                    <select
                      className="w-full px-3 py-2 rounded-lg 
                               border border-gray-200 dark:border-gray-600 
                               bg-white dark:bg-dark-secondary
                               text-gray-900 dark:text-gray-100
                               focus:outline-none"
                      value={salaryRange}
                      onChange={(e) => setSalaryRange(e.target.value)}
                    >
                      <option value="">Any Salary</option>
                      <option value="0-50000">$0 - $50,000</option>
                      <option value="50000-100000">$50,000 - $100,000</option>
                      <option value="100000-150000">$100,000 - $150,000</option>
                      <option value="150000+">$150,000+</option>
                    </select>
                  </div>

                  {/* Date Posted Filter */}
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date Posted
                    </label>
                    <select
                      className="w-full px-3 py-2 rounded-lg 
                               border border-gray-200 dark:border-gray-600 
                               bg-white dark:bg-dark-secondary
                               text-gray-900 dark:text-gray-100
                               focus:outline-none"
                      value={datePosted}
                      onChange={(e) => setDatePosted(e.target.value)}
                    >
                      <option value="" >Any Time</option>
                      <option value="24h">Last 24 hours</option>
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                      <option value="90d">Last 90 days</option>
                    </select>
                  </div>
                </div>

                {/* Active Filters */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {(jobType || salaryRange || datePosted) && (
                    <>
                      {jobType && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full 
                                             bg-gray-100 dark:bg-dark-secondary text-sm 
                                             text-gray-700 dark:text-[#c9d1d9]">
                          {jobType}
                          <button
                            onClick={() => setJobType('')}
                            className="ml-1 hover:text-gray-900 dark:hover:text-gray-100"
                          >
                            ×
                          </button>
                        </span>
                      )}
                      {salaryRange && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full 
                                             bg-gray-100 dark:bg-dark-secondary text-sm 
                                             text-gray-700 dark:text-[#c9d1d9]">
                          {salaryRange}
                          <button
                            onClick={() => setSalaryRange('')}
                            className="ml-1 hover:text-gray-900 dark:hover:text-gray-100"
                          >
                            ×
                          </button>
                        </span>
                      )}
                      {datePosted && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full 
                                             bg-gray-100 dark:bg-dark-secondary text-sm 
                                             text-gray-700 dark:text-[#c9d1d9]">
                          {datePosted}
                          <button
                            onClick={() => setDatePosted('')}
                            className="ml-1 hover:text-gray-900 dark:hover:text-gray-100"
                          >
                            ×
                          </button>
                        </span>
                      )}
                      <button
                        onClick={clearFilters}
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      >
                        Clear all filters
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Job Cards */}
            <div className="space-y-6 overflow-y-scroll app h-[39%] ">
              {filteredJobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  isExpanded={expandedJobs[job.id]}
                  onToggle={toggleJobExpansion}
                />
              ))}
             <div className='h-96'>
             </div>
              <div className='h-96'>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar - Hidden on mobile */}
          <div className="hidden lg:block sticky top-6 h-fit">
            {/* Ready to Hire Section - Shows on desktop */}
            <div className="bg-white dark:bg-dark-primary rounded-lg shadow-sm">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-[#c9d1d9] mb-2">
                  Ready to hire?
                </h3>
                <p className="text-sm text-gray-600 dark:text-[#8b949e] mb-4">
                  Post your job to reach thousands of qualified candidates.
                </p>
                <button
                  onClick={() => setIsPostJobModalOpen(true)}
                  className="w-full  bg-theme-primary hover:bg-opacity-80   text-white
                           py-3 rounded-lg transition-all duration-200 font-medium"
                >
                  Post a Job
                </button>
              </div>
              
              {/* Quick Stats */}
              <div className="border-t border-gray-200 dark:border-[#21262d] px-6 py-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-[#c9d1d9]">5k+</div>
                    <div className="text-xs text-gray-500 dark:text-[#8b949e]">Active Users</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-[#c9d1d9]">24h</div>
                    <div className="text-xs text-gray-500 dark:text-[#8b949e]">Avg. Response</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-[#c9d1d9]">98%</div>
                    <div className="text-xs text-gray-500 dark:text-[#8b949e]">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages List */}
            <div className="mt-6">
              <MessagesList messages={messages} onChatOpen={setActiveChat} />
            </div>
          </div>
        </div>
      </div>

      {/* Modals and Chat */}
      {activeChat && (
        <Chatbox 
          userId={activeChat} 
          messages={messages}
          onClose={() => setActiveChat(null)} 
        />
      )}
      <PostJobModal
        isOpen={isPostJobModalOpen}
        onClose={() => setIsPostJobModalOpen(false)}
      />
    </div>
  );
};

const JobCard = ({ job, isExpanded, onToggle }) => {
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    if (!isValid(date)) return 'Recently';
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    if (!isValid(date)) return 'N/A';
    return format(date, 'MMM dd, yyyy');
  };

  const timeAgo = getTimeAgo(job.postedAt);
  const formattedDate = getFormattedDate(job.postedAt);
  
  return (
    <div className="bg-white dark:bg-dark-primary rounded-lg shadow-sm space-y-1">
      {/* Main Job Card - Clickable Header */}
      <div 
        onClick={() => onToggle(job.id)}
        className="p-4 cursor-pointer  hover:bg-theme-primary/20 rounded-lg
                 transition-colors duration-200"
      >
        <div className="flex gap-4">
          <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-white 
                       flex items-center justify-center shrink-0 overflow-hidden">
            {job.logo ? (
              <img 
                src={job.logo} 
                alt={`${job.company} logo`}
                className="h-8 w-8 object-contain dark:bg-white"
              />
            ) : (
              <Briefcase className="h-6 w-6 text-gray-500" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {job.title}
              </h3>
              <motion.button
                initial={false}
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <ChevronDown className="h-5 w-5" />
              </motion.button>
            </div>
            
            {/* Basic Job Info */}
            <div className="mt-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {job.company}
              </span>
            </div>
            
            <div className="mt-2 flex flex-wrap gap-2">
              {/* Location, Type, Salary badges */}
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex text-xs px-2 py-1 rounded-full 
                      bg-gray-100 dark:bg-dark-secondary
                      text-gray-600 dark:text-white/50">
                  {job.location}
                </span>
                <span className="inline-flex text-xs px-2 py-1 rounded-full 
                      bg-gray-100 dark:bg-dark-secondary
                      text-gray-600 dark:text-white/50">
                  {job.type}
                </span>
                <span className="inline-flex text-xs px-2 py-1 rounded-full 
                      bg-gray-100 dark:bg-dark-secondary
                      text-gray-600 dark:text-white/50">
                  {job.salary}
                </span>
              </div>
              {/* Time badge */}
              <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full 
                      bg-theme-primary text-white dark:bg-dark-secondary
                      dark:text-white/50">
                <Clock className="h-3 w-3 " /> 
                {timeAgo}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Updated Job Details with black badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 
                            bg-theme-primary dark:bg-dark-secondary
                            text-white dark:text-white/50
                              rounded-full">
                  <Calendar className="h-3.5 w-3.5" />
                  Posted: {formattedDate}
                </span>
                {job.expiresAt && isValid(new Date(job.expiresAt)) && (
                  <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 
                               bg-theme-primary dark:bg-dark-secondary
                               text-white dark:text-white/50
                                rounded-full">
                    <Clock className="h-3.5 w-3.5" />
                    Expires: {getFormattedDate(job.expiresAt)}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 
                            bg-theme-primary dark:bg-dark-secondary
                            text-white dark:text-white/50
                               rounded-full">
                  <Users className="h-3.5 w-3.5" />
                  {job.applicants || 0} applicants
                </span>
              </div>

              {/* Job Description */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  About the Role
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {job.description}
                </p>
              </div>

              {/* Requirements */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Requirements
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                  {job.requirements?.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              {/* Company Description */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  About {job.company}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {job.companyDescription || `${job.company} is a leading technology company...`}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 bg-theme-primary  hover:opacity-90 text-white 
                               px-4 py-2 rounded-lg transition-opacity
                               flex items-center justify-center gap-2">
                  <Send className="h-4 w-4" />
                  Apply Now
                </button>
                <button className="px-4 py-2 rounded-lg border border-gray-200 dark:border-dark-primary
                               text-gray-700 dark:text-white/80 hover:dark:bg-dark-secondary hover:bg-theme-primary/20 
                               flex items-center justify-center gap-2">
                  <BookmarkPlus className="h-4 w-4" />
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Jobs;