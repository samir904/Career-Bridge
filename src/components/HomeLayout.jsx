import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, Home, Briefcase, Users, Search, Bell, LogOut, User,
  Settings, ChevronDown, FileText, Heart, MessageSquare, Plus,
  MoreVertical, ExternalLink, ArrowRight, Zap, TrendingUp,
  BarChart3, CheckCircle, MapPin, Clock, DollarSign
} from 'lucide-react';
import { 
  logout,
  selectIsAuthenticated,
  selectUser,
  selectLoading
} from '../store/slices/user.slice';

function HomeLayout({ children }) {
  // ============================================
  // STATE & HOOKS
  // ============================================

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // ============================================
  // REDUX STATE
  // ============================================
// ✅ Use individual memoized selectors (NOT destructuring)
const isAuthenticated = useSelector(selectIsAuthenticated);
const user = useSelector(selectUser);
const loading = useSelector(selectLoading);

// Notifications - empty array for now (no notifications slice yet)
const notifications = [];
// ============================================
  // EFFECTS
  // ============================================

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Get unread notifications count
  const unreadCount = notifications.filter(n => !n.read).length;

  // ============================================
  // NAVIGATION LINKS
  // ============================================

  const publicNavLinks = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Jobs', path: '/jobs/search', icon: Briefcase },
    { label: 'Companies', path: '/companies', icon: Users },
  ];

  const jobSeekerNavLinks = [
    // { label: 'Dashboard', path: '/dashboard', icon: Home },
    { label: 'Home', path: '/', icon: Home },
    { label: 'Jobs', path: '/jobs/search', icon: Briefcase },
    { label: 'Applications', path: '/applications', icon: FileText },
    { label: 'Saved', path: '/saved-jobs', icon: Heart },
  ];

  const employerNavLinks = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { label: 'Postings', path: '/employer/jobs', icon: Briefcase },
    { label: 'Applicants', path: '/employer/applicants', icon: Users },
    { label: 'Analytics', path: '/employer/analytics', icon: TrendingUp },
     { label: 'Companies', path: '/companies', icon: Users },
  ];

  const profileMenuLinks = [
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Resumes', path: '/resumes', icon: FileText },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const employerProfileLinks = [
    { label: 'profile', path: '/profile', icon: Users },
    { label: 'Settings', path: '/employer/settings', icon: Settings },
  ];

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsProfileDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const getCurrentNavLinks = () => {
    if (!isAuthenticated) return publicNavLinks;
    if (user?.role === 'EMPLOYER') return employerNavLinks;
    return jobSeekerNavLinks;
  };

  const getCurrentProfileLinks = () => {
    if (user?.role === 'EMPLOYER') return employerProfileLinks;
    return profileMenuLinks;
  };

  // Mobile bottom nav for authenticated users
  const mobileBottomLinks = isAuthenticated
    ? user?.role === 'EMPLOYER'
      ? [
        { label: 'Home', path: '/', icon: Home },
          { label: 'Dashboard', path: '/employer/dashboard', icon: BarChart3 },
          { label: 'Post Job', path: '/create-job', icon: Plus, special: true },
          { label: 'Applicants', path: '/employer/applicants', icon: Users },
          { label: 'Profile', path: '/profile', icon: User }
        ]
      : [
          { label: 'Home', path: '/', icon: Home },
          { label: 'Search', path: '/jobs/search', icon: Search },
          // { label: 'Messages', path: '/messages', icon: MessageSquare },
          { label: 'Profile', path: '/profile', icon: User }
        ]
    : [
        { label: 'Home', path: '/', icon: Home },
        { label: 'Jobs', path: '/jobs/search', icon: Briefcase },
        { label: 'Companies', path: '/companies', icon: Users },
      ];

  // ============================================
  // RENDER - DESKTOP NAVBAR
  // ============================================

  const renderDesktopNavbar = () => (
    <nav className={`navbar-desktop  md:flex sticky top-0 z-40 w-full transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 dark:bg-slate-900/95 shadow-lg backdrop-blur-md'
        : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm'
    } border-b border-slate-200 dark:border-slate-800`}>
      <div className="w-full px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* LOGO */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow transform group-hover:scale-105">
              <span className="text-white font-bold text-lg">CB</span>
            </div>
            <div className=" sm:block">
              <span className="font-bold text-xl bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">
                CareerBridge
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">Job Portal</p>
            </div>
          </div>

          {/* CENTER NAVIGATION */}
          <div className=" lg:flex items-center gap-1">
            {getCurrentNavLinks().map(({ label, path, icon: Icon }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium text-sm ${
                  isActive(path)
                    ? 'bg-teal-500 text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-3 md:gap-4">
            
            {/* NOTIFICATIONS */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 5).map((notif, idx) => (
                          <div key={idx} className="p-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                            <p className="text-sm text-slate-900 dark:text-white">{notif.message}</p>
                            <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-slate-500">
                          <Bell size={24} className="mx-auto mb-2 opacity-50" />
                          <p>No notifications</p>
                        </div>
                      )}
                    </div>
                    <button className="w-full p-3 text-center text-teal-600 dark:text-teal-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700">
                      View All →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* POST JOB BUTTON (Employer Only) */}
            {isAuthenticated && user?.role === 'employer' && (
              <button
                onClick={() => navigate('/employer/jobs/new')}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                <Plus size={18} />
                Post Job
              </button>
            )}

            {/* AUTH SECTION */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {user?.fullName?.split(' ')[0] || 'User'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                      {user?.role || 'Seeker'}
                    </p>
                  </div>
                  <ChevronDown size={16} className="text-slate-600 dark:text-slate-400" />
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 py-2">
                    
                    {/* Profile Header */}
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {user?.fullName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user?.email}</p>
                      <p className="text-xs text-teal-600 dark:text-teal-400 mt-2 capitalize font-medium">
                        {user?.role === 'employer' ? '💼 Employer' : '👤 Job Seeker'}
                      </p>
                    </div>

                    {/* Menu Items */}
                    {getCurrentProfileLinks().map(({ label, path, icon: Icon }) => (
                      <button
                        key={path}
                        onClick={() => {
                          navigate(path);
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 flex items-center gap-3 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm"
                      >
                        <Icon size={16} />
                        {label}
                      </button>
                    ))}

                    {/* Logout */}
                    <div className="border-t border-slate-200 dark:border-slate-700 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 flex items-center gap-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className=" md:hidden flex gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="  px-4 py-2.5 text-teal-600 dark:text-teal-400 font-medium rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all text-sm"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-lg hover:shadow-lg transition-all text-sm hover:-translate-y-0.5"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  // ============================================
  // RENDER - MOBILE MENU BUTTON
  // ============================================

  const renderMobileMenuButton = () => (
    <div className="md:hidden fixed top-4 right-4 z-50">
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="p-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  );

  // ============================================
  // RENDER - MOBILE SIDEBAR
  // ============================================

  const renderMobileSidebar = () => (
    isMobileMenuOpen && (
      <div className="md:hidden fixed inset-0 z-40 top-16 left-0 right-0 bottom-20 bg-white dark:bg-slate-800 overflow-y-auto">
        <div className="px-4 py-4 space-y-2">
          
          {/* NAV LINKS */}
          {getCurrentNavLinks().map(({ label, path, icon: Icon }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 font-medium transition-all ${
                isActive(path)
                  ? 'bg-teal-500 text-white shadow-lg'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}

          {/* DIVIDER */}
          <div className="border-t border-slate-200 dark:border-slate-700 my-4"></div>

          {/* AUTH SECTION */}
          {isAuthenticated ? (
            <>
              {/* USER INFO */}
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-lg mb-3">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {user?.fullName}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{user?.email}</p>
                <span className="inline-block text-xs bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 px-2 py-1 rounded mt-2 capitalize font-medium">
                  {user?.role}
                </span>
              </div>

              {/* PROFILE LINKS */}
              {getCurrentProfileLinks().map(({ label, path, icon: Icon }) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className="w-full text-left px-4 py-3 flex items-center gap-3 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors font-medium"
                >
                  <Icon size={20} />
                  {label}
                </button>
              ))}

              {/* POST JOB (Mobile Employer) */}
              {user?.role === 'employer' && (
                <button
                  onClick={() => navigate('/employer/jobs/new')}
                  className="w-full text-left px-4 py-3 flex items-center gap-3 text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:shadow-lg rounded-lg transition-all font-medium mt-3"
                >
                  <Plus size={20} />
                  Post New Job
                </button>
              )}

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 flex items-center gap-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium mt-3"
              >
                <LogOut size={20} />
                Logout
              </button>
            </>
          ) : (
            <div className="space-y-2 mt-4">
              <button
                onClick={() => navigate('/login')}
                className="w-full px-4 py-3 text-teal-600 dark:text-teal-400 font-medium rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors border border-teal-600 dark:border-teal-400"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="w-full px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-lg hover:shadow-lg transition-all"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    )
  );

  // ============================================
  // RENDER - MOBILE BOTTOM NAV
  // ============================================

  const renderMobileBottomNav = () => (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-2xl">
      <div className="flex justify-around items-center h-20 px-2">
        {mobileBottomLinks.map(({ label, path, icon: Icon, special }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all relative ${
              special
                ? 'text-white'
                : isActive(path)
                ? 'text-teal-600 dark:text-teal-400'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {special ? (
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg mb-1">
                <Icon size={24} />
              </div>
            ) : (
              <>
                <Icon size={24} />
                <span className="text-xs font-medium">{label}</span>
                {isActive(path) && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-teal-600 dark:bg-teal-400 rounded-b-full"></div>
                )}
              </>
            )}
          </button>
        ))}
      </div>
    </nav>
  );

  // ============================================
  // RENDER - FOOTER
  // ============================================
const renderFooter = () => (
  <footer className="md:block mt-20 bg-gradient-to-b from-slate-900 to-slate-950 dark:from-slate-950 dark:to-black text-slate-300">
    <style>{`
      @keyframes heartbeat {
        0%, 100% {
          transform: scale(1);
        }
        25% {
          transform: scale(1.2);
        }
        50% {
          transform: scale(1);
        }
        75% {
          transform: scale(1.15);
        }
      }
      
      .beating-heart {
        animation: heartbeat 0.8s ease-in-out infinite;
        display: inline-block;
      }
    `}</style>

    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      
      {/* FOOTER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* BRAND */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CB</span>
            </div>
            <span className="font-bold text-lg text-white">CareerBridge</span>
          </div>
          <p className="text-sm text-slate-400">
            Connecting talent with opportunities. Your gateway to professional success.
          </p>
          <div className="flex gap-3">
            <a href="#" className="w-9 h-9 bg-slate-800 hover:bg-teal-600 rounded-full flex items-center justify-center transition-colors text-xs font-bold">f</a>
            <a href="#" className="w-9 h-9 bg-slate-800 hover:bg-teal-600 rounded-full flex items-center justify-center transition-colors text-xs font-bold">𝕏</a>
            <a href="#" className="w-9 h-9 bg-slate-800 hover:bg-teal-600 rounded-full flex items-center justify-center transition-colors text-xs font-bold">in</a>
          </div>
        </div>

        {/* FOR JOB SEEKERS */}
        <div>
          <h3 className="font-semibold text-white mb-4">For Job Seekers</h3>
          <ul className="space-y-2.5">
            <li><a href="/jobs" className="text-slate-400 hover:text-teal-400 transition-colors text-sm">Browse Jobs</a></li>
            <li><a href="/companies" className="text-slate-400 hover:text-teal-400 transition-colors text-sm">Companies</a></li>
            <li><a href="/profile" className="text-slate-400 hover:text-teal-400 transition-colors text-sm">My Profile</a></li>
          </ul>
        </div>

        {/* FOR EMPLOYERS */}
        <div>
          <h3 className="font-semibold text-white mb-4">For Employers</h3>
          <ul className="space-y-2.5">
            <li><a href="#" className="text-slate-400 hover:text-teal-400 transition-colors text-sm">Post a Job</a></li>
            <li><a href="#" className="text-slate-400 hover:text-teal-400 transition-colors text-sm">Browse Talent</a></li>
            <li><a href="#" className="text-slate-400 hover:text-teal-400 transition-colors text-sm">Pricing</a></li>
          </ul>
        </div>

        {/* COMPANY */}
        <div>
          <h3 className="font-semibold text-white mb-4">Company</h3>
          <ul className="space-y-2.5">
            <li><a href="#" className="text-slate-400 hover:text-teal-400 transition-colors text-sm">About Us</a></li>
            <li><a href="#" className="text-slate-400 hover:text-teal-400 transition-colors text-sm">Contact</a></li>
            <li><a href="#" className="text-slate-400 hover:text-teal-400 transition-colors text-sm">Privacy</a></li>
          </ul>
        </div>
      </div>

      {/* BUILT WITH LOVE & TEAM SECTION */}
      <div className="border-t border-slate-800 pt-8 pb-8">
        {/* Built with Love by Section */}
        <div className="text-center mb-6">
          <p className="text-sm text-slate-300 flex items-center justify-center gap-2 flex-wrap">
            <span>Built with</span>
            <span className="beating-heart text-red-500">
              <Heart size={18} fill="currentColor" />
            </span>
            <span>by the amazing</span>
            <span className="font-semibold text-teal-400">CareerBridge Team</span>
          </p>
        </div>

        {/* Team Members Display */}
        <div className="bg-slate-800/30 rounded-lg p-6 mb-6">
          <h3 className="text-center font-semibold text-white mb-4 text-sm">Team Members</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Himanshu Kumar */}
            <div className="bg-slate-700/40 rounded-lg p-4 text-center hover:bg-teal-500/10 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold text-sm">HK</span>
              </div>
              <p className="text-white font-medium text-sm">Himanshu Kumar</p>
              <p className="text-slate-400 text-xs mt-1">Full Stack Developer</p>
            </div>

            {/* Rishabh Singh */}
            <div className="bg-slate-700/40 rounded-lg p-4 text-center hover:bg-teal-500/10 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold text-sm">RS</span>
              </div>
              <p className="text-white font-medium text-sm">Rishabh Singh</p>
              <p className="text-slate-400 text-xs mt-1">Backend Developer</p>
            </div>

            {/* Aman Kumar */}
            <div className="bg-slate-700/40 rounded-lg p-4 text-center hover:bg-teal-500/10 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold text-sm">AK</span>
              </div>
              <p className="text-white font-medium text-sm">Aman Kumar</p>
              <p className="text-slate-400 text-xs mt-1">Frontend Developer</p>
            </div>

            {/* Swaraj Singh */}
            <div className="bg-slate-700/40 rounded-lg p-4 text-center hover:bg-teal-500/10 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold text-sm">SS</span>
              </div>
              <p className="text-white font-medium text-sm">Swaraj Singh</p>
              <p className="text-slate-400 text-xs mt-1">UI/UX Designer</p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER BOTTOM */}
      <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-slate-400">
          © 2025 CareerBridge. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm text-slate-400">
          <a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-teal-400 transition-colors">Terms</a>
          <a href="#" className="hover:text-teal-400 transition-colors">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
);

  // ============================================
  // LOADING STATE
  // ============================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      
      {/* NAVBAR */}
      {renderDesktopNavbar()}

      {/* MOBILE MENU BUTTON */}
      {renderMobileMenuButton()}

      {/* MOBILE SIDEBAR */}
      {renderMobileSidebar()}

      {/* MAIN CONTENT */}
      <main className="flex-1 pt-20 md:pt-6 pb-24 md:pb-6 px-4 md:px-6 lg:px-8 overflow-y-auto">        <div className="w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* MOBILE BOTTOM NAV */}
      {renderMobileBottomNav()}

      {/* FOOTER */}
      {renderFooter()}
    </div>
  );
}

export default HomeLayout;