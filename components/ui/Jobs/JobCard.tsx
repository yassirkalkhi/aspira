'use client';
import React from 'react';
import { Briefcase, ChevronDown, BookmarkPlus, Send, Clock, Calendar, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow, format, isValid } from 'date-fns';
import { Job } from '@/types/types';



const JobCard = ({ job, isExpanded, onToggle, onApply }: { job: Job; isExpanded: boolean; onToggle: () => void; onApply: () => void }) => {
    const getTimeAgo = (dateString: string) => {
      const date = new Date(dateString);
      if (!isValid(date)) return 'Recently';
      return formatDistanceToNow(date, { addSuffix: true });
    };
  
    const getFormattedDate = (dateString: string) => {
      const date = new Date(dateString);
      if (!isValid(date)) return 'N/A';
      return format(date, 'MMM dd, yyyy');
    };
  
    const timeAgo = getTimeAgo(job.postedAt.toString());
    const formattedDate = getFormattedDate(job.postedAt.toString());
  
    return (
      <div className="bg-dark-primary rounded-lg shadow-sm space-y-1">
        {/* Main Job Card - Clickable Header */}
        <div onClick={onToggle} className="p-4 cursor-pointer hover:bg-theme-primary/20 rounded-lg transition-colors duration-200">
          {/* Job Card Content */}
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center shrink-0 overflow-hidden">
              {job.logo ? (
                <img src={job.logo} alt={`${job.company} logo`} className="h-8 w-8 object-contain bg-white" />
              ) : (
                <Briefcase className="h-6 w-6 text-gray-500" />
              )}
            </div>
  
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-100">{job.title}</h3>
                <motion.button
                  initial={false}
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-500 hover:text-gray-300"
                >
                  <ChevronDown className="h-5 w-5" />
                </motion.button>
              </div>
  
              {/* Basic Job Info */}
              <div className="mt-1">
                <span className="text-sm text-gray-400">{job.company}</span>
              </div>
  
              <div className="mt-2 flex flex-wrap gap-2">
                {/* Location, Type, Salary badges */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex text-xs px-2 py-1 rounded-full bg-dark-secondary text-white/50">
                    {job.location}
                  </span>
                  <span className="inline-flex text-xs px-2 py-1 rounded-full bg-dark-secondary text-white/50">
                    {job.type}
                  </span>
                  <span className="inline-flex text-xs px-2 py-1 rounded-full bg-dark-secondary text-white/50">
                    {job.salary} $ a Year 
                  </span>
                </div>
                {/* Time badge */}
                <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full   bg-dark-secondary text-white/50">
                  <Clock className="h-3 w-3" /> {timeAgo}
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
                {/* Job Details */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-dark-secondary text-white/50 rounded-full">
                    <Calendar className="h-3.5 w-3.5" />
                    Posted: {formattedDate}
                  </span>
                  {job.expiresAt && isValid(new Date(job.expiresAt)) && (
                    <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-dark-secondary text-white/50 rounded-full">
                      <Clock className="h-3.5 w-3.5" />
                      Expires: {getFormattedDate(job.expiresAt)}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-dark-secondary text-white/50 rounded-full">
                    <Users className="h-3.5 w-3.5" />
                    {job.applicants || 0} applicants
                  </span>
                </div>
  
                {/* Job Description */}
                <div>
                  <h4 className="text-md font-semibold text-gray-100 mb-2">About the Role</h4>
                  <p className="text-sm text-gray-400">{job.description}</p>
                </div>
  
                {/* Requirements */}
                <div>
                  <h4 className="text-md font-semibold text-gray-100 mb-2">Requirements</h4>
                  <ul className="list-disc list-inside text-sm text-gray-400">
                    {job.requirements?.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
  
                {/* Company Description */}
                <div>
                  <h4 className="text-md font-semibold text-gray-100 mb-2">About {job.company}</h4>
                  <p className="text-sm text-gray-400">{job.companyDescription || `${job.company} is a leading technology company...`}</p>
                </div>
  
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button onClick={onApply} className="flex-1 bg-theme-primary hover:opacity-90 text-white px-4 py-2 rounded-lg transition-opacity flex items-center justify-center gap-2">
                    <Send className="h-4 w-4" />
                    Apply Now
                  </button>
                  <button className="px-4 py-2 rounded-lg border border-dark-primary text-white/80 hover:bg-dark-secondary flex items-center justify-center gap-2">
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


  export default JobCard