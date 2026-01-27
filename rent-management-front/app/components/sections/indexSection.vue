<template>
    <section class="main__section">
        <!-- Content for the index section goes here -->
        <div class="first__content flex flex-col gap-8">
            <div class="title__section">
                <h2>Une idée sur vos chiffres</h2>
            </div>
            <div class="cards__section">
                <revenueCard v-for="i in 3"/>
            </div>
            <div class="last__operations flex flex-col gap-8">
                <!-- Placeholder for last operations content -->
                <div class="title__section">
                    <h2>Une idée sur vos chiffres</h2>
                </div>
                <operationsList/>
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
    color: #215083;
}

.cards__section{
    display: flex;
    gap: 1rem;
}
</style>