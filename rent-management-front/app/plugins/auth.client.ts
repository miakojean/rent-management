export default defineNuxtPlugin(async()=>{
    const authStore = useAuthStore();
   // Évite les appels répétés
    if (authStore.isInitialized) return;

    await authStore.initializeAuth();

})