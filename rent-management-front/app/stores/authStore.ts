import { defineStore } from "pinia";
import { api } from "~/services/api"; // Assure-toi que api a { withCredentials: true }
import { ref, computed } from "vue";
import { useRouter } from "#app";

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
    const router = useRouter()
    const cachedUser = useCookie<User | null>('user_data', {
        maxAge: 30 * 24 * 60 * 60, // 30 jours
    })

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
            const response = await api.post('/rent-manager/auth/login', credentials);
            // Sinon, il faudra faire un appel à /me juste après
            cachedUser.value = response.data.user;
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
            cachedUser.value = null;
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
        // 1. Si l'utilisateur est déjà présent (chargé depuis le cache/persistance)
        if (user.value) {
            // Optionnel : On rafraîchit les données en arrière-plan sans bloquer l'interface
            // Cela permet de mettre à jour le profil si des changements ont eu lieu côté serveur
            api.get('/rent-manager/auth/profile')
                .then(response => {
                    user.value = response.data.user;
                })
                .catch(() => {
                    // Si l'appel échoue (ex: cookie expiré), on nettoie le cache
                    user.value = null;
                });
            
            return; // On sort immédiatement pour ne pas déclencher isLoading
        }

        // 2. Si aucun utilisateur n'est en cache, on fait l'appel classique
        try {
            isLoading.value = true;
            const response = await api.get('/rent-manager/auth/profile');
            user.value = response.data.user;
        } catch (err) {
            user.value = null;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        user,
        isLoading,
        error,
        router,
        isAuthenticated,
        fullName,
        cachedUser,
        login,
        logout,
        initializeAuth
    };
});