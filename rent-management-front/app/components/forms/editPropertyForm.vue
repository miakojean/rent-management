<template>
    <section class="main__section">
        <div class="first__content w-full flex flex-col gap-8">
            <div class="title__section">
                <h2>{{ title }}</h2>
            </div>
        </div>

        <form 
            @submit.prevent="submitForm" 
            class="flex flex-col gap-6 p-4 w-2/3"
            v-if="!succes"
        >
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <BaseInput label="Nom de votre propriété" v-model="editForm.title"/>
                
                <!-- Utilisation de property_type pour correspondre au store et au backend -->
                <BaseSelect 
                    label="Type de propriété" 
                    v-model="editForm.property_type" 
                    :options="property_types"
                />

                <BaseSelect 
                    label="Statut de la propriété" 
                    v-model="editForm.status"
                    :options="statusOptions"
                />

                <BaseInput 
                    type="number" 
                    label="Loyer mensuel" 
                    v-model="editForm.pricePerMonth"
                />

                <BaseInput 
                    type="number" 
                    label="Surface (m²)" 
                    v-model="editForm.surfaceArea"
                />
            </div>

            <BaseTextArea label="Description" v-model="editForm.description"/>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <BaseSelect 
                    label="Pays" 
                    v-model="editForm.country" 
                    :options="countryOptions"
                    @change="onCountryChange"
                />

                <BaseSelect 
                    v-if="cityOptions.length > 0"  
                    label="Ville" 
                    v-model="editForm.city" 
                    :options="cityOptions"
                />
                
                <BaseInput label="Adresse exacte" v-model="editForm.address"/>
            </div>
            
            <div class="flex justify-end gap-4 mt-4">
                <mainButton 
                    type="submit" 
                    btn_label="Enregistrer les modifications" 
                    :loading="propertyStore.loading"
                    :disabled="!hasChanges"
                />
            </div>
        </form>
        
        <p v-if="propertyStore.error" class="text-red-500 mt-2">{{ propertyStore.error }}</p>

        <succes-form 
            message="Propriété modifiée succès"
            v-if="succes"
        />
    </section>
</template>

<script lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue';
import { usePropertyStore, type Property } from '../../stores/propertyStore';
import { useRouter } from 'vue-router';
import { useCountries } from '../../plugins/countries';

import mainButton from '../buttons/mainButton.vue';
import BaseInput from '../input/BaseInput.vue';
import BaseSelect from '../input/BaseSelect.vue';
import BaseTextArea from '../input/BaseTextArea.vue';
import succesForm from './succesForm.vue';

export default {
    name: 'editPropertyForm',
    props: {
        title: { type: String, default: "Modifier les informations de ma propriété" }
    },
    components:{
        mainButton,
        BaseInput,
        BaseSelect,
        BaseTextArea,
        succesForm
    },
    setup() {
        const router = useRouter();
        const propertyStore = usePropertyStore();
        const { getCountryList } = useCountries();

        // State

        const editForm = ref<Property>({
            id: '',
            title: '',
            description: '',
            property_type: '', // Doit correspondre à la valeur 'code' des options
            status: '',
            pricePerMonth: 0,
            surfaceArea: 0,
            address: '',
            city: '',
            country: '',
        });

        const succes = ref<boolean>(false);

        const property_types = [
            { code: 'HOUSE',        name: 'Villa' },
            { code: 'APARTMENT',    name: 'Appartement' },
            { code: 'STUDIO',       name: 'Studio' },
            { code: 'OFFICE',       name: 'Bureau' },
            { code: 'COMMERCIAL',   name: 'Local Commercial' },
            { code: 'BUILDING',     name: 'Immeuble' },
        ];

        const statusOptions = [
            { code: 'AVAILABLE',   name: 'Disponible' },
            { code: 'RENTED',      name: 'Loué' },
            { code: 'MAINTENANCE', name: 'En travaux / Maintenance' },
        ];

        const submitForm = async () => {
            if (!propertyStore.currentPropertyId) return;

            // Préparation du payload final pour Django
            const payload = {
                title: editForm.value.title,
                description: editForm.value.description,
                property_type: editForm.value.property_type,
                status: editForm.value.status,
                price_per_month: Number(editForm.value.pricePerMonth), // snake_case et conversion en number
                surface_area: Number(editForm.value.surfaceArea),     // snake_case et conversion en number
                address: editForm.value.address,
                city: editForm.value.city,
                country: editForm.value.country,
            };

            const response = await propertyStore.editProperty(propertyStore.currentPropertyId, payload as any);
            if (response && !propertyStore.error) {
                succes.value = true;
            }
        };

        // ... reste de la logique (countryOptions, cityOptions, etc.)
        const countryOptions = computed(() => getCountryList().sort((a, b) => a.name.localeCompare(b.name, 'fr')));
        const CITIES_BY_COUNTRY: Record<string, string[]> = { CI: ['Abidjan', 'Bouaké', 'Daloa'], SN: ['Dakar', 'Saint-Louis'] }; // Simplifié pour l'exemple
        const cityOptions = computed(() => (CITIES_BY_COUNTRY[editForm.value.country] || []).map(c => ({ code: c, name: c })));
        const onCountryChange = () => { editForm.value.city = ''; };

        // État initial du formulaire
        const initialForm = ref<any>({});

        // Computed pour vérifier si des changements ont été faits
        const hasChanges = computed(() => {
            return JSON.stringify(editForm.value) !== JSON.stringify(initialForm.value);
        });

        onMounted(() => {
            if (!propertyStore.currentPropertyId) {
                router.push('/dashboard/Property');
                return;
            }

            const selectedProperty = propertyStore.properties.find(
                (p) => p.id === propertyStore.currentPropertyId
            );

            if (selectedProperty) {
                // CORRECTION : Mapping explicite des champs venant de Django (snake_case) 
                // vers ton objet editForm (qui utilise un mélange pour price/surface)
                editForm.value = {
                    ...selectedProperty,
                    // On s'assure que property_type prend la valeur de l'objet trouvé
                    property_type: selectedProperty.property_type || '', 
                    // Mapping des champs numériques si l'API renvoie du snake_case
                    pricePerMonth: (selectedProperty as any).price_per_month || selectedProperty.pricePerMonth || 0,
                    surfaceArea: (selectedProperty as any).surface_area || selectedProperty.surfaceArea || 0
                };
            };

            if (!propertyStore.currentPropertyId) {
                router.push('/dashboard/Property');
                return;
            }

            if (selectedProperty) {
                editForm.value = {
                    ...selectedProperty,
                    property_type: selectedProperty.property_type || '',
                    pricePerMonth: (selectedProperty as any).price_per_month || selectedProperty.pricePerMonth || 0,
                    surfaceArea: (selectedProperty as any).surface_area || selectedProperty.surfaceArea || 0
                };
                
                // Sauvegarde une copie de l'état initial
                initialForm.value = JSON.parse(JSON.stringify(editForm.value));
            }
        });

        watch(editForm, ()=>{
            console.log('Votre formulaire a changé')
        })

        return {
            propertyStore, property_types, statusOptions, countryOptions, hasChanges,
            cityOptions, onCountryChange, succes, editForm, submitForm
        };
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