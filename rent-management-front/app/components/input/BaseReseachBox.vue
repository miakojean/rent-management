<template>
  <div class="search-container" :class="{ 'is-focused': isFocused, 'has-value': !!modelValue }">
    <div class="search-wrapper">
      <span class="search-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </span>

      <input
        type="text"
        class="search-input"
        :value="modelValue"
        :placeholder="placeholder"
        @input="handleInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
        v-bind="$attrs"
      />

      <button 
        v-if="modelValue" 
        type="button" 
        class="clear-button" 
        @click="clearSearch"
        aria-label="Effacer la recherche"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  modelValue: string | number;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Rechercher...',
});

const emit = defineEmits(['update:modelValue', 'search', 'clear']);

const isFocused = ref(false);

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  emit('update:modelValue', value);
  emit('search', value); // Optionnel : pour déclencher une recherche immédiate
};

const clearSearch = () => {
  emit('update:modelValue', '');
  emit('clear');
};
</script>

<style scoped>
.search-container {
  --search-bg: white;
  --search-border: #e5e7eb;
  --search-focus: var(--primary-color, #3b82f6);
  --icon-color: #9ca3af;
  
  width: 100%;
  max-width: 400px; /* Ajustable selon tes besoins */
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.search-icon {
  position: absolute;
  left: 12px;
  width: 20px;
  height: 20px;
  color: var(--icon-color);
  pointer-events: none;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 10px 40px 10px 42px; /* Espacement pour icône et bouton clear */
  font-size: 0.95rem;
  background-color: var(--search-bg);
  border: 1px solid var(--search-border);
  border-radius: 10px;
  color: #1f2937;
  outline: none;
  transition: all 0.2s ease;
}

/* Effet de Focus */
.is-focused .search-input {
  background-color: #ffffff;
  border-color: var(--search-focus);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.is-focused .search-icon {
  color: var(--search-focus);
}

/* Bouton Clear */
.clear-button {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--icon-color);
  display: flex;
  align-items: center;
  border-radius: 50%;
}

.clear-button:hover {
  background-color: #e5e7eb;
  color: #4b5563;
}

.clear-button svg {
  width: 16px;
  height: 16px;
}
</style>