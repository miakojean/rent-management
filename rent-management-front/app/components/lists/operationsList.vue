<template>
    <div class="operations__list">
        <table>
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
                    <td>{{ cell.type }}</td>
                    <td><optionButton /></td>
                </tr>
            </tbody>
        </table>

        <!-- Transition autour de la modale -->
        <Transition name="modal">
            <propModale
                v-if="isModaleOpen"
                :isOpen="isModaleOpen"
                :selectedItem="selectedItem"
                @closeModale="closeModale"
            />
        </Transition>
    </div>
</template>

<script lang="ts">
import { ref, type PropType } from 'vue';  // ← ajouter ref
import BaseCheckbox from '../input/BaseCheckbox.vue';
import optionButton from '../buttons/optionButton.vue';
import propModale from '../modales/propModale.vue';

interface OperationRow {
  created_at: string;
  title: string;
  description: string;
  city: string;
  country: string;
  type: string;
}

export default {
    name: 'OperationsList',
    props: {
        tableHeader: {
            type: Array as PropType<string[]>,
            default: () => ['Date d\'ajout', 'title', 'Description', 'Ville', 'Pays', 'Type']
        },
        tableBody: {
            type: Array as PropType<OperationRow[]>,
            default: () => []
        }
    },
    components: { BaseCheckbox, optionButton, propModale },
    emits: ['getSpecItem'],
    setup(props, { emit }) {
        const isModaleOpen = ref(false);
        const selectedItem = ref<OperationRow | null>(null);

        function getTheSpecItem(item: OperationRow) {
            selectedItem.value = item;       // stocke l'élément cliqué
            isModaleOpen.value = true;       // ouvre la modale
            emit('getSpecItem', item);
            console.log('Évènement émis avec', item);
        }

        function closeModale() {
            isModaleOpen.value = false;
            selectedItem.value = null;        // nettoie au cas où
        }

        return {
            isModaleOpen,
            selectedItem,
            getTheSpecItem,
            closeModale
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