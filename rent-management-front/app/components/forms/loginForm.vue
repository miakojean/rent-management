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
            :error-message="errors.email"
            :required=true
        />
        <BaseInput 
            id="password"
            v-model="user.password"
            label="Mot de passe"
            placeholder="votre mot de passe"
            :error-message="errors.password"
            :required="true"
            type="password"
        />
        <div class="remember-content flex items-center gap-4">
            <p>
                Se souvenir de moi
            </p>
            <BaseCheckbox/>
        </div>
        <error-message v-if="authStore.error"/>
        <mainButton type="submit" btn_label="connexion" :isloading="authStore.isLoading"/>
        <p @click="()=> router.push('/auth/registration')" class="cursor-pointer">
            Pas de compte ? <span>Inscrivez-vous</span>
        </p>
    </form>
</template>

<script lang="ts">
import { ref } from 'vue';
import BaseInput from '../input/BaseInput.vue';
import mainButton from '../buttons/mainButton.vue';
import BaseCheckbox from '../input/BaseCheckbox.vue';
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'vue-router';
import errorMessage from './errorMessage.vue';

interface LoginForm {
    email: string; 
    password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default {
    name: 'LoginForm',
    components: {
        BaseInput,
        mainButton,
        BaseCheckbox,
        errorMessage
    },
    setup() {

        // state
        const authStore = useAuthStore();
        const user = ref<LoginForm>({
            email: '',
            password: ''
        });
        const errors = ref<FormErrors>({});
        const router = useRouter();
        
        // Getters
        const validateForm = (): boolean => {
            errors.value = {};

            if (!user.value.email) {
                errors.value.email = 'L\'adresse email est requise.';
            } else if (!/\S+@\S+\.\S+/.test(user.value.email)) {
                errors.value.email = 'L\'adresse email n\'est pas valide.';
            }

            if (!user.value.password) {
                errors.value.password = 'Le mot de passe est requis.';
            }

            return Object.keys(errors.value).length === 0;
        };

        // Actions
        const submitForm = async () => { // Ajout de async
            if (validateForm()) {
                try {
                    // On attend la réponse du serveur
                    await authStore.login(user.value);
                    
                    // Si on arrive ici, le login a réussi (pas d'exception levée)
                    router.push('/dashboard');
                } catch (err) {
                    // En cas d'erreur (identifiants faux, etc.), le store capture l'erreur
                    // et l'exception est re-jetée, donc on reste sur la page.
                    console.error("Échec de la connexion :", err);
                }
            }
        };

        // lifecycle hooks

        return {
            router,
            user,
            errors,
            submitForm,
            authStore
        };
    }
}
</script>

<style scoped>
 
.login-form{
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.login-form h3 {
    color: var(--primary-color-dark);
    font-size: 1.8rem;
    font-weight: 600;
}

span{
    font-weight: 600;
    color: var(--primary-color);
}

.error{
    color: var(--error-color);
}
</style>