import { useState } from "react";
import { Briefcase, ArrowRight, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export const PopularJobs = ({ jobs }) => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const initialJobsToShow = 3;

    // Filter jobs based on search query
    const filteredJobs = jobs.filter(job => 
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.location.toLowerCase().includes(query.toLowerCase()) ||
      job.company.toLowerCase().includes(query.toLowerCase())
    );

    const visibleJobs = filteredJobs.slice(0, initialJobsToShow);

    const handleJobClick = (jobId) => {
        navigate(`/jobs/${jobId}`);
    };

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-[#2F2F2F] rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Popular Jobs
          </h2>
          {visibleJobs.length > 0 ? (
            <>
              {visibleJobs.map((job) => (
                <div 
                  key={job.id} 
                  onClick={() => handleJobClick(job.id)}
                  className="mb-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#18181A] 
                          cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 
                                flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-gray-900 dark:text-gray-100" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {job.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {job.newPositions} new positions • {job.location}
                      </p>
                      <p className="text-xs text-gray-900 dark:text-gray-100 mt-1">{job.salary}</p>
                    </div>
                  </div>
                </div>
              ))}

              <Link
                to={`/jobs${query ? `?q=${encodeURIComponent(query)}` : ''}`}
                className="mt-2 flex items-center justify-between p-3 text-sm font-medium 
                         text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-[#18181A] 
                         rounded-lg transition-colors"
              >
                <span>Show all jobs</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No jobs found matching "{query}"
              </p>
              <button
                onClick={() => setQuery('')}
                className="mt-2 text-sm text-gray-900 dark:text-gray-100 
                       hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 ml-4">
          <div className="flex flex-wrap gap-x-3 gap-y-2 mb-3">
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 hover:underline">
              About
            </a>
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 hover:underline">
              Accessibility
            </a>
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 hover:underline">
              Help Center
            </a>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-2 mb-3">
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 hover:underline">
              Privacy & Terms
            </a>
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 hover:underline">
              Ad Choices
            </a>
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 hover:underline">
              Advertising
            </a>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-2 mb-3">
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 hover:underline">
              Business Services
            </a>
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 hover:underline">
              Get the App
            </a>
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 hover:underline">
              More
            </a>
          </div>

          <div className="mt-4 text-xs text-gray-400 dark:text-gray-500">
            <span>Aspira Corporation © 2024</span>
          </div>
        </div>
      </div>
    );
  };
  
export default PopularJobs;