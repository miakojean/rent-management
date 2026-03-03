<template>
    <div class="registration__form">
        <h3>
            Mettez de l'ordre dans votre gestion
        </h3>
        <p>Entrer vos détails et finalisons <span>votre inscription</span></p>
        <stepper/>
        <form action="">
            <div class="step w-full flex flex-col gap-6" v-if="step == 1">
                <h4>Je m'enregistre en tant que</h4>

                <BaseCheckbox 
                    label="propriétaire" 
                    :modelValue="user.type === 'propriétaire'"
                    @update:modelValue="selectType('propriétaire')"
                />
                
                <BaseCheckbox 
                    label="Agence immobilière"
                    :modelValue="user.type === 'agence'"
                    @update:modelValue="selectType('agence')"
                />

                <mainButton 
                    type="button" 
                    btn_label="suivant" 
                    :disabled="isStepOneInvalid"
                    @handleClick="step = 2" 
                />
                <p>
                    En poursuivant vous acceptez 
                    <span> les conditions d'utilisations votre inscription</span>
                </p>
            </div>
            <div class="step w-full flex flex-col gap-4"
                v-if="step == 2"
            >
                <BaseInput
                    id="firstName"
                    v-model="user.firstName"
                    label="Nom"
                    type="text"
                    placeholder="Entrer votre nom"
                />
                <BaseInput
                    id="firstName"
                    v-model="user.lastName"
                    label="Prenoms"
                    type="text"
                    placeholder="Entrer votre prenom"
                />
            </div>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import BaseInput from '../input/BaseInput.vue';
import BaseCheckbox from '../input/BaseCheckbox.vue';
import { useAuthStore } from '#imports';
import mainButton from '../buttons/mainButton.vue';
import stepper from '../tools/stepper.vue';

// state

interface RegistrationForm {
    firstName:string,
    lastName:string,
    username:string,
    type:string,
    password:string,
    passwordConfirmation:string,
    phone:string,
    address:string,
    isActive:boolean
}

const user = ref<RegistrationForm>({
    firstName:"",
    lastName:"",
    username:"",
    type:"",
    password:"",
    passwordConfirmation:"",
    phone:"",
    address:"",
    isActive:true

})

const authStore = useAuthStore();

const step = ref<number>(1);
const active = ref<boolean>(false);

// Getter

// Action
const isStepOneInvalid = computed(() => {
    return user.value.type === "";
});

// 3. Fonction pour sélectionner le type
const selectType = (selectedType: string) => {
    // Si on clique sur ce qui est déjà sélectionné, on vide la valeur (désélection)
    // Sinon, on applique la nouvelle valeur
    if (user.value.type === selectedType) {
        user.value.type = "";
    } else {
        user.value.type = selectedType;
    }
};
</script>

<style scoped>
.registration__form{
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.registration__form h3{
    color: var(--primary-color-dark);
    font-size: 1.8rem;
    font-weight: 600;
}

.registration__form h4{
    color: var(--text-color);
    font-size: 1.2rem;
    font-weight: 500;
}

span{
    font-weight: 600;
    color: var(--primary-color);
}

.error{
    color: var(--error-color);
}
</style>