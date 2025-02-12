import { Briefcase, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PopularJob } from "@/types/types";

export const PopularJobs = ({ jobs } :{jobs : PopularJob[]}) => {

    return (
      <div className="hidden lg:block space-y-6">
        <div className="bg-dark-primary rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold text-[#c9d1d9] mb-4">
            Popular Jobs
          </h2>
         
            <>
              {jobs.map((job) => (
                <div 
                  key={job.id} 
                  className="mb-4 p-3 rounded-lg hover:bg-dark-secondary 
                          cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-theme-primary
                                flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[#c9d1d9]">
                        {job.title}
                      </h3>
                      <p className="text-xs text-[#8b949e]">
                        {job.newPositions} new positions • {job.location}
                      </p>
                      <p className="text-xs text-[#c9d1d9] mt-1">{job.salary}</p>
                    </div>
                  </div>
                </div>
              ))}

              <Link
                href='/jobs'
                className="mt-2 flex items-center justify-between p-3 text-sm font-medium text-[#c9d1d9]  hover:bg-[#161b22] rounded-lg transition-colors"
              >
                <span>Show all jobs</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
         
        </div>

      </div>
    );
  };
  
export default PopularJobs;