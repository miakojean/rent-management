<template>
    <section class="main__section">

        <div class="first__content w-full flex flex-col gap-8">
            <div class="title__section">
                <h2>{{ title }}</h2>
            </div>
        </div>

        <form action="" 
            class="flex flex-col gap-6 p-4 w-2/3"
        >

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <BaseInput label="Nom de votre propriété" v-model="editForm.title"/>
                <BaseInput label="Nom de votre propriété"/>
                <BaseInput label="Nom de votre propriété"/>
                <BaseInput label="Nom de votre propriété"/>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <BaseInput label="Nom de votre propriété"/>
                <BaseInput label="Nom de votre propriété"/>
            </div>

        </form>
    </section>
</template>

<script lang="ts">
import BaseInput from '../input/BaseInput.vue';
import BaseSelect from '../input/BaseSelect.vue';
import BaseTextArea from '../input/BaseTextArea.vue';
import mainButton from '../buttons/mainButton.vue';
import succesForm from './succesForm.vue';

import { ref } from '#imports';
import { usePropertyStore } from '#imports';
import { useRouter } from 'vue-router';
import { useCountries } from '~/plugins/countries';

interface Property {
    id?: string;
    title: string;
    description?: string;
    propertyType: string;
    status?:string;
    pricePerMonth?: number;
    surfaceArea?: number;
    address: string;
    city: string;
    country: string;

}

export default {
    name:'editPropertyForm',
    components:{
        BaseInput
    },
    props: {
        title: {
            type: String,
            default: "Modifier les informations de ma propriété"
        }
    },
    setup(){
        const propertyStore = usePropertyStore();
        const editForm = ref<Property>({
            id: '',
            title: '',
            description: '',
            propertyType: '',
            status:'',
            pricePerMonth:0,
            surfaceArea:0,
            address: '',
            city: '',
            country: '',
        })
        

        return{
            propertyStore,
            editForm
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
    align-items: center;
    gap: 1rem;
    background: #fff;
    padding: 1rem;
    border-radius: 1rem;
}

.first__content h2{
    font-size: large;
    font-weight: 700;
    color: var(--primary-color);
}
</style>