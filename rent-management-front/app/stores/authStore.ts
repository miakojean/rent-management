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

// authStore.ts
export const useAuthStore = defineStore('auth', () => {

    const user = ref<User | null>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    // Le cookie sert de cache persistant entre les sessions
    const cachedUser = useCookie<User | null>('user_data', {
        maxAge: 30 * 24 * 60 * 60,
    });

    const isAuthenticated = computed(() => !!user.value);
    const fullName = computed(() =>
        user.value ? `${user.value.firstName} ${user.value.lastName}` : ''
    );

    async function login(credentials: { email: string; password: string }) {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await api.post('/rent-manager/auth/login', credentials);
            user.value = response.data.user;       // ← état réactif mis à jour
            cachedUser.value = response.data.user; // ← cache persisté
            return response.data;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erreur de connexion';
            throw error.value;
        } finally {
            isLoading.value = false;
        }
    }

    async function logout() {
        try {
            await api.post('/rent-manager/auth/logout');
        } catch (err) {
            console.error('Erreur logout:', err);
        } finally {
            user.value = null;
            cachedUser.value = null; // ← on vide aussi le cache
        }
    }

    async function initializeAuth() {
        // Étape 1 : affichage immédiat depuis le cache (pas de flash)
        if (cachedUser.value) {
            user.value = cachedUser.value;
        }

        // Étape 2 : validation réelle auprès du serveur (toujours)
        try {
            isLoading.value = true;
            const response = await api.get('/rent-manager/auth/profile');
            user.value = response.data.user;
            cachedUser.value = response.data.user; // ← resync du cache
        } catch {
            // Cookie expiré ou invalide → on nettoie tout
            user.value = null;
            cachedUser.value = null;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        user, isLoading, error,
        isAuthenticated, fullName,
        login, logout, initializeAuth
    };
    // ← router n'est plus exposé ici
});