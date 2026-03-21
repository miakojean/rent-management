<template>
    <form @submit.prevent="submitform">
        <!-- Form fields go here -->
        <h3>Enregistrer un nouveau bien</h3>

        <div class="">
            <BaseInput label="Nom de votre propriété"/>
        </div>
    </form>
</template>

<script lang="ts">
import { ref } from 'vue';
import { usePropertyStore } from '#imports';
import type { Property } from '#imports';

import BaseInput from '../input/BaseInput.vue';

export default {
    name:"propertyForm",

    components:{
        BaseInput
    },

    setup(){
        // state
        const propertyStore = usePropertyStore();
        const newProperty = ref<Property>({
            title: '',
            description: '',
            type: '',
            address: '',
            city: '',
            country: '',
        })

        // getters

        // actions
         const submitform = () => {
            // Logic to handle form submission
            console.log("Form submitted");
        }

        return {
            propertyStore,
            newProperty,
            submitform
        }
    }
}

</script>