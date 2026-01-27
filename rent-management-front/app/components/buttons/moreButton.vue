<template>
    <button 
        :disabled="isloading || disabled" 
        @click="handleClick"
        :class="{ 'loading': isloading }"
        class="main-button"
    >
        <span v-if="isloading" class="loading-spinner"></span>
        {{ btn_label }}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>

    </button>
</template>

<script lang="ts">
export default {
    name: "moreButton",

    props: {
        btn_label: {
            type: String,
            default: "clients"
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
    background-color: var(--primary-color);
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 1.5rem;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
}

.main-button:hover:not(:disabled) {
    background-color: var(--primary-color-dark);
    transform: translateY(-1px);
}

.main-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    opacity: 0.7;
}

.main-button.loading {
    background-color: var(--primary-color-light);
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