<template>
    <div class="registration__form">
        <h3>
            Mettez de l'ordre dans votre gestion
        </h3>
        <stepper :steps="stepItems" />
        <form action="">
            <div class="step w-full flex flex-col gap-6" 
                v-if="step == 1">
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
                    @handleClick="" 
                />
                <p>
                    En poursuivant vous acceptez 
                    <span> les conditions d'utilisations votre inscription</span>
                </p>
            </div>
            
            <div class="step w-full grid grid-cols-2 gap-4"
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
                    id="lastName"
                    v-model="user.lastName"
                    label="Prenoms"
                    type="text"
                    placeholder="Entrer votre prenom"
                />

                <BaseInput
                    id="username"
                    v-model="user.username"
                    label="Nom d'utilisateur"
                    type="text"
                    placeholder="Entrer un username"
                />

                <BaseInput
                    id="email"
                    v-model="user.email"
                    label="Email"
                    type="text"
                    placeholder="Entrer votre email"
                />

                <BaseInput
                    id="password"
                    v-model="user.password"
                    label="Mot de passe"
                    type="password"
                    placeholder="Entrer votre mot de passe"
                />

                <BaseInput
                    id="confirmPassword"
                    v-model="user.passwordConfirmation"
                    label="Confirmer mot de passe"
                    type="password"
                    placeholder="Confirmer mot de passe"
                />

                <prevButton @click=""/>

                <mainButton 
                    type="button" 
                    btn_label="suivant" 
                    :disabled="isStepOneInvalid"
                    @handleClick="" 
                />
            </div>

            <div class="step w-full grid grid-cols-2 gap-4"
                v-if="step == 3"
            >

                <BaseInput
                    id="phone"
                    v-model="user.phone"
                    label="Numero de téléphone"
                    type="text"
                    placeholder="Entrer votre numéro de téléphone"
                />

                <BaseInput
                    id="city"
                    v-model="user.city"
                    label="Pays"
                    type="text"
                    placeholder="Entrer votre pays"
                />

                <BaseInput
                    id="pays"
                    v-model="user.country"
                    label="Pays"
                    type="text"
                    placeholder="Entrer un pays"
                />

                <BaseInput
                    id="address"
                    v-model="user.address"
                    label="Email"
                    type="text"
                    placeholder="Entrer votre address"
                />

                <prevButton/>

                <mainButton 
                    type="button" 
                    btn_label="suivant" 
                    :disabled="isStepOneInvalid"
                    @handleClick="step = 2" 
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
import prevButton from '../buttons/prevButton.vue';

// state

interface RegistrationForm {
    firstName:string,
    lastName:string,
    username:string,
    email:string,
    type:string,
    password:string,
    passwordConfirmation:string,
    phone:string,
    address:string,
    city:string,
    country:string,
    isActive:boolean
}

const user = ref<RegistrationForm>({
    firstName:"",
    lastName:"",
    username:"",
    email:"",
    type:"",
    password:"",
    passwordConfirmation:"",
    phone:"",
    address:"",
    city:"",
    country:"",
    isActive:true
})

const authStore = useAuthStore();

const step = ref(1); // 1, 2 ou 3

// Définir les étapes avec leur nom
const stepItems = computed(() => [
  { id: 1, name: 'Type de compte', isActive: step.value === 1 },
  { id: 2, name: 'Informations personnelles', isActive: step.value === 2 },
  { id: 3, name: 'Coordonnées', isActive: step.value === 3 }
]);

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
    max-width: 600px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
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