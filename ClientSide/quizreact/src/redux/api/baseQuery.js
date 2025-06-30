// src/redux/api/baseQuery.js
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toast } from 'react-hot-toast';

// Optional: custom navigation (since hooks can't be used outside components)
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:7001',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
  credentials: 'include', // if you want cookies too
});

const customBaseQuery = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    toast.error('Token expired or invalid. Please login again.');
    localStorage.removeItem('token');
    history.push('/signin');
  }

  return result;
};

export default customBaseQuery;
