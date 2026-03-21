import { defineStore } from "pinia";
import { api } from "~/services/api"; // Assure-toi que api a { withCredentials: true }
import { ref, computed } from "vue";

export interface User {
    id?: number,
    firstName: string,
    lastName: string,
    email: string,
    username: string,
}

export const useAuthStore = defineStore('auth', () => {
    // State
    const user = ref<User | null>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    // Getters
    // On considère l'utilisateur authentifié si l'objet user est rempli
    const isAuthenticated = computed(() => !!user.value);
    
    const fullName = computed(() => 
        user.value ? `${user.value.firstName} ${user.value.lastName}` : ''
    );

    // Actions
    async function login(credentials: { email: string; password: string }) {
        isLoading.value = true;
        error.value = null;
        
        try {
            // Ton backend pose le cookie 'auth_token' automatiquement ici
            const response = await api.post('/rent-management/auth/login', credentials);
            
            // On récupère les infos utilisateur renvoyées (si ton API les renvoie)
            // Sinon, il faudra faire un appel à /me juste après
            user.value = response.data.user; 
            
            return response.data;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erreur lors de la connexion';
            throw error.value;
        } finally {
            isLoading.value = false;
        }
    }

    async function logout() {
        try {
            await api.post('rent-manager/auth/logout');
        } catch (err) {
            console.error('Erreur lors de la déconnexion:', err);
        } finally {
            // On nettoie l'état local quoi qu'il arrive
            user.value = null;
            // Le cookie sera supprimé par le serveur ou expirera
        }
    }

    /**
     * Très important avec les cookies : 
     * Au chargement de l'app, on demande au serveur "Qui suis-je ?"
     * Si le cookie est valide, le serveur répond avec l'utilisateur.
     */
    async function initializeAuth() {
        try {
            isLoading.value = true;
            const response = await api.get('/rent-management/auth/me');
            user.value = response.data.user;
        } catch (err) {
            // Si erreur (401), le cookie est invalide ou absent
            user.value = null;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        user,
        isLoading,
        error,
        isAuthenticated,
        fullName,
        login,
        logout,
        initializeAuth
    };
});