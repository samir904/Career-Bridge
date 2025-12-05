// store/slices/applicationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../service/api';  // ✅ Import axios instance

// ============================================
// ASYNC THUNKS
// ============================================

// 1. APPLY FOR JOB (Job Seeker Only)
export const applyForJob = createAsyncThunk(
  'application/applyForJob',
  async (applicationData, { rejectWithValue }) => {
    try {
      const response = await api.post('/application', applicationData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to apply for job'
      );
    }
  }
);

// 2. GET MY APPLICATIONS (Job Seeker Only)
export const getMyApplications = createAsyncThunk(
  'application/getMyApplications',
  async (params = { page: 1, limit: 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get('/application/seeker/my-applications', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch applications'
      );
    }
  }
);

// 3. GET RECEIVED APPLICATIONS (Employer Only)
export const getReceivedApplications = createAsyncThunk(
  'application/getReceivedApplications',
  async (params = { page: 1, limit: 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get('/application/employer/received', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch received applications'
      );
    }
  }
);

// 4. GET SINGLE APPLICATION
export const getApplicationById = createAsyncThunk(
  'application/getApplicationById',
  async (applicationId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/application/${applicationId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch application'
      );
    }
  }
);

// 5. UPDATE APPLICATION STATUS (Employer Only)
export const updateApplicationStatus = createAsyncThunk(
  'application/updateStatus',
  async ({ applicationId, statusData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/application/${applicationId}/status`, statusData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update application status'
      );
    }
  }
);

// 6. WITHDRAW APPLICATION (Job Seeker Only)
export const withdrawApplication = createAsyncThunk(
  'application/withdrawApplication',
  async (applicationId, { rejectWithValue }) => {
    try {
      await api.delete(`/application/${applicationId}`);
      return applicationId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to withdraw application'
      );
    }
  }
);

// 7. GET ALL APPLICATIONS (Admin/Dashboard)
export const getAllApplications = createAsyncThunk(
  'application/getAllApplications',
  async (params = { page: 1, limit: 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get('/application', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch applications'
      );
    }
  }
);

// 8. SEND MESSAGE IN APPLICATION
export const sendMessage = createAsyncThunk(
  'application/sendMessage',
  async ({ applicationId, message }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/application/${applicationId}/message`, { message });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to send message'
      );
    }
  }
);

// 9. RATE APPLICATION (Mutual Rating)
export const rateApplication = createAsyncThunk(
  'application/rateApplication',
  async ({ applicationId, rating }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/application/${applicationId}/rate`, { rating });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to submit rating'
      );
    }
  }
);

// 10. GET APPLICATION STATISTICS (Employer Dashboard)
export const getApplicationStats = createAsyncThunk(
  'application/getStats',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/application/employer/stats', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch statistics'
      );
    }
  }
);

// 11. BULK UPDATE APPLICATIONS (Employer)
export const bulkUpdateApplications = createAsyncThunk(
  'application/bulkUpdate',
  async (bulkData, { rejectWithValue }) => {
    try {
      const response = await api.put('/application/bulk/update', bulkData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to bulk update applications'
      );
    }
  }
);

// 12. GET CONVERSATION THREAD
export const getConversation = createAsyncThunk(
  'application/getConversation',
  async (applicationId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/application/${applicationId}/conversation`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch conversation'
      );
    }
  }
);

// ============================================
// INITIAL STATE
// ============================================
const initialState = {
  // Applications list
  applications: [],
  myApplications: [],
  receivedApplications: [],
  currentApplication: null,
  
  // Conversation
  currentConversation: null,
  messages: [],
  
  // Statistics
  stats: null,
  
  // Loading states
  loading: false,
  appLoading: false,
  messageLoading: false,
  statsLoading: false,
  
  // Error & Success
  error: null,
  success: null,
  
  // Pagination
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalApplications: 0,
    applicationsPerPage: 10
  },
  
  receivedPagination: {
    currentPage: 1,
    totalPages: 1,
    totalApplications: 0
  }
};

