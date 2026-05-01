<template>
    <div ref="wrapperRef" class="dropdown-container">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" @click="toggleDropdown">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
        </svg>
        <Transition name="dropdown">
            <div v-if="isOpen" class="dropdown">
                <!-- Header utilisateur -->
                <div class="dropdown-header">
                    <p>Options</p>
                </div>

                <ul class="dropdown-menu">
                <li>
                    <a href="/profile">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    Voire propriété
                    </a>
                </li>
                <li>
                    <a href="/settings">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                    Modifier
                    </a>
                </li>

                <li class="separator" />

                <li>
                    <button class="logout-btn" @click="$emit('delete')">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    Supprimer
                    </button>
                </li>
                </ul>
            </div>
        </Transition>

        <Transition name="modal">

            <div class="modal-overlay"></div>

        </Transition>
    </div>
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
export default {

    props:{
        
    },

    emits:['delete'],

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