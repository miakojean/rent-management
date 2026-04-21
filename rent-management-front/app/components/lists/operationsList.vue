<template>
    <div class="operations__list">
        <!-- Placeholder for operations list content -->
        <table>
            <thead>
                <tr>
                    <th><BaseCheckbox /></th>
                    <th v-for="(head, index) in tableHeader" :key="index">{{ head }}</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <!-- Sample data rows -->
                <tr>
                    <td><BaseCheckbox /></td>
                    <td v-for="(cell, index) in tableBody" :key="index">{{ cell }}</td>
                    <td><optionButton /></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import BaseCheckbox from '../input/BaseCheckbox.vue';
import optionButton from '../buttons/optionButton.vue';
export default {
    name: 'OperationsList',
    props:{
        tableHeader: {
            type: Array,
            default: () => ['Date', 'Description', 'Montant', 'Type']
        },
        tableBody: {
            type:Array,
            default: () => ['2024-06-01', 'Loyer Juin', '1200€', 'Revenu']
        }
    },
    components:{
        BaseCheckbox,
        optionButton
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