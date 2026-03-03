<template>
    <nav class="fixed top-0 left-0 z-50 w-full bg-white px-8 py-4">
        <div class="flex justify-between items-center px-8 py-4"> 
            <div class="logo">
                <h3>Calim</h3>
            </div>
            <div class="login">
                <p>Déjà un compte? <span>Se connecter ici</span></p>
            </div>
        </div>
    </nav>
</template>

<script></script>

<style scoped>
nav{
    padding: 0.5rem;
}

.logo h3{
    color: var(--primary-color-dark);
    font-size: 1.8rem;
    font-weight: 600;
}

.login span{
    font-weight: 600;
    color: var(--primary-color-dark);
}
</style>