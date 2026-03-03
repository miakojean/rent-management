<template>
    <div class="registration__form">
        <h3>
            Mettez de l'ordre dans votre gestion
        </h3>
        <form action="">
            <div class="step w-full flex flex-col gap-4"
                v-if="step == 1"
            >
                <h4>
                    Je m'enregistre en tant que
                </h4>

                <BaseCheckbox label="propriétaire"/>
                <BaseCheckbox label="Agence immobilière"/>
                <mainButton type="button" btn_label="suivant"/>
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

// Getter

// Action
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