// ============================================
// APPLICATION SLICE
// ============================================
const applicationSlice = createSlice({
  name: 'application',
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
    
    // Reset current application
    resetCurrentApplication: (state) => {
      state.currentApplication = null;
    },
    
    // Clear conversation
    clearConversation: (state) => {
      state.currentConversation = null;
      state.messages = [];
    },
    
    // Add message locally (optimistic update)
    addMessageLocally: (state, action) => {
      state.messages.push(action.payload);
    }
  },
  
  extraReducers: (builder) => {
    // ============================================
    // APPLY FOR JOB
    // ============================================
    builder
      .addCase(applyForJob.pending, (state) => {
        state.appLoading = true;
        state.error = null;
      })
      .addCase(applyForJob.fulfilled, (state, action) => {
        state.appLoading = false;
        state.myApplications.unshift(action.payload);
        state.success = 'Application submitted successfully';
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.appLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // GET MY APPLICATIONS
    // ============================================
    builder
      .addCase(getMyApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.myApplications = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ============================================
    // GET RECEIVED APPLICATIONS
    // ============================================
    builder
      .addCase(getReceivedApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReceivedApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.receivedApplications = action.payload.data;
        state.receivedPagination = action.payload.pagination;
      })
      .addCase(getReceivedApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ============================================
    // GET SINGLE APPLICATION
    // ============================================
    builder
      .addCase(getApplicationById.pending, (state) => {
        state.appLoading = true;
        state.error = null;
      })
      .addCase(getApplicationById.fulfilled, (state, action) => {
        state.appLoading = false;
        state.currentApplication = action.payload;
      })
      .addCase(getApplicationById.rejected, (state, action) => {
        state.appLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // UPDATE APPLICATION STATUS
    // ============================================
    builder
      .addCase(updateApplicationStatus.pending, (state) => {
        state.appLoading = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.appLoading = false;
        state.currentApplication = action.payload;
        state.receivedApplications = state.receivedApplications.map(a => 
          a._id === action.payload._id ? action.payload : a
        );
        state.success = `Application status updated to ${action.payload.status}`;
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.appLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // WITHDRAW APPLICATION
    // ============================================
    builder
      .addCase(withdrawApplication.pending, (state) => {
        state.appLoading = true;
        state.error = null;
      })
      .addCase(withdrawApplication.fulfilled, (state, action) => {
        state.appLoading = false;
        state.myApplications = state.myApplications.filter(a => a._id !== action.payload);
        state.success = 'Application withdrawn successfully';
      })
      .addCase(withdrawApplication.rejected, (state, action) => {
        state.appLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // GET ALL APPLICATIONS
    // ============================================
    builder
      .addCase(getAllApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ============================================
    // SEND MESSAGE
    // ============================================
    builder
      .addCase(sendMessage.pending, (state) => {
        state.messageLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messageLoading = false;
        if (state.currentConversation) {
          state.currentConversation.messages.push(action.payload.message);
        }
        state.success = 'Message sent successfully';
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.messageLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // RATE APPLICATION
    // ============================================
    builder
      .addCase(rateApplication.pending, (state) => {
        state.appLoading = true;
        state.error = null;
      })
      .addCase(rateApplication.fulfilled, (state) => {
        state.appLoading = false;
        state.success = 'Rating submitted successfully';
      })
      .addCase(rateApplication.rejected, (state, action) => {
        state.appLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // GET APPLICATION STATISTICS
    // ============================================
    builder
      .addCase(getApplicationStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(getApplicationStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(getApplicationStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // BULK UPDATE APPLICATIONS
    // ============================================
    builder
      .addCase(bulkUpdateApplications.pending, (state) => {
        state.appLoading = true;
        state.error = null;
      })
      .addCase(bulkUpdateApplications.fulfilled, (state, action) => {
        state.appLoading = false;
        state.success = `Updated ${action.payload.totalUpdated} applications`;
      })
      .addCase(bulkUpdateApplications.rejected, (state, action) => {
        state.appLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // GET CONVERSATION THREAD
    // ============================================
    builder
      .addCase(getConversation.pending, (state) => {
        state.messageLoading = true;
        state.error = null;
      })
      .addCase(getConversation.fulfilled, (state, action) => {
        state.messageLoading = false;
        state.currentConversation = action.payload;
        state.messages = action.payload.messages || [];
      })
      .addCase(getConversation.rejected, (state, action) => {
        state.messageLoading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearError, 
  clearSuccess, 
  resetCurrentApplication, 
  clearConversation, 
  addMessageLocally 
} = applicationSlice.actions;
export default applicationSlice.reducer;
