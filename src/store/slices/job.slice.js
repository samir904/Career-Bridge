// store/slices/jobSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../service/api';  // ✅ Import axios instance

// ============================================
// ASYNC THUNKS
// ============================================

// 1. CREATE JOB (Employer Only)
export const createJob = createAsyncThunk(
  'job/createJob',
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await api.post('/job', jobData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create job'
      );
    }
  }
);

// 2. GET ALL JOBS (Public)
export const getAllJobs = createAsyncThunk(
  'job/getAllJobs',
  async (params = { page: 1, limit: 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get('/job', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch jobs'
      );
    }
  }
);

// 3. GET SINGLE JOB
export const getJobById = createAsyncThunk(
  'job/getJobById',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/job/${jobId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch job'
      );
    }
  }
);

// 4. GET MY JOBS (Employer Only)
export const getMyJobs = createAsyncThunk(
  'job/getMyJobs',
  async (params = { page: 1, limit: 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get('/job/employer/my-jobs', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch your jobs'
      );
    }
  }
);

// 5. UPDATE JOB (Employer Only)
export const updateJob = createAsyncThunk(
  'job/updateJob',
  async ({ jobId, updateData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/job/${jobId}`, updateData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update job'
      );
    }
  }
);

// 6. DELETE JOB (Employer Only)
export const deleteJob = createAsyncThunk(
  'job/deleteJob',
  async (jobId, { rejectWithValue }) => {
    try {
      await api.delete(`/job/${jobId}`);
      return jobId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete job'
      );
    }
  }
);

// 7. PUBLISH JOB (Change from DRAFT to ACTIVE)
export const publishJob = createAsyncThunk(
  'job/publishJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/job/${jobId}/publish`, {});
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to publish job'
      );
    }
  }
);

// 8. CLOSE JOB (Stop accepting applications)
export const closeJob = createAsyncThunk(
  'job/closeJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/job/${jobId}/close`, {});
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to close job'
      );
    }
  }
);

// 9. TRACK JOB VIEW
export const trackJobView = createAsyncThunk(
  'job/trackView',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/job/${jobId}/view`, {});
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to track view'
      );
    }
  }
);

// 10. SEARCH JOBS
export const searchJobs = createAsyncThunk(
  'job/searchJobs',
  async (params = { page: 1, limit: 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get('/job/search', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Search failed'
      );
    }
  }
);

// 11. GET SIMILAR JOBS
export const getSimilarJobs = createAsyncThunk(
  'job/getSimilarJobs',
  async (params = { limit: 5 }, { rejectWithValue }) => {
    try {
      const response = await api.get('/job/similar', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch similar jobs'
      );
    }
  }
);

// 12. SAVE JOB (Job Seeker)
export const saveJob = createAsyncThunk(
  'job/saveJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/job/${jobId}/save`, {});
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to save job'
      );
    }
  }
);

// 13. UNSAVE JOB (Job Seeker)
export const unsaveJob = createAsyncThunk(
  'job/unsaveJob',
  async (jobId, { rejectWithValue }) => {
    try {
      await api.delete(`/job/${jobId}/unsave`);
      return jobId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to unsave job'
      );
    }
  }
);

// 14. GET SAVED JOBS (Job Seeker)
export const getSavedJobs = createAsyncThunk(
  'job/getSavedJobs',
  async (params = { page: 1, limit: 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get('/job/seeker/saved', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch saved jobs'
      );
    }
  }
);

// 15. GET JOB STATISTICS (Employer Dashboard)
export const getJobStats = createAsyncThunk(
  'job/getJobStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/job/employer/stats');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch statistics'
      );
    }
  }
);

// ============================================
// INITIAL STATE
// ============================================
const initialState = {
  // Jobs list
  jobs: [],
  currentJob: null,
  savedJobs: [],
  similarJobs: [],
  
  // Search & Filters
  searchResults: [],
  
  // Statistics
  stats: null,
  
  // Loading states
  loading: false,
  jobLoading: false,
  searchLoading: false,
  statsLoading: false,
  
  // Error & Success
  error: null,
  success: null,
  
  // Pagination
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    jobsPerPage: 10
  },
  
  searchPagination: {
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0
  }
};

