import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, clearError, clearSuccess } from '../../store/slices/user.slice';
import {
  selectUser,
  selectLoading,
  selectError,
  selectSuccess,
  selectIsAuthenticated
} from '../../store/slices/user.slice';
import Toast from '../Toast/Toast.jsx';
import LoadingSpinner from '../LoadingSpinner';
import HomeLayout from '../HomeLayout.jsx';

export default function GetProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // ✅ FIXED: Extract error/success message if it's an object
  const getErrorMessage = () => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    if (typeof error === 'object' && error.message) return error.message;
    return 'An error occurred';
  };

  const getSuccessMessage = () => {
    if (!success) return null;
    if (typeof success === 'string') return success;
    if (typeof success === 'object' && success.message) return success.message;
    return 'Success!';
  };

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getProfile());
    }
  }, [dispatch, isAuthenticated]);

  // ✅ Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // ✅ Clear success after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  // ✅ Show loading spinner
  if (loading) {
    return (
      <HomeLayout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
      </HomeLayout>
    );
  }

  // ✅ Show error if not authenticated
  if (!isAuthenticated) {
    return (
      <HomeLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Not Authenticated</h2>
            <p className="text-gray-600 mt-2">Please login to view your profile</p>
          </div>
        </div>
      </HomeLayout>
    );
  }

  // ✅ Show error if profile not found
  if (!user) {
    return (
      <HomeLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Profile Not Found</h2>
            <p className="text-gray-600 mt-2">Unable to load your profile</p>
          </div>
        </div>
      </HomeLayout>
    );
  }

  const errorMessage = getErrorMessage();
  const successMessage = getSuccessMessage();

  return (
    <HomeLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        {/* ✅ FIXED: Toast Notifications - Extract message properly */}
        {errorMessage && <Toast type="error" message={errorMessage} />}
        {successMessage && <Toast type="success" message={successMessage} />}

        <div className="max-w-6xl mx-auto">
          {/* ✅ Header Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8">
              <h1 className="text-4xl font-bold text-white">My Profile</h1>
              <p className="text-blue-100 mt-2">Manage your account information</p>
            </div>
          </div>

          {/* ✅ Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ✅ Left Sidebar - User Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Profile Avatar */}
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                    {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </div>

                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Full Name</p>
                    <p className="text-gray-900 font-bold text-lg">
                      {user?.fullName || 'Not provided'}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Email</p>
                    <p className="text-gray-900 break-all">{user?.email || 'N/A'}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Role</p>
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {user?.role === 'JOB_SEEKER' ? 'Job Seeker' : 'Employer'}
                    </span>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Phone</p>
                    <p className="text-gray-900">{user?.phoneNumber || 'Not provided'}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        user?.isProfilePublic
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user?.isProfilePublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                    Edit Profile
                  </button>
                  <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                    Change Password
                  </button>
                </div>
              </div>
            </div>

            {/* ✅ Right Content - Detailed Information */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Details */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-blue-500">
                  Personal Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-gray-600 text-sm font-semibold">Full Name</label>
                    <p className="text-gray-900 text-lg font-semibold">
                      {user?.fullName || 'Not provided'}
                    </p>
                  </div>

                  <div>
                    <label className="text-gray-600 text-sm font-semibold">Email Address</label>
                    <p className="text-gray-900 text-lg font-semibold">{user?.email || 'N/A'}</p>
                  </div>

                  <div>
                    <label className="text-gray-600 text-sm font-semibold">Phone Number</label>
                    <p className="text-gray-900 text-lg font-semibold">
                      {user?.phoneNumber || 'Not provided'}
                    </p>
                  </div>

                  <div>
                    <label className="text-gray-600 text-sm font-semibold">Date of Birth</label>
                    <p className="text-gray-900 text-lg font-semibold">
                      {user?.dateOfBirth
                        ? new Date(user.dateOfBirth).toLocaleDateString()
                        : 'Not provided'}
                    </p>
                  </div>

                  <div>
                    <label className="text-gray-600 text-sm font-semibold">Gender</label>
                    <p className="text-gray-900 text-lg font-semibold">
                      {user?.gender || 'Not provided'}
                    </p>
                  </div>

                  <div>
                    <label className="text-gray-600 text-sm font-semibold">Location</label>
                    <p className="text-gray-900 text-lg font-semibold">
                      {user?.location || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>

             {/* Job Seeker Profile */}
{user?.role === 'JOB_SEEKER' && user?.seekerProfile && (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-green-500">
      Job Seeker Details
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="text-gray-600 text-sm font-semibold">Headline</label>
        <p className="text-gray-900 text-lg">
          {user.seekerProfile.headline || 'Not provided'}
        </p>
      </div>

      <div>
        <label className="text-gray-600 text-sm font-semibold">
          Experience Level
        </label>
        <p className="text-gray-900 text-lg font-semibold">
          {user.seekerProfile.experience?.level || 'Not provided'}
        </p>
      </div>

      <div>
        <label className="text-gray-600 text-sm font-semibold">
          Expected Salary Currency
        </label>
        <p className="text-gray-900 text-lg">
          {user.seekerProfile.expectedSalary?.currency || 'Not specified'}
        </p>
      </div>

      <div>
        <label className="text-gray-600 text-sm font-semibold">Skills</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {user.seekerProfile.skills &&
          Array.isArray(user.seekerProfile.skills) &&
          user.seekerProfile.skills.length > 0 ? (
            user.seekerProfile.skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-gray-500">No skills added</p>
          )}
        </div>
      </div>

      <div>
        <label className="text-gray-600 text-sm font-semibold">
          Preferred Locations
        </label>
        <div className="flex flex-wrap gap-2 mt-2">
          {user.seekerProfile.preferredLocations &&
          Array.isArray(user.seekerProfile.preferredLocations) &&
          user.seekerProfile.preferredLocations.length > 0 ? (
            user.seekerProfile.preferredLocations.map((location, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {location}
              </span>
            ))
          ) : (
            <p className="text-gray-500">No location preferences set</p>
          )}
        </div>
      </div>

      <div>
        <label className="text-gray-600 text-sm font-semibold">
          Preferred Job Types
        </label>
        <div className="flex flex-wrap gap-2 mt-2">
          {user.seekerProfile.preferredJobTypes &&
          Array.isArray(user.seekerProfile.preferredJobTypes) &&
          user.seekerProfile.preferredJobTypes.length > 0 ? (
            user.seekerProfile.preferredJobTypes.map((type, idx) => (
              <span
                key={idx}
                className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
              >
                {type}
              </span>
            ))
          ) : (
            <p className="text-gray-500">No job type preferences set</p>
          )}
        </div>
      </div>

      <div>
        <label className="text-gray-600 text-sm font-semibold">
          Profile Completion
        </label>
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-500 h-2.5 rounded-full transition-all"
              style={{
                width: user.seekerProfile.isProfileComplete ? '100%' : '20%'
              }}
            ></div>
          </div>
          <p className="text-gray-600 text-sm mt-2">
            {user.seekerProfile.isProfileComplete
              ? '✅ Complete'
              : '⏳ 20% Complete'}
          </p>
        </div>
      </div>
    </div>

    <div className="mt-6">
      <label className="text-gray-600 text-sm font-semibold">Bio</label>
      <p className="text-gray-900 mt-2 text-lg leading-relaxed">
        {user.seekerProfile.bio || 'No bio provided'}
      </p>
    </div>
  </div>
)}


              {/* Employer Profile */}
              {user?.role === 'EMPLOYER' && user?.employerProfile && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-purple-500">
                    Employer Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-gray-600 text-sm font-semibold">
                        Company Name
                      </label>
                      <p className="text-gray-900 text-lg font-semibold">
                        {user.employerProfile.companyId?.name || 'Not provided'}
                      </p>
                    </div>

                    <div>
                      <label className="text-gray-600 text-sm font-semibold">
                        Company Size
                      </label>
                      <p className="text-gray-900 text-lg">
                        {user.employerProfile.companyId?.companySize ||
                          'Not provided'}
                      </p>
                    </div>

                    <div>
                      <label className="text-gray-600 text-sm font-semibold">
                        Industry
                      </label>
                      <p className="text-gray-900 text-lg">
                        {user.employerProfile.companyId?.industry ||
                          'Not provided'}
                      </p>
                    </div>

                    <div>
                      <label className="text-gray-600 text-sm font-semibold">
                        Location
                      </label>
                      <p className="text-gray-900 text-lg">
                        {user.employerProfile.companyId?.location ||
                          'Not provided'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="text-gray-600 text-sm font-semibold">
                      Description
                    </label>
                    <p className="text-gray-900 mt-2 text-lg leading-relaxed">
                      {user.employerProfile.companyId?.description ||
                        'No description provided'}
                    </p>
                  </div>
                </div>
              )}

              {/* Social Links */}
              {user?.socialLinks &&
                Object.keys(user.socialLinks).length > 0 && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-orange-500">
                      Social Links
                    </h2>

                    <div className="space-y-4">
                      {user.socialLinks.linkedin && (
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">💼</span>
                          <div>
                            <p className="text-gray-600 text-sm font-semibold">
                              LinkedIn
                            </p>
                            <a
                              href={user.socialLinks.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {user.socialLinks.linkedin}
                            </a>
                          </div>
                        </div>
                      )}

                      {user.socialLinks.github && (
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">🐙</span>
                          <div>
                            <p className="text-gray-600 text-sm font-semibold">
                              GitHub
                            </p>
                            <a
                              href={user.socialLinks.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {user.socialLinks.github}
                            </a>
                          </div>
                        </div>
                      )}

                      {user.socialLinks.portfolio && (
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">🌐</span>
                          <div>
                            <p className="text-gray-600 text-sm font-semibold">
                              Portfolio
                            </p>
                            <a
                              href={user.socialLinks.portfolio}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {user.socialLinks.portfolio}
                            </a>
                          </div>
                        </div>
                      )}

                      {user.socialLinks.twitter && (
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">🐦</span>
                          <div>
                            <p className="text-gray-600 text-sm font-semibold">
                              Twitter
                            </p>
                            <a
                              href={user.socialLinks.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {user.socialLinks.twitter}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* Account Info */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-gray-400">
                  Account Information
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-semibold">
                      Account Created
                    </span>
                    <span className="text-gray-900">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-semibold">
                      Last Updated
                    </span>
                    <span className="text-gray-900">
                      {user?.updatedAt
                        ? new Date(user.updatedAt).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-semibold">
                      Profile Visibility
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user?.isProfilePublic
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user?.isProfilePublic ? '🔓 Public' : '🔒 Private'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
