import { defineStore } from "pinia";
import { api } from "~/services/api";
import { ref, computed } from "vue";

// authStore.ts
export interface User {
    id?: string,
    first_name: string,
    last_name: string,
    email: string,
    username: string,
    title_category: string,
    phone_number: string,
    password?: string,
    passwordConfirmation?:string,
    address?: string,
    city?: string,
    country?: string
}

export const useAuthStore = defineStore('auth', () => {

    const cachedUser = useCookie<User | null>('user_data', {
        maxAge: 30 * 24 * 60 * 60,
    });

    const user = ref<User | null>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const isInitialized = ref(false); // ← flag ajouté

    const isAuthenticated = computed(() => !!user.value);
    const fullName = computed(() =>
        user.value ? `${user.value.first_name} ${user.value.last_name}` : ''
    );

    async function registration(user:User) {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await api.post('/account/registry/', user);
            console.log("Debug registration", response.data)
            isLoading.value = false;
            return response.data
        } catch(e:any) {
            error.value = e.response?.data?.message || 'Erreur lors de la création de compte'
            isLoading.value = false;
            throw error.value;
        } finally {
            isLoading.value = false;
        }
    }

    async function login(credentials: { email: string; password: string }) {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await api.post('/account/login/', credentials);
            user.value = response.data.user;
            cachedUser.value = response.data.user;
            console.log('userCached', user.value)
            return response.data;
        } catch (err: any) {

            if(!err.response){
                error.value = 'Une erreur est survenue. Veuillez vérifier votre connexion.';
            }

            else if (err.response.status === 401){
                error.value = 'Email ou mot de passe incorrect';
            }
            else{
                error.value = err.response?.data?.message || 'Une erreur est survenue. veuillez réessayer.';
            }
            throw error.value;
        } 
        finally {
            isLoading.value = false;
        }
    }

    async function initializeAuth() {

        console.log("Fonction enclenchée")
 
        if (isInitialized.value) return; // ← bloque les appels répétés

        isLoading.value = true;

        if (cachedUser.value) {
            user.value = cachedUser.value;
        }

        try {
            const response = await api.get('/account/profile/'); 
            user.value = response.data.user; // Ajoute .user ici
            cachedUser.value = response.data.user; // Et ici aussi
            console.log("Reponse du backend", user.value)
        } catch {
            user.value = null;
            cachedUser.value = null;
            console.log("Erreur sur la mise en cache", cachedUser.value)
        } finally {
            isLoading.value = false;
            isInitialized.value = true; // ← marqué comme fait, succès ou échec
        }
    }

    async function logout() {
        try {
            await api.post('/account/logout/');
        } catch (err) {
            console.error('Erreur logout:', err);
        } finally {
            user.value = null;
            cachedUser.value = null;
            isInitialized.value = false; // ← reset au logout
        }
    }

    return {
        user, 
        isLoading, 
        error, 
        isInitialized,
        isAuthenticated, 
        fullName,
        registration,
        login, 
        logout, 
        initializeAuth
    };
});