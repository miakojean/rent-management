<template>
    <form 
        @submit.prevent="submitForm"
        class="login-form" 
    >   

        <h3>
            Se connecter
        </h3>
        
        <BaseInput 
            v-model="user.email"
            label="Adresse Email"
            type="email"
            placeholder="jean@example.com"
            :required=true
        />
        <BaseInput 
            v-model="user.password"
            label="Mot de passe"
            placeholder="votre mot de passe"
            :required="true"
            type="password"
        />
        <div class="remember-content">
            <p>
                Se souvenir de moi
            </p>
        </div>
        <mainButton type="button" btn_label="connexion"/>
    </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseInput from '../input/BaseInput.vue';
import mainButton from '../buttons/mainButton.vue';

interface LoginForm {
    email: string; 
    password: string;
}

const user = ref<LoginForm>({
  email: '',
  password: '' // Correction: Utiliser 'password' au lieu de 'name'
});

interface FormErrors {
  email?: string;
  password?: string;
}

const errors = ref<FormErrors>({
  email: 'Format email invalide'
});

// Ajout: Fonction de soumission manquante
const submitForm = () => {
  console.log('Formulaire soumis:', user.value);
  // Logique de soumission ici
};
</script>

<style scoped>

.login-form{
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

</style>