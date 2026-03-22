<template>
  <form @submit.prevent="submitform" class="flex flex-col gap-6 p-4">

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BaseInput 
        v-model="newProperty.title"
        label="Nom de votre propriété"
        :error-message="errors.title"
        required
      />
      
      <BaseSelect 
        v-model="newProperty.type"
        label="Type de propriété"
        :error-message="errors.type"
        required
      />

      <BaseSelect 
        v-model="newProperty.country"
        label="Pays"
        :error-message="errors.country"
        required
      />

      <BaseInput 
        v-model="newProperty.city"
        label="Ville"
        :error-message="errors.city"
        required
      />

      <BaseInput 
        v-model="newProperty.address"
        label="Adresse complète"
        :error-message="errors.address"
        class="md:col-span-2"
        required
      />

      <BaseTextArea 
        v-model="newProperty.description"
        label="Description détaillée"
        :error-message="errors.description"
        class="md:col-span-2"
        required
      />
    </div>

    <div class="mt-4">
      <mainButton type="submit">Enregistrer le bien</mainButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { usePropertyStore } from '../../stores/propertyStore'; // Exemple de chemin
import type { Property } from '../../stores/propertyStore';

// component
import BaseInput from '../input/BaseInput.vue';
import BaseSelect from '../input/BaseSelect.vue';
import BaseTextArea from '../input/BaseTextArea.vue';
import mainButton from '../buttons/mainButton.vue';

// State
const propertyStore = usePropertyStore();
const newProperty = ref<Property>({
  title: '',
  description: '',
  type: '',
  address: '',
  city: '',
  country: '',
});

// Gestion des erreurs par champ pour une meilleure UX
const errors = reactive({
  title: '',
  description: '',
  type: '',
  address: '',
  city: '',
  country: '',
});

// Validation
const validate = () => {
  let isValid = true;
  
  // Réinitialisation des erreurs
  Object.keys(errors).forEach(key => (errors[key as keyof typeof errors] = ''));

  if (!newProperty.value.title) {
    errors.title = "Le nom est obligatoire";
    isValid = false;
  }
  if (!newProperty.value.type) {
    errors.type = "Veuillez choisir un type";
    isValid = false;
  }
  if (!newProperty.value.address){
    errors.type = "Entrer une addresse";
    isValid = false
  }
  if (!newProperty.value.city){
    errors.city = "Entrer une ville";
    isValid = false;
  }
  if(!newProperty.value.country){
    errors.country = "Entrer un pays";
    isValid = false;
  }

  return isValid;
};

// Actions
const submitform = async () => {
  if (!validate()) return;

  try {
    // On passe la valeur brute (.value) au store
    await propertyStore.addProperty({ ...newProperty.value });
    
    // Optionnel : Réinitialiser le formulaire après succès
    // resetForm();
  } catch (err) {
    console.error("Erreur lors de l'enregistrement", err);
  }
};
</script>