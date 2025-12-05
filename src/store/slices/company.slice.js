// store/slices/companySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../service/api';  // ✅ Import axios instance

// ============================================
// ASYNC THUNKS
// ============================================

// 1. CREATE COMPANY (Employer Only)
export const createCompany = createAsyncThunk(
  'company/createCompany',
  async (companyData, { rejectWithValue }) => {
    try {
      const response = await api.post('/company', companyData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create company'
      );
    }
  }
);

// 2. GET ALL COMPANIES (Public)
export const getAllCompanies = createAsyncThunk(
  'company/getAllCompanies',
  async (params = { page: 1, limit: 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get('/company', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch companies'
      );
    }
  }
);

// 3. GET SINGLE COMPANY BY ID
export const getCompanyById = createAsyncThunk(
  'company/getCompanyById',
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/company/${companyId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch company'
      );
    }
  }
);

// 4. GET MY COMPANIES (Employer Only)
export const getMyCompanies = createAsyncThunk(
  'company/getMyCompanies',
  async (params = { page: 1, limit: 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get('/company/employer/my-companies', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch your companies'
      );
    }
  }
);

// 5. UPDATE COMPANY (Employer Only)
export const updateCompany = createAsyncThunk(
  'company/updateCompany',
  async ({ companyId, updateData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/company/${companyId}`, updateData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update company'
      );
    }
  }
);

// 6. DELETE COMPANY (Employer Only)
export const deleteCompany = createAsyncThunk(
  'company/deleteCompany',
  async (companyId, { rejectWithValue }) => {
    try {
      await api.delete(`/company/${companyId}`);
      return companyId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete company'
      );
    }
  }
);

// 7. UPLOAD COMPANY LOGO
export const uploadCompanyLogo = createAsyncThunk(
  'company/uploadLogo',
  async ({ companyId, formData }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/company/${companyId}/upload-logo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to upload logo'
      );
    }
  }
);

// 8. SEARCH COMPANIES
export const searchCompanies = createAsyncThunk(
  'company/searchCompanies',
  async (params = { page: 1, limit: 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get('/company/search', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Search failed'
      );
    }
  }
);

// 9. GET COMPANY STATISTICS (Employer Dashboard)
export const getCompanyStats = createAsyncThunk(
  'company/getStats',
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/company/${companyId}/stats`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch statistics'
      );
    }
  }
);

// 10. ADD COMPANY REVIEW
export const addCompanyReview = createAsyncThunk(
  'company/addReview',
  async ({ companyId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/company/${companyId}/review`,
        reviewData
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add review'
      );
    }
  }
);

// 11. GET TOP COMPANIES
export const getTopCompanies = createAsyncThunk(
  'company/getTopCompanies',
  async (params = { limit: 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get('/company/top', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch top companies'
      );
    }
  }
);

// 12. VERIFY COMPANY (Admin Only)
export const verifyCompany = createAsyncThunk(
  'company/verifyCompany',
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/company/${companyId}/verify`, {});
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to verify company'
      );
    }
  }
);

// ============================================
// INITIAL STATE
// ============================================
const initialState = {
  // Companies list
  companies: [],
  currentCompany: null,
  myCompanies: [],
  topCompanies: [],
  
  // Search & Filters
  searchResults: [],
  
  // Statistics
  stats: null,
  
  // Loading states
  loading: false,
  companyLoading: false,
  searchLoading: false,
  uploadLoading: false,
  statsLoading: false,
  
  // Error & Success
  error: null,
  success: null,
  
  // Pagination
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCompanies: 0,
    companiesPerPage: 10
  },
  
  searchPagination: {
    currentPage: 1,
    totalPages: 1,
    totalCompanies: 0
  }
};

