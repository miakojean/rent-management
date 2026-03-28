<template>
  <div class="profile-wrapper" ref="wrapperRef">
    <!-- Bouton déclencheur (initiale fixe "PR") -->
    <button class="profile-button" @click="toggleDropdown">
      PR
    </button>

    <!-- Dropdown statique -->
    <Transition name="fade">
      <div v-if="isOpen" class="dropdown">
        <ul class="dropdown-menu">
          <li><a href="/profile">Mon profil</a></li>
          <li><a href="/settings">Paramètres</a></li>
          <li><button @click="logout">Déconnexion</button></li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '#imports'
import { useRouter } from '#imports'

// État local
const isOpen = ref(false)
const wrapperRef = ref(null)
const authStore = useAuthStore();
const router = useRouter()

// Fonctions
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

// Gestion du clic en dehors
const handleClickOutside = (event) => {
  if (wrapperRef.value && !wrapperRef.value.contains(event.target)) {
    closeDropdown()
  }
}

// Déconnexion (à remplacer par ta logique)
const logout = async() => {

  await authStore.logout();
  router.push('login')
  console.log('Déconnexion')
  // Appel API, redirection, etc.
  closeDropdown()
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* (les mêmes styles que précédemment) */
.profile-wrapper {
  position: relative;
  display: inline-block;
}

.profile-button {
  background-color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.9rem;
  transition: 0.4s;
}

.profile-button:hover {
  transform: translateY(-2px);
  transition: 0.2s;
}

.dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 180px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
}

.dropdown-menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown-menu li {
  padding: 0;
}

.dropdown-menu a,
.dropdown-menu button {
  display: block;
  width: 100%;
  padding: 10px 16px;
  text-decoration: none;
  color: #333;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 0.9rem;
}

.dropdown-menu a:hover,
.dropdown-menu button:hover {
  background-color: #f5f5f5;
}

/* Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>