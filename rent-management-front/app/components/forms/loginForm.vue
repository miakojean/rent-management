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
            <p class="error">{{ errors.email || errors.password }}</p>
        </div>
        <mainButton type="submit" btn_label="connexion" :isloading="authStore.isLoading"/>
        <p @click="router.push('/registration')" class="cursor-pointer">
            Pas de compte ? <span>Inscrivez-vous</span>
        </p>
    </form>
</template>

<script lang="ts">
import { ref } from 'vue';
import BaseInput from '../input/BaseInput.vue';
import mainButton from '../buttons/mainButton.vue';
import BaseCheckbox from '../input/BaseCheckbox.vue';
import { useAuthStore } from '#imports';
import { authMiddleware } from '~/middleware/auth';
import { useRoute, useRouter } from 'vue-router';

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
        BaseCheckbox
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
        const submitForm = () => {
            if (validateForm()) {
                authStore.login(user.value);
                router.push('/'); // Redirige vers le dashboard après une connexion réussie
            }
        };

        // lifecycle hooks

        return {
            user,
            errors,
            router,
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

span{
    font-weight: 600;
    color: var(--primary-color);
}

.error{
    color: var(--error-color);
}
</style>