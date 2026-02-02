import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL_MOBILE, API_KEY } from '../common/constants';
import { RootState } from '../store';

export const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL_MOBILE,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    
    headers.set('x-api-key', API_KEY);
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});
