<template>
    <section class="main__section">

        <div class="first__content w-full flex flex-col gap-8">
            <div class="title__section">
                <h2>{{ title }}</h2>
            </div>
        </div>

        <form @submit.prevent="submitForm" class="flex flex-col gap-6 p-4 w-2/3">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <!-- Informations générales -->
                <BaseInput label="Nom de votre propriété" v-model="editForm.title"/>
                
                <BaseSelect 
                    label="Type de propriété" 
                    v-model="editForm.propertyType" 
                    :options="propertyTypes"
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
                <!-- Localisation -->
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
            
            <!-- Actions -->
            <div class="flex justify-end gap-4 mt-4">
                <mainButton 
                    type="submit" 
                    text="Enregistrer les modifications" 
                    :loading="propertyStore.loading"
                />
            </div>
        </form>
        
        <!-- Affichage des erreurs si nécessaire -->
        <p v-if="propertyStore.error" class="text-red-500 mt-2">{{ propertyStore.error }}</p>

    </section>
</template>

<script lang="ts">
import BaseInput from '../input/BaseInput.vue';
import BaseSelect from '../input/BaseSelect.vue';
import BaseTextArea from '../input/BaseTextArea.vue';
import mainButton from '../buttons/mainButton.vue';
import succesForm from './succesForm.vue';

import { ref, computed, reactive, onMounted } from 'vue';
import { usePropertyStore } from '#imports';
import { useRouter } from 'vue-router';
import { useCountries } from '../../plugins/countries';

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
        BaseInput, BaseTextArea, BaseSelect, mainButton, succesForm
    },
    props: {
        title: {
            type: String,
            default: "Modifier les informations de ma propriété"
        }
    },
    setup(){
        const router = useRouter();
        const propertyStore = usePropertyStore();
        
        // Options de pays et villes
        const {getCountryList} = useCountries();
        const countryOptions = computed(() =>
            getCountryList().sort((a, b) => a.name.localeCompare(b.name, 'fr'))
        );
        
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
        };

        const cityOptions = computed(() => {
            const cities = CITIES_BY_COUNTRY[editForm.value.country] ?? [];
            return cities.map(city => ({ code: city, name: city }));
        });

        const onCountryChange = () => {
            editForm.value.city = '';
            errors.city = '';
        };

        const propertyTypes = [
            { code: 'APARTMENT', name: 'Villa' },
            { code: 'cour commune', name: 'Cour commune' },
            { code: 'APARTMENT',    name: 'Appartement' },
            { code: 'STUDIO',       name: 'Studio' },
            { code: 'OFFICE',       name: 'Bureau' },
            { code: 'COMMERCIAL',   name: 'Local Commercial' },
            { code: 'BUILDING',     name: 'Immeuble'},
            { code: 'autre',        name: 'Autre' },
        ];

        // Mappé sur les STATUS_CHOICES du backend
        const statusOptions = [
            { code: 'AVAILABLE',   name: 'Disponible' },
            { code: 'RENTED',      name: 'Loué' },
            { code: 'MAINTENANCE', name: 'En travaux / Maintenance' },
        ];

        const editForm = ref<Property>({
            id: '',
            title: '',
            description: '',
            propertyType: '',
            status: '',
            pricePerMonth: 0,
            surfaceArea: 0,
            address: '',
            city: '',
            country: '',
        });

        const errors = reactive({
            title:       '',
            description: '',
            type:        '',
            address:     '',
            city:        '',
            country:     '',
        });
        
        onMounted(() => {
            if (!propertyStore.currentPropertyId) {
                router.push('/dashboard/Properties');
                return;
            }

            const selectedProperty = propertyStore.properties.find(
                (p) => p.id === propertyStore.currentPropertyId
            );

            if (selectedProperty) {
                // Remplissage du formulaire. On s'assure que les champs camelCase 
                // reçoivent bien les données (si elles arrivent en snake_case depuis l'API, 
                // vous devrez adapter ici : e.g., pricePerMonth: selectedProperty.price_per_month)
                editForm.value = { ...selectedProperty };
            }
        });

        const submitForm = async () => {
            if (!propertyStore.currentPropertyId) return;

            // Transformation du payload pour correspondre aux attentes de Django (snake_case)
            const payload = {
                title: editForm.value.title,
                description: editForm.value.description,
                property_type: editForm.value.propertyType, 
                status: editForm.value.status,
                price_per_month: editForm.value.pricePerMonth,
                surface_area: editForm.value.surfaceArea,
                address: editForm.value.address,
                city: editForm.value.city,
                country: editForm.value.country,
            };

            const response = await propertyStore.editProperty(propertyStore.currentPropertyId, payload as any);

            if (response && !propertyStore.error) {
                // Redirection vers la liste des propriétés après succès
                router.push('/dashboard/Property');
            }
        };

        const cancelEdit = () => {
            router.push('/dashboard/Property');
        };

        return{
            router,
            propertyStore,
            getCountryList,
            propertyTypes,
            statusOptions,
            countryOptions,
            cityOptions,
            onCountryChange,
            editForm,
            submitForm,
            cancelEdit
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