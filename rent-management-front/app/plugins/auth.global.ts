import { useAuthStore } from "#imports";

export default defineNuxtPlugin(async()=>{
    const authStore = useAuthStore();
   // Évite les appels répétés
    if (authStore.isInitialized) return;

    await authStore.initializeAuth();

    console.log("Middleware a joué son rôle !!!")
})