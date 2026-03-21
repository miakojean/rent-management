<template>
    <form @submit.prevent="submitform" class="flex flex-col gap-4">
        <!-- Form fields go here -->
        <h3>Enregistrer un nouveau bien</h3>

        <div class="grid grid-cols-2 gap-4">
            <BaseInput label="Nom de votre propriété"/>
            <BaseSelect label="Nom de votre propriété"/>
            <BaseInput label="Nom de votre propriété"/>
            <BaseSelect label="Nom de votre propriété"/>
            <BaseTextArea label="Nom de votre propriété"/>
            
        </div>

        <div class="">
           <mainButton/>
        </div>
    </form>
</template>

<script lang="ts">
import { ref } from 'vue';
import { usePropertyStore } from '#imports';
import type { Property } from '#imports';

import BaseInput from '../input/BaseInput.vue';
import BaseSelect from '../input/BaseSelect.vue';
import BaseTextArea from '../input/BaseTextArea.vue';
import mainButton from '../buttons/mainButton.vue';

export default {
    name:"propertyForm",

    components:{
        BaseInput,
        BaseSelect,
        BaseTextArea,
        mainButton
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