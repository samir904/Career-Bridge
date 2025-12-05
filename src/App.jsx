import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import HomeLayout from './components/HomeLayout'
import { useDispatch, useSelector } from 'react-redux'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/auth/SignUpPage'
import LoginPage from './pages/auth/LoginPage'
import JobsListPage from './pages/public/JobsListPage'
import LoadingSpinner from './components/LoadingSpinner'
import { getProfile } from './store/slices/user.slice'
import ProfilePage from './pages/ProfilePage'
import GetProfilePage from './components/Profile/ProfilePage'
import CompanyDashboardPage from './pages/CompanyDashboardPage'
import CreateCompanyPage from './pages/CreateCompanyPage'
import EditCompanyPage from './pages/EditCompanyPage'
import CompanyDetailsPage from './pages/CompanyDetailsPage'
import CompaniesPage from './pages/CompaniesPage'
import EmployerDashboard from './pages/EmployerDashboard'
import EmployerJobsPage from './pages/EmployerJobsPage'
import EmployerApplicantsPage from './pages/EmployerApplicantsPage'
import EmployerAnalyticsPage from './pages/EmployerAnalyticsPage'
import ApplicationsPage from './pages/ApplicationsPage'
import ApplicationDetailPage from './pages/ApplicationDetailPage'
import SavedJobsPage from './pages/SavedJobsPage'
import ResumeViewPage from './pages/ResumeViewPage'
import ResumesPage from './pages/ResumesPage'
import UploadResumePage from './pages/UploadResumePage'
import CreateJobPage from './pages/CreateJobPage'

function App() {
  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useSelector(state => state.user);

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };
  const dispatch = useDispatch()
  const { user, isAuthenticated, loading } = useSelector(state => state.user)

  // ✅ CHECK AUTH ON MOUNT
  useEffect(() => {
    // Try to get profile from token (if token exists in cookies)
    dispatch(getProfile())
  }, [dispatch])

  // ✅ SHOW LOADING WHILE CHECKING AUTH
  if (loading) {
    return (
      <LoadingSpinner />
    )
  }
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/register' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path="/profile" element={<GetProfilePage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/companies/:id" element={<CompanyDetailsPage />} />
        <Route path="/companies/:id/edit" element={<EditCompanyPage />} />

        {/* Employer Routes */}
        <Route path="/create-company" element={<CreateCompanyPage />} />
        <Route path="/dashboard" element={<CompanyDashboardPage />} />
        <Route path="/employer/dashboard" element={<EmployerDashboard />} />
        <Route path="/employer/jobs" element={<EmployerJobsPage />} />
        <Route path="/employer/applicants" element={<EmployerApplicantsPage />} />
        <Route path="/employer/analytics" element={<EmployerAnalyticsPage />} />
        <Route path='/jobs/search' element={<JobsListPage />} />
<Route path="create-job" element={<CreateJobPage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/applications/:appId" element={<ApplicationDetailPage />} />
        <Route path="/saved-jobs" element={<SavedJobsPage />} />

{/* Resume list page */}
      <Route path="/resumes" element={<ResumesPage />} />
      
      {/* Upload resume */}
      <Route path="/resumes/upload" element={<UploadResumePage />} />
      
      {/* View resume */}
      <Route path="/resumes/:resumeId" element={<ResumeViewPage />} />
      
      </Routes>
    </>
  )
}

export default App;
