export default defineNuxtRouteMiddleware(async (to) => {
    const authStore = useAuthStore();
    const publicRoutes = ['/login', '/register'];

    // On attend que le store soit initialisé (vérification du cache + appel API)
    if (!authStore.isInitialized) {
        await authStore.initializeAuth();
    }

    // Maintenant, isAuthenticated est 100% fiable
    if (!authStore.isAuthenticated && !publicRoutes.includes(to.path)) {
        return navigateTo('/login');
    }

    if (authStore.isAuthenticated && publicRoutes.includes(to.path)) {
        return navigateTo('/dashboard');
    }
});