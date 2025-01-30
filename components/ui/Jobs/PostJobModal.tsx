import { useState } from "react";
import { X, ArrowRight, ArrowLeft, AlertCircle } from "lucide-react";
import { Timestamp } from "firebase/firestore";
import { doc, setDoc, collection } from "firebase/firestore";
import {
  jobFormStep1Schema,
  jobFormStep2Schema,
  jobFormStep3Schema,
  jobFormStep4Schema,
  type JobFormData
} from "@/validation/formValidations";
import { z } from "zod";
import { db } from "@/lib/firebase";

const PostJobSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    company: "",
    logo: "" as string,
    location: "",
    type: "Full-time",
    salary: "",
    isRemote: false,
    level: "Mid Level",
    description: "",
    requirements: [""],
    companyDescription: "",
    expiresAt: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData(prev => ({ ...prev, requirements: newRequirements }));
    if (errors.requirements) setErrors(prev => ({ ...prev, requirements: "" }));
  };

  const addRequirement = () => {
    setFormData(prev => ({ ...prev, requirements: [...prev.requirements, ""] }));
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const validateStep = async (stepNumber: number) => {
    let schema;
    switch(stepNumber) {
      case 1: schema = jobFormStep1Schema; break;
      case 2: schema = jobFormStep2Schema; break;
      case 3: schema = jobFormStep3Schema; break;
      case 4: schema = jobFormStep4Schema; break;
      default: return false;
    }

    try {
      await schema.parseAsync(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        (error as z.ZodError).issues.forEach(issue => {
          const path = issue.path[0];
          if (path) newErrors[path] = issue.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(step);
    if (isValid) setStep(prev => prev + 1);
  };

  const handleBack = () => setStep(prev => prev - 1);

const handleSubmit = async () => {
    const isValid = await validateStep(4);
    if (!isValid) return;

    const jobData = {
        ...formData,
        salary: Number(formData.salary),
        applicants: 0,
        requirements: formData.requirements.filter(req => req.trim()),
        postedAt: Timestamp.now(),
        expiresAt: Timestamp.fromDate(new Date(formData.expiresAt)),
        isRemote: formData.isRemote
    };

    try {
        await setDoc(doc(collection(db, "jobs")), jobData);
        console.log("Job posted successfully:", jobData);
        alert("Job posted successfully!");
    } catch (error) {
        console.error("Error posting job:", error);
        setErrors({ submit: "Error posting job. Please try again." });
    }
    setIsModalOpen(false);
};

  return (
    <div className="bg-dark-secondary rounded-lg p-6 shadow-lg">
      {/* Banner Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-theme-secondary">Ready to hire?</h2>
        <p className="text-theme-secondary/80">
          Post your job to reach thousands of qualified candidates
        </p>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-theme-primary hover:bg-opacity-90 text-theme-secondary py-3 rounded-lg font-medium transition-all"
        >
          Post a Job
        </button>

        <div className="border-t border-dark-primary pt-4 mt-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <StatItem value="5k+" label="Active Users" />
            <StatItem value="24h" label="Avg. Response" />
            <StatItem value="98%" label="Success Rate" />
          </div>
        </div>
      </div>

      {/* Job Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsModalOpen(false)} />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-dark-primary rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-dark-secondary">
                <h2 className="text-xl font-semibold text-theme-secondary">
                  Post a Job - Step {step} of 4
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-theme-secondary/80 hover:text-theme-secondary"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {step === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-theme-secondary">Basic Information</h3>
                    <div className="space-y-4">
                      <InputField
                        label="Job Title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        error={errors.title}
                        required
                      />
                      <InputField
                        label="Company Name"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        error={errors.company}
                        required
                      />
                      <InputField
                        label="Logo URL"
                        name="logo"
                        value={formData.logo || ""}
                        onChange={handleInputChange}
                        error={errors.logo}
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-theme-secondary">Job Details</h3>
                    <div className="space-y-4">
                      <InputField
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        error={errors.location}
                        required
                      />
                      
                      <div className="flex gap-4">
                        <SelectField
                          label="Job Type"
                          name="type"
                          value={formData.type}
                          options={["Full-time", "Part-time", "Contract", "Freelance"]}
                          onChange={handleInputChange}
                        />
                        <SelectField
                          label="Experience Level"
                          name="level"
                          value={formData.level}
                          options={["Entry Level", "Mid Level", "Senior Level"]}
                          onChange={handleInputChange}
                        />
                      </div>

                      <InputField
                        label="Salary ($)"
                        name="salary"
                        type="number"
                        value={formData.salary}
                        onChange={handleInputChange}
                        error={errors.salary}
                        required
                      />

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-theme-secondary">
                          Expiration Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="expiresAt"
                          value={formData.expiresAt}
                          onChange={handleInputChange}
                          className="w-full bg-dark-secondary text-theme-secondary border border-dark-primary rounded-lg p-2"
                        />
                        <ErrorMessage error={errors.expiresAt} />
                      </div>

                      <Checkbox
                        label="Remote Position"
                        checked={formData.isRemote}
                        onChange={(e) => setFormData(prev => ({ ...prev, isRemote: e.target.checked }))}
                      />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-theme-secondary">Job Description</h3>
                    <div className="space-y-4">
                      <TextArea
                        label="Job Description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        error={errors.description}
                        rows={4}
                        required
                      />
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-theme-secondary">
                          Requirements <span className="text-red-500">*</span>
                        </label>
                        {formData.requirements.map((req, index) => (
                          <div key={index} className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={req}
                              onChange={(e) => handleRequirementChange(index, e.target.value)}
                              className="flex-1 bg-dark-secondary text-theme-secondary border border-dark-primary rounded-lg p-2"
                              placeholder="Add requirement"
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
                          className="text-sm text-theme-primary hover:underline"
                        >
                          + Add Requirement
                        </button>
                        <ErrorMessage error={errors.requirements} />
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-theme-secondary">Company Info</h3>
                    <TextArea
                      label="Company Description"
                      name="companyDescription"
                      value={formData.companyDescription}
                      onChange={handleInputChange}
                      error={errors.companyDescription}
                      rows={6}
                      required
                    />
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-between items-center border-t border-dark-secondary p-6">
                <button
                  onClick={handleBack}
                  disabled={step === 1}
                  className="px-4 py-2 rounded-lg border border-dark-secondary text-theme-secondary hover:bg-dark-secondary disabled:opacity-50 flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Previous
                </button>
                <button
                  onClick={step === 4 ? handleSubmit : handleNext}
                  className="px-4 py-2 rounded-lg bg-theme-primary text-theme-secondary hover:bg-opacity-90 flex items-center gap-2"
                >
                  {step === 4 ? "Post Job" : "Next"}
                  {step !== 4 && <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Components
const StatItem = ({ value, label }: { value: string; label: string }) => (
  <div>
    <div className="text-xl font-bold text-theme-primary">{value}</div>
    <div className="text-sm text-theme-secondary/80">{label}</div>
  </div>
);

const InputField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  type = "text", 
  required, 
  placeholder 
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-theme-secondary mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full bg-dark-secondary text-theme-secondary border ${
        error ? "border-red-500" : "border-dark-primary"
      } rounded-lg p-2`}
    />
    <ErrorMessage error={error} />
  </div>
);

const TextArea = ({
  label,
  name,
  value,
  onChange,
  error,
  rows,
  required
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  rows: number;
  required?: boolean;
}) => (
  <div>
    <label className="block text-sm font-medium text-theme-secondary mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      className={`w-full bg-dark-secondary text-theme-secondary border ${
        error ? "border-red-500" : "border-dark-primary"
      } rounded-lg p-2`}
    />
    <ErrorMessage error={error} />
  </div>
);

const SelectField = ({
  label,
  name,
  value,
  options,
  onChange
}: {
  label: string;
  name: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <div className="flex-1">
    <label className="block text-sm font-medium text-theme-secondary mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-dark-secondary text-theme-secondary border border-dark-primary rounded-lg p-2"
    >
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
);

const Checkbox = ({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="rounded border-dark-primary text-theme-primary focus:ring-theme-primary"
    />
    <label className="text-sm text-theme-secondary">{label}</label>
  </div>
);

const ErrorMessage = ({ error }: { error?: string }) => 
  error ? (
    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
      <AlertCircle className="h-4 w-4" /> {error}
    </p>
  ) : null;

export default PostJobSection;