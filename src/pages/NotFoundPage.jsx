import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, AlertCircle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 dark:from-slate-950 dark:to-black flex items-center justify-center px-4 py-12">
      
      {/* Main Container */}
      <div className="max-w-2xl w-full">
        
        {/* 404 Number - Large & Bold */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <div className="text-9xl md:text-[150px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-600 animate-pulse">
              404
            </div>
          </div>
        </div>

        {/* Alert Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-teal-500/20 blur-2xl rounded-full"></div>
            <div className="relative bg-slate-800/80 rounded-full p-6 border border-teal-500/30">
              <AlertCircle size={64} className="text-teal-400" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
          Oops! Page Not Found
        </h1>

        {/* Description */}
        <p className="text-lg text-slate-300 text-center mb-4">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        {/* Secondary Message */}
        <p className="text-sm md:text-base text-slate-400 text-center mb-12 max-w-md mx-auto">
          It might have been deleted, the URL might be wrong, or you may not have permission to access this page.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          
          {/* Back Button */}
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <Home size={20} />
            <span>Back to Home</span>
          </Link>

          {/* Go Back Button */}
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition-all duration-300 border border-slate-600"
          >
            <ArrowLeft size={20} />
            <span>Go Back</span>
          </button>
        </div>

        {/* Quick Links Section */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-8 mb-8">
          <h2 className="text-white font-semibold mb-4 text-center">Here are some helpful links:</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/jobs"
              className="block p-3 bg-slate-700/50 hover:bg-teal-500/10 border border-slate-600/50 hover:border-teal-500/50 rounded-lg text-slate-300 hover:text-teal-400 transition-all text-center font-medium"
            >
              Browse Jobs
            </Link>

            <Link
              to="/companies"
              className="block p-3 bg-slate-700/50 hover:bg-teal-500/10 border border-slate-600/50 hover:border-teal-500/50 rounded-lg text-slate-300 hover:text-teal-400 transition-all text-center font-medium"
            >
              Explore Companies
            </Link>

            <Link
              to="/applications"
              className="block p-3 bg-slate-700/50 hover:bg-teal-500/10 border border-slate-600/50 hover:border-teal-500/50 rounded-lg text-slate-300 hover:text-teal-400 transition-all text-center font-medium"
            >
              My Applications
            </Link>

            <Link
              to="/profile"
              className="block p-3 bg-slate-700/50 hover:bg-teal-500/10 border border-slate-600/50 hover:border-teal-500/50 rounded-lg text-slate-300 hover:text-teal-400 transition-all text-center font-medium"
            >
              My Profile
            </Link>
          </div>
        </div>

        {/* Search Suggestion */}
        <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/30 rounded-lg p-6 text-center">
          <div className="flex justify-center mb-3">
            <Search size={32} className="text-teal-400" />
          </div>
          <h3 className="text-white font-semibold mb-2">Can't find what you're looking for?</h3>
          <p className="text-slate-300 text-sm mb-4">
            Use our search feature or browse through our popular sections to find the right opportunity.
          </p>
          <Link
            to="/jobs"
            className="inline-block px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-colors"
          >
            Search Jobs
          </Link>
        </div>

        {/* Error Details */}
        <div className="mt-12 text-center">
          <p className="text-xs text-slate-500 mb-2">Error Code: 404</p>
          <p className="text-xs text-slate-500">
            If you believe this is an error, please <a href="#" className="text-teal-400 hover:text-teal-300">contact support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
