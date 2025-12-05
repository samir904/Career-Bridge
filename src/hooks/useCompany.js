// hooks/useCompany.js
import { useDispatch, useSelector } from 'react-redux';
import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  getMyCompanies,
  updateCompany,
  deleteCompany,
  uploadCompanyLogo,
  searchCompanies,
  getCompanyStats,
  addCompanyReview,
  getTopCompanies,
  verifyCompany,
  clearError,
  clearSuccess,
  resetCurrentCompany,
  clearSearchResults
} from '../store/slices/company.slice';

export const useCompany = () => {
  const dispatch = useDispatch();
  const {
    companies,
    currentCompany,
    myCompanies,
    topCompanies,
    searchResults,
    stats,
    loading,
    companyLoading,
    searchLoading,
    uploadLoading,
    statsLoading,
    error,
    success,
    pagination,
    searchPagination
  } = useSelector(state => state.company);

  return {
    // State
    companies,
    currentCompany,
    myCompanies,
    topCompanies,
    searchResults,
    stats,
    loading,
    companyLoading,
    searchLoading,
    uploadLoading,
    statsLoading,
    error,
    success,
    pagination,
    searchPagination,
    
    // Actions
    fetchAllCompanies: (params) => dispatch(getAllCompanies(params)),
    fetchCompanyById: (id) => dispatch(getCompanyById(id)),
    fetchMyCompanies: (params) => dispatch(getMyCompanies(params)),
    createNewCompany: (data) => dispatch(createCompany(data)),
    updateExistingCompany: (data) => dispatch(updateCompany(data)),
    removeCompany: (id) => dispatch(deleteCompany(id)),
    uploadLogo: (data) => dispatch(uploadCompanyLogo(data)),
    searchForCompanies: (params) => dispatch(searchCompanies(params)),
    fetchStats: (id) => dispatch(getCompanyStats(id)),
    addReview: (data) => dispatch(addCompanyReview(data)),
    fetchTopCompanies: (params) => dispatch(getTopCompanies(params)),
    verify: (id) => dispatch(verifyCompany(id)),
    clearErrorMsg: () => dispatch(clearError()),
    clearSuccessMsg: () => dispatch(clearSuccess()),
    resetCompany: () => dispatch(resetCurrentCompany()),
    clearSearch: () => dispatch(clearSearchResults())
  };
};
