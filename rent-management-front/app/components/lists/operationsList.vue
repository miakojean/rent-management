<template>
    <div class="operations__list">
        <table v-if="propertyStore.properties.length >=1">
            <thead>
                <tr>
                    <th><BaseCheckbox /></th>
                    <th v-for="(head, index) in tableHeader" :key="index">{{ head }}</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(cell, index) in tableBody" :key="index">
                    <td><BaseCheckbox @click="getTheSpecItem(cell)"/></td>
                    <td>{{ cell.created_at }}</td>
                    <td>{{ cell.title }}</td>
                    <td>{{ cell.description }}</td>
                    <td>{{ cell.city }}</td>
                    <td>{{ cell.country }}</td>
                    <td>
                        <optionButton 
                            @get="getTheSpecItem(cell)"
                            @delete="deleteTheSpecItme(cell)"
                            @archive="archiveTheSpecItem(cell)"
                        />
                    </td>
                </tr>
            </tbody>
        </table>

        <div 
            class="empty-content w-full flex flex-col justify-center items-center gap-4"
            v-else
            >

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-12">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 13.5H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
            </svg>

            <h3 class=" text-2xl font-medium">Vous n'avez aucune propriété enregistrée.</h3>

            <div class=" w-1/2">
                <main-button btn_label="ajouter une propriété"/>
            </div>

        </div>

        <!-- Transition autour de la modale -->
        <Transition name="modal">
            <propModale
                v-if="isModaleOpen"
                :isOpen="isModaleOpen"
                :selectedItem="selectedItem"
                @closeModale="closeModale"
            />
        </Transition>

        <deleteModale
            :isOpen="isDeleteModaleOpen"
            :selected-item="selectedItem"
            :isLoading="propertyStore.loading" 
            @close="isDeleteModaleOpen = false"
            @confirm="confirmDeleting"
        />

        <archiveModale
            :isOpen="isAchiveModaleOpen"
            :selected-item="selectedItem"
            :isLoading="propertyStore.loading" 
            @close="isAchiveModaleOpen = false"
            @confirm="confirmArchiving"
        />
    </div>
</template>

<script lang="ts">
import { ref, type PropType } from 'vue';  // ← ajouter ref
import BaseCheckbox from '../input/BaseCheckbox.vue';
import optionButton from '../buttons/optionButton.vue';
import propModale from '../modales/propModale.vue';
import deleteModale from '../modales/deleteModale.vue';
import archiveModale from '../modales/archiveModale.vue';
import { usePropertyStore } from '../../stores/propertyStore';
import mainButton from '../buttons/mainButton.vue';

interface OperationRow {
  created_at: string;
  title: string;
  description: string;
  city: string;
  country: string;
  type: string;
  id?: string
}

export default {
    name: 'OperationsList',
    props: {
        tableHeader: {
            type: Array as PropType<string[]>,
            default: () => ['Date d\'ajout', 'title', 'Description', 'Ville', 'Pays']
        },
        tableBody: {
            type: Array as PropType<OperationRow[]>,
            default: () => []
        }
    },
    components: { BaseCheckbox, optionButton, propModale, deleteModale, mainButton, archiveModale },
    emits: ['getSpecItem' , 'refreshTable'],
    setup(props, { emit }) {
        
        // component state
        const isModaleOpen = ref(false);
        const isDeleteModaleOpen = ref(false);
        const isAchiveModaleOpen = ref(false);
        const selectedItem = ref<OperationRow | null>(null);
        const propertyStore = usePropertyStore();
        
        // component actions

        function closeModale() {
            isModaleOpen.value = false;
            selectedItem.value = null;        // nettoie au cas où
        }

        function getTheSpecItem(item: OperationRow) {
            selectedItem.value = item;       // stocke l'élément cliqué
            isModaleOpen.value = true;       // ouvre la modale
            emit('getSpecItem', item);
        }

        function archiveTheSpecItem(item: OperationRow){
            selectedItem.value = item;       // stocke l'élément cliqué
            isAchiveModaleOpen.value = true;       // ouvre la modale
            emit('getSpecItem', item);
        }

        async function confirmArchiving(){
            if (!selectedItem.value?.id || propertyStore.loading) return

            try {
                await propertyStore.archiveProperty(selectedItem.value.id, selectedItem.value.title);

                propertyStore.properties = propertyStore.properties.filter(
                    (p) => p.id !== selectedItem.value?.id
                );

                isAchiveModaleOpen.value = false;
                selectedItem.value = null;
            } catch (error) {
                console.error("Erreur lors de l'archivage:", error)
            }
        }

        function deleteTheSpecItme(item:OperationRow){
            selectedItem.value = item;
            isDeleteModaleOpen.value = true
        }

        async function confirmDeleting() { 
            if (!selectedItem.value?.id || propertyStore.loading) return;

            try {
                await propertyStore.deleteProperty(selectedItem.value.id);
                
                // ✅ Supprimer localement dans le store (mise à jour immédiate du tableau)
                propertyStore.properties = propertyStore.properties.filter(
                    (p) => p.id !== selectedItem.value?.id
                );

                isDeleteModaleOpen.value = false;
                selectedItem.value = null; 
            } catch (error) {
                console.error("Erreur lors de la suppression :", error);
            }
        }

        return {
            isModaleOpen,
            isDeleteModaleOpen,
            isAchiveModaleOpen,
            selectedItem,
            propertyStore,
            // Actions
            getTheSpecItem,
            closeModale,
            archiveTheSpecItem,
            confirmArchiving,
            deleteTheSpecItme,
            confirmDeleting
        };
    }
}
</script>

<style scoped>
.operations__list{
    width: 100%;
    background-color: #fff;
    border-radius: 12px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

th {
    background-color: #f4f4f4;
    font-weight: 600;
}

tr:hover {
    background-color: #f9f9f9;
}

@media(prefers-color-scheme: dark){
    .operations__list {
        background-color: #2c2c2c;
    }
    th {
        background-color: #3a3a3a;
        color: #f3f3f3;
    }
    td {
        color: #f3f3f3;
    }
    tr:hover {
        background-color: #444;
    }
}

</style>