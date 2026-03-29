<template>
    <div class="registration__form">

        <!-- ═══════════════════════════════════
             ÉCRAN DE SUCCÈS
        ═══════════════════════════════════ -->
        <template v-if="registrationSuccess">
            <div class="success__screen">
                <div class="success__icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="11" stroke="currentColor" stroke-width="1.5"/>
                        <path d="M7 12.5L10.5 16L17 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3 class="success__title">Compte créé avec succès !</h3>
                <p class="success__subtitle">
                    <template v-if="isEntreprise">
                        Bienvenue <span>{{ user.username }}</span>.<br/>
                    </template>
                    <template v-else>
                        Bienvenue <span>{{ user.first_name }} {{ user.last_name }}</span>.<br/>
                    </template>
                    Vous serez redirigé vers la connexion dans <span>{{ countdown }}s</span>.
                </p>
                <mainButton
                    type="button"
                    btn_label="Se connecter maintenant"
                    @handleClick="router.push('/auth/login')"
                />
            </div>
        </template>

        <!-- ═══════════════════════════════════
             FORMULAIRE
        ═══════════════════════════════════ -->
        <template v-else>
            <h3>Mettez de l'ordre dans votre gestion</h3>

            <stepper :steps="stepItems" />

            <form @submit.prevent>

                <!-- ÉTAPE 1 — Type de compte -->
                <div class="step w-full flex flex-col gap-6" v-if="step === 1">
                    <h4>Je m'enregistre en tant que</h4>

                    <div class="flex flex-col gap-3">
                        <BaseCheckbox
                            label="Propriétaire"
                            :modelValue="user.title_category === 'PT'"
                            @update:modelValue="selectType('PT')"
                        />
                        <BaseCheckbox
                            label="Agence immobilière"
                            :modelValue="user.title_category === 'ESE'"
                            @update:modelValue="selectType('ESE')"
                        />
                        <p v-if="errors.title_category" class="error">{{ errors.title_category }}</p>
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

                <!-- ÉTAPE 2 — Informations -->
                <div class="step w-full grid grid-cols-2 gap-4" v-if="step === 2">

                    <!-- Nom — Propriétaire uniquement -->
                    <div class="input-group" v-if="!isEntreprise">
                        <BaseInput
                            id="firstName"
                            v-model="user.first_name"
                            label="Nom"
                            type="text"
                            placeholder="Entrez votre nom"
                            :errorMessage="errors.first_name"
                        />
                    </div>

                    <!-- Prénoms — Propriétaire uniquement -->
                    <div class="input-group" v-if="!isEntreprise">
                        <BaseInput
                            id="lastName"
                            v-model="user.last_name"
                            label="Prénoms"
                            type="text"
                            placeholder="Entrez votre prénom"
                            :errorMessage="errors.last_name"
                        />
                    </div>

                    <!-- Nom d'utilisateur / Nom d'entreprise -->
                    <div class="input-group" :class="{ 'col-span-2': isEntreprise }">
                        <BaseInput
                            id="username"
                            v-model="user.username"
                            :label="usernameLabel"
                            type="text"
                            :placeholder="usernamePlaceholder"
                            :errorMessage="errors.username"
                        />
                    </div>

                    <div class="input-group" :class="{ 'col-span-2': isEntreprise }">
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

                <!-- ÉTAPE 3 — Coordonnées -->
                <div class="step w-full grid grid-cols-2 gap-4" v-if="step === 3">

                    <div class="input-group">
                        <BaseInput
                            id="phone"
                            v-model="user.phone_number"
                            label="Numéro de téléphone"
                            type="text"
                            placeholder="Entrez votre numéro de téléphone"
                            :errorMessage="errors.phone_number"
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
                        :isloading="authStore.isLoading"
                        @handleClick="submitForm"
                    />
                </div>

                <error-message v-if="authStore.error"/>

            </form>
        </template>

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
import type { User } from '#imports';
import { useRouter } from '#imports';

// ─── State ───────────────────────────────────────────────
const user = ref<User>({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    title_category: "",
    password: "",
    passwordConfirmation: "",
    phone_number: "",
    address: "",
    city: "",
    country: "",
})

