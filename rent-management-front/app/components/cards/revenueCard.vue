<template>
    <div class="revenue__cards">
        <div class="card__header flex justify-between items-center">
            <div class="flex gap-2 items-center">
                <h4>{{ label }}</h4>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
            </div>
            <div class="">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                </svg>
            </div>
        </div>
        
        <div class="figures w-full flex flex-col gap-4">
            <div class="flex justify-between items-center w-full gap-4">
                <h2 class="text-6xl font-bold">24</h2>
                <p class="text-2xl">100%</p>
            </div>
            <div class="progress-container">
                <div class="progress-bar rounded-full" style="width: 80%;"></div>
            </div>
        </div>

        <div class="footer flex justify-start gap-2 items-center">
            <span>Voir détails</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
            </svg>
        </div>
    </div>
</template>

<script>
import moreButton from '../buttons/moreButton.vue';
export default {
    props: {
        label: {
            type: String,
            default: 'Revenue Card'
        }
    },
    components: {
        moreButton
    }
}
</script>

<style scoped>
.revenue__cards{
    border-radius: 2px;
    gap: 1rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-left: 1px solid var(--background-color);
}

.card__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    color: var(--primary-color);
}

.card__header h4 {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--primary-color);
}

.total__revenue h2,
.monthly__growth h2 {
    font-size: 2rem;
    font-weight: 500;
    color: #555;
    margin-bottom: 0.5rem;
}

.progress-container {
    width: 100%;
    height: 10px;
    background-color: var(--border-color);
    border-radius: 5px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background-color: var(--primary-color);
}
</style>