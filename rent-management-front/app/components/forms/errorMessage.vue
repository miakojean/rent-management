<template>
  <div class="error--message">
    <p>{{ message }}</p>
  </div>
</template>

<script lang="ts">
export default {
    props:{
        message:{
            type:String,
            default:"Une erreur est survenue. Veuillez réessayer."
        },
        isNetworkError: {
            type: Boolean,
            default: false
        }
    },
    setup(){

    }
}
</script>

<style>
.error--message{
    background: #f0a5a5;
    border-radius: 0.5rem;
    padding: 0.5rem;
    color: rgb(156, 5, 5);
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
}
</style>