// ============================================
// COMPANY SLICE
// ============================================
const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear success
    clearSuccess: (state) => {
      state.success = null;
    },
    
    // Reset current company
    resetCurrentCompany: (state) => {
      state.currentCompany = null;
    },
    
    // Clear search results
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchPagination = {
        currentPage: 1,
        totalPages: 1,
        totalCompanies: 0
      };
    }
  },
  
  extraReducers: (builder) => {
    // ============================================
    // CREATE COMPANY
    // ============================================
    builder
      .addCase(createCompany.pending, (state) => {
        state.companyLoading = true;
        state.error = null;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.companyLoading = false;
        state.myCompanies.unshift(action.payload);
        state.success = 'Company created successfully';
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.companyLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // GET ALL COMPANIES
    // ============================================
    builder
      .addCase(getAllCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ============================================
    // GET SINGLE COMPANY
    // ============================================
    builder
      .addCase(getCompanyById.pending, (state) => {
        state.companyLoading = true;
        state.error = null;
      })
      .addCase(getCompanyById.fulfilled, (state, action) => {
        state.companyLoading = false;
        state.currentCompany = action.payload;
      })
      .addCase(getCompanyById.rejected, (state, action) => {
        state.companyLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // GET MY COMPANIES
    // ============================================
    builder
      .addCase(getMyCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.myCompanies = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getMyCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ============================================
    // UPDATE COMPANY
    // ============================================
    builder
      .addCase(updateCompany.pending, (state) => {
        state.companyLoading = true;
        state.error = null;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.companyLoading = false;
        state.currentCompany = action.payload;
        state.myCompanies = state.myCompanies.map(c => 
          c._id === action.payload._id ? action.payload : c
        );
        state.companies = state.companies.map(c => 
          c._id === action.payload._id ? action.payload : c
        );
        state.success = 'Company updated successfully';
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.companyLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // DELETE COMPANY
    // ============================================
    builder
      .addCase(deleteCompany.pending, (state) => {
        state.companyLoading = true;
        state.error = null;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.companyLoading = false;
        state.myCompanies = state.myCompanies.filter(c => c._id !== action.payload);
        state.companies = state.companies.filter(c => c._id !== action.payload);
        state.success = 'Company deleted successfully';
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.companyLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // UPLOAD COMPANY LOGO
    // ============================================
    builder
      .addCase(uploadCompanyLogo.pending, (state) => {
        state.uploadLoading = true;
        state.error = null;
      })
      .addCase(uploadCompanyLogo.fulfilled, (state, action) => {
        state.uploadLoading = false;
        state.currentCompany = action.payload;
        state.myCompanies = state.myCompanies.map(c => 
          c._id === action.payload._id ? action.payload : c
        );
        state.success = 'Logo uploaded successfully';
      })
      .addCase(uploadCompanyLogo.rejected, (state, action) => {
        state.uploadLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // SEARCH COMPANIES
    // ============================================
    builder
      .addCase(searchCompanies.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchCompanies.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.data;
        state.searchPagination = action.payload.pagination;
      })
      .addCase(searchCompanies.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // GET COMPANY STATISTICS
    // ============================================
    builder
      .addCase(getCompanyStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(getCompanyStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(getCompanyStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // ADD COMPANY REVIEW
    // ============================================
    builder
      .addCase(addCompanyReview.pending, (state) => {
        state.companyLoading = true;
        state.error = null;
      })
      .addCase(addCompanyReview.fulfilled, (state, action) => {
        state.companyLoading = false;
        state.success = 'Review added successfully';
      })
      .addCase(addCompanyReview.rejected, (state, action) => {
        state.companyLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // GET TOP COMPANIES
    // ============================================
    builder
      .addCase(getTopCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTopCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.topCompanies = action.payload;
      })
      .addCase(getTopCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ============================================
    // VERIFY COMPANY
    // ============================================
    builder
      .addCase(verifyCompany.pending, (state) => {
        state.companyLoading = true;
        state.error = null;
      })
      .addCase(verifyCompany.fulfilled, (state, action) => {
        state.companyLoading = false;
        state.currentCompany = action.payload;
        state.myCompanies = state.myCompanies.map(c => 
          c._id === action.payload._id ? action.payload : c
        );
        state.success = 'Company verified successfully';
      })
      .addCase(verifyCompany.rejected, (state, action) => {
        state.companyLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSuccess, resetCurrentCompany, clearSearchResults } = companySlice.actions;
export default companySlice.reducer;
