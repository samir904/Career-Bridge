import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5014/api/v1',
      withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// // ✅ Response interceptor with LAZY store import
// api.interceptors.response.use(
//     (response) => {
//         console.log(`✅ Response from ${response.config.url}`, response.data);
//         return response;
//     },
//     (error) => {
//         console.error('❌ API Error:', error.response?.data || error.message);
        
//         // ✅ Handle 401 Unauthorized (token expired/invalid)
//         if (error.response?.status === 401) {
//             console.log('Token invalid/expired - logging out');
            
//             // ✅ LAZY IMPORT INSIDE - No circular import!
//             import('../REDUX/store').then(({ default: store }) => {
//                 import('../REDUX/SLICES/authSlice').then(({ logoutUser }) => {
//                     store.dispatch(logoutUser());
//                     window.location.href = '/login';
//                 });
//             });
//         }
        
//         // ✅ Handle 403 Forbidden (no permission)
//         if (error.response?.status === 403) {
//             console.log('Access forbidden - insufficient permissions');
//         }
        
//         return Promise.reject(error);
//     }
// );

export default api;