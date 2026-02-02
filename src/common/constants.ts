// API Configuration
export const BASE_URL = __DEV__ ? 'http://10.0.2.2:3000' : 'https://api.jaipurbangles.com';
export const BASE_URL_MOBILE = 'http://10.0.2.2:3000';
export const API_KEY = 'your-api-key';
export const WEB_APP_URL = 'https://app.jaipurbangles.com';
export const DISABLE_HEADER_FOOTER_PARAM = 'no_header_footer';

export const API_ENDPOINTS = {
  NOTIFICATIONS: '/mobile/notifications',
  PROFILE: '/mobile/profile',
  DASHBOARD_STATS: '/mobile/dashboard/stats',
  PURCHASED_COURSES: '/mobile/courses/purchased',
  SUPPORT_MESSAGES: '/mobile/support/messages',
  COMMENTS: '/mobile/comments',
};