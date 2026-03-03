<template>
    <form 
        @submit.prevent="submitForm"
        class="login-form" 
    >   

        <h3>
            Se connecter
        </h3>
        
        <BaseInput 
            id="email"
            v-model="user.email"
            label="Adresse Email"
            type="email"
            placeholder="jean@example.com"
            :required=true
        />
        <BaseInput 
            id="password"
            v-model="user.password"
            label="Mot de passe"
            placeholder="votre mot de passe"
            :required="true"
            type="password"
        />
        <div class="remember-content flex items-center gap-4">
            <p>
                Se souvenir de moi
            </p>
            <BaseCheckbox/>
        </div>
        <div class="error--message">
            <p class="error">{{ authStore.error }}</p>
        </div>
        <mainButton type="submit" btn_label="connexion"/>
        <p>Pas un compte? <span>Ouvrir un compte</span></p>
    </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseInput from '../input/BaseInput.vue';
import mainButton from '../buttons/mainButton.vue';
import BaseCheckbox from '../input/BaseCheckbox.vue';
import { useAuthStore } from '#imports';

interface LoginForm {
    email: string; 
    password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const authStore = useAuthStore();

const user = ref<LoginForm>({
  email: '',
  password: '' // Correction: Utiliser 'password' au lieu de 'name'
});

const errors = ref<FormErrors>({
  email: 'Format email invalide'
});

// Ajout: Fonction de soumission manquante
const submitForm = async () => {
  try {
    await authStore.login(user.value);
    console.log("Connexion réussie", user.value)
    // Redirection ou message de succès
  } catch (err) {
    // err contient le message d'erreur
    // On peut le parser pour remplir errors.email ou errors.password
  }
};
</script>

<style scoped>

.login-form{
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

span{
    font-weight: 600;
    color: var(--primary-color);
}

.error{
    color: var(--error-color);
}
</style>