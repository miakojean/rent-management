<template>
  <ul class="steps">
    <li class="step step-teal">Étape 1</li>
    <li class="step">Étape 2</li>
    <li class="step">Étape 3</li>
  </ul>
</template>

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