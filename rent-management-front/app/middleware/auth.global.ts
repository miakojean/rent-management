export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore()
    const publicRoutes = ['/auth/login', '/auth/register']

    // 1. On attend l'initialisation complète (Cookie + Vérification API)
    // On utilise "await" pour que le middleware ne rende pas la page 
    // avant de savoir si l'utilisateur est vraiment connecté.
    if (!authStore.isInitialized) {
        await authStore.initializeAuth() // Utilise le bon nom de fonction
    }

    const isPublic = publicRoutes.includes(to.path)

    // 2. Redirection : Non connecté tente d'aller sur une page privée
    if (!authStore.isAuthenticated && !isPublic) {
        return navigateTo('/auth/login')
    }

    // 3. Redirection : Déjà connecté tente d'aller sur une page publique
    if (authStore.isAuthenticated && isPublic) {
        return navigateTo('/')
    }
})