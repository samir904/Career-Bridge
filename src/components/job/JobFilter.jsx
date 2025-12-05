
import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';

const JobFilter = ({ onFilter, onSearch, loading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    jobType: 'ALL',
    level: 'ALL',
    minSalary: 0,
    maxSalary: 500,
    sortBy: 'newest'
  });

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    onFilter(updatedFilters);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      location: '',
      jobType: 'ALL',
      level: 'ALL',
      minSalary: 0,
      maxSalary: 500,
      sortBy: 'newest'
    });
    onSearch('');
    onFilter({});
  };

  const isFiltersActive = 
    searchTerm || 
    filters.location || 
    filters.jobType !== 'ALL' || 
    filters.level !== 'ALL' || 
    filters.minSalary > 0 || 
    filters.maxSalary < 500 || 
    filters.sortBy !== 'newest';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-200 dark:border-slate-700 mb-6 shadow-sm">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search jobs, companies, skills..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-4 py-2.5 border rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap text-sm ${
            showAdvanced
              ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
              : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Filter size={18} />
          Filters
          <ChevronDown size={16} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>
      </form>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Location
              </label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                placeholder="e.g., New York, Remote"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Job Type
              </label>
              <select
                value={filters.jobType}
                onChange={(e) => handleFilterChange('jobType', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer"
              >
                <option value="ALL">All Types</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="TEMPORARY">Temporary</option>
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Experience Level
              </label>
              <select
                value={filters.level}
                onChange={(e) => handleFilterChange('level', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer"
              >
                <option value="ALL">All Levels</option>
                <option value="ENTRY">Entry Level</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
                <option value="EXECUTIVE">Executive</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="salary-high">Highest Salary</option>
                <option value="salary-low">Lowest Salary</option>
                <option value="most-viewed">Most Viewed</option>
              </select>
            </div>
          </div>

          {/* Salary Range */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Salary Range: ${filters.minSalary}K - ${filters.maxSalary}K
              </label>
              <div className="flex gap-4 items-center">
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={filters.minSalary}
                  onChange={(e) => {
                    const newMin = parseInt(e.target.value);
                    if (newMin <= filters.maxSalary) {
                      handleFilterChange('minSalary', newMin);
                    }
                  }}
                  className="flex-1"
                />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400 min-w-fit">
                  to
                </span>
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={filters.maxSalary}
                  onChange={(e) => {
                    const newMax = parseInt(e.target.value);
                    if (newMax >= filters.minSalary) {
                      handleFilterChange('maxSalary', newMax);
                    }
                  }}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {isFiltersActive && (
            <div className="pt-2 border-t border-slate-300 dark:border-slate-600">
              <button
                onClick={handleClearFilters}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <X size={16} />
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Active Filters Display */}
      {isFiltersActive && (
        <div className="mt-4 flex flex-wrap gap-2">
          {searchTerm && (
            <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 rounded-full text-xs font-medium flex items-center gap-2">
              Search: {searchTerm}
              <button
                onClick={() => {
                  setSearchTerm('');
                  onSearch('');
                }}
                className="hover:opacity-70"
              >
                ×
              </button>
            </span>
          )}
          {filters.location && (
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium flex items-center gap-2">
              Location: {filters.location}
              <button
                onClick={() => handleFilterChange('location', '')}
                className="hover:opacity-70"
              >
                ×
              </button>
            </span>
          )}
          {filters.jobType !== 'ALL' && (
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium flex items-center gap-2">
              {filters.jobType}
              <button
                onClick={() => handleFilterChange('jobType', 'ALL')}
                className="hover:opacity-70"
              >
                ×
              </button>
            </span>
          )}
          {filters.level !== 'ALL' && (
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-xs font-medium flex items-center gap-2">
              {filters.level}
              <button
                onClick={() => handleFilterChange('level', 'ALL')}
                className="hover:opacity-70"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default JobFilter;
