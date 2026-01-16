<template>
    <main class="flex h-screen">
        <sidebar />
    </main>
</template>

<script>
import sidebar from '~/components/navigation/sidebar.vue';

export default {
    components:{
        sidebar
    }
}
</script>

<style scoped>
/* The design is just for desktop */
</style>