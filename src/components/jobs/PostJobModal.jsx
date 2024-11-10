import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';

const PostJobModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    logo: '',
    location: '',
    type: 'Full-time',
    salary: '',
    isRemote: false,
    level: 'Mid Level',
    description: '',
    requirements: [''],
    companyDescription: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData(prev => ({
      ...prev,
      requirements: newRequirements
    }));
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const removeRequirement = (index) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  // Validation functions
  const validateStep = (stepNumber) => {
    const newErrors = {};

    switch (stepNumber) {
      case 1:
        if (!formData.title.trim()) {
          newErrors.title = 'Job title is required';
        } else if (formData.title.length < 5) {
          newErrors.title = 'Job title must be at least 5 characters';
        }

        if (!formData.company.trim()) {
          newErrors.company = 'Company name is required';
        }

        if (formData.logo && !isValidUrl(formData.logo)) {
          newErrors.logo = 'Please enter a valid URL';
        }
        break;

      case 2:
        if (!formData.location.trim()) {
          newErrors.location = 'Location is required';
        }

        if (!formData.salary.trim()) {
          newErrors.salary = 'Salary range is required';
        } else if (!isValidSalaryFormat(formData.salary)) {
          newErrors.salary = 'Please use format: $XXk - $XXXk';
        }

        if (!formData.type.trim()) {
          newErrors.type = 'Job type is required';
        }

        if (!formData.level.trim()) {
          newErrors.level = 'Experience level is required';
        }
        break;

      case 3:
        if (!formData.description.trim()) {
          newErrors.description = 'Job description is required';
        } else if (formData.description.length < 100) {
          newErrors.description = 'Description must be at least 100 characters';
        }

        if (formData.requirements.length === 0) {
          newErrors.requirements = 'At least one requirement is needed';
        } else if (formData.requirements.some(req => !req.trim())) {
          newErrors.requirements = 'All requirements must be filled';
        }
        break;

      case 4:
        if (!formData.companyDescription.trim()) {
          newErrors.companyDescription = 'Company description is required';
        } else if (formData.companyDescription.length < 50) {
          newErrors.companyDescription = 'Company description must be at least 50 characters';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const isValidSalaryFormat = (salary) => {
    return /^\$\d+k\s*-\s*\$\d+k$/i.test(salary);
  };

  // Updated handlers
  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep(4)) {
      console.log('Form submitted:', formData);
      onClose();
    }
  };

  // Error display component
  const ErrorMessage = ({ error }) => {
    if (!error) return null;
    return (
      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
        <AlertCircle className="h-4 w-4" />
        {error}
      </p>
    );
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-[#0d1117] rounded-lg w-full max-w-3xl 
                      max-h-[90vh] overflow-hidden flex flex-col relative z-50">
          <div className="flex items-center justify-between p-6 border-b dark:border-[#21262d]">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-[#c9d1d9]">
              Post a Job - Step {step} of 4
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-[#8b949e] dark:hover:text-[#c9d1d9]"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border 
                        ${errors.title ? 'border-red-500' : 'border-gray-200 dark:border-[#30363d]'}
                        bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-[#c9d1d9]
                        focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#1f6feb]
                        focus:border-transparent`}
                      placeholder="e.g., Senior Software Engineer"
                    />
                    <ErrorMessage error={errors.title} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border 
                        ${errors.company ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}
                        bg-gray-50 dark:bg-[#18181A] text-gray-900 dark:text-gray-100`}
                      placeholder="e.g., Tech Corp"
                    />
                    <ErrorMessage error={errors.company} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company Logo URL
                    </label>
                    <input
                      type="text"
                      name="logo"
                      value={formData.logo}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border 
                        ${errors.logo ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}
                        bg-gray-50 dark:bg-[#18181A] text-gray-900 dark:text-gray-100`}
                      placeholder="https://example.com/logo.png"
                    />
                    <ErrorMessage error={errors.logo} />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Job Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border 
                        ${errors.location ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}
                        bg-gray-50 dark:bg-[#18181A] text-gray-900 dark:text-gray-100`}
                      placeholder="e.g., New York, NY"
                    />
                    <ErrorMessage error={errors.location} />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Job Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                                 bg-gray-50 dark:bg-[#18181A] text-gray-900 dark:text-gray-100"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                      </select>
                      <ErrorMessage error={errors.type} />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Experience Level <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                                 bg-gray-50 dark:bg-[#18181A] text-gray-900 dark:text-gray-100"
                      >
                        <option value="Entry Level">Entry Level</option>
                        <option value="Mid Level">Mid Level</option>
                        <option value="Senior Level">Senior Level</option>
                      </select>
                      <ErrorMessage error={errors.level} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Salary Range <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border 
                        ${errors.salary ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}
                        bg-gray-50 dark:bg-[#18181A] text-gray-900 dark:text-gray-100`}
                      placeholder="e.g., $120k - $180k"
                    />
                    <ErrorMessage error={errors.salary} />
                    <p className="mt-1 text-sm text-gray-500">Format: $XXk - $XXXk (e.g., $120k - $180k)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isRemote"
                      checked={formData.isRemote}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        isRemote: e.target.checked
                      }))}
                      className="rounded border-gray-300 dark:border-gray-700
                               text-gray-900 dark:text-gray-100"
                    />
                    <label className="text-sm text-gray-700 dark:text-gray-300">
                      This is a remote position
                    </label>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Job Description & Requirements
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Job Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full px-4 py-2 rounded-lg border 
                        ${errors.description ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}
                        bg-gray-50 dark:bg-[#18181A] text-gray-900 dark:text-gray-100`}
                      placeholder="Describe the role and responsibilities..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Requirements
                    </label>
                    {formData.requirements.map((req, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={req}
                          onChange={(e) => handleRequirementChange(index, e.target.value)}
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                                   bg-gray-50 dark:bg-[#18181A] text-gray-900 dark:text-gray-100"
                          placeholder="Add a requirement"
                        />
                        <button
                          onClick={() => removeRequirement(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addRequirement}
                      className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900
                               dark:hover:text-gray-100"
                    >
                      + Add Requirement
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Company Description
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    About the Company <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="companyDescription"
                    value={formData.companyDescription}
                    onChange={handleInputChange}
                    rows={6}
                    className={`w-full px-4 py-2 rounded-lg border 
                      ${errors.companyDescription ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}
                      bg-gray-50 dark:bg-[#18181A] text-gray-900 dark:text-gray-100`}
                    placeholder="Tell us about your company, culture, mission, and values..."
                  />
                  <ErrorMessage error={errors.companyDescription} />
                  <p className="mt-1 text-sm text-gray-500">
                    Minimum 50 characters ({formData.companyDescription.length}/50)
                  </p>
                  
                  {/* Preview Section with proper text truncation */}
                  {formData.companyDescription.length >= 50 && (
                    <div className="mt-8 p-4 rounded-lg bg-gray-50 dark:bg-[#161b22]">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-[#c9d1d9] mb-4">
                        Job Posting Summary
                      </h4>
                      <div className="space-y-3">
                        {/* Each row with proper truncation */}
                        <div className="grid grid-cols-[100px_1fr] gap-4 text-sm items-start">
                          <span className="text-gray-500 dark:text-[#8b949e]">Position:</span>
                          <span className="text-gray-700 dark:text-[#c9d1d9] font-medium truncate">
                            {formData.title}
                          </span>
                        </div>

                        <div className="grid grid-cols-[100px_1fr] gap-4 text-sm items-start">
                          <span className="text-gray-500 dark:text-[#8b949e]">Company:</span>
                          <span className="text-gray-700 dark:text-[#c9d1d9] font-medium truncate">
                            {formData.company}
                          </span>
                        </div>

                        <div className="grid grid-cols-[100px_1fr] gap-4 text-sm items-start">
                          <span className="text-gray-500 dark:text-[#8b949e]">Location:</span>
                          <span className="text-gray-700 dark:text-[#c9d1d9] font-medium truncate">
                            {formData.location} {formData.isRemote && '(Remote)'}
                          </span>
                        </div>

                        <div className="grid grid-cols-[100px_1fr] gap-4 text-sm items-start">
                          <span className="text-gray-500 dark:text-[#8b949e]">Salary:</span>
                          <span className="text-gray-700 dark:text-[#c9d1d9] font-medium truncate">
                            {formData.salary}
                          </span>
                        </div>

                        <div className="grid grid-cols-[100px_1fr] gap-4 text-sm items-start">
                          <span className="text-gray-500 dark:text-[#8b949e]">Type:</span>
                          <span className="text-gray-700 dark:text-[#c9d1d9] font-medium truncate">
                            {formData.type}
                          </span>
                        </div>

                        <div className="grid grid-cols-[100px_1fr] gap-4 text-sm items-start">
                          <span className="text-gray-500 dark:text-[#8b949e]">Level:</span>
                          <span className="text-gray-700 dark:text-[#c9d1d9] font-medium truncate">
                            {formData.level}
                          </span>
                        </div>

                        <div className="grid grid-cols-[100px_1fr] gap-4 text-sm items-start">
                          <span className="text-gray-500 dark:text-[#8b949e]">Description:</span>
                          <span className="text-gray-700 dark:text-[#c9d1d9] font-medium truncate">
                            {formData.description}
                          </span>
                        </div>

                        <div className="grid grid-cols-[100px_1fr] gap-4 text-sm items-start">
                          <span className="text-gray-500 dark:text-[#8b949e]">Requirements:</span>
                          <div className="text-gray-700 dark:text-[#c9d1d9] font-medium">
                            {formData.requirements.map((req, index) => (
                              <div key={index} className="truncate">
                                • {req}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-[100px_1fr] gap-4 text-sm items-start">
                          <span className="text-gray-500 dark:text-[#8b949e]">About:</span>
                          <span className="text-gray-700 dark:text-[#c9d1d9] font-medium truncate">
                            {formData.companyDescription}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center border-t dark:border-[#21262d] p-6">
            <button
              onClick={() => setStep(prev => prev - 1)}
              disabled={step === 1}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-[#30363d]
                       text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#161b22]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              onClick={step === 4 ? handleSubmit : handleNext}
              className="px-4 py-2 rounded-lg bg-gray-900 dark:bg-gray-100
                       text-white dark:text-gray-900 hover:opacity-90
                       flex items-center gap-2"
            >
              {step === 4 ? 'Post Job' : 'Next'}
              {step !== 4 && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJobModal;
