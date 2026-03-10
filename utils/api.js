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

        // Determine which token to prioritize based on the route
        const superAdminToken = localStorage.getItem('super_admin_token');
        const authToken = localStorage.getItem('auth_token');

        let token = null;

        if (pathname.startsWith('/super-admin')) {
            // In super-admin area, always prefer super-admin token
            token = superAdminToken || authToken;
        } else {
            // Everywhere else, prefer auth_token (standard login)
            token = authToken || superAdminToken;
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default api;
