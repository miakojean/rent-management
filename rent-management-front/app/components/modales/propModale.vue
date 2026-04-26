<template>
    <Transition name="modal">
        <div v-if="isOpen" class="modale-overlay" @click.self="close">
            <div class="modal-content">
                <div class="modal-header flex justify-between items-center">
                    <h2>Property Details</h2>
                    <closeButton @click="close"/>
                </div>
                <!-- Affichage des détails de l'élément sélectionné -->
                <div v-if="selectedItem" class="modal-body">
                    <p><strong>Titre :</strong> {{ selectedItem.title }}</p>
                    <p><strong>Description :</strong> {{ selectedItem.description }}</p>
                    <p><strong>Ville :</strong> {{ selectedItem.city }}</p>
                    <p><strong>Pays :</strong> {{ selectedItem.country }}</p>
                    <p><strong>Type :</strong> {{ selectedItem.type }}</p>
                    <p><strong>Date d'ajout :</strong> {{ selectedItem.created_at }}</p>
                </div>
                <div v-else class="modal-body">
                    <p>Aucune donnée sélectionnée.</p>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script lang="ts">
import closeButton from '../buttons/closeButton.vue';
import type { PropType } from 'vue';

// Définissez ici le même type que OperationRow (ou exportez-le depuis un fichier partagé)
interface OperationRow {
  created_at: string;
  title: string;
  description: string;
  city: string;
  country: string;
  type: string;
}

export default {
    name: 'PropModale',
    components: { closeButton },
    props: {
        isOpen: {
            type: Boolean,
            default: false
        },
        selectedItem: {
            type: Object as PropType<OperationRow | null>,
            default: null
        }
    },
    emits: ['closeModale'],
    setup(props, { emit }) {
        function close() {
            emit('closeModale');
        }
        return { close };
    }
}
</script>

<style scoped>
/* Animation modale */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
    transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
    transform: translateX(30px);
}

.modal-leave-to .modal-content {
    transition-delay: 0.1s; /* optionnel : attend un peu avant de glisser */
}

/* Style existant */
.modale-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: end;
    align-items: center;
    padding: 0.5rem;
}

.modal-content {
    background: #fff;
    padding: 1rem;
    border-radius: 8px;
    min-height: 800px;
    width: 500px;
}

/* dark mode non modifié */
@media(prefers-color-scheme: dark) {
    .modal-content {
        background: #2c2c2c;
        color: #f3f3f3;
    }
}
</style>