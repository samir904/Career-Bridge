import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Plus, X, AlertCircle, CheckCircle,
  Briefcase, MapPin, DollarSign, Calendar, Tag,
  Zap, Users, Clock
} from 'lucide-react';
import { createJob, clearError, clearSuccess } from '../store/slices/job.slice';
import HomeLayout from '../components/HomeLayout';

function CreateJobPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobLoading, error, success } = useSelector(state => state.job);
  const { user } = useSelector(state => state.user);

  // ============================================
  // STATE
  // ============================================
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    companyId: '',
    jobType: 'FULL_TIME',
    category: '',
    skillsRequired: [],
    experienceLevel: '',
    minimumExperience: 0,
    salary: {
      min: '',
      max: '',
      currency: 'USD'
    },
    locations: [],
    closingDate: '',
    tags: [],
    isFeatured: false
  });

  const [skillInput, setSkillInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [companies, setCompanies] = useState([]);

  // ============================================
  // EFFECTS
  // ============================================
  useEffect(() => {
    // Clear messages on unmount
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  // ============================================
  // HANDLERS
  // ============================================
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('salary.')) {
      const salaryField = name.split('.');
      setFormData(prev => ({
        ...prev,
        salary: {
          ...prev.salary,
          [salaryField]: value
        }
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setFormData(prev => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter((_, i) => i !== index)
    }));
  };

  const handleAddLocation = () => {
    if (locationInput.trim()) {
      setFormData(prev => ({
        ...prev,
        locations: [...prev.locations, locationInput.trim()]
      }));
      setLocationInput('');
    }
  };

  const handleRemoveLocation = (index) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index)
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      alert('Please enter job title');
      return;
    }

    if (formData.description.length < 100) {
      alert('Description must be at least 100 characters');
      return;
    }

    if (!formData.companyId) {
      alert('Please select a company');
      return;
    }

    if (!formData.experienceLevel) {
      alert('Please select experience level');
      return;
    }

    if (!formData.closingDate) {
      alert('Please set a closing date');
      return;
    }

    const closingDate = new Date(formData.closingDate);
    if (closingDate <= new Date()) {
      alert('Closing date must be in the future');
      return;
    }

    // Dispatch action
    await dispatch(createJob(formData));
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <HomeLayout>
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors mb-4 font-medium"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Post a New Job
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Fill out the form below to create a new job posting. Jobs are saved as DRAFT by default.
            </p>
          </div>
        </div>

        {/* MESSAGES */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900 dark:text-red-200">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
            <CheckCircle size={20} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-green-900 dark:text-green-200">{success}</p>
              <p className="text-sm text-green-800 dark:text-green-300 mt-1">
                Redirecting to dashboard...
              </p>
            </div>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8">
          
          {/* BASIC INFORMATION */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Briefcase size={24} className="text-teal-600" />
              Basic Information
            </h2>

            {/* JOB TITLE */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Senior React Developer"
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Make it clear and specific. e.g., avoid "Job" as title
              </p>
            </div>

            {/* JOB DESCRIPTION */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Job Description * (Minimum 100 characters)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the role, responsibilities, and what makes this job great..."
                rows="6"
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all resize-vertical"
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Include responsibilities, requirements, and benefits
                </p>
                <span className={`text-xs font-medium ${formData.description.length >= 100 ? 'text-green-600' : 'text-red-600'}`}>
                  {formData.description.length}/100
                </span>
              </div>
            </div>

            {/* COMPANY */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Company * (Demo: Select any) 
              </label>
              <select
                name="companyId"
                value={formData.companyId}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              >
                <option value="">Select a company</option>
                <option value="demo-company-1">Tech Innovations Inc</option>
                <option value="demo-company-2">Digital Solutions Ltd</option>
                <option value="demo-company-3">Cloud Ventures</option>
              </select>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Select the company this job is for
              </p>
            </div>
          </div>

          {/* JOB DETAILS */}
          <div className="mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Clock size={24} className="text-teal-600" />
              Job Details
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* JOB TYPE */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Job Type *
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                >
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="TEMPORARY">Temporary</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>

              {/* EXPERIENCE LEVEL */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Experience Level *
                </label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                >
                  <option value="">Select level</option>
                  <option value="ENTRY">Entry Level</option>
                  <option value="MID">Mid Level</option>
                  <option value="SENIOR">Senior Level</option>
                  <option value="EXECUTIVE">Executive</option>
                </select>
              </div>

              {/* MINIMUM EXPERIENCE */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Minimum Experience (years)
                </label>
                <input
                  type="number"
                  name="minimumExperience"
                  value={formData.minimumExperience}
                  onChange={handleInputChange}
                  min="0"
                  max="50"
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                >
                  <option value="">Select category</option>
                  <option value="IT_SOFTWARE">IT & Software</option>
                  <option value="DESIGN">Design</option>
                  <option value="MARKETING">Marketing</option>
                  <option value="SALES">Sales</option>
                  <option value="HR">Human Resources</option>
                  <option value="FINANCE">Finance</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* COMPENSATION */}
          <div className="mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <DollarSign size={24} className="text-teal-600" />
              Compensation
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {/* SALARY MIN */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Minimum Salary
                </label>
                <input
                  type="number"
                  name="salary.min"
                  value={formData.salary.min}
                  onChange={handleInputChange}
                  placeholder="e.g., 50000"
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>

              {/* SALARY MAX */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Maximum Salary
                </label>
                <input
                  type="number"
                  name="salary.max"
                  value={formData.salary.max}
                  onChange={handleInputChange}
                  placeholder="e.g., 80000"
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>

              {/* CURRENCY */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Currency
                </label>
                <select
                  name="salary.currency"
                  value={formData.salary.currency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                  <option value="AUD">AUD</option>
                </select>
              </div>
            </div>
          </div>

          {/* SKILLS & LOCATIONS */}
          <div className="mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Users size={24} className="text-teal-600" />
              Skills & Locations
            </h2>

            {/* SKILLS REQUIRED */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Skills Required
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  placeholder="e.g., React, Node.js, TypeScript"
                  className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all font-medium"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* SKILLS LIST */}
              {formData.skillsRequired.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skillsRequired.map((skill, index) => (
                    <div
                      key={index}
                      className="px-3 py-1.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full flex items-center gap-2"
                    >
                      <span className="text-sm">{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(index)}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* LOCATIONS */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Locations
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLocation())}
                  placeholder="e.g., New York, Remote, London"
                  className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddLocation}
                  className="px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all font-medium"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* LOCATIONS LIST */}
              {formData.locations.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.locations.map((location, index) => (
                    <div
                      key={index}
                      className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full flex items-center gap-2"
                    >
                      <MapPin size={16} />
                      <span className="text-sm">{location}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLocation(index)}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ADDITIONAL DETAILS */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Zap size={24} className="text-teal-600" />
              Additional Details
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* CLOSING DATE */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Closing Date *
                </label>
                <input
                  type="datetime-local"
                  name="closingDate"
                  value={formData.closingDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  When should applications close?
                </p>
              </div>

              {/* FEATURED JOB */}
              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-teal-600 rounded cursor-pointer"
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Featured Job (Premium)
                  </span>
                </label>
              </div>
            </div>

            {/* TAGS */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="e.g., Startup, Fast-paced, Remote-Friendly"
                  className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all font-medium"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* TAGS LIST */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full flex items-center gap-2"
                    >
                      <Tag size={16} />
                      <span className="text-sm">{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(index)}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 pt-8">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 px-6 py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={jobLoading}
              className={`flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-medium transition-all ${
                jobLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              {jobLoading ? 'Creating Job...' : 'Create Job (as Draft)'}
            </button>
          </div>

          {/* INFO BOX */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              <span className="font-medium">Note:</span> Jobs are created as DRAFT. You can edit them anytime before publishing. Once published, job seekers will be able to view and apply.
            </p>
          </div>
        </form>
      </div>
    </div>
    </HomeLayout>
  );
}

export default CreateJobPage;