// ============================================
// JOB SLICE
// ============================================
const jobSlice = createSlice({
  name: 'job',
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
    
    // Reset current job
    resetCurrentJob: (state) => {
      state.currentJob = null;
    },
    
    // Clear search results
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchPagination = {
        currentPage: 1,
        totalPages: 1,
        totalJobs: 0
      };
    }
  },
  
  extraReducers: (builder) => {
    // ============================================
    // CREATE JOB
    // ============================================
    builder
      .addCase(createJob.pending, (state) => {
        state.jobLoading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.jobLoading = false;
        state.jobs.unshift(action.payload);
        state.success = 'Job created successfully (Status: DRAFT)';
      })
      .addCase(createJob.rejected, (state, action) => {
        state.jobLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // GET ALL JOBS
    // ============================================
    builder
      .addCase(getAllJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ============================================
    // GET SINGLE JOB
    // ============================================
    builder
      .addCase(getJobById.pending, (state) => {
        state.jobLoading = true;
        state.error = null;
      })
      .addCase(getJobById.fulfilled, (state, action) => {
        state.jobLoading = false;
        state.currentJob = action.payload;
      })
      .addCase(getJobById.rejected, (state, action) => {
        state.jobLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // GET MY JOBS
    // ============================================
    builder
      .addCase(getMyJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getMyJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ============================================
    // UPDATE JOB
    // ============================================
    builder
      .addCase(updateJob.pending, (state) => {
        state.jobLoading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.jobLoading = false;
        state.currentJob = action.payload;
        state.jobs = state.jobs.map(j => 
          j._id === action.payload._id ? action.payload : j
        );
        state.success = 'Job updated successfully';
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.jobLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // DELETE JOB
    // ============================================
    builder
      .addCase(deleteJob.pending, (state) => {
        state.jobLoading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobLoading = false;
        state.jobs = state.jobs.filter(j => j._id !== action.payload);
        state.success = 'Job deleted successfully';
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.jobLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // PUBLISH JOB
    // ============================================
    builder
      .addCase(publishJob.pending, (state) => {
        state.jobLoading = true;
        state.error = null;
      })
      .addCase(publishJob.fulfilled, (state, action) => {
        state.jobLoading = false;
        state.currentJob = action.payload;
        state.jobs = state.jobs.map(j => 
          j._id === action.payload._id ? action.payload : j
        );
        state.success = 'Job published successfully';
      })
      .addCase(publishJob.rejected, (state, action) => {
        state.jobLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // CLOSE JOB
    // ============================================
    builder
      .addCase(closeJob.pending, (state) => {
        state.jobLoading = true;
        state.error = null;
      })
      .addCase(closeJob.fulfilled, (state, action) => {
        state.jobLoading = false;
        state.currentJob = action.payload;
        state.jobs = state.jobs.map(j => 
          j._id === action.payload._id ? action.payload : j
        );
        state.success = 'Job closed successfully';
      })
      .addCase(closeJob.rejected, (state, action) => {
        state.jobLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // TRACK JOB VIEW
    // ============================================
    builder
      .addCase(trackJobView.pending, (state) => {
        state.error = null;
      })
      .addCase(trackJobView.fulfilled, (state) => {
        // No state update needed for view tracking
      })
      .addCase(trackJobView.rejected, (state, action) => {
        state.error = action.payload;
      });

    // ============================================
    // SEARCH JOBS
    // ============================================
    builder
      .addCase(searchJobs.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchJobs.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.data;
        state.searchPagination = action.payload.pagination;
      })
      .addCase(searchJobs.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // GET SIMILAR JOBS
    // ============================================
    builder
      .addCase(getSimilarJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSimilarJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.similarJobs = action.payload;
      })
      .addCase(getSimilarJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ============================================
    // SAVE JOB
    // ============================================
    builder
      .addCase(saveJob.pending, (state) => {
        state.jobLoading = true;
        state.error = null;
      })
      .addCase(saveJob.fulfilled, (state, action) => {
        state.jobLoading = false;
        state.success = 'Job saved successfully';
      })
      .addCase(saveJob.rejected, (state, action) => {
        state.jobLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // UNSAVE JOB
    // ============================================
    builder
      .addCase(unsaveJob.pending, (state) => {
        state.jobLoading = true;
        state.error = null;
      })
      .addCase(unsaveJob.fulfilled, (state, action) => {
        state.jobLoading = false;
        state.savedJobs = state.savedJobs.filter(j => j._id !== action.payload);
        state.success = 'Job removed from saved jobs';
      })
      .addCase(unsaveJob.rejected, (state, action) => {
        state.jobLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // GET SAVED JOBS
    // ============================================
    builder
      .addCase(getSavedJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSavedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.savedJobs = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getSavedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ============================================
    // GET JOB STATISTICS
    // ============================================
    builder
      .addCase(getJobStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(getJobStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(getJobStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSuccess, resetCurrentJob, clearSearchResults } = jobSlice.actions;
// ============================================
// MEMOIZED SELECTORS
// ============================================

export const selectJobState = (state) => {
  const jobState = state.job || {};
  return {
    jobs: jobState.jobs || [],
    currentJob: jobState.currentJob || null,
    savedJobs: jobState.savedJobs || [],
    similarJobs: jobState.similarJobs || [],
    searchResults: jobState.searchResults || [],
    stats: jobState.stats || null,
    loading: jobState.loading || false,
    jobLoading: jobState.jobLoading || false,
    searchLoading: jobState.searchLoading || false,
    statsLoading: jobState.statsLoading || false,
    error: jobState.error || null,
    success: jobState.success || null,
    pagination: jobState.pagination || {
      currentPage: 1,
      totalPages: 1,
      totalJobs: 0,
      jobsPerPage: 10
    },
    searchPagination: jobState.searchPagination || {
      currentPage: 1,
      totalPages: 1,
      totalJobs: 0
    }
  };
};

export const selectJobs = (state) => state.job?.jobs || [];
export const selectCurrentJob = (state) => state.job?.currentJob || null;
export const selectSavedJobs = (state) => state.job?.savedJobs || [];
export const selectJobLoading = (state) => state.job?.loading || false;
export const selectJobError = (state) => state.job?.error || null;
export const selectJobSuccess = (state) => state.job?.success || null;
export const selectJobPagination = (state) => state.job?.pagination || {};

export default jobSlice.reducer;
