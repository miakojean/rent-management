import { useAuthStore } from "#imports";

export default defineNuxtPlugin(async()=>{
    const authstore = useAuthStore();
    await authstore.initializeAuth();
})