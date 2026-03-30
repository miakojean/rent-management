<template>
    <div class="operations__list">
        <!-- Placeholder for operations list content -->
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Montant</th>
                    <th>Type</th>
                </tr>
            </thead>
            <tbody>
                <!-- Sample data rows -->
                <tr>
                    <td>2024-06-01</td>
                    <td>Loyer Juin</td>
                    <td>1200€</td>
                    <td>Revenu</td>
                </tr>
                <tr>
                    <td>2024-06-05</td>
                    <td>Réparation plomberie</td>
                    <td>-150€</td>
                    <td>Dépense</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts"></script>

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