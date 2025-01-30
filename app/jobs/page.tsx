'use client';
import React, { useState, useEffect } from 'react';
import JobCard from '@/components/ui/Jobs/JobCard';
import { Search, MapPin, X } from 'lucide-react';
import { db } from '@/lib/firebase'; // Adjust the path to your Firebase config
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Job } from '@/types/types';
import { Skeleton } from '@/components/ui/shadcn/ui/skeleton';
import PostJobSection from '@/components/ui/Jobs/PostJobModal';

const Jobs = () => {
    const user = {
        uid: "id1",
        photoURL: "https://example.com/photo.jpg" 
    }; 
    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [jobs, setJobs] = useState<Job[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [expandedJobs, setExpandedJobs] = useState<{ [key: number]: boolean }>({});
    const [jobType, setJobType] = useState('');
    const [salaryRange, setSalaryRange] = useState('');
    const [datePosted, setDatePosted] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
    const [currentJobId, setCurrentJobId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [motivationLetter, setMotivationLetter] = useState('');

    // Fetch jobs from Firestore
    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const jobsCollection = collection(db, 'jobs');
            const jobsSnapshot = await getDocs(jobsCollection);
            const jobs = jobsSnapshot.docs.map(doc => ({ 
                id: doc.id.toString(), 
                ...doc.data(),
                postedAt: doc.data().postedAt.toDate() // Convert Firestore Timestamp to Date
            } as unknown as Job));
            console.log(jobs)
            setJobs(jobs);
            setFilteredJobs(jobs);
            handleSearch(jobs); 
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setError('Failed to fetch jobs. Please try again later.');
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
                const matchesDatePosted = !datePosted || checkDatePosted(job.postedAt.toDate(), datePosted);

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

    const checkDatePosted = (postedAt: Date, dateFilter: string) => {
        const currentDate = new Date();
        const timeDiff = currentDate.getTime() - postedAt.getTime();

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

    // Handle job application
    const handleApply = async () => {
        if (!user || !currentJobId) {
            setError('You must be logged in to apply for a job.');
            return;
        }

        if (!name || !email || !motivationLetter) {
            setError('All fields are required.');
            return;
        }

        try {
            await addDoc(collection(db, 'applications'), {
                jobId: currentJobId,
                userId: user.uid,
                name,
                email,
                motivationLetter,
                avatar: user.photoURL,
                appliedAt: Timestamp.now(),
            });
            alert('Application submitted successfully!');
            setIsApplicationModalOpen(false);
            setName('');
            setEmail('');
            setMotivationLetter('');
        } catch (err) {
            setError('Failed to submit application. Please try again.');
        }
    };

    // Clear all filters
    const clearFilters = () => {
        setJobType('');
        setSalaryRange('');
        setDatePosted('');
    };

    return (
        <div className="lg:h-[93.5vh] w-full bg-gray-50 dark:bg-dark-secondary mt-[6.5vh] p-4 sm:p-6 lg:p-8 lg:fixed">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        {error}
                        <button onClick={() => setError(null)} className="absolute top-0 right-0 px-4 py-3">
                            ×
                        </button>
                    </div>
                )}

                {/* Application Modal */}
                <AnimatePresence>
                    {isApplicationModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        >
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.9 }}
                                className="bg-white dark:bg-dark-primary rounded-lg shadow-lg p-6 w-full max-w-md"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Apply for Job</h2>
                                    <button onClick={() => setIsApplicationModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleApply();
                                    }}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-secondary text-gray-900 dark:text-gray-100 focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-secondary text-gray-900 dark:text-gray-100 focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Motivation Letter</label>
                                        <textarea
                                            value={motivationLetter}
                                            onChange={(e) => setMotivationLetter(e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-secondary text-gray-900 dark:text-gray-100 focus:outline-none"
                                            rows={4}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-theme-primary hover:opacity-90 text-white px-4 py-2 rounded-lg transition-opacity"
                                    >
                                        Submit Application
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Job List Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-dark-primary rounded-lg shadow-sm p-4 mb-6">
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
                                        className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-[#30363d] rounded-lg focus:outline-none bg-white dark:bg-dark-secondary text-gray-900 dark:text-[#c9d1d9] placeholder-gray-400 dark:placeholder-[#8b949e]"
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
                                        className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none bg-white dark:bg-dark-secondary text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
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
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-secondary text-gray-900 dark:text-gray-100 focus:outline-none"
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
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-secondary text-gray-900 dark:text-gray-100 focus:outline-none"
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
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-secondary text-gray-900 dark:text-gray-100 focus:outline-none"
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
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 dark:bg-dark-secondary text-sm text-gray-700 dark:text-[#c9d1d9]">
                                                    {jobType}
                                                    <button onClick={() => setJobType('')} className="ml-1 hover:text-gray-900 dark:hover:text-gray-100">
                                                        ×
                                                    </button>
                                                </span>
                                            )}
                                            {salaryRange && (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 dark:bg-dark-secondary text-sm text-gray-700 dark:text-[#c9d1d9]">
                                                    {salaryRange}
                                                    <button onClick={() => setSalaryRange('')} className="ml-1 hover:text-gray-900 dark:hover:text-gray-100">
                                                        ×
                                                    </button>
                                                </span>
                                            )}
                                            {datePosted && (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 dark:bg-dark-secondary text-sm text-gray-700 dark:text-[#c9d1d9]">
                                                    {datePosted}
                                                    <button onClick={() => setDatePosted('')} className="ml-1 hover:text-gray-900 dark:hover:text-gray-100">
                                                        ×
                                                    </button>
                                                </span>
                                            )}
                                            <button onClick={clearFilters} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                                                Clear all filters
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        

                        {/* Job Cards */}
                        <div className="space-y-6 overflow-y-auto h-[calc(100vh-300px)]">
                                {isLoading ? (
                                    <div className="space-y-4">
                                        {[...Array(5)].map((_, index) => (
                                            <div key={index} className="bg-white dark:bg-dark-primary rounded-lg shadow-sm p-4">
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
                  <PostJobSection />
                </div>
            </div>
        </div>
    );
};

export default Jobs;