// ~/services/api.ts
import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3333',  // Ton backend AdonisJS
    headers: {
        'Content-Type': 'application/json',
    }
});

// Intercepteur pour gérer les erreurs 401
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Token expiré ou invalide
            const authStore = useAuthStore();
            authStore.logout();
        }
        return Promise.reject(error);
    }
);