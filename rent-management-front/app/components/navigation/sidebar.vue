<template>
    <aside class="main-sidebar">
        <div class="sidebar-header">
            <h3>Calim</h3>
        </div>

        <nav class="sidebar-menu">
            <ul>
                <template v-for="item in navItems" :key="item.path">
                    <!-- Item sans sous-section -->
                    <li
                        v-if="!item.children"
                        :class="{ active: isActive(item.path) }"
                        @click="navigate(item.path)"
                    >
                        <span class="nav-icon" v-html="item.icon"></span>
                        <span class="nav-label">{{ item.label }}</span>
                    </li>

                    <!-- Item avec sous-sections -->
                    <li
                        v-else
                        class="has-children"
                        :class="{ 'parent-active': isParentActive(item) }"
                    >
                        <div
                            class="nav-item-row"
                            :class="{ active: isActive(item.path) }"
                            @click="toggleSection(item.path)"
                        >
                            <span class="nav-icon" v-html="item.icon"></span>
                            <span class="nav-label">{{ item.label }}</span>
                            <span class="chevron" :class="{ open: openSections.includes(item.path) }">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </span>
                        </div>

                        <!-- Sous-sections avec arborescence -->
                        <ul class="sub-menu" :class="{ open: openSections.includes(item.path) }">
                            <li
                                v-for="(child, index) in item.children"
                                :key="child.path"
                                :class="{
                                    active: isActive(child.path),
                                    'last-child': index === item.children.length - 1
                                }"
                                @click.stop="navigate(child.path)"
                            >
                                <span class="tree-branch"></span>
                                <span class="nav-label">{{ child.label }}</span>
                            </li>
                        </ul>
                    </li>
                </template>
            </ul>
        </nav>
    </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from '#imports';
import { useAuthStore } from '../../stores/authStore';

const route  = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Sections dépliées
const openSections = ref<string[]>([]);

