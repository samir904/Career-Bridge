// store/slices/userSlice.js
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import api from '../../service/api.js';  // ✅ Import axios instance

// ============================================
// ASYNC THUNKS
// ============================================

// 1. REGISTER USER
export const register = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/user/register', userData);
      localStorage.setItem('token', response.data.token);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

// 2. LOGIN USER
export const login = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/user/login', credentials);
      localStorage.setItem('token', response.data.token);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

// 3. LOGOUT USER
export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.get('/user/logout');
      localStorage.removeItem('token');
      return null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Logout failed'
      );
    }
  }
);

// 4. GET PROFILE
export const getProfile = createAsyncThunk(
  'user/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/profile');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch profile'
      );
    }
  }
);

// 5. UPDATE PROFILE
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put('/user/update-profile', profileData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update profile'
      );
    }
  }
);

// 6. CHANGE PASSWORD
export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await api.post('/user/change-password', passwordData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to change password'
      );
    }
  }
);

// 7. UPDATE SOCIAL LINKS
export const updateSocialLinks = createAsyncThunk(
  'user/updateSocialLinks',
  async (socialLinks, { rejectWithValue }) => {
    try {
      const response = await api.put('/user/social-links', socialLinks);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update social links'
      );
    }
  }
);

// 8. TOGGLE PROFILE VISIBILITY
export const toggleProfileVisibility = createAsyncThunk(
  'user/toggleVisibility',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.put('/user/toggle-visibility', {});
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to toggle visibility'
      );
    }
  }
);

// ============================================
// RESUME THUNKS
// ============================================

// 9. UPLOAD RESUME
export const uploadResume = createAsyncThunk(
  'user/uploadResume',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/user/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Resume upload failed'
      );
    }
  }
);

// 10. GET MY RESUMES
export const getMyResumes = createAsyncThunk(
  'user/getMyResumes',
  async (params = { page: 1, limit: 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/resume/', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch resumes'
      );
    }
  }
);

// 11. GET SINGLE RESUME
export const getResumeById = createAsyncThunk(
  'user/getResumeById',
  async (resumeId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user/resume/${resumeId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch resume'
      );
    }
  }
);

// 12. DELETE RESUME
export const deleteResume = createAsyncThunk(
  'user/deleteResume',
  async (resumeId, { rejectWithValue }) => {
    try {
      await api.delete(`/user/resume/${resumeId}`);
      return resumeId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete resume'
      );
    }
  }
);

// 13. SET DEFAULT RESUME
export const setDefaultResume = createAsyncThunk(
  'user/setDefaultResume',
  async (resumeId, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/user/resume/${resumeId}/set-default`,
        {}
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to set default resume'
      );
    }
  }
);

// 14. UPDATE RESUME DATA
export const updateResumeData = createAsyncThunk(
  'user/updateResumeData',
  async ({ resumeId, dataType, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/user/resume/${resumeId}/update-data`,
        { dataType, data }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update resume data'
      );
    }
  }
);

// 15. UPDATE RESUME ITEM
export const updateResumeItem = createAsyncThunk(
  'user/updateResumeItem',
  async ({ resumeId, itemType, itemId, updateData }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/user/resume/${resumeId}/${itemType}/${itemId}`,
        updateData
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update resume item'
      );
    }
  }
);

// 16. DELETE RESUME ITEM
export const deleteResumeItem = createAsyncThunk(
  'user/deleteResumeItem',
  async ({ resumeId, itemType, itemId }, { rejectWithValue }) => {
    try {
      await api.delete(
        `/user/resume/${resumeId}/${itemType}/${itemId}`
      );
      return { resumeId, itemType, itemId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete resume item'
      );
    }
  }
);

// 17. BULK UPDATE RESUME
export const bulkUpdateResume = createAsyncThunk(
  'user/bulkUpdateResume',
  async ({ resumeId, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/user/resume/${resumeId}/bulk-update`,
        data
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update resume'
      );
    }
  }
);

