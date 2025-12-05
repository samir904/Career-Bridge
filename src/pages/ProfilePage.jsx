import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '../store/slices/user.slice';
import {
  selectUser,
  selectLoading,
  selectError,
  selectIsAuthenticated
} from '../store/slices/user.slice';
import HomeLayout from '../components/HomeLayout';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getProfile());
    }
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return (
      <HomeLayout>
        <div className="text-center py-20">Loading profile...</div>
      </HomeLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <HomeLayout>
        <div className="text-center py-20 text-red-600">Please login first</div>
      </HomeLayout>
    );
  }

  if (!user) {
    return (
      <HomeLayout>
        <div className="text-center py-20 text-red-600">Profile not found</div>
      </HomeLayout>
    );
  }

  if (error) {
    const errorMessage = typeof error === 'string' ? error : error?.message || 'An error occurred';
    return (
      <HomeLayout>
        <div className="text-center py-20 text-red-600">{errorMessage}</div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="bg-blue-600 text-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold">My Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-gray-600 font-semibold text-sm">Full Name</p>
              <p className="text-2xl font-bold text-gray-900">{user.fullName}</p>
            </div>

            <div>
              <p className="text-gray-600 font-semibold text-sm">Email</p>
              <p className="text-2xl font-bold text-gray-900">{user.email}</p>
            </div>

            <div>
              <p className="text-gray-600 font-semibold text-sm">Phone</p>
              <p className="text-2xl font-bold text-gray-900">
                {user.phoneNumber || 'Not provided'}
              </p>
            </div>

            <div>
              <p className="text-gray-600 font-semibold text-sm">Role</p>
              <p className="text-2xl font-bold text-gray-900">
                {user.role === 'JOB_SEEKER' ? '👤 Job Seeker' : '🏢 Employer'}
              </p>
            </div>
          </div>

          <hr className="my-8" />

          {/* Job Seeker Details */}
          {user.role === 'JOB_SEEKER' && user.seekerProfile && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Job Seeker Details
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 font-semibold">Headline</p>
                  <p className="text-lg text-gray-900">
                    {user.seekerProfile.headline || 'Not provided'}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 font-semibold">Experience Level</p>
                  <p className="text-lg text-gray-900">
                    {/* ✅ FIX: Extract level from experience object */}
                    {user.seekerProfile.experience?.level || 'Not specified'}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 font-semibold">Expected Salary</p>
                  <p className="text-lg text-gray-900">
                    {/* ✅ FIX: Extract currency from expectedSalary object */}
                    {user.seekerProfile.expectedSalary?.currency || 'Not specified'}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 font-semibold">Skills</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.seekerProfile.skills && user.seekerProfile.skills.length > 0 ? (
                      user.seekerProfile.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-green-100 text-green-800 px-4 py-2 rounded-full"
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
                  <p className="text-gray-600 font-semibold">Preferred Locations</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.seekerProfile.preferredLocations && user.seekerProfile.preferredLocations.length > 0 ? (
                      user.seekerProfile.preferredLocations.map((location, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full"
                        >
                          {location}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">No locations specified</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-gray-600 font-semibold">Bio</p>
                  <p className="text-lg text-gray-900 mt-2">
                    {user.seekerProfile.bio || 'No bio provided'}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 font-semibold">Profile Status</p>
                  <p className={`text-lg font-bold ${
                    user.seekerProfile.isProfileComplete ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {user.seekerProfile.isProfileComplete ? '✅ Complete' : '⚠️ Incomplete'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Employer Details */}
          {user.role === 'EMPLOYER' && user.employerProfile && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Employer Details
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 font-semibold">Jobs Posted</p>
                  <p className="text-lg text-gray-900">
                    {user.employerProfile.jobsPosted || 0}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 font-semibold">Verification Status</p>
                  <p className={`text-lg font-bold ${
                    user.employerProfile.isVerified ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {user.employerProfile.isVerified ? '✅ Verified' : '❌ Not Verified'}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 font-semibold">Average Rating</p>
                  <p className="text-lg text-gray-900">
                    {user.employerProfile.applicantsReview?.avgRating || 'No ratings'} 
                    {user.employerProfile.applicantsReview?.totalReviews > 0 && 
                      ` (${user.employerProfile.applicantsReview.totalReviews} reviews)`}
                  </p>
                </div>
              </div>
            </div>
          )}

          <hr className="my-8" />

          {/* Notifications Settings */}
          {user.emailNotifications && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Email Notifications
              </h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-semibold">Job Recommendations</span>
                  <span className={`px-3 py-1 rounded-full ${
                    user.emailNotifications.jobRecommendations
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.emailNotifications.jobRecommendations ? '✅ On' : '❌ Off'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-semibold">Application Updates</span>
                  <span className={`px-3 py-1 rounded-full ${
                    user.emailNotifications.applicationUpdates
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.emailNotifications.applicationUpdates ? '✅ On' : '❌ Off'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-semibold">Messages</span>
                  <span className={`px-3 py-1 rounded-full ${
                    user.emailNotifications.messages
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.emailNotifications.messages ? '✅ On' : '❌ Off'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-semibold">Marketing</span>
                  <span className={`px-3 py-1 rounded-full ${
                    user.emailNotifications.marketing
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.emailNotifications.marketing ? '✅ On' : '❌ Off'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <hr className="my-8" />

          {/* Account Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 font-semibold text-sm">Account Created</p>
              <p className="text-lg text-gray-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-gray-600 font-semibold text-sm">Email Verified</p>
              <p className={`text-lg font-bold ${
                user.isEmailVerified ? 'text-green-600' : 'text-red-600'
              }`}>
                {user.isEmailVerified ? '✅ Yes' : '❌ No'}
              </p>
            </div>

            <div>
              <p className="text-gray-600 font-semibold text-sm">Account Status</p>
              <p className={`text-lg font-bold ${
                user.isAccountActive ? 'text-green-600' : 'text-red-600'
              }`}>
                {user.isAccountActive ? '✅ Active' : '❌ Inactive'}
              </p>
            </div>

            <div>
              <p className="text-gray-600 font-semibold text-sm">Profile Status</p>
              <p className={`text-lg font-bold ${
                user.isProfilePublic ? 'text-green-600' : 'text-gray-600'
              }`}>
                {user.isProfilePublic ? '🔓 Public' : '🔒 Private'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
