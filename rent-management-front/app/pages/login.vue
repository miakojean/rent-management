<template>
    <div class="login-page-container">
        <loginForm></loginForm>
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