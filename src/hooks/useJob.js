// hooks/useJob.js
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllJobs,
  getJobById,
  getMyJobs,
  createJob,
  updateJob,
  deleteJob,
  publishJob,
  closeJob,
  saveJob,
  unsaveJob,
  getSavedJobs,
  searchJobs,
  getSimilarJobs,
  getJobStats,
  trackJobView,
  clearError,
  clearSuccess
} from '../store/slices/job.slice';

export const useJob = () => {
  const dispatch = useDispatch();
  const {
    jobs,
    currentJob,
    savedJobs,
    similarJobs,
    searchResults,
    stats,
    loading,
    jobLoading,
    searchLoading,
    statsLoading,
    error,
    success,
    pagination,
    searchPagination
  } = useSelector(state => state.job);

  return {
    // State
    jobs,
    currentJob,
    savedJobs,
    similarJobs,
    searchResults,
    stats,
    loading,
    jobLoading,
    searchLoading,
    statsLoading,
    error,
    success,
    pagination,
    searchPagination,
    
    // Actions
    fetchAllJobs: (params) => dispatch(getAllJobs(params)),
    fetchJobById: (id) => dispatch(getJobById(id)),
    fetchMyJobs: (params) => dispatch(getMyJobs(params)),
    createNewJob: (data) => dispatch(createJob(data)),
    updateExistingJob: (data) => dispatch(updateJob(data)),
    removeJob: (id) => dispatch(deleteJob(id)),
    publishExistingJob: (id) => dispatch(publishJob(id)),
    closeExistingJob: (id) => dispatch(closeJob(id)),
    addToSaved: (id) => dispatch(saveJob(id)),
    removeFromSaved: (id) => dispatch(unsaveJob(id)),
    fetchSavedJobs: (params) => dispatch(getSavedJobs(params)),
    searchForJobs: (params) => dispatch(searchJobs(params)),
    fetchSimilarJobs: (params) => dispatch(getSimilarJobs(params)),
    fetchStats: () => dispatch(getJobStats()),
    trackView: (id) => dispatch(trackJobView(id)),
    clearErrorMsg: () => dispatch(clearError()),
    clearSuccessMsg: () => dispatch(clearSuccess())
  };
};
