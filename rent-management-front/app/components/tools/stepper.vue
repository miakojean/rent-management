<template>
  <ul class="steps">
    <li 
      v-for="step in steps" 
      class="step"
      :class="{ 'step-teal': step.isActive }"
    >
      {{ step.name }}
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    steps: {
      type: Array,
      required: true // ou default: () => [] si vous voulez un fallback vide
    }
  }
}
</script>

<style scoped>
/* Définir la couleur pour le cercle et la ligne */
.step.step-teal::before {
  background-color: var(--primary-color); /* ou la valeur hex de teal-800 */
  border-color: var(--primary-color);
}

/* Pour l'étape active / complétée, tu peux aussi modifier la ligne */
.step.step-teal::after {
  background-color: var(--primary-color);
}

.step1{
    color: #f3f3f3;
}
</style>