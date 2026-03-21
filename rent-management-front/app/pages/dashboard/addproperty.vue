<template>
    <div class="app-container">
        <sidebar class="sidebar-area"/>
        
        <header class="header-area">
            <headerContent 
                title="Ajouter un bien immobilier"
            />
        </header>

        <main class="main-area">
            <addPropertySection/>
        </main>

        <footer class="footer-area">
            &copy; 2024 Rent Management. All rights reserved.
        </footer>
    </div>
</template>

<script lang="ts">
import headerContent from '../../components/headers/headerContent.vue';
import sidebar from '../../components/navigation/sidebar.vue';
import indexSection from '../../components/sections/indexSection.vue';
import addPropertySection from '~/components/sections/addPropertySection.vue';
export default {
    components:{
        sidebar,
        headerContent,
        indexSection,
        addPropertySection
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
    margin: 2px 8px;
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