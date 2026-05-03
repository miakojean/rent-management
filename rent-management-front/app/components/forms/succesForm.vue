<template>
  <div class="success__screen">
    <div class="success__icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="11" stroke="currentColor" stroke-width="1.5"/>
            <path d="M7 12.5L10.5 16L17 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </div>
    <h3 class="success__title">{{ message }}</h3>
    <p class="success__subtitle">
        Vous serez redirigé dans <span>{{ countdown }}s</span>.
    </p>
    <mainButton
        type="button"
        btn_label="Retour à l'accueil"
        @handleClick="router.push('/')"
    />
  </div>
</template>

<script lang="ts">
import { useRouter } from '#app';
import { ref, onMounted, onUnmounted } from 'vue';

export default {
    props: {
        message: {
            type: String,
            default: 'Action effectuée avec succès !'
        }
    },
    setup() {
        const router = useRouter();
        const countdown = ref(3);
        let countdownTimer: any = null;

        onMounted(() => {
            // CRUCIAL : Lancer le décompte dès que le composant apparaît
            countdownTimer = setInterval(() => {
                countdown.value--;
                if (countdown.value <= 0) {
                    clearInterval(countdownTimer);
                    router.push('/'); // Redirection automatique
                }
            }, 1000);
        });

        onUnmounted(() => {
            // Nettoyage pour éviter les fuites de mémoire
            if (countdownTimer) clearInterval(countdownTimer);
        });

        return {
            router,
            countdown
        }
    }
}
</script>

<style scoped>
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
</style>