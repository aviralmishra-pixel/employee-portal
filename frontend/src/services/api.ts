import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api/auth`;

// Create a configured instance of Axios as app
const api = axios.create({
  baseURL: BASE_URL,   
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach the Access Token to every request header
api.interceptors.request.use(
  (config) => {     // register this as for each request..
    const token = localStorage.getItem('accessToken'); // Or wherever you store it in memory/state
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: If an access token expires (401), automatically fetch a new one.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the server returns a 401/403 and we haven't already tried to refresh
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Hit the refresh api — the browser sends the secure cookie automatically
        const response = await axios.post(
          `${BASE_URL}/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data;

        // Save the new access token
        localStorage.setItem('accessToken', accessToken);

        // Update the authorization header for the stalled request and retry it
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      }
       catch (refreshError) {
        // Refresh token is also expired/invalid -> Clear session and boot user to login
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;