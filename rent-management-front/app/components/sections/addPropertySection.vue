<template>
    <section class="main__section">
        <!-- Content for the index section goes here -->
        <div class="first__content flex flex-col gap-8">
            <div class="title__section">
                <h2>Formulaire d'ajout de bien</h2>
            </div>
            <div class="">
                
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import revenueCard from '../cards/revenueCard.vue';
import operationsList from '../lists/operationsList.vue';
export default {
    name: "IndexSection",
    components: {
        revenueCard,
        operationsList
    }
}
</script>

<style scoped>
.main__section{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: normal;
}

.first__content h2{
    font-size: large;
    font-weight: 700;
    color: var(--primary-color);
}

.cards__section{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}
</style>