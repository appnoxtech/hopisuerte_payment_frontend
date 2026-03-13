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
    if (config.headers.Authorization) {
        return config;
    }

    if (typeof window !== 'undefined') {
        const pathname = window.location.pathname;

        const superAdminToken = localStorage.getItem('super_admin_token');
        const authToken = localStorage.getItem('auth_token');

        let token = null;

        if (pathname.startsWith('/super-admin')) {
            // Strictly use super admin token for super admin routes
            token = superAdminToken;
        } else if (pathname.startsWith('/admin')) {
            // Strictly use auth token for merchant routes
            token = authToken;
        } else {
            // Public area: prefer auth_token, fallback to super_admin_token
            token = authToken || superAdminToken;
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default api;