const router = useRouter()
const errors = reactive<Partial<Record<keyof User, string>>>({})
const step = ref(1)
const authStore = useAuthStore()

// ─── Type de compte ───────────────────────────────────────
const isEntreprise = computed(() => user.value.title_category === 'ESE')

const usernameLabel = computed(() =>
    isEntreprise.value ? "Nom de l'entreprise" : "Nom d'utilisateur"
)

const usernamePlaceholder = computed(() =>
    isEntreprise.value ? "Entrez le nom de votre entreprise" : "Entrez un nom d'utilisateur"
)

// ─── Succès & countdown ──────────────────────────────────
const registrationSuccess = ref(false)
const countdown = ref(5)
let countdownTimer: ReturnType<typeof setInterval> | null = null

function startCountdown() {
    countdownTimer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
            clearInterval(countdownTimer!)
            router.push('/auth/login')
        }
    }, 1000)
}

// ─── Stepper ─────────────────────────────────────────────
const stepItems = computed(() => [
    { id: 1, name: 'Type de compte',            isActive: step.value === 1 },
    { id: 2, name: 'Informations',               isActive: step.value === 2 },
    { id: 3, name: 'Coordonnées',                isActive: step.value === 3 },
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
    errors.first_name           = undefined
    errors.last_name            = undefined
    errors.username             = undefined
    errors.email                = undefined
    errors.password             = undefined
    errors.passwordConfirmation = undefined

    // Nom & prénom uniquement pour les propriétaires
    if (!isEntreprise.value) {
        if (!user.value.first_name.trim()) {
            errors.first_name = "Le nom est requis."
            valid = false
        }
        if (!user.value.last_name.trim()) {
            errors.last_name = "Le prénom est requis."
            valid = false
        }
    }

    if (!user.value.username.trim()) {
        errors.username = isEntreprise.value
            ? "Le nom de l'entreprise est requis."
            : "Le nom d'utilisateur est requis."
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
    errors.phone_number = undefined
    errors.city         = undefined
    errors.country      = undefined
    errors.address      = undefined

    if (!user.value.phone_number.trim()) {
        errors.phone_number = "Le numéro de téléphone est requis."
        valid = false
    } else if (!PHONE_RE.test(user.value.phone_number)) {
        errors.phone_number = "Numéro de téléphone invalide."
        valid = false
    }
    if (!user.value.city?.trim()) {
        errors.city = "La ville est requise."
        valid = false
    }
    if (!user.value.country?.trim()) {
        errors.country = "Le pays est requis."
        valid = false
    }
    if (!user.value.address?.trim()) {
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
        const payload = {
            first_name:     user.value.first_name,
            last_name:      user.value.last_name,
            username:       user.value.username,
            email:          user.value.email,
            title_category: user.value.title_category,
            password:       user.value.password,
            phone_number:   user.value.phone_number,
            address:        user.value.address,
            city:           user.value.city,
            country:        user.value.country,
        }
        await authStore.registration(payload)

        registrationSuccess.value = true
        startCountdown()

    } catch (e) {
        console.error("Erreur lors de l'inscription :", e)
    }
}

// ─── Sélection type ──────────────────────────────────────
function selectType(selectedType: string) {
    user.value.title_category = user.value.title_category === selectedType ? "" : selectedType

    // Nettoyer nom/prénom si passage en mode entreprise
    if (user.value.title_category === 'ESE') {
        user.value.first_name = ""
        user.value.last_name  = ""
    }
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

/* ── Écran de succès ── */
.success__screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    padding: 2.5rem 1.5rem;
    text-align: center;
    animation: fadeInUp 0.4s ease both;
}

@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
}

.success__icon {
    width: 72px;
    height: 72px;
    color: var(--primary-color);
    animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes popIn {
    from { opacity: 0; transform: scale(0.4); }
    to   { opacity: 1; transform: scale(1); }
}

.success__title {
    color: var(--primary-color-dark);
    font-size: 1.6rem;
    font-weight: 700;
    margin: 0;
}

.success__subtitle {
    color: var(--text-color);
    font-size: 0.95rem;
    line-height: 1.7;
    margin: 0;
}

/* ── Groupes champs ── */
.input-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.col-span-2 {
    grid-column: span 2;
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