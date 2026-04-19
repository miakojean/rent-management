<template>
    <section class="main__section">
        <!-- Content for the index section goes here -->
        <div class="first__content flex flex-col gap-8">
            <div class="title__section">
                <h2>{{ title }}</h2>
            </div>
            <div class="cards__section">
                <revenueCard v-for="card in cardsData" 
                    :key="card.title" 
                    :label="card.title" 
                    :amount="card.amount"
                />
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
import { onMounted } from '#imports';
import revenueCard from '../cards/revenueCard.vue';
import operationsList from '../lists/operationsList.vue';
import { usePropertyStore } from '#imports';
import type { Property } from '#imports';
export default {
    name: "MainSectionProperty",
    props: {
        title: {
            type: String,
            required: false,
            default: "Résumé de mes comptes"
        }
    },
    components: {
        revenueCard,
        operationsList
    },
    setup(){

        const propertyStore = usePropertyStore();

        // Logic for the main section can be added here
        const cardsData = [
            { title: "Revenu total", amount: "5000€" },
            { title: "Dépenses totales", amount: "2000€" },
            { title: "Bénéfice net", amount: "3000€" }
        ]

        onMounted(() => {
            propertyStore.fetchProperties();
        })

        return {
            cardsData,
            propertyStore
        }
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
    background: var(--card-background);
    padding: 1rem;
    border-radius: 0.5rem;
}
</style>