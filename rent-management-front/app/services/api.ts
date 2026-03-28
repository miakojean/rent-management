// ~/services/api.ts
import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:8000',  // Ton backend AdonisJS
    withCredentials: true,  // Permet d'envoyer les cookies pour l'authentification
    headers: {
        'Content-Type': 'application/json',
    }
});

// Intercepteur pour gérer les erreurs 401
/* Pour l'instant je désactive pour mieux debbuger
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
);*/