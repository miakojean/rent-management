import { defineStore } from "pinia";
import { api } from "~/services/api";
import { ref, computed } from "vue";

export interface Property {
    id?: string;
    title: string;
    description?: string;
    type: string;
    address: string;
    city: string;
    country: string;
}

const usePropertyStore = defineStore("property", ()=> {
    // State
    const properties = ref<Property[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // Actions
    const fecthProperties = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.get('/rent-management/properties');
            properties.value = response.data;
        } catch (err) {
            error.value = 'Failed to fetch properties';
            console.error(err);
        } finally {
            loading.value = false;
        }
        
    }

    const addProperty = async (property: Property) => {
        try {
            const response = await api.post('/rent-management/properties', property);
            properties.value.push(response.data);
        } catch (err) {
            error.value = 'Failed to add property';
            console.error(err);
        }
    };

    return {
        properties,
        loading,
        error,
        fecthProperties,
        addProperty,
    }
})

export { usePropertyStore }