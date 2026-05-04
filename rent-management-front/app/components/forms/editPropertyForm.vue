<template>
    <section class="main__section">

        <div class="first__content w-full flex flex-col gap-8">
            <div class="title__section">
                <h2>{{ title }}</h2>
            </div>
        </div>

        <form action="" class="flex flex-col gap-6 p-4 w-2/3">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <!-- Liaison avec le titre -->
                <BaseInput label="Nom de votre propriété" v-model="editForm.title"/>
                
                <BaseTextArea label="Description" v-model="editForm.description"/>

                <!-- Liaison avec la ville -->
                <BaseSelect 
                    v-if="cityOptions.length > 0"  
                    label="Ville" 
                    v-model="editForm.city" 
                    :options="cityOptions"
                />
                
                <!-- Liaison avec le pays -->
                <BaseSelect 
                    label="Pays" 
                    v-model="editForm.country" 
                    :options="countryOptions"
                />

                <BaseSelect 
                    label="Type de propriété" 
                    v-model="editForm.propertyType" 
                    :options="propertyTypes"
                />
                
                <!-- Liaison avec l'adresse -->
                <BaseSelect 
                    label="Statut de la propriété" 
                    v-model="editForm.status" 
                />
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <!-- Liaison avec le titre -->
                <BaseInput label="Nom de votre propriété" v-model="editForm.title"/>
                
                <!-- Liaison avec la ville -->
                <BaseInput label="Ville" v-model="editForm.city"/>
                
                <!-- Liaison avec le pays -->
                <BaseInput label="Pays" v-model="editForm.country"/>
                
                <!-- Liaison avec l'adresse -->
                <BaseInput label="Adresse exacte" v-model="editForm.address"/>
            </div>
            
            <!-- Pour la description, si vous utilisez un TextArea -->
        </form>
    </section>
</template>

<script lang="ts">
import BaseInput from '../input/BaseInput.vue';
import BaseSelect from '../input/BaseSelect.vue';
import BaseTextArea from '../input/BaseTextArea.vue';
import mainButton from '../buttons/mainButton.vue';
import succesForm from './succesForm.vue';

import { ref, computed, reactive } from 'vue';
import { usePropertyStore } from '#imports';
import { useRouter } from 'vue-router';
import { useCountries } from '~/plugins/countries';
import { onMounted } from 'vue';

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
        BaseInput, BaseTextArea, BaseSelect
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
        
        // About city and Town selcetion
        const {getCountryList} = useCountries();
        const countryOptions = computed(() =>
            getCountryList().sort((a, b) => a.name.localeCompare(b.name, 'fr'))
        )
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

        const cityOptions = computed(() => {
            const cities = CITIES_BY_COUNTRY[editForm.value.country] ?? []
            return cities.map(city => ({ code: city, name: city }))
        })

        const onCountryChange = () => {
            editForm.value.city = ''
            errors.city = ''
        }

        const propertyTypes = [
            { code: 'villa',        name: 'Villa' },
            { code: 'cour commune', name: 'Cour commune' },
            { code: 'APARTMENT',  name: 'Appartement' },
            {code: 'STUDIO',     name: 'Studio' },
            { code: 'OFFICE',      name: 'Bureau' },
            { code: 'COMMERCIAL',  name: 'Local Commercial' },
            { code: 'autre',        name: 'Autre' },
            {code: 'BUILDING', name: 'Immeuble'},
        ]

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

        const errors = reactive({
            title:       '',
            description: '',
            type:        '',
            address:     '',
            city:        '',
            country:     '',
        })
        
        // editPropertyForm.vue

        onMounted(() => {
            // 1. Vérifier si on a un ID de sélectionné
            if (!propertyStore.currentPropertyId) {
                // Optionnel : rediriger vers la liste si aucun ID n'est trouvé
                router.push('/dashboard/Properties');
                return;
            }

            // 2. Trouver la propriété dans le store via son ID
            const selectedProperty = propertyStore.properties.find(
                (p) => p.id === propertyStore.currentPropertyId
            );

            console.log('Propriété sélectionnée',selectedProperty)

            // 3. Remplir le formulaire avec les données trouvées
            if (selectedProperty) {
                // On utilise la décomposition (...) pour créer une copie et éviter de modifier 
                // directement l'objet du store avant la validation du formulaire
                editForm.value = { ...selectedProperty };
            }
        });

        return{
            router,
            cityOptions,
            propertyStore,
            getCountryList,
            propertyTypes,
            onCountryChange,
            countryOptions,
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