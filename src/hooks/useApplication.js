// hooks/useApplication.js
import { useDispatch, useSelector } from 'react-redux';
import {
  applyForJob,
  getMyApplications,
  getReceivedApplications,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
  getAllApplications,
  sendMessage,
  rateApplication,
  getApplicationStats,
  bulkUpdateApplications,
  getConversation,
  clearError,
  clearSuccess,
  resetCurrentApplication,
  clearConversation,
  addMessageLocally
} from '../store/slices/application.slice';

export const useApplication = () => {
  const dispatch = useDispatch();
  const {
    applications,
    myApplications,
    receivedApplications,
    currentApplication,
    currentConversation,
    messages,
    stats,
    loading,
    appLoading,
    messageLoading,
    statsLoading,
    error,
    success,
    pagination,
    receivedPagination
  } = useSelector(state => state.application);

  return {
    // State
    applications,
    myApplications,
    receivedApplications,
    currentApplication,
    currentConversation,
    messages,
    stats,
    loading,
    appLoading,
    messageLoading,
    statsLoading,
    error,
    success,
    pagination,
    receivedPagination,
    
    // Actions
    applyForNewJob: (data) => dispatch(applyForJob(data)),
    fetchMyApplications: (params) => dispatch(getMyApplications(params)),
    fetchReceivedApplications: (params) => dispatch(getReceivedApplications(params)),
    fetchApplicationById: (id) => dispatch(getApplicationById(id)),
    updateStatus: (data) => dispatch(updateApplicationStatus(data)),
    withdrawApp: (id) => dispatch(withdrawApplication(id)),
    fetchAllApplications: (params) => dispatch(getAllApplications(params)),
    sendMsg: (data) => dispatch(sendMessage(data)),
    rateApp: (data) => dispatch(rateApplication(data)),
    fetchStats: (params) => dispatch(getApplicationStats(params)),
    bulkUpdate: (data) => dispatch(bulkUpdateApplications(data)),
    fetchConversation: (id) => dispatch(getConversation(id)),
    addMsgLocally: (msg) => dispatch(addMessageLocally(msg)),
    clearErrorMsg: () => dispatch(clearError()),
    clearSuccessMsg: () => dispatch(clearSuccess()),
    resetApp: () => dispatch(resetCurrentApplication()),
    clearChat: () => dispatch(clearConversation())
  };
};
