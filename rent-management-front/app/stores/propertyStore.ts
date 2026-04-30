import { defineStore } from "pinia";
import { api } from "~/services/api";
import { ref, computed } from "vue";

export interface Property {
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

const usePropertyStore = defineStore("property", ()=> {
    // State
    const property = ref<Property>({
        id:'',
        title:'',
        description:'',
        propertyType:'',
        address:'',
        city:'',
        country:''
    })
    const properties = ref<Property[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // Guetters

    // Actions
    const fetchProperties = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.get('/property/');
            properties.value = response.data.properties;
            console.log("Propriétés récupérées", properties.value)
        } catch (err) {
            error.value = 'Failed to fetch properties';
            console.error(err);
        } finally {
            loading.value = false;
        }
        
    }

    const fetchSpecificProperty = async (propId:string) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.get(`/property/${propId}`);
            if(response){
                loading.value = false;
                property.value = response.data;
                console.log('Votre propriété', property.value)
                return response
            } else {
                error.value = "Une erreur est surevenue lors de la récupération"
                loading.value = false
                return error
            }
        } catch (err) {
            error.value = 'Failed to add property';
            console.error(err);
            loading.value = false;
            return;
        }
    }

    const addProperty = async (property: Property) => {
        
        // UX
        error.value = "";
        loading.value = true;

        try {
            const response = await api.post('/property/', property);
            
            if(response) {
                properties.value.push(response.data);
                console.log("Propriété ajoutée", properties.value)
                loading.value = false;
                return response;
            } else {
                error.value = "Une erreur est intervenue lors de l'ajout de la propriété";
                loading.value = false;
                return;
            }
        } catch (err) {
            error.value = 'Failed to add property';
            console.error(err);
            loading.value = false;
            return;
        }
    };

    const deleteProperty = async (propId:string) => {
        // ux
        error.value = "";
        loading.value = true;

        try {
            const response = await api.delete(`/property/${propId}/`);
            if(response){
                loading.value = false;
                return response
            }
            else {
                error.value = "Une erreur est survenue lors de la suppression"
                loading.value = false;
                return error
            }
        } catch (err) {
            error.value = 'Failed to add property';
            console.error(err);
            loading.value = false;
            return;
        }
    }

    return {
        properties,
        loading,
        error,
        //
        
        //
        fetchProperties,
        fetchSpecificProperty,
        addProperty,
        deleteProperty
    }
})

export { usePropertyStore }