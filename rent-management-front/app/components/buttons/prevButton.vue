<template>

    <button type="button" class="prev--btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>

    </button>

</template>

<script></script>

<style scoped>
.prev--btn{
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--background-color);
    max-width: 50px;
    color: var(--primary-color-dark);
    cursor: pointer;
    transition: ease-in-out 0.2s;
}

.prev--btn:hover{
    background: var(--primary-color-dark);
    color: white;
    transition: ease-in-out 0.4s;
}

svg{
    font-weight: 600;
}
</style>