<template>
  <succesForm 
    v-if="isSuccess" 
    message="Votre propriété a été ajoutée avec succès !" 
  />
  <form v-else
    @submit.prevent="submitform" 
    class="flex flex-col gap-6 p-4 md:"
  >
    
    <h3>
      Ajouter une nouvelle propriété
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BaseInput 
        v-model="newProperty.title"
        label="Nom de votre propriété"
        :error-message="errors.title"
        required
      />
      
      <BaseSelect 
        v-model="newProperty.property_type"
        label="Type de propriété"
        :error-message="errors.property_type"
        :options="propertyTypes"
        required
      />

      <!-- Sélection du pays via la liste ISO normalisée -->
      <BaseSelect 
        v-model="newProperty.country"
        label="Pays"
        placeholder="Sélectionnez un pays"
        :error-message="errors.country"
        :options="countryOptions"
        required
        @change="onCountryChange"
      />

      <!-- Ville : select si des villes connues existent, sinon input libre -->
      <BaseSelect
        v-if="cityOptions.length > 0"
        v-model="newProperty.city"
        label="Ville"
        placeholder="Sélectionnez une ville"
        :error-message="errors.city"
        :options="cityOptions"
        required
      />
      <BaseInput
        v-else
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

    <div class="error--message" v-if="propertyStore.error" >
      <p class="error">{{ propertyStore.error }}</p>
    </div>

    <div class="mt-4">
      <mainButton 
        type="submit" 
        btn_label="ajouter la propriété" 
        :isloading="propertyStore.loading"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { usePropertyStore } from '../../stores/propertyStore';
import type { Property } from '../../stores/propertyStore';
import { useCountries } from '~/plugins/countries';
import { useRouter } from 'vue-router';

// Composants
import BaseInput from '../input/BaseInput.vue';
import BaseSelect from '../input/BaseSelect.vue';
import BaseTextArea from '../input/BaseTextArea.vue';
import mainButton from '../buttons/mainButton.vue';
import succesForm from './succesForm.vue';

const isSuccess = ref(false);

// ─── Pays ────────────────────────────────────────────────────────────────────

const { getCountryList } = useCountries()

/**
 * Liste triée alphabétiquement, au format attendu par BaseSelect :
 * { code: 'CI', name: 'Côte d\'Ivoire' }
 * La valeur stockée dans newProperty.country sera le code ISO-2 (ex: 'CI').
 */
const countryOptions = computed(() =>
  getCountryList().sort((a, b) => a.name.localeCompare(b.name, 'fr'))
)

// ─── Villes par pays ──────────────────────────────────────────────────────────

/**
 * Dictionnaire des villes connues par code pays ISO-2.
 * Étendre selon les besoins métier. Les pays absents basculeront sur un input libre.
 */
const CITIES_BY_COUNTRY: Record<string, string[]> = {
  CI: ['Abidjan', 'Bouaké', 'Daloa', 'Yamoussoukro', 'Korhogo', 'San-Pédro', 'Man', 'Divo', 'Gagnoa', 'Abengourou'],
  SN: ['Dakar', 'Thiès', 'Kaolack', 'Saint-Louis', 'Ziguinchor', 'Touba', 'Mbour', 'Diourbel'],
  CM: ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua', 'Bamenda', 'Maroua', 'Ngaoundéré'],
  ML: ['Bamako', 'Sikasso', 'Mopti', 'Koutiala', 'Kayes', 'Ségou', 'Gao'],
  BF: ['Ouagadougou', 'Bobo-Dioulasso', 'Koudougou', 'Ouahigouya', 'Banfora'],
  GN: ['Conakry', 'Nzérékoré', 'Kankan', 'Kindia', 'Labé'],
  FR: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Bordeaux', 'Lille', 'Rennes'],
  MA: ['Casablanca', 'Rabat', 'Fès', 'Marrakech', 'Agadir', 'Tanger', 'Meknès', 'Oujda'],
  TN: ['Tunis', 'Sfax', 'Sousse', 'Gabès', 'Kairouan', 'Bizerte'],
  DZ: ['Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Sétif'],
}

/**
 * Options de villes au format BaseSelect ({ code, name }).
 * Retourne un tableau vide si le pays n'est pas dans le dictionnaire
 * → le template bascule alors sur un <BaseInput> libre.
 */
const cityOptions = computed(() => {
  const cities = CITIES_BY_COUNTRY[newProperty.value.country] ?? []
  return cities.map(city => ({ code: city, name: city }))
})

/**
 * Réinitialise la ville à chaque changement de pays
 * pour éviter une valeur incohérente.
 */
const onCountryChange = () => {
  newProperty.value.city = ''
  errors.city = ''
}

// Router
const router = useRouter();

// ─── Types de propriété ───────────────────────────────────────────────────────

// Valeurs alignées sur PropertyTypes dans #models/property
const propertyTypes = [
  { code: 'HOUSE',        name: 'Villa' },
  { code: 'cour commune', name: 'Cour commune' },
  { code: 'APARTMENT',  name: 'Appartement' },
  {code: 'STUDIO',     name: 'Studio' },
  { code: 'OFFICE',      name: 'Bureau' },
  { code: 'COMMERCIAL',  name: 'Local Commercial' },
  { code: 'autre',        name: 'Autre' },
  {code: 'BUILDING', name: 'Immeuble'},
]

// ─── Formulaire ───────────────────────────────────────────────────────────────

const propertyStore = usePropertyStore();

const newProperty = ref<Property>({
  title: '',
  description: '',
  type: '',
  address: '',
  city: '',
  country: '',
  property_type:''
})

const errors = reactive({
  title:       '',
  description: '',
  property_type: '',
  address:     '',
  city:        '',
  country:     '',
})

// ─── Validation ───────────────────────────────────────────────────────────────

const validate = () => {
  let isValid = true

  Object.keys(errors).forEach(key => (errors[key as keyof typeof errors] = ''))

  if (!newProperty.value.title) {
    errors.title = 'Le nom est obligatoire'
    isValid = false
  }
  if (!newProperty.value.property_type) {
    errors.property_type = 'Veuillez choisir un type'
    isValid = false
  }
  if (!newProperty.value.country) {
    errors.country = 'Veuillez sélectionner un pays'
    isValid = false
  }
  if (!newProperty.value.city) {
    errors.city = 'Veuillez saisir ou sélectionner une ville'
    isValid = false
  }
  if (!newProperty.value.address) {
    errors.address = 'Entrez une adresse'
    isValid = false
  }
  if (!newProperty.value.description) {
    errors.description = 'La description est obligatoire'
    isValid = false
  }

  return isValid
}

// ─── Soumission ───────────────────────────────────────────────────────────────

const submitform = async () => {
  if (!validate()) return

  try {
    const success = await propertyStore.addProperty({ ...newProperty.value })
    
    if(success) {
      // 1. On active l'écran de succès
      isSuccess.value = true;
      
      // 2. Optionnel : On réinitialise le formulaire
      newProperty.value = {
        title: "", description: "", address: "",
        type: "", city: "", country: "", property_type:""
      };
    }
  } catch (err) {
    console.error("Erreur lors de l'enregistrement", err)
  }
}

onMounted(() => {
  // Réinitialiser le store pour éviter les messages d'erreur persistants
  propertyStore.error = null;
})
</script>