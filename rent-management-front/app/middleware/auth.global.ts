export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore()
    const publicRoutes = ['/auth/login', '/auth/register']
    
    // 1. Gestion de l'initialisation (si ton store a une méthode init)
    // On attend que le store vérifie si un token existe avant de décider
    if (!authStore.isInitialized) {
        // Supposons que tu aies une action asynchrone pour vérifier le user
        // await authStore.checkAuth() 
    }

    const isPublic = publicRoutes.includes(to.path)

    // 2. Redirection : Utilisateur NON connecté tente d'aller sur une page privée
    if (!authStore.isAuthenticated && !isPublic) {
        return navigateTo('/auth/login')
    }

    // 3. Redirection : Utilisateur DÉJÀ connecté tente d'aller sur une page publique (login/register)
    if (authStore.isAuthenticated && isPublic) {
        return navigateTo('/') // Ou vers le dashboard
    }
})