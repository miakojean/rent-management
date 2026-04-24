<template>
    <div ref="wrapperRef" class="dropdown-container">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" @click="toggleDropdown">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
        </svg>
        <Transition name="dropdown">
            <div v-if="isOpen" class="dropdown">
                <!-- Header utilisateur -->
                <div class="dropdown-header">
                    <p>Boutton options</p>
                </div>

                <ul class="dropdown-menu">
                <li>
                    <a href="/profile">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
                    </svg>
                    Mon profil
                    </a>
                </li>
                <li>
                    <a href="/settings">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                    </svg>
                    Paramètres
                    </a>
                </li>

                <li class="separator" />

                <li>
                    <button class="logout-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"/>
                    </svg>
                    Déconnexion 
                    </button>
                </li>
                </ul>
            </div>
        </Transition>
    </div>
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
export default {

    props:{
        
    },

    setup(props, {emit}){
        const isOpen = ref(false)
        const wrapperRef = ref<HTMLElement | null>(null)

        const toggleDropdown = () => {
            isOpen.value = !isOpen.value
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.value && !wrapperRef.value.contains(event.target as Node)) {
                isOpen.value = false
            }
        }

        onMounted(() => {
            document.addEventListener('click', handleClickOutside)
        })

        onUnmounted(() => {
            document.removeEventListener('click', handleClickOutside)
        })

        return {
            isOpen,
            wrapperRef,
            toggleDropdown
        }
    }
}
</script>

<style scoped>

.dropdown-container {
  position: relative;  /* 2. Permet au dropdown de se positionner correctement */
  display: inline-block;
}

svg{
    cursor: pointer;
    color: var(--primary-color-dark);
}

/* ── Dropdown ── */
.dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 220px;
  background: white;
  border-radius: 12px;
  border: 0.5px solid rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 1000;
}

/* Header */
.dropdown-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px 12px;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.08);
}

.avatar {
  width: 38px; height: 38px;
  border-radius: 50%;
  background: var(--primary-color);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  font-weight: 500;
  flex-shrink: 0;
}

.user-info { display: flex; flex-direction: column; min-width: 0; }

.user-name {
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role { font-size: 11px; color: #888; margin-top: 1px; }

/* Menu items */
.dropdown-menu { list-style: none; padding: 6px 0; margin: 0; }

.dropdown-menu li a,
.dropdown-menu li button {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 16px;
  font-size: 13px;
  color: #1a1a1a;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.12s;
  text-align: left;
}

.dropdown-menu li a svg,
.dropdown-menu li button svg {
  width: 16px; height: 16px;
  color: #888;
  flex-shrink: 0;
}

.dropdown-menu li a:hover,
.dropdown-menu li button:hover {
  background: rgba(0, 0, 0, 0.04);
}

.separator {
  height: 0.5px;
  background: rgba(0, 0, 0, 0.08);
  margin: 4px 0;
  padding: 0;
}

.logout-btn { color: #c0392b !important; }
.logout-btn svg { color: #c0392b !important; }
.logout-btn:hover { background: rgba(192, 57, 43, 0.07) !important; }

/* ── Animation ── */
.dropdown-enter-active {
  animation: pop-in 0.16s cubic-bezier(0.34, 1.4, 0.64, 1);
}
.dropdown-leave-active {
  animation: pop-in 0.12s cubic-bezier(0.34, 1.4, 0.64, 1) reverse;
}

@keyframes pop-in {
  from { opacity: 0; transform: scale(0.88) translateY(-6px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
</style>