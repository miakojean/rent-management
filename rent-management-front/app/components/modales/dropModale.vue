<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">{{ title }}</h2>
          <button class="close-button" @click="handleClose" :disabled="isLoading">
            <!-- Icône de fermeture statique -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="close-icon">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <!-- SLOT POUR L'ICÔNE -->
          <div class="icon-wrapper">
            <slot name="icon">
              <!-- Icône par défaut si rien n'est fourni -->
              <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10">
                <path d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </slot>
          </div>

          <!-- SLOT POUR LE MESSAGE -->
          <div class="confirmation-content">
            <slot>
              <p class="confirmation-message">Êtes-vous sûr de vouloir continuer ?</p>
            </slot>
          </div>

          <div v-if="itemName" class="item-details">
            <span class="item-label">Élément :</span>
            <strong class="item-name">{{ itemName }}</strong>
          </div>
        </div>

        <div class="modal-actions">
          <deleteButton 
            :btn_label="confirmLabel"
            :isloading="isLoading"
            @click="$emit('confirm')"
          />
          <button class="btn btn-secondary" @click="handleClose" :disabled="isLoading">
            Annuler
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue'
import deleteButton from '../buttons/deleteButton.vue'

export default defineComponent({
  name: 'ActionModal',
  components: { deleteButton },
  props: {
    isOpen: Boolean,
    isLoading: Boolean,
    title: String,
    confirmLabel: String,
    selectedItem: Object as PropType<any>
  },
  emits: ['close', 'confirm'],
  setup(props, { emit }) {
    const itemName = computed(() => {
      if (!props.selectedItem) return ''
      return props.selectedItem.title || props.selectedItem.description || 'cet élément'
    })
    const handleClose = () => { if (!props.isLoading) emit('close') }
    return { itemName, handleClose }
  }
})
</script>

<style scoped>
/* Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

/* Conteneur de la modale */
.modal-container {
  background-color: #ffffff;
  border-radius: 1.25rem;
  width: 100%;
  max-width: 28rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

/* En-tête */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.close-button {
  background: transparent;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: #6b7280;
  border-radius: 9999px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover:not(:disabled) {
  background-color: #f3f4f6;
  color: #111827;
}

.close-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.close-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Corps */
.modal-body {
  padding: 1.5rem;
  text-align: center;
}

.icon-wrapper {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.danger-icon {
  width: 3rem;
  height: 3rem;
  color: #dc2626;
  stroke-width: 1.5;
}

.confirmation-message {
  font-size: 1.125rem;
  font-weight: 500;
  color: #111827;
  margin-bottom: 0.75rem;
}

.item-details {
  background-color: #f9fafb;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  margin: 1rem 0;
  font-size: 0.875rem;
}

.item-label {
  color: #6b7280;
  margin-right: 0.5rem;
}

.item-name {
  color: #111827;
  word-break: break-word;
}

.warning-message {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.75rem;
}

/* Actions */
.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem 1.5rem 1.5rem;
}

.btn {
  flex: 1;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.btn-danger {
  background-color: #dc2626;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #b91c1c;
}

/* Spinner de chargement */
.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* Animations */
@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Transition Vue */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container {
  transform: scale(0.95);
}

.modal-leave-to .modal-container {
  transform: scale(0.95);
}

/* Mode sombre */
@media (prefers-color-scheme: dark) {
  .modal-container {
    background-color: #1f2937;
  }

  .modal-title {
    color: #f9fafb;
  }

  .modal-header {
    border-bottom-color: #374151;
  }

  .close-button {
    color: #9ca3af;
  }

  .close-button:hover:not(:disabled) {
    background-color: #374151;
    color: #f9fafb;
  }

  .confirmation-message {
    color: #f9fafb;
  }

  .item-details {
    background-color: #111827;
  }

  .item-label {
    color: #9ca3af;
  }

  .item-name {
    color: #f9fafb;
  }

  .warning-message {
    color: #9ca3af;
  }

  .modal-actions {
    background-color: #111827;
    border-top-color: #374151;
  }

  .btn-secondary {
    background-color: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }

  .btn-secondary:hover:not(:disabled) {
    background-color: #4b5563;
  }
}

/* Responsive */
@media (max-width: 640px) {
  .modal-container {
    max-width: 90%;
    border-radius: 1rem;
  }

  .modal-header,
  .modal-body,
  .modal-actions {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .confirmation-message {
    font-size: 1rem;
  }
}
</style>