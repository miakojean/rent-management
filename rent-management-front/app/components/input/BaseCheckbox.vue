<template>
  <label class="checkbox-container" :class="{ disabled }">
    <input
      type="checkbox"
      v-bind="$attrs"
      :checked="modelValue"
      :disabled="disabled"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span v-if="label || $slots.default" class="checkbox-label">
      <!-- Affiche le contenu du slot s'il existe, sinon la prop label -->
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script>
export default {
  name: 'BaseCheckbox',
  inheritAttrs: false, // évite que les attributs se fixent sur le label
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue']
}
</script>

<style scoped>
.checkbox-container {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-container.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* La couleur de la case cochée utilise la variable CSS */
input[type="checkbox"] {
  accent-color: var(--primary-color);
  width: 1.2em;
  height: 1.2em;
  margin-right: 0.5em;
}

.checkbox-label {
  font-size: 1em;
}
</style>