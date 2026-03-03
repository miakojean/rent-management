import { defineStore } from "pinia";
import { api } from "~/services/api";
import { ref, reactive,computed } from "vue";

export interface User {
    id?:number,
    firstName:string,
    lastName:string,
    email:string,
    username:string,
    password?:string,
}

export interface AuthResponse {
    type:'bearer',
    value:string,
    user: User
}

export const useAuthStore = defineStore('auth', ()=>{
    // state of the store
    const user = ref<User | null>(null);
    const token = ref<string | null>(null)
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    // Getter
    const isAuthenticated = computed(() => !!token.value && !!user.value);
    const fullName = computed(() => 
        user.value ? `${user.value.firstName} ${user.value.lastName}` : ''
    );

    // Action
    async function register(userData: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }) {
        isLoading.value = true;
        error.value = null;
        
        try {
            const response = await api.post('/rent-manager/auth/register', userData);
            
            if (response.data.token) {
                token.value = response.data.token;
                user.value = response.data.user;
                
                // Optionnel : stocker dans localStorage pour persistance
                localStorage.setItem('auth_token', response.data.token);
            }
            
            return response.data;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erreur lors de l\'inscription';
            //debugging
            console.log(error.value);
            throw error.value;
        } finally {
            isLoading.value = false;
        }
    }

    async function login(credentials: {
        email: string;
        password: string;
    }) {
        isLoading.value = true;
        error.value = null;
        
        try {
            const response = await api.post('/rent-manager/auth/login', credentials);
            
            if (response.data.value) {  // Ton API renvoie { type, value, user }
                token.value = response.data.value;
                user.value = response.data.user;
                
                localStorage.setItem('auth_token', response.data.value);
                
                // Configurer le token pour les futures requêtes
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.value}`;
            }
            
            return response.data;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erreur lors de la connexion';
            // debugging
            console.log("error message", error.value)
            throw error.value;
        } finally {
            isLoading.value = false;
        }
    }

    async function logout() {
        try {
            await api.post('/rent-manager/auth/logout');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        } finally {
            // Nettoyer le store même si la requête échoue
            user.value = null;
            token.value = null;
            localStorage.removeItem('auth_token');
            delete api.defaults.headers.common['Authorization'];
        }
    }

    // Restaurer la session au chargement
    function initializeAuth() {
        const savedToken = localStorage.getItem('auth_token');
        if (savedToken) {
            token.value = savedToken;
            api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
            
            // Optionnel : vérifier que le token est valide
            api.get('/rent-manager/auth/me')
                .then(response => {
                    user.value = response.data.user;
                })
                .catch(() => {
                    // Token invalide, déconnecter
                    logout();
                });
        }
    }

    // Retourner tout ce qui doit être accessible
    return {
        // State
        user,
        token,
        isLoading,
        error,
        
        // Getters
        isAuthenticated,
        fullName,
        
        // Actions
        register,
        login,
        logout,
        initializeAuth
    };
});

export function useAuth() {
    const store = useAuthStore();
    return store;
}