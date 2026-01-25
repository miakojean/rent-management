<template>
    <section class="main__section">
        <!-- Content for the index section goes here -->
        <div class="first__content flex flex-col gap-4">
            <h2>Une idée sur vos chiffres</h2>
            <div class="cards__section">
                <revenueCard/>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import revenueCard from '../cards/revenueCard.vue';
export default {
    name: "IndexSection",
    components: {
        revenueCard
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
</style>