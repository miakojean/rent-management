<template>
    <div class="app-container grid grid-cols-1 lg:grid-cols-2 h-screen overflow-hidden">
        <div class="left-side flex flex-col items-center justify-between p-4">
            <h3>Calim</h3>
            <propertyForm/>
            <p>Calim provided by Caladrius | conditions d'utilisations appliquées</p>
        </div>
        <div class="right-side hidden lg:flex flex-col items-center justify-center p-12 text-white relative">
        <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      
        <div class="content-wrapper relative z-10 text-center">
            <img 
            src="../../assets/svg/undraw_coming-home_jmbc.svg" 
            alt="Illustration gestion immobilière"
            class="w-4/5 max-w-md mx-auto mb-8 drop-shadow-2xl"
            />
            <div class="quotes max-w-sm mx-auto">
            <h4 class="text-xl font-medium italic opacity-90">
                "La meilleure façon de prédire l'avenir, c'est de le créer."
            </h4>
            </div>
        </div>
    </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import propertyForm from '~/components/forms/propertyForm.vue';
export default {

    components:{
        propertyForm
    }

}
</script>

<style scoped>
.left-side{
    padding: 1rem;
}

.left-side h3 {
    color: var(--primary-color-dark);
    font-size: 1.8rem;
    font-weight: 600;
    width: 100%;
    text-align: start;
}

.right-side{
    background: var(--primary-color);
}
</style>