// Navigation statique
const navItems = [
    {
        path: '/dashboard',
        label: 'Dashboard',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
               </svg>`,
    },
    {
        path: '/proprietes',
        label: 'Mes propriétés',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
               </svg>`,
        children: [
            { path: '/proprietes/liste',    label: 'Liste' },
            { path: '/proprietes/ajouter',  label: 'Ajouter' },
        ],
    },
    {
        path: '/appartements',
        label: 'Appartements',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
               </svg>`,
    },
    {
        path: '/locataires',
        label: 'Locataires',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
               </svg>`,
        children: [
            { path: '/locataires/liste',    label: 'Liste' },
            { path: '/locataires/ajouter',  label: 'Ajouter' },
            { path: '/locataires/archives', label: 'Archives' },
        ],
    },
    {
        path: '/finances',
        label: 'Finances',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
               </svg>`,
        children: [
            { path: '/finances/transactions', label: 'Transactions' },
            { path: '/finances/loyers',       label: 'Loyers' },
            { path: '/finances/depenses',     label: 'Dépenses' },
        ],
    },
    {
        path: '/contrats',
        label: 'Contrats',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
               </svg>`,
    },
    {
        path: '/maintenance',
        label: 'Maintenance',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
               </svg>`,
    },
    {
        path: '/rapports',
        label: 'Rapports',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
               </svg>`,
    },
    {
        path: '/parametres',
        label: 'Paramètres',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
               </svg>`,
    },
];

function isActive(path: string): boolean {
    return route.path === path;
}

function isParentActive(item: typeof navItems[number]): boolean {
    return item.children?.some(child => route.path === child.path) ?? false;
}

function toggleSection(path: string) {
    const idx = openSections.value.indexOf(path);
    if (idx === -1) {
        openSections.value.push(path);
    } else {
        openSections.value.splice(idx, 1);
    }
}

navItems.forEach(item => {
    if (item.children && isParentActive(item)) {
        openSections.value.push(item.path);
    }
});

function navigate(path: string) {
    router.push(path);
}

function handleLogout() {
    authStore.logout();
}
</script>

<style scoped>
.main-sidebar {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: normal;
    justify-content: normal;
    overflow-y: auto;
    background: white;
}

.sidebar-header {
    margin-top: 0.5rem;
    border-bottom: 1px solid #d2deec;
    padding-bottom: 0.75rem;
    margin-bottom: 0.5rem;
}

.sidebar-header h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-color);
}

.sidebar-menu {
    overflow-y: auto;
    flex: 1;
}

.sidebar-menu ul {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.5rem 0 0 0; /* ← suppression du padding-bottom */
    list-style: none;
}

/* Item racine sans enfants */
.sidebar-menu > ul > li:not(.has-children) {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-color);
    display: flex;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
    border-radius: 0.5rem;
    border: 1px solid transparent;
    transition: color 0.2s, background-color 0.2s;
}

.sidebar-menu > ul > li:not(.has-children):hover {
    background: #f0f4f9;
}

/* Item avec enfants */
.has-children {
    display: flex;
    flex-direction: column;
}

.has-children.parent-active > .nav-item-row {
    color: var(--primary-color);
}

.nav-item-row {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-color);
    display: flex;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
    border-radius: 0.5rem;
    border: 1px solid transparent;
    transition: color 0.2s, background-color 0.2s;
}

.nav-item-row:hover {
    background: #f0f4f9;
}

/* État actif */
.active {
    background: var(--primary-color) !important;
    color: white !important;
    border-radius: 0.5rem;
}

/* Icônes */
.nav-icon {
    display: flex;
    align-items: center;
    flex-shrink: 0;
}

.nav-icon :deep(svg) {
    width: 20px;
    height: 20px;
    color: var(--primary-color);
    transition: color 0.2s;
}

.active .nav-icon :deep(svg),
.active svg {
    color: white !important;
}

/* Label */
.nav-label {
    flex: 1;
}

/* Chevron */
.chevron {
    display: flex;
    align-items: center;
    margin-left: auto;
    transition: transform 0.25s ease;
}

.chevron svg {
    width: 14px;
    height: 14px;
    color: #94a3b8;
}

.chevron.open {
    transform: rotate(90deg);
}

/* Sous-menu avec arborescence */
.sub-menu {
    display: flex;
    flex-direction: column;
    gap: 0;
    /* Ligne verticale de l'arbre, alignée avec le centre de .tree-branch */
    padding-left: 2rem;
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.3s ease, opacity 0.25s ease;
    opacity: 0;
    list-style: none;
    position: relative;
}

/* Trait vertical gauche de l'arborescence */
.sub-menu::before {
    content: '';
    position: absolute;
    left: 1.35rem;
    top: 0;
    bottom: 0.9rem; /* s'arrête avant le dernier item */
    width: 1.5px;
    background: #d2deec;
}

.sub-menu.open {
    max-height: 300px;
    opacity: 1;
    padding-top: 0.2rem;
    padding-bottom: 0; /* ← suppression du padding-bottom */
}

.sub-menu li {
    padding: 0.45rem 0.75rem;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-color);
    display: flex;
    align-items: center;
    gap: 0.6rem;
    cursor: pointer;
    border-radius: 0.4rem;
    transition: color 0.2s, background-color 0.2s;
    position: relative;
}

.sub-menu li:hover {
    background: #f0f4f9;
}

.sub-menu li.active {
    background: var(--primary-color);
    color: white;
}

/* Branche horizontale de l'arborescence (le ├ ou └) */
.tree-branch {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    width: 16px;
    height: 1.5px;
    background: #d2deec;
    position: relative;
    margin-right: 0.1rem;
}

/* Petit rond au bout de la branche */
.tree-branch::after {
    content: '';
    position: absolute;
    right: -3px;
    top: 50%;
    transform: translateY(-50%);
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #94a3b8;
    transition: background 0.2s;
}

.sub-menu li.active .tree-branch {
    background: rgba(255, 255, 255, 0.5);
}

.sub-menu li.active .tree-branch::after {
    background: white;
}

/* Footer */
.sidebar-footer {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #d2deec;
    display: flex;
    justify-content: center;
}


</style>