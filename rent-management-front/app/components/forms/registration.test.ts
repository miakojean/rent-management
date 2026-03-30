import { describe, it, expect, vi, beforeEach, nextTick } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import registrationForm from './registrationForm.vue'

// ─── Mocks composants enfants ─────────────────────────────
vi.mock('../input/BaseInput.vue', () => ({
    default: {
        name: 'BaseInput',
        template: `<div>
            <label>{{ label }}</label>
            <input :id="id" :type="type" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
            <span v-if="errorMessage" class="error">{{ errorMessage }}</span>
        </div>`,
        props: ['id', 'label', 'type', 'placeholder', 'modelValue', 'errorMessage'],
        emits: ['update:modelValue'],
    }
}))

vi.mock('../input/BaseCheckbox.vue', () => ({
    default: {
        name: 'BaseCheckbox',
        template: `<input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />`,
        props: ['label', 'modelValue'],
        emits: ['update:modelValue'],
    }
}))

vi.mock('../buttons/mainButton.vue', () => ({
    default: {
        name: 'mainButton',
        template: `<button type="button" @click="$emit('handleClick')">{{ btn_label }}</button>`,
        props: ['btn_label', 'isloading'],
        emits: ['handleClick'],
    }
}))

vi.mock('../buttons/prevButton.vue', () => ({
    default: {
        name: 'prevButton',
        template: `<button type="button" @click="$emit('click')">Retour</button>`,
        emits: ['click'],
    }
}))

vi.mock('../tools/stepper.vue', () => ({
    default: { name: 'stepper', template: '<div />', props: ['steps'] }
}))

vi.mock('./errorMessage.vue', () => ({
    default: { name: 'errorMessage', template: '<div />' }
}))

vi.mock('#imports', async () => {
    const { defineStore } = await import('pinia')
    return {
        useAuthStore: defineStore('auth', {
            state: () => ({ isLoading: false, error: null }),
            actions: { registration: vi.fn() },
        }),
        useRouter: () => ({ push: vi.fn() }),
    }
})

// ─── Helpers ─────────────────────────────────────────────
function createWrapper() {
    return mount(registrationForm, {
        global: {
            plugins: [createTestingPinia({ createSpy: vi.fn })],
        },
    })
}

async function selectAccountType(wrapper: VueWrapper, type: 'PT' | 'ESE') {
    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    const index = type === 'PT' ? 0 : 1
    const checkbox = checkboxes[index]
    // On coche directement l'élément DOM avant de trigger
    ;(checkbox.element as HTMLInputElement).checked = true
    await checkbox.trigger('change')
    await nextTick()
}

async function goNext(wrapper: VueWrapper) {
    const buttons = wrapper.findAll('button')
    const nextBtn = buttons.find(b => b.text() === 'Suivant')
    await nextBtn!.trigger('click')
}

async function fillStep2PT(wrapper: VueWrapper) {
    const inputs = wrapper.findAll('input[type="text"], input[type="password"]')
    // first_name, last_name, username, email, password, confirm
    await inputs[0].setValue('Dupont')
    await inputs[1].setValue('Jean')
    await inputs[2].setValue('jean_dupont')
    await inputs[3].setValue('jean@example.com')
    await inputs[4].setValue('motdepasse123')
    await inputs[5].setValue('motdepasse123')
}

async function fillStep2ESE(wrapper: VueWrapper) {
    const inputs = wrapper.findAll('input[type="text"], input[type="password"]')
    // username (nom entreprise), email, password, confirm
    await inputs[0].setValue('MonAgence')
    await inputs[1].setValue('agence@example.com')
    await inputs[2].setValue('motdepasse123')
    await inputs[3].setValue('motdepasse123')
}

async function fillStep3(wrapper: VueWrapper) {
    const inputs = wrapper.findAll('input[type="text"]')
    const phoneInput = inputs.find((_, i) => i === 0)
    await inputs[0].setValue('+2250102030405')
    await inputs[1].setValue('Abidjan')
    await inputs[2].setValue('Côte d\'Ivoire')
    await inputs[3].setValue('Rue des Jardins')
}

// ═════════════════════════════════════════════════════════
//  SUITE DE TESTS
// ═════════════════════════════════════════════════════════

