<template>
    <div class="regis--section flex flex-col gap-4">
        <HeaderNav/>
        <registrationForm/>
    </div>
</template> 

<script lang="ts" setup>
import navbar from '~/components/navigation/navbar.vue';
import registrationForm from '~/components/forms/registrationForm.vue';
import HeaderNav from '~/components/navigation/headerNav.vue';
</script>

<style lang="css" scoped>
.regis--section{
    padding: 1rem;
    height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>