<template>
    <section class="main__section">
        <!-- Content for the index section goes here -->
        <div class="first__content flex flex-col gap-8">
            <div class="title__section">
                <h2>Formulaire d'ajout de bien</h2>
            </div>
            <div class="grid grid-cols-2 gap-8">
                <propertyForm/>
                <illustratorSection/>
            </div>
        </div>

        <notification-popup
            :visible="notificationVisible"
            :message="message"
            :type="notificationType"
            :duration="10000"
            @close="notificationVisible = false"
        />
    </section>
</template>

<script lang="ts">
import revenueCard from '../cards/revenueCard.vue';
import operationsList from '../lists/operationsList.vue';
import propertyForm from '../forms/propertyForm.vue';
import illustratorSection from './illustratorSection.vue';
import notificationPopup from '../tools/notificationPopup.vue';
import { ref } from 'vue';

export default {
    name: "IndexSection",
    components: {
        revenueCard,
        operationsList,
        propertyForm,
        illustratorSection,
        notificationPopup
    },

    setup() {
        const notificationVisible = ref(true)
        const notificationMessage = ref('')
        const notificationType = ref('success')


        //message pour le fun
        const message = ref<string>('Pour le test des notifications')
        // Fonction pour afficher une notification
        const showNotification = (message, type = 'success') => {
        notificationMessage.value = message
        notificationType.value = type
        notificationVisible.value = true
        }

        return {
        notificationVisible,
        notificationMessage,
        notificationType,
        message,
        showNotification
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
}
</style>