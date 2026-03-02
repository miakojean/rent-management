<template>
    <div class="login-page-container grid-cols-2 gap-4">
        <loginForm></loginForm>
        <div class="">
            <h1>Bienvenu sur calim, Prenez en main la gestion de vos bien immobiliers</h1>
        </div>
    </div>
</template>

<script lang="ts">
import loginForm from '~/components/forms/loginForm.vue';

export default{
    components:{
        loginForm,
    }
}
</script>

<style scoped>

.login-page-container{
    padding: 1rem;
    height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

</style>