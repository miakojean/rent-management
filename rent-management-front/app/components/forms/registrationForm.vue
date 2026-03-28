<template>
    <div class="registration__form">
        <h3>Mettez de l'ordre dans votre gestion</h3>

        <stepper :steps="stepItems" />

        <form @submit.prevent>

            <!-- ═══════════════════════════════════
                 ÉTAPE 1 — Type de compte
            ═══════════════════════════════════ -->
            <div class="step w-full flex flex-col gap-6" v-if="step === 1">
                <h4>Je m'enregistre en tant que</h4>

                <div class="flex flex-col gap-3">
                    <BaseCheckbox
                        label="Propriétaire"
                        :modelValue="user.type === 'propriétaire'"
                        @update:modelValue="selectType('propriétaire')"
                    />
                    <BaseCheckbox
                        label="Agence immobilière"
                        :modelValue="user.type === 'agence'"
                        @update:modelValue="selectType('agence')"
                    />
                    <p v-if="errors.type" class="error">{{ errors.type }}</p>
                </div>

                <mainButton
                    type="button"
                    btn_label="Suivant"
                    @handleClick="goToStep(2)"
                />

                <p class="mention">
                    En poursuivant vous acceptez
                    <span>les conditions d'utilisation</span> de votre inscription.
                </p>
            </div>

            <!-- ═══════════════════════════════════
                 ÉTAPE 2 — Informations personnelles
            ═══════════════════════════════════ -->
            <div class="step w-full grid grid-cols-2 gap-4" v-if="step === 2">

                <div class="input-group">
                    <BaseInput
                        id="firstName"
                        v-model="user.firstName"
                        label="Nom"
                        type="text"
                        placeholder="Entrez votre nom"
                        :errorMessage="errors.firstName"
                    />
                </div>

                <div class="input-group">
                    <BaseInput
                        id="lastName"
                        v-model="user.lastName"
                        label="Prénoms"
                        type="text"
                        placeholder="Entrez votre prénom"
                        :errorMessage="errors.firstName"
                    />
                </div>

                <div class="input-group">
                    <BaseInput
                        id="username"
                        v-model="user.username"
                        label="Nom d'utilisateur"
                        type="text"
                        placeholder="Entrez un nom d'utilisateur"
                        :errorMessage="errors.username"
                    />
                </div>

                <div class="input-group">
                    <BaseInput
                        id="email"
                        v-model="user.email"
                        label="Email"
                        type="text"
                        placeholder="Entrez votre email"
                        :errorMessage="errors.email"
                    />
                </div>

                <div class="input-group">
                    <BaseInput
                        id="password"
                        v-model="user.password"
                        label="Mot de passe"
                        type="password"
                        placeholder="Entrez votre mot de passe"
                        :errorMessage="errors.password"
                    />
                </div>

                <div class="input-group">
                    <BaseInput
                        id="confirmPassword"
                        v-model="user.passwordConfirmation"
                        label="Confirmer le mot de passe"
                        type="password"
                        placeholder="Confirmez le mot de passe"
                    />
                    <p v-if="errors.passwordConfirmation" class="error">{{ errors.passwordConfirmation }}</p>
                </div>

                <prevButton @click="goToStep(1)" />
                <mainButton
                    type="button"
                    btn_label="Suivant"
                    @handleClick="goToStep(3)"
                />
            </div>

            <!-- ═══════════════════════════════════
                 ÉTAPE 3 — Coordonnées
            ═══════════════════════════════════ -->
            <div class="step w-full grid grid-cols-2 gap-4" v-if="step === 3">

                <div class="input-group">
                    <BaseInput
                        id="phone"
                        v-model="user.phone"
                        label="Numéro de téléphone"
                        type="text"
                        placeholder="Entrez votre numéro de téléphone"
                        :errorMessage="errors.phone"
                    />
                </div>

                <div class="input-group">
                    <BaseInput
                        id="city"
                        v-model="user.city"
                        label="Ville"
                        type="text"
                        placeholder="Entrez votre ville"
                        :errorMessage="errors.city"
                    />
                </div>

                <div class="input-group">
                    <BaseInput
                        id="country"
                        v-model="user.country"
                        label="Pays"
                        type="text"
                        placeholder="Entrez votre pays"
                        :errorMessage="errors.country"
                    />
                </div>

                <div class="input-group">
                    <BaseInput
                        id="address"
                        v-model="user.address"
                        label="Adresse"
                        type="text"
                        placeholder="Entrez votre adresse"
                    />
                    <p v-if="errors.address" class="error">{{ errors.address }}</p>
                </div>

                <prevButton @click="goToStep(2)" />
                <mainButton
                    type="button"
                    btn_label="Soumettre"
                    @handleClick="submitForm"
                />
            </div>

            <error-message v-if="authStore.error"/>

        </form>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, reactive } from 'vue';
import BaseInput from '../input/BaseInput.vue';
import BaseCheckbox from '../input/BaseCheckbox.vue';
import { useAuthStore } from '#imports';
import mainButton from '../buttons/mainButton.vue';
import stepper from '../tools/stepper.vue';
import prevButton from '../buttons/prevButton.vue';
import errorMessage from './errorMessage.vue';

