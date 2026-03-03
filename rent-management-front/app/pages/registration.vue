<template>
    <div class="regis--section gap-4">
        <registrationForm/>
    </div>
</template> 

<script lang="ts" setup>
import registrationForm from '~/components/forms/registrationForm.vue';
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