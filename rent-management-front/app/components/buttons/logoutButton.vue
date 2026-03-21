<template>
    <button>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
        </svg>
        {{ label }}
    </button>
</template>

<script lang="ts">
export default {
    name: "LogoutButton",

    props:{
        label:{
            type:String,
            default: "Déconnexion"
        }
    },

    emits: ['handleClick'],

    setup(props, {emit}){
        
    }
}
</script>

<style scoped>
button {
    padding: 0.8rem 1rem;
    background-color: #f56555;
    color: #f3f3f3;
    border: none;
    border-radius: 1.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    transition: ease-in-out 0.3s;
}

button:hover {
    background-color: #e53e3e;
    transition: ease-in-out 0.3s;
}
</style>