// ============================================
// INITIAL STATE
// ============================================
const initialState = {
  user: null,
  resumes: [],
  currentResume: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  
  // Loading states
  loading: false,
  profileLoading: false,
  resumeLoading: false,
  
  // Error & Success
  error: null,
  success: null,
  
  // Pagination
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalResumes: 0
  }
};

// ============================================
// USER SLICE
// ============================================
const userSlice = createSlice({
  name: 'user',
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
    
    // Set token
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    
    // Clear user data
    clearUserData: (state) => {
      state.user = null;
      state.resumes = [];
      state.currentResume = null;
      state.token = null;
      state.isAuthenticated = false;
    }
  },
  
  extraReducers: (builder) => {
    // ============================================
    // REGISTER
    // ============================================
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.success = 'Registration successful!';
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ============================================
    // LOGIN
    // ============================================
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.success = 'Login successful!';
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ============================================
    // LOGOUT
    // ============================================
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.resumes = [];
        state.isAuthenticated = false;
        state.success = 'Logged out successfully!';
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ============================================
    // GET PROFILE
    // ============================================
    builder
      .addCase(getProfile.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.user = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // UPDATE PROFILE
    // ============================================
    builder
      .addCase(updateProfile.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.user = action.payload;
        state.success = 'Profile updated successfully!';
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // CHANGE PASSWORD
    // ============================================
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.success = 'Password changed successfully!';
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ============================================
    // UPDATE SOCIAL LINKS
    // ============================================
    builder
      .addCase(updateSocialLinks.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(updateSocialLinks.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.user = action.payload;
        state.success = 'Social links updated!';
      })
      .addCase(updateSocialLinks.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // TOGGLE PROFILE VISIBILITY
    // ============================================
    builder
      .addCase(toggleProfileVisibility.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(toggleProfileVisibility.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.user = action.payload;
        state.success = `Profile is now ${action.payload.isProfilePublic ? 'public' : 'private'}`;
      })
      .addCase(toggleProfileVisibility.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // UPLOAD RESUME
    // ============================================
    builder
      .addCase(uploadResume.pending, (state) => {
        state.resumeLoading = true;
        state.error = null;
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.resumeLoading = false;
        state.resumes.unshift(action.payload);
        state.success = 'Resume uploaded successfully!';
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.resumeLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // GET MY RESUMES
    // ============================================
    builder
      .addCase(getMyResumes.pending, (state) => {
        state.resumeLoading = true;
        state.error = null;
      })
      .addCase(getMyResumes.fulfilled, (state, action) => {
        state.resumeLoading = false;
        state.resumes = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getMyResumes.rejected, (state, action) => {
        state.resumeLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // GET SINGLE RESUME
    // ============================================
    builder
      .addCase(getResumeById.pending, (state) => {
        state.resumeLoading = true;
        state.error = null;
      })
      .addCase(getResumeById.fulfilled, (state, action) => {
        state.resumeLoading = false;
        state.currentResume = action.payload;
      })
      .addCase(getResumeById.rejected, (state, action) => {
        state.resumeLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // DELETE RESUME
    // ============================================
    builder
      .addCase(deleteResume.pending, (state) => {
        state.resumeLoading = true;
        state.error = null;
      })
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.resumeLoading = false;
        state.resumes = state.resumes.filter(r => r._id !== action.payload);
        state.success = 'Resume deleted successfully!';
      })
      .addCase(deleteResume.rejected, (state, action) => {
        state.resumeLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // SET DEFAULT RESUME
    // ============================================
    builder
      .addCase(setDefaultResume.pending, (state) => {
        state.resumeLoading = true;
        state.error = null;
      })
      .addCase(setDefaultResume.fulfilled, (state, action) => {
        state.resumeLoading = false;
        state.resumes = state.resumes.map(r => ({
          ...r,
          isDefault: r._id === action.payload._id
        }));
        state.success = 'Default resume updated!';
      })
      .addCase(setDefaultResume.rejected, (state, action) => {
        state.resumeLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // UPDATE RESUME DATA
    // ============================================
    builder
      .addCase(updateResumeData.pending, (state) => {
        state.resumeLoading = true;
        state.error = null;
      })
      .addCase(updateResumeData.fulfilled, (state, action) => {
        state.resumeLoading = false;
        state.currentResume = action.payload;
        state.success = 'Resume data updated!';
      })
      .addCase(updateResumeData.rejected, (state, action) => {
        state.resumeLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // UPDATE RESUME ITEM
    // ============================================
    builder
      .addCase(updateResumeItem.pending, (state) => {
        state.resumeLoading = true;
        state.error = null;
      })
      .addCase(updateResumeItem.fulfilled, (state, action) => {
        state.resumeLoading = false;
        state.currentResume = action.payload;
        state.success = 'Item updated successfully!';
      })
      .addCase(updateResumeItem.rejected, (state, action) => {
        state.resumeLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // DELETE RESUME ITEM
    // ============================================
    builder
      .addCase(deleteResumeItem.pending, (state) => {
        state.resumeLoading = true;
        state.error = null;
      })
      .addCase(deleteResumeItem.fulfilled, (state) => {
        state.resumeLoading = false;
        state.success = 'Item deleted successfully!';
      })
      .addCase(deleteResumeItem.rejected, (state, action) => {
        state.resumeLoading = false;
        state.error = action.payload;
      });

    // ============================================
    // BULK UPDATE RESUME
    // ============================================
    builder
      .addCase(bulkUpdateResume.pending, (state) => {
        state.resumeLoading = true;
        state.error = null;
      })
      .addCase(bulkUpdateResume.fulfilled, (state, action) => {
        state.resumeLoading = false;
        state.currentResume = action.payload;
        state.success = 'Resume updated successfully!';
      })
      .addCase(bulkUpdateResume.rejected, (state, action) => {
        state.resumeLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSuccess, setToken, clearUserData } = userSlice.actions;
// ============================================
// MEMOIZED SELECTORS
// ============================================
// ============================================
// ✅ MEMOIZED SELECTORS - NO WARNING!
// ============================================

// Base selector
const selectUserState = (state) => state.user;

// ✅ Individual memoized selectors
export const selectUser = createSelector(
  [selectUserState],
  (state) => state?.user || null
);

export const selectLoading = createSelector(
  [selectUserState],
  (state) => state?.loading || false
);

export const selectError = createSelector(
  [selectUserState],
  (state) => state?.error || null
);

export const selectSuccess = createSelector(
  [selectUserState],
  (state) => state?.success || null
);

export const selectIsAuthenticated = createSelector(
  [selectUserState],
  (state) => state?.isAuthenticated || false
);

export const selectToken = createSelector(
  [selectUserState],
  (state) => state?.token || null
);

export const selectResumes = createSelector(
  [selectUserState],
  (state) => state?.resumes || []
);

export const selectCurrentResume = createSelector(
  [selectUserState],
  (state) => state?.currentResume || null
);

export const selectPagination = createSelector(
  [selectUserState],
  (state) => state?.pagination || {}
);

export const selectProfileLoading = createSelector(
  [selectUserState],
  (state) => state?.profileLoading || false
);

export const selectResumeLoading = createSelector(
  [selectUserState],
  (state) => state?.resumeLoading || false
);

// ✅ Complex memoized selector
export const selectAuthState = createSelector(
  [selectIsAuthenticated, selectUser, selectLoading, selectError, selectSuccess, selectToken],
  (isAuthenticated, user, loading, error, success, token) => ({
    isAuthenticated,
    user,
    loading,
    error,
    success,
    token
  })
);

// ✅ Resume memoized selector
export const selectResumesState = createSelector(
  [selectResumes, selectCurrentResume, selectResumeLoading, selectPagination],
  (resumes, currentResume, loading, pagination) => ({
    resumes,
    currentResume,
    loading,
    pagination
  })
);

export default userSlice.reducer;