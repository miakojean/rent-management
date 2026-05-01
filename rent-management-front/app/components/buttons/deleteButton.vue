<template>
    <button 
        :disabled="isloading || disabled" 
        @click="handleClick"
        class="main-button"
    >
        <span v-if="isloading" class="loading loading-spinner loading-md"></span>
        {{ btn_label }}
    </button>
</template>

<script lang="ts">
export default {
    name: "MainButton",

    props: {
        btn_label: {
            type: String,
            default: "main button"
        },
        isloading: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    emits: ['handleClick'],

    setup(props, { emit }) {
        const handleClick = () => {
            if (!props.isloading && !props.disabled) {
                emit('handleClick');
            }
        };

        return {
            handleClick
        };
    }
}
</script>

<style scoped>
.main-button {
    background-color: var(--variant-error-color);
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 32px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    max-width: 400px;
}

.main-button:hover:not(:disabled) {
    background-color: var(--error-color);
    transform: translateY(-1px);
}

.main-button:disabled {
    background-color: var(--border-color);
    cursor: not-allowed;
    opacity: 0.7;
}

.main-button.loading {
    background-color: var(--primary-color);
}

.loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>