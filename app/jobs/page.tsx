'use client';
import React, { useState, useEffect } from 'react';
import JobCard from '@/components/ui/Jobs/JobCard';
import { Search, MapPin} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Job } from '@/types/types';
import { Skeleton } from '@/components/ui/shadcn/ui/skeleton';
import PostJobSection from '@/components/ui/Jobs/PostJobModal';
import ApplyModal from '@/components/ui/Jobs/ApplyModal';
import MessagesList from '@/components/ui/Messages/MessagesList';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { listenForAuthChanges } from '@/features/auth/authSlice';
import toast from 'react-hot-toast';

const Jobs = () => {
    
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
      dispatch(listenForAuthChanges());
    }, [dispatch]);

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [locationQuery, setLocationQuery] = useState<string>('');
    const [jobs, setJobs] = useState<Job[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [expandedJobs, setExpandedJobs] = useState<{ [key: number]: boolean }>({});
    const [jobType, setJobType] = useState('');
    const [salaryRange, setSalaryRange] = useState('');
    const [datePosted, setDatePosted] = useState('');
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
    const [currentJobId, setCurrentJobId] = useState<string | null>(null);

    // Fetch jobs from Firestore
    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const jobsCollection = collection(db, 'jobs');
            const jobsSnapshot = await getDocs(jobsCollection);
            const jobs = jobsSnapshot.docs.map(doc => ({
                id: doc.id,
                title: doc.data().title,
                company: doc.data().company,
                logo: doc.data().logo,
                location: doc.data().location,
                type: doc.data().type,
                salary: doc.data().salary,
                isRemote: doc.data().isRemote,
                level: doc.data().level,
                description: doc.data().description,
                requirements: doc.data().requirements,
                companyDescription: doc.data().companyDescription,
                postedAt: doc.data().postedAt.toDate(), // Convert Firestore Timestamp to Date
                expiresAt: doc.data().expiresAt,
                applicants: doc.data().applicants
            } as unknown  as Job));
            setJobs(jobs);
            setFilteredJobs(jobs);
            handleSearch(jobs); 
        } catch (err) {
            console.error('Error fetching jobs:', err);
            toast.error('Failed to fetch jobs. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    // Handle search and filters
    const handleSearch = (jobsToFilter = jobs) => {
        setIsLoading(true);
        setTimeout(() => {
            const results = jobsToFilter.filter(job => {
                const matchesSearch = !searchQuery || 
                    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    job.company.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesLocation = !locationQuery ||
                    job.location.toLowerCase().includes(locationQuery.toLowerCase());
                const matchesJobType = !jobType || job.type === jobType;
                const matchesSalaryRange = !salaryRange || checkSalaryRange(job.salary, salaryRange);
                const matchesDatePosted = !datePosted || checkDatePosted(job.postedAt.toString(), datePosted);
                return matchesSearch && matchesLocation && matchesJobType && matchesSalaryRange && matchesDatePosted;
            });

            setFilteredJobs(results);
            setIsLoading(false);
        }, 500);
    };

    const checkSalaryRange = (salary: number, range: string) => {
        const [min, max] = range.split('-').map(Number);
        return salary >= min && salary <= max;
    };

    const checkDatePosted = (postedAt: string, dateFilter: string) => {
        const currentDate = new Date();
        const datePosted = new Date(postedAt);
        const timeDiff = currentDate.getTime() - datePosted.getTime();
        switch (dateFilter) {
            case '24h':
                return timeDiff <= 24 * 60 * 60 * 1000;
            case '7d':
                return timeDiff <= 7 * 24 * 60 * 60 * 1000;
            case '30d':
                return timeDiff <= 30 * 24 * 60 * 60 * 1000;
            case '90d':
                return timeDiff <= 90 * 24 * 60 * 60 * 1000;
            default:
                return true;
        }
    };

    useEffect(() => {
        handleSearch();
    }, [searchQuery, locationQuery, jobType, salaryRange, datePosted]);



    // Clear all filters
    const clearFilters = () => {
        setJobType('');
        setSalaryRange('');
        setDatePosted('');
    };

    return (
        <div className="lg:h-[93.5vh] w-full  bg-dark-secondary  p-4 sm:p-6 lg:p-8 lg:fixed">
            <div className="max-w-7xl mx-auto space-y-6">
               
                     <ApplyModal  setIsApplicationModalOpen={setIsApplicationModalOpen} isApplicationModalOpen={isApplicationModalOpen} currentJobId={currentJobId} />

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Job List Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-dark-primary rounded-lg shadow-sm p-4 mb-6">
                            {/* Search and Filters Section */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Search className="h-5 w-5 text-[#8b949e]" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search jobs..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-[#30363d] rounded-lg focus:outline-none bg-dark-secondary text-[#c9d1d9] placeholder-[#8b949e]"
                                    />
                                </div>

                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Location..."
                                        value={locationQuery}
                                        onChange={(e) => setLocationQuery(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg focus:outline-none bg-dark-secondary text-gray-100 placeholder-gray-500"
                                    />
                                </div>
                            </div>

                            {/* Filters Section */}
                            <div className="pt-4 border-tborder-[#21262d]">
                                <div className="flex flex-wrap gap-4">
                                    {/* Job Type Filter */}
                                    <div className="flex-1 min-w-[200px]">
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Job Type
                                        </label>
                                        <select
                                            className="w-full px-3 py-2 rounded-lg border  border-gray-600 bg-dark-secondary text-gray-100 focus:outline-none"
                                            value={jobType}
                                            onChange={(e) => setJobType(e.target.value)}
                                        >
                                            <option value="">All Types</option>
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Freelance">Freelance</option>
                                        </select>
                                    </div>

                                    {/* Salary Range Filter */}
                                    <div className="flex-1 min-w-[200px]">
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Salary Range
                                        </label>
                                        <select
                                            className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-dark-secondary text-gray-100 focus:outline-none"
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
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Date Posted
                                        </label>
                                        <select
                                            className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-dark-secondary text-gray-100 focus:outline-none"
                                            value={datePosted}
                                            onChange={(e) => setDatePosted(e.target.value)}
                                        >
                                            <option value="">Any Time</option>
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
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full  bg-dark-secondary text-sm text-[#c9d1d9]">
                                                    {jobType}
                                                    <button onClick={() => setJobType('')} className="ml-1  hover:text-gray-100"> ×</button>
                                                </span>
                                            )}
                                            {salaryRange && (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-dark-secondary text-sm text-[#c9d1d9]">
                                                    {salaryRange}
                                                    <button onClick={() => setSalaryRange('')} className="ml-1  hover:text-gray-100">×</button>
                                                </span>
                                            )}
                                            {datePosted && (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-dark-secondary text-sm text-[#c9d1d9]">
                                                    {datePosted}
                                                    <button onClick={() => setDatePosted('')} className="ml-1 hover:text-gray-100"> ×</button>
                                                </span>
                                            )}
                                            <button onClick={clearFilters} className="text-sm text-gray-400  hover:text-gray-200">
                                                Clear all filters
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        

                        {/* Job Cards */}
                        <div className="space-y-6 overflow-y-auto h-[70vh] lg:pb-40 noScrollBar">
                                {isLoading ? (
                                    <div className="space-y-4">
                                        {[...Array(5)].map((_, index) => (
                                            <div key={index} className="bg-dark-primary rounded-lg shadow-sm p-4">
                                                <div className="flex gap-4">
                                                    <Skeleton className="h-12 w-12 rounded-lg" />
                                                    <div className="flex-1 space-y-2">
                                                        <Skeleton className="h-6 w-3/4 rounded-lg" />
                                                        <Skeleton className="h-4 w-1/2 rounded-lg" />
                                                        <Skeleton className="h-4 w-1/2 rounded-lg" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    filteredJobs.map(job => (
                                        <JobCard
                                            key={job.id}
                                            job={job}
                                            isExpanded={expandedJobs[job.id]}
                                            onToggle={() => setExpandedJobs(prev => ({  [job.id]: !prev[job.id] }))}
                                            onApply={() => {
                                                setCurrentJobId(job.id.toString());
                                                setIsApplicationModalOpen(true);
                                            }}
                                        />
                                    ))
                                )}
                        </div>
                        
                    </div>
                    <div className='space-y-5'>
                             <PostJobSection />
                             <MessagesList></MessagesList>
                  </div>
                </div>
            </div>
        </div>
    );
};

export default Jobs;