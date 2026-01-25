<template>
    <div class="app-container">
        <sidebar class="sidebar-area"/>
        
        <header class="header-area">
            <headerContent/>
        </header>

        <main class="main-area">
            <p>Welcome to the Rent Management application...</p>
            <p>Features include:</p>
            <ul>
                <li>Property Listings</li>
                <li>Tenant Management</li>
                <li>Payment Tracking</li>
                <li>Maintenance Requests</li>
                <li>Reporting and Analytics</li>
            </ul>
        </main>

        <footer class="footer-area">
            &copy; 2024 Rent Management. All rights reserved.
        </footer>
    </div>
</template>

<script lang="ts">
import headerContent from '../components/headers/headerContent.vue';
import sidebar from '../components/navigation/sidebar.vue';
export default {
    components:{
        sidebar,
        headerContent
    }
}

</script>

<style scoped>
.app-container {
    background: #f3f3f3;
    height: 100vh;
    width: 100%;
    display: grid;
    gap: 4px;
    /* Définition correcte : Sidebar à gauche sur toute la hauteur, 
       le reste à droite */
    grid-template-areas: 
        "sidebar header"
        "sidebar main"
        "sidebar footer";
    grid-template-columns: 250px 1fr;
    grid-template-rows: 80px 1fr auto; /* Header fixe, Main flexible, Footer auto */
}

.header-area {
    grid-area: header;
    background-color: white;
    color: #333;
    padding: 1rem;
    margin: 8px;
    border-radius: 12px;
}

.sidebar-area {
    grid-area: sidebar;
}

.main-area {
    grid-area: main;
    background-color: #fff;
    padding: 1rem;
    margin: 8px;
    border-radius: 12px;
    overflow-y: auto; /* Permet de scroller uniquement le contenu */
}

.footer-area {
    grid-area: footer;
    background-color: white;
    color: #333;
    padding: 1rem;
    text-align: center;
}
</style>