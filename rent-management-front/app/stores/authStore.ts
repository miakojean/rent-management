import { defineStore } from "pinia";
import { api } from "~/services/api";
import { ref, computed } from "vue";

export interface User {
    id?: number,
    firstName: string,
    lastName: string,
    email: string,
    username: string,
}

export const useAuthStore = defineStore('auth', () => {

    const user = ref<User | null>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const isInitialized = ref(false); // ← flag ajouté

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
            const response = await api.post('/rent-management/auth/login', credentials);
            user.value = response.data.user;
            cachedUser.value = response.data.user;
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
            await api.post('/rent-management/auth/logout');
        } catch (err) {
            console.error('Erreur logout:', err);
        } finally {
            user.value = null;
            cachedUser.value = null;
            isInitialized.value = false; // ← reset au logout
        }
    }

    async function initializeAuth() {
        if (isInitialized.value) return; // ← bloque les appels répétés

        if (cachedUser.value) {
            user.value = cachedUser.value;
        }

        try {
            isLoading.value = true;
            const response = await api.get('/rent-management/auth/profile'); 
            user.value = response.data.user;
            cachedUser.value = response.data.user;
        } catch {
            user.value = null;
            cachedUser.value = null;
        } finally {
            isLoading.value = false;
            isInitialized.value = true; // ← marqué comme fait, succès ou échec
        }
    }

    return {
        user, isLoading, error, isInitialized,
        isAuthenticated, fullName,
        login, logout, initializeAuth
    };
});