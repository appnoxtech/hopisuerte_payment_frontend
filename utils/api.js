import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    // If the request already has an explicit Authorization header, don't overwrite it.
    // This is critical for super-admin requests that pass their own token.
    if (config.headers.Authorization) {
        return config;
    }

    if (typeof window !== 'undefined') {
        // Check for super_admin_token first, then fall back to auth_token
        const superAdminToken = localStorage.getItem('super_admin_token');
        const authToken = localStorage.getItem('auth_token');
        const token = superAdminToken || authToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default api;