describe('registrationForm', () => {

    // ─── Navigation entre étapes ─────────────────────────

    describe('Navigation', () => {
        it('affiche l\'étape 1 au montage', () => {
            const wrapper = createWrapper()
            expect(wrapper.text()).toContain('Je m\'enregistre en tant que')
        })

        it('bloque le passage à l\'étape 2 si aucun type sélectionné', async () => {
            const wrapper = createWrapper()
            await goNext(wrapper)
            expect(wrapper.text()).toContain('Veuillez sélectionner un type de compte.')
        })

        it('passe à l\'étape 2 après sélection du type', async () => {
            const wrapper = createWrapper()
            await selectAccountType(wrapper, 'PT')
            await goNext(wrapper)
            expect(wrapper.find('#firstName').exists()).toBe(true)
        })

        it('revient à l\'étape 1 via le bouton Retour', async () => {
            const wrapper = createWrapper()
            await selectAccountType(wrapper, 'PT')
            await goNext(wrapper)
            const retourBtn = wrapper.find('button')
            await retourBtn.trigger('click')
            expect(wrapper.text()).toContain('Je m\'enregistre en tant que')
        })

        it('passe à l\'étape 3 après une étape 2 valide (PT)', async () => {
            const wrapper = createWrapper()
            await selectAccountType(wrapper, 'PT')
            await goNext(wrapper)
            await fillStep2PT(wrapper)
            await goNext(wrapper)
            expect(wrapper.find('#phone').exists()).toBe(true)
        })
    })

    // ─── Validation des champs ───────────────────────────

    describe('Validation — étape 2 (PT)', () => {
        let wrapper: VueWrapper

        beforeEach(async () => {
            wrapper = createWrapper()
            await selectAccountType(wrapper, 'PT')
            await goNext(wrapper)
        })

        it('affiche une erreur si le nom est vide', async () => {
            await goNext(wrapper)
            expect(wrapper.text()).toContain('Le nom est requis.')
        })

        it('affiche une erreur si le prénom est vide', async () => {
            await goNext(wrapper)
            expect(wrapper.text()).toContain('Le prénom est requis.')
        })

        it('affiche une erreur si le nom d\'utilisateur est vide', async () => {
            await goNext(wrapper)
            expect(wrapper.text()).toContain('Le nom d\'utilisateur est requis.')
        })

        it('affiche une erreur si le nom d\'utilisateur est trop court', async () => {
            await wrapper.find('#username').setValue('ab')
            await goNext(wrapper)
            expect(wrapper.text()).toContain('Minimum 3 caractères.')
        })

        it('affiche une erreur si l\'email est invalide', async () => {
            await wrapper.find('#username').setValue('valide')
            await wrapper.find('#email').setValue('pasunemail')
            await goNext(wrapper)
            expect(wrapper.text()).toContain('Adresse email invalide.')
        })

        it('affiche une erreur si le mot de passe est trop court', async () => {
            await wrapper.find('#password').setValue('court')
            await goNext(wrapper)
            expect(wrapper.text()).toContain('Minimum 8 caractères.')
        })

        it('affiche une erreur si les mots de passe ne correspondent pas', async () => {
            await wrapper.find('#password').setValue('motdepasse123')
            await wrapper.find('#confirmPassword').setValue('autrechose')
            await goNext(wrapper)
            expect(wrapper.text()).toContain('Les mots de passe ne correspondent pas.')
        })
    })

    describe('Validation — étape 3', () => {
        let wrapper: VueWrapper

        beforeEach(async () => {
            wrapper = createWrapper()
            await selectAccountType(wrapper, 'PT')
            await goNext(wrapper)
            await fillStep2PT(wrapper)
            await goNext(wrapper)
        })

        it('affiche une erreur si le téléphone est vide', async () => {
            const submitBtn = wrapper.findAll('button').find(b => b.text() === 'Soumettre')
            await submitBtn!.trigger('click')
            expect(wrapper.text()).toContain('Le numéro de téléphone est requis.')
        })

        it('affiche une erreur si le téléphone est invalide', async () => {
            await wrapper.find('#phone').setValue('abc')
            const submitBtn = wrapper.findAll('button').find(b => b.text() === 'Soumettre')
            await submitBtn!.trigger('click')
            expect(wrapper.text()).toContain('Numéro de téléphone invalide.')
        })

        it('affiche une erreur si la ville est vide', async () => {
            const submitBtn = wrapper.findAll('button').find(b => b.text() === 'Soumettre')
            await submitBtn!.trigger('click')
            expect(wrapper.text()).toContain('La ville est requise.')
        })
    })

    // ─── Différence PT / ESE ─────────────────────────────

    describe('Différence PT / ESE', () => {
        it('affiche les champs Nom et Prénoms pour un propriétaire (PT)', async () => {
            const wrapper = createWrapper()
            await selectAccountType(wrapper, 'PT')
            await goNext(wrapper)
            expect(wrapper.find('#firstName').exists()).toBe(true)
            expect(wrapper.find('#lastName').exists()).toBe(true)
        })

        it('masque les champs Nom et Prénoms pour une entreprise (ESE)', async () => {
            const wrapper = createWrapper()
            await selectAccountType(wrapper, 'ESE')
            await goNext(wrapper)
            expect(wrapper.find('#firstName').exists()).toBe(false)
            expect(wrapper.find('#lastName').exists()).toBe(false)
        })

        it('affiche le label "Nom de l\'entreprise" pour ESE', async () => {
            const wrapper = createWrapper()
            await selectAccountType(wrapper, 'ESE')
            await goNext(wrapper)
            expect(wrapper.text()).toContain('Nom de l\'entreprise')
        })

        it('affiche le label "Nom d\'utilisateur" pour PT', async () => {
            const wrapper = createWrapper()
            await selectAccountType(wrapper, 'PT')
            await goNext(wrapper)
            expect(wrapper.text()).toContain('Nom d\'utilisateur')
        })

        it('affiche une erreur "Nom de l\'entreprise requis" pour ESE', async () => {
            const wrapper = createWrapper()
            await selectAccountType(wrapper, 'ESE')
            await goNext(wrapper)
            await goNext(wrapper)
            expect(wrapper.text()).toContain('Le nom de l\'entreprise est requis.')
        })

        it('vide first_name et last_name lors du passage à ESE', async () => {
            const wrapper = createWrapper()
            await selectAccountType(wrapper, 'PT')
            await goNext(wrapper)
            await wrapper.find('#firstName').setValue('Jean')
            await wrapper.find('#lastName').setValue('Dupont')

            // Retour à l'étape 1 et bascule vers ESE
            await wrapper.find('button').trigger('click')
            await selectAccountType(wrapper, 'ESE')
            await goNext(wrapper)

            // Les champs sont absents → les valeurs ont été vidées
            expect(wrapper.find('#firstName').exists()).toBe(false)
            expect(wrapper.find('#lastName').exists()).toBe(false)
        })

        it('ne valide pas nom/prénom pour ESE et passe à l\'étape 3', async () => {
            const wrapper = createWrapper()
            await selectAccountType(wrapper, 'ESE')
            await goNext(wrapper)
            await fillStep2ESE(wrapper)
            await goNext(wrapper)
            expect(wrapper.find('#phone').exists()).toBe(true)
        })
    })

    // ─── Soumission du formulaire ────────────────────────

    describe('Soumission', () => {
        it('appelle authStore.registration avec le bon payload (PT)', async () => {
            const wrapper = createWrapper()
            const authStore = (wrapper.vm as any).authStore ?? (await import('#imports')).useAuthStore()

            await selectAccountType(wrapper, 'PT')
            await goNext(wrapper)
            await fillStep2PT(wrapper)
            await goNext(wrapper)
            await fillStep3(wrapper)

            const submitBtn = wrapper.findAll('button').find(b => b.text() === 'Soumettre')
            await submitBtn!.trigger('click')

            expect(authStore.registration).toHaveBeenCalledWith(
                expect.objectContaining({
                    username:       'jean_dupont',
                    first_name:     'Dupont',
                    last_name:      'Jean',
                    title_category: 'PT',
                })
            )
        })

        it('appelle authStore.registration avec le bon payload (ESE)', async () => {
            const wrapper = createWrapper()
            const authStore = (wrapper.vm as any).authStore ?? (await import('#imports')).useAuthStore()

            await selectAccountType(wrapper, 'ESE')
            await goNext(wrapper)
            await fillStep2ESE(wrapper)
            await goNext(wrapper)
            await fillStep3(wrapper)

            const submitBtn = wrapper.findAll('button').find(b => b.text() === 'Soumettre')
            await submitBtn!.trigger('click')

            expect(authStore.registration).toHaveBeenCalledWith(
                expect.objectContaining({
                    username:       'MonAgence',
                    first_name:     '',
                    last_name:      '',
                    title_category: 'ESE',
                })
            )
        })

        it('affiche l\'écran de succès après soumission réussie', async () => {
            const wrapper = createWrapper()

            await selectAccountType(wrapper, 'PT')
            await goNext(wrapper)
            await fillStep2PT(wrapper)
            await goNext(wrapper)
            await fillStep3(wrapper)

            const submitBtn = wrapper.findAll('button').find(b => b.text() === 'Soumettre')
            await submitBtn!.trigger('click')
            await wrapper.vm.$nextTick()

            expect(wrapper.text()).toContain('Compte créé avec succès !')
        })

        it('affiche le nom d\'entreprise dans l\'écran de succès pour ESE', async () => {
            const wrapper = createWrapper()

            await selectAccountType(wrapper, 'ESE')
            await goNext(wrapper)
            await fillStep2ESE(wrapper)
            await goNext(wrapper)
            await fillStep3(wrapper)

            const submitBtn = wrapper.findAll('button').find(b => b.text() === 'Soumettre')
            await submitBtn!.trigger('click')
            await wrapper.vm.$nextTick()

            expect(wrapper.text()).toContain('MonAgence')
        })
    })
})