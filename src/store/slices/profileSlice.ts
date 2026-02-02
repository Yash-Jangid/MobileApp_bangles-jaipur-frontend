import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiService from '../../services/ApiService';

// Types
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  joinDate: string;
  coursesCompleted: number;
  certificatesEarned: number;
  totalHours: number;
  isUser: boolean;
  isInstructor: boolean;
  isOrganization: boolean;
  financial_approval: boolean;
  offline: boolean;
  offline_message?: string;
}

export interface DashboardStats {
  accountBalance: number;
  drawableAmount: number;
  pendingAppointments: number;
  webinarsCount: number;
  monthlySalesCount: number;
  reserveMeetingsCount: number;
  supportsCount: number;
  commentsCount: number;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  created_at: string;
  read_at?: string;
}

export interface Noticeboard {
  id: number;
  title: string;
  message: string;
  sender: string;
  created_at: string;
}

export interface PurchasedCourse {
  id: number;
  title: string;
  instructor: string;
  progress: number;
  image?: string;
  created_at: string;
}

export interface SupportMessage {
  id: number;
  title: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Meeting {
  id: number;
  title: string;
  date: string;
  status: string;
  type: string;
}

export interface Comment {
  id: number;
  text: string;
  course_name: string;
  created_at: string;
  rating?: number;
}

interface ProfileState {
  // Profile data
  userProfile: UserProfile | null;
  dashboardStats: DashboardStats | null;
  notifications: Notification[];
  noticeboards: Noticeboard[];
  purchasedCourses: PurchasedCourse[];
  supportMessages: SupportMessage[];
  meetings: Meeting[];
  comments: Comment[];
  
  // Loading states
  loading: {
    profile: boolean;
    stats: boolean;
    notifications: boolean;
    noticeboards: boolean;
    courses: boolean;
    support: boolean;
    meetings: boolean;
    comments: boolean;
  };
  
  // Error states
  errors: {
    profile: string | null;
    stats: string | null;
    notifications: string | null;
    noticeboards: string | null;
    courses: string | null;
    support: string | null;
    meetings: string | null;
    comments: string | null;
  };
  
  // Cache timestamps
  lastFetched: {
    profile: number | null;
    stats: number | null;
    notifications: number | null;
    noticeboards: number | null;
    courses: number | null;
    support: number | null;
    meetings: number | null;
    comments: number | null;
  };
  
  // Cache duration (5 minutes)
  cacheDuration: number;
}

const initialState: ProfileState = {
  userProfile: null,
  dashboardStats: null,
  notifications: [],
  noticeboards: [],
  purchasedCourses: [],
  supportMessages: [],
  meetings: [],
  comments: [],
  
  loading: {
    profile: false,
    stats: false,
    notifications: false,
    noticeboards: false,
    courses: false,
    support: false,
    meetings: false,
    comments: false,
  },
  
  errors: {
    profile: null,
    stats: null,
    notifications: null,
    noticeboards: null,
    courses: null,
    support: null,
    meetings: null,
    comments: null,
  },
  
  lastFetched: {
    profile: null,
    stats: null,
    notifications: null,
    noticeboards: null,
    courses: null,
    support: null,
    meetings: null,
    comments: null,
  },
  
  cacheDuration: 5 * 60 * 1000,
};

// Helper function to check if data needs refresh
const needsRefresh = (lastFetched: number | null, cacheDuration: number): boolean => {
  if (!lastFetched) return true;
  return Date.now() - lastFetched > cacheDuration;
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (token: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { profile: ProfileState };
      const { lastFetched, cacheDuration } = state.profile;
      
      // Check cache
      if (!needsRefresh(lastFetched.profile, cacheDuration)) {
        return { cached: true };
      }
      
      const response = await apiService.getProfile(token);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch profile');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchDashboardStats = createAsyncThunk(
  'profile/fetchDashboardStats',
  async (token: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { profile: ProfileState };
      const { lastFetched, cacheDuration } = state.profile;
      
      if (!needsRefresh(lastFetched.stats, cacheDuration)) {
        return { cached: true };
      }
      
      const response = await apiService.getDashboardStats(token);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch stats');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchNotifications = createAsyncThunk(
  'profile/fetchNotifications',
  async (token: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { profile: ProfileState };
      const { lastFetched, cacheDuration } = state.profile;
      
      if (!needsRefresh(lastFetched.notifications, cacheDuration)) {
        return { cached: true };
      }
      
      const response = await apiService.getNotifications(token);
      if (response.success) {
        const notifications = response.data?.notifications || response.data || [];
        return notifications.slice(0, 5);
      } else {
        return rejectWithValue(response.message || 'Failed to fetch notifications');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchNoticeboards = createAsyncThunk(
  'profile/fetchNoticeboards',
  async (token: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { profile: ProfileState };
      const { lastFetched, cacheDuration } = state.profile;
      
      if (!needsRefresh(lastFetched.noticeboards, cacheDuration)) {
        return { cached: true };
      }
      
      const response = await apiService.getDashboardNoticeboards(token);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch noticeboards');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchPurchasedCourses = createAsyncThunk(
  'profile/fetchPurchasedCourses',
  async (token: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { profile: ProfileState };
      const { lastFetched, cacheDuration } = state.profile;
      
      if (!needsRefresh(lastFetched.courses, cacheDuration)) {
        return { cached: true };
      }
      
      const response = await apiService.getPurchasedCoursesList(token);
      if (response.success) {
        return response.data.slice(0, 3);
      } else {
        return rejectWithValue(response.message || 'Failed to fetch courses');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchSupportMessages = createAsyncThunk(
  'profile/fetchSupportMessages',
  async (token: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { profile: ProfileState };
      const { lastFetched, cacheDuration } = state.profile;
      
      if (!needsRefresh(lastFetched.support, cacheDuration)) {
        return { cached: true };
      }
      
      const response = await apiService.getSupportMessagesList(token);
      if (response.success) {
        return response.data.slice(0, 2);
      } else {
        return rejectWithValue(response.message || 'Failed to fetch support messages');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchMeetings = createAsyncThunk(
  'profile/fetchMeetings',
  async ({ token, isUser }: { token: string; isUser: boolean }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { profile: ProfileState };
      const { lastFetched, cacheDuration } = state.profile;
      
      if (!needsRefresh(lastFetched.meetings, cacheDuration)) {
        return { cached: true };
      }
      
      const response = await apiService.getMeetingsList(token, isUser);
      if (response.success) {
        const mappedMeetings = response.data.map((item: any) => ({
          id: item.id,
          title: item.title || 'Meeting',
          date: item.date || item.created_at,
          status: item.status || 'pending',
          type: item.meeting_type || 'online',
        }));
        return mappedMeetings.slice(0, 2);
      } else {
        return rejectWithValue(response.message || 'Failed to fetch meetings');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchComments = createAsyncThunk(
  'profile/fetchComments',
  async ({ token, isUser }: { token: string; isUser: boolean }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { profile: ProfileState };
      const { lastFetched, cacheDuration } = state.profile;
      
      if (!needsRefresh(lastFetched.comments, cacheDuration)) {
        return { cached: true };
      }
      
      const response = await apiService.getCommentsList(token, isUser);
      if (response.success) {
        return response.data.slice(0, 3);
      } else {
        return rejectWithValue(response.message || 'Failed to fetch comments');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileData: (state) => {
      state.userProfile = null;
      state.dashboardStats = null;
      state.notifications = [];
      state.noticeboards = [];
      state.purchasedCourses = [];
      state.supportMessages = [];
      state.meetings = [];
      state.comments = [];
      state.lastFetched = {
        profile: null,
        stats: null,
        notifications: null,
        noticeboards: null,
        courses: null,
        support: null,
        meetings: null,
        comments: null,
      };
    },
    setOfflineStatus: (state, action: PayloadAction<boolean>) => {
      if (state.userProfile) {
        state.userProfile.offline = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // Profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading.profile = true;
        state.errors.profile = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading.profile = false;
        if (!action.payload.cached) {
          state.userProfile = action.payload;
          state.lastFetched.profile = Date.now();
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading.profile = false;
        state.errors.profile = action.payload as string;
      });

    // Stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading.stats = true;
        state.errors.stats = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        if (!action.payload.cached) {
          state.dashboardStats = action.payload;
          state.lastFetched.stats = Date.now();
        }
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.errors.stats = action.payload as string;
      });

    // Notifications
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading.notifications = true;
        state.errors.notifications = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading.notifications = false;
        if (!action.payload.cached) {
          state.notifications = action.payload;
          state.lastFetched.notifications = Date.now();
        }
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading.notifications = false;
        state.errors.notifications = action.payload as string;
      });

    // Noticeboards
    builder
      .addCase(fetchNoticeboards.pending, (state) => {
        state.loading.noticeboards = true;
        state.errors.noticeboards = null;
      })
      .addCase(fetchNoticeboards.fulfilled, (state, action) => {
        state.loading.noticeboards = false;
        if (!action.payload.cached) {
          state.noticeboards = action.payload;
          state.lastFetched.noticeboards = Date.now();
        }
      })
      .addCase(fetchNoticeboards.rejected, (state, action) => {
        state.loading.noticeboards = false;
        state.errors.noticeboards = action.payload as string;
      });

    // Courses
    builder
      .addCase(fetchPurchasedCourses.pending, (state) => {
        state.loading.courses = true;
        state.errors.courses = null;
      })
      .addCase(fetchPurchasedCourses.fulfilled, (state, action) => {
        state.loading.courses = false;
        if (!action.payload.cached) {
          state.purchasedCourses = action.payload;
          state.lastFetched.courses = Date.now();
        }
      })
      .addCase(fetchPurchasedCourses.rejected, (state, action) => {
        state.loading.courses = false;
        state.errors.courses = action.payload as string;
      });

    // Support
    builder
      .addCase(fetchSupportMessages.pending, (state) => {
        state.loading.support = true;
        state.errors.support = null;
      })
      .addCase(fetchSupportMessages.fulfilled, (state, action) => {
        state.loading.support = false;
        if (!action.payload.cached) {
          state.supportMessages = action.payload;
          state.lastFetched.support = Date.now();
        }
      })
      .addCase(fetchSupportMessages.rejected, (state, action) => {
        state.loading.support = false;
        state.errors.support = action.payload as string;
      });

    // Meetings
    builder
      .addCase(fetchMeetings.pending, (state) => {
        state.loading.meetings = true;
        state.errors.meetings = null;
      })
      .addCase(fetchMeetings.fulfilled, (state, action) => {
        state.loading.meetings = false;
        if (!action.payload.cached) {
          state.meetings = action.payload;
          state.lastFetched.meetings = Date.now();
        }
      })
      .addCase(fetchMeetings.rejected, (state, action) => {
        state.loading.meetings = false;
        state.errors.meetings = action.payload as string;
      });

    // Comments
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading.comments = true;
        state.errors.comments = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading.comments = false;
        if (!action.payload.cached) {
          state.comments = action.payload;
          state.lastFetched.comments = Date.now();
        }
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading.comments = false;
        state.errors.comments = action.payload as string;
      });
  },
});

export const { clearProfileData, setOfflineStatus } = profileSlice.actions;
export default profileSlice.reducer;