// ─── Interface ───────────────────────────────────────────
interface RegistrationForm {
    firstName: string
    lastName: string
    username: string
    email: string
    title_category: string
    password: string
    passwordConfirmation: string
    phone_number: string
    address: string
    city: string
    country: string
    isActive: boolean
}

// ─── State ───────────────────────────────────────────────
const user = ref<RegistrationForm>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    title_category: "",
    password: "",
    passwordConfirmation: "",
    phone_number: "",
    address: "",
    city: "",
    country: "",
    isActive: true
})

const errors = reactive<Partial<Record<keyof RegistrationForm, string>>>({})

const step = ref(1)

const authStore = useAuthStore()

// ─── Stepper ─────────────────────────────────────────────
const stepItems = computed(() => [
    { id: 1, name: 'Type de compte',           isActive: step.value === 1 },
    { id: 2, name: 'Informations personnelles', isActive: step.value === 2 },
    { id: 3, name: 'Coordonnées',               isActive: step.value === 3 },
])

// ─── Validation ──────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[+\d][\d\s\-().]{7,19}$/

function validateStep1(): boolean {
    errors.title_category = undefined
    if (!user.value.title_category) {
        errors.title_category = "Veuillez sélectionner un type de compte."
        return false
    }
    return true
}

function validateStep2(): boolean {
    let valid = true

    errors.firstName           = undefined
    errors.lastName            = undefined
    errors.username            = undefined
    errors.email               = undefined
    errors.password            = undefined
    errors.passwordConfirmation = undefined

    if (!user.value.firstName.trim()) {
        errors.firstName = "Le nom est requis."
        valid = false
    }

    if (!user.value.lastName.trim()) {
        errors.lastName = "Le prénom est requis."
        valid = false
    }

    if (!user.value.username.trim()) {
        errors.username = "Le nom d'utilisateur est requis."
        valid = false
    } else if (user.value.username.length < 3) {
        errors.username = "Minimum 3 caractères."
        valid = false
    }

    if (!user.value.email.trim()) {
        errors.email = "L'email est requis."
        valid = false
    } else if (!EMAIL_RE.test(user.value.email)) {
        errors.email = "Adresse email invalide."
        valid = false
    }

    if (!user.value.password) {
        errors.password = "Le mot de passe est requis."
        valid = false
    } else if (user.value.password.length < 8) {
        errors.password = "Minimum 8 caractères."
        valid = false
    }

    if (!user.value.passwordConfirmation) {
        errors.passwordConfirmation = "Veuillez confirmer le mot de passe."
        valid = false
    } else if (user.value.password !== user.value.passwordConfirmation) {
        errors.passwordConfirmation = "Les mots de passe ne correspondent pas."
        valid = false
    }

    return valid
}

function validateStep3(): boolean {
    let valid = true

    errors.phone_number   = undefined
    errors.city    = undefined
    errors.country = undefined
    errors.address = undefined

    if (!user.value.phone_number.trim()) {
        errors.phone_number = "Le numéro de téléphone est requis."
        valid = false
    } else if (!PHONE_RE.test(user.value.phone_number)) {
        errors.phone_number = "Numéro de téléphone invalide."
        valid = false
    }

    if (!user.value.city.trim()) {
        errors.city = "La ville est requise."
        valid = false
    }

    if (!user.value.country.trim()) {
        errors.country = "Le pays est requis."
        valid = false
    }

    if (!user.value.address.trim()) {
        errors.address = "L'adresse est requise."
        valid = false
    }

    return valid
}

// ─── Navigation ──────────────────────────────────────────
const validators: Record<number, () => boolean> = {
    1: validateStep1,
    2: validateStep2,
    3: validateStep3,
}

function goToStep(target: number) {
    // En avant : valider l'étape courante. En arrière : navigation libre.
    if (target > step.value) {
        const isValid = validators[step.value]?.() ?? true
        if (!isValid) return
    }
    step.value = target
}

// ─── Soumission ──────────────────────────────────────────
async function submitForm() {
    if (!validateStep3()) return
    try {
        await authStore.registration(user.value)
    } catch (e) {
        console.error("Erreur lors de l'inscription :", e)
    }
}

// ─── Sélection type ──────────────────────────────────────
function selectType(selectedType: string) {
    user.value.title_category = user.value.title_category === selectedType ? "" : selectedType
}
</script>

<style scoped>
.registration__form {
    width: 100%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.registration__form h3 {
    color: var(--primary-color-dark);
    font-size: 1.8rem;
    font-weight: 600;
}

.registration__form h4 {
    color: var(--text-color);
    font-size: 1.2rem;
    font-weight: 500;
}

/* Groupe champ + message d'erreur */
.input-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.error {
    font-size: 0.75rem;
    color: var(--error-color);
    margin: 0;
}

.mention {
    font-size: 0.85rem;
    color: var(--text-color);
}

span {
    font-weight: 600;
    color: var(--primary-color);
}
</style>