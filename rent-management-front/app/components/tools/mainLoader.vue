<template>
  <div class="main-loader" role="status" aria-live="polite">
    <div class="loader-content">
      <!-- Spinner animé -->
      <div class="spinner" :style="spinnerStyle"></div>
      
      <!-- Texte de chargement (nom) -->
      <p class="loader-name" :style="textStyle">{{ name }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mainLoader',
  
  props: {
    /**
     * Texte affiché sous le spinner (le "nom")
     */
    name: {
      type: String,
      default: 'Chargement en cours...'
    },
    
    /**
     * Couleur principale du spinner et du texte
     */
    color: {
      type: String,
      default: '#3498db' // Bleu par défaut, remplacez par votre couleur
    }
  },
  
  computed: {
    /**
     * Style dynamique pour la bordure du spinner
     */
    spinnerStyle() {
      return {
        borderTopColor: this.color
      };
    },
    
    /**
     * Style dynamique pour le texte
     */
    textStyle() {
      return {
        color: this.color
      };
    }
  }
};
</script>

<style scoped>
.main-loader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.95);
  z-index: 9999;
  backdrop-filter: blur(2px);
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid var(--primary-color, #3498db);
  animation: spin 1s linear infinite;
}

.loader-name {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 500;
  font-family: inherit;
  letter-spacing: 0.5px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Option : désactiver le flou d'arrière-plan si non souhaité */
@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation-duration: 1.5s;
  }
}
</style>