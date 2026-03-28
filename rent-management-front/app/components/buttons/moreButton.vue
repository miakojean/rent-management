<template>
  <div class="more__btn" ref="containerRef">
    <button
      :disabled="isloading || disabled"
      @click="toggleDropdown"
      :class="{ loading: isloading }"
      class="main-button"
      :aria-expanded="isOpen"
      aria-haspopup="true"
      type="button"
    >
      <span v-if="isloading" class="loading-spinner"></span>
      {{ btn_label }}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
        :class="{ 'rotate-chevron': isOpen }"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    </button>

    <Transition name="menu">
      <div v-if="isOpen" class="dropdown-menu" role="menu" ref="menuRef">
        <ul class="menu-grid">
          <li
            v-for="item in menuItems"
            :key="item.label"
            role="menuitem"
            class="menu-item"
            @click="handleItemClick(item)"
          >
            <div class="item-icon" v-html="item.icon"></div>
            <span class="item-label">{{ item.label }}</span>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from '#app';

export default {
  name: 'moreButton',

  props: {
    btn_label: {
      type: String,
      default: 'Nouveau',
    },
    isloading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['handleClick', 'selectItem'],

  setup(props, { emit }) {
    const router = useRouter();

    const isOpen = ref(false);
    const containerRef = ref<HTMLElement | null>(null);
    const menuRef = ref<HTMLElement | null>(null);

    // Liste des éléments du menu (avec icônes SVG)
    const menuItems = [
      {
        label: 'Propriété',
        url:'/dashboard/createproperty',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" /></svg>`,
      },
      {
        label: 'Appartement',
        url:'/dashboard/createproperty',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" /></svg>`,
      },
      {
        label: 'Locataire',
        url:'/dashboard/createproperty',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>`,
      },
      {
        label: 'Finance',
        url:'/dashboard/createproperty',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>`,
      },
    ];

    const toggleDropdown = () => {
      if (props.disabled || props.isloading) return;
      isOpen.value = !isOpen.value;
      emit('handleClick');
    };

    const closeDropdown = () => {
      if (isOpen.value) {
        isOpen.value = false;
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.value &&
        !containerRef.value.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen.value) {
        closeDropdown();
        // Focus retour sur le bouton
        containerRef.value?.querySelector('button')?.focus();
      }
    };

    const handleItemClick = (item: any) => {
      emit('selectItem', item);
      router.push(`${item.url}`)
      closeDropdown();
    };

    // Positionnement intelligent : ajuste la position du menu si nécessaire
    const adjustMenuPosition = () => {
      if (!menuRef.value) return;
      const rect = menuRef.value.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      if (rect.bottom > viewportHeight) {
        // Menu dépasse en bas -> le positionner au-dessus
        menuRef.value.style.top = 'auto';
        menuRef.value.style.bottom = '100%';
        menuRef.value.style.marginBottom = '0.5rem';
      } else {
        menuRef.value.style.top = 'calc(100% + 0.5rem)';
        menuRef.value.style.bottom = 'auto';
        menuRef.value.style.marginBottom = '0';
      }
      if (rect.right > viewportWidth) {
        menuRef.value.style.right = '0';
        menuRef.value.style.left = 'auto';
      } else {
        menuRef.value.style.right = '0';
        menuRef.value.style.left = 'auto';
      }
    };

    // Observe les changements de taille de la fenêtre pour repositionner
    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleKeydown);
      window.addEventListener('resize', adjustMenuPosition);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('resize', adjustMenuPosition);
    });

    return {
      isOpen,
      toggleDropdown,
      containerRef,
      menuRef,
      menuItems,
      handleItemClick,
    };
  },
};
</script>

<style scoped>
.more__btn {
  position: relative;
}

.main-button {
  position: relative;
  background: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 2rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.main-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  background: var(--primary-color)
}

.main-button:active:not(:disabled) {
  transform: translateY(1px);
}

.main-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.7;
  transform: none;
  box-shadow: none;
}

.main-button.loading {
  background: var(--primary-color-light, #a5b4fc);
  cursor: wait;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.rotate-chevron {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

/* Dropdown menu - style glassmorphique */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 320px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 1.25rem;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.02);
  z-index: 1000;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
}

/* Animation du menu */
.menu-enter-active,
.menu-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top right;
}

.menu-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}

.menu-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-5px);
}

/* Grille des items */
.menu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.25rem;
  padding: 0.75rem;
  list-style: none;
  margin: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  color: #1f2937;
  background: transparent;
}

.menu-item:hover {
  background: rgba(99, 102, 241, 0.1);
  transform: translateX(4px);
}

.item-icon {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color, #6366f1);
  transition: transform 0.2s ease;
}

.menu-item:hover .item-icon {
  transform: scale(1.1);
}

.item-label {
  font-size: 0.9rem;
  font-weight: 500;
}

/* Responsive : sur mobile, une seule colonne */
@media (max-width: 640px) {
  .menu-grid {
    grid-template-columns: 1fr;
  }
  .dropdown-menu {
    min-width: 260px;
    right: 0;
    left: auto;
  }
}

/* Mode sombre automatique */
@media (prefers-color-scheme: dark) {
  .dropdown-menu {
    background: rgba(31, 41, 55, 0.9);
    backdrop-filter: blur(12px);
    border-color: rgba(255, 255, 255, 0.1);
  }
  .menu-item {
    color: #e5e7eb;
  }
  .menu-item:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  .item-icon {
    color: #a5b4fc;
  }
}

/* Ajustement de la flèche du bouton */
.main-button svg {
  transition: transform 0.3s ease;
}
</style>