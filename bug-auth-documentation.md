# 🐛 Documentation du Bug — Authentification Nuxt + AdonisJS

**Date :** 27 mars 2026  
**Stack :** Nuxt 3 (frontend) · AdonisJS (backend) · Pinia (state management)  
**Symptôme initial :** `initializeAuth()` retournait toujours une erreur 401

---

## Contexte

L'authentification repose sur des **Access Tokens** (AdonisJS `tokensGuard`), stockés dans un cookie `HttpOnly` posé par le backend. Côté frontend, un store Pinia (`authStore`) gère l'état de l'utilisateur connecté.

---

## Bugs identifiés et corrections

### 1. `isLoading` déclenché trop tard dans `initializeAuth`

**Fichier :** `authStore.ts`

**Problème :** `isLoading.value = true` était mis à `true` après avoir déjà modifié `user.value`, causant un flash UI où l'utilisateur semblait connecté avant le début du chargement.

```ts
// ❌ Avant
if (cachedUser.value) {
    user.value = cachedUser.value;
}
try {
    isLoading.value = true; // trop tard
```

```ts
// ✅ Après
isLoading.value = true; // en premier
if (cachedUser.value) {
    user.value = cachedUser.value;
}
```

---

### 2. `maxAge` du cookie en millisecondes au lieu de secondes

**Fichier :** `auth_controller.ts`

**Problème :** AdonisJS attend `maxAge` en **secondes**. La valeur était multipliée par `1000` (convention JavaScript), ce qui donnait une durée aberrante (`2592000000` au lieu de `2592000`). Le navigateur rejetait le cookie.

```ts
// ❌ Avant
maxAge: 30 * 24 * 60 * 60 * 1000 // millisecondes → cookie rejeté
```

```ts
// ✅ Après
maxAge: 30 * 24 * 60 * 60 // secondes → cookie accepté
```

---

### 3. Cookie non transmis entre ports différents (cross-port)

**Fichier :** `api.ts` + `authStore.ts`

**Problème :** Le cookie `auth_token` était posé par le backend sur `localhost:3333`, mais le frontend tourne sur `localhost:3000`. Les navigateurs ne partagent pas les cookies entre ports différents, donc le cookie n'était jamais envoyé avec les requêtes Axios.

**Solution :** Renvoyer le token dans le **body** de la réponse login, le stocker via `useCookie` côté Nuxt (port `:3000`), et l'attacher à chaque requête via un intercepteur Axios.

```ts
// auth_controller.ts — renvoyer le token dans le body
return {
    message: 'Connexion réussie',
    user: user,
    token: tokenValue // ← ajouté
}
```

```ts
// authStore.ts — stocker le token côté Nuxt
const tokenCookie = useCookie('auth_token', { maxAge: 30 * 24 * 60 * 60 })
tokenCookie.value = response.data.token
```

```ts
// api.ts — intercepteur pour attacher le token
api.interceptors.request.use((config) => {
    const token = useCookie('auth_token').value
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})
```

---

### 4. Plugin d'initialisation exécuté côté serveur (SSR)

**Fichier :** `plugins/auth.ts`

**Problème :** Le plugin Nuxt s'exécutait côté serveur (SSR), où les cookies ne sont pas encore disponibles, causant une initialisation échouée systématiquement.

**Solution :** Renommer le plugin en `.client.ts` pour forcer l'exécution uniquement dans le navigateur.

```
plugins/auth.ts  →  plugins/auth.client.ts
```

---

### 5. Middleware de route s'exécutant avant l'initialisation du store

**Fichier :** `middleware/auth.ts`

**Problème :** Au refresh, le middleware de route s'exécutait côté serveur avant que le plugin `.client.ts` puisse initialiser le store. `isAuthenticated` était `false` → redirection systématique vers `/login`.

**Solution :** Dans `initializeAuth`, retourner immédiatement si le cookie `user_data` existe, sans attendre l'appel API.

```ts
// ✅ authStore.ts — retour immédiat si cache disponible
if (cachedUser.value) {
    user.value = cachedUser.value
    isInitialized.value = true
    isLoading.value = false
    return // pas d'appel API au refresh
}
```

---

## Architecture finale

| Élément | Rôle |
|---|---|
| `auth_token` (cookie Nuxt) | Authentifie les requêtes API via l'intercepteur Axios |
| `user_data` (cookie Nuxt) | Restaure l'utilisateur immédiatement au refresh |
| `plugins/auth.client.ts` | Initialise le store uniquement côté client |
| Middleware de route | Vérifie `isAuthenticated` après initialisation |
| `initializeAuth` | Priorise le cache, appelle l'API seulement si nécessaire |

---

## Leçons retenues

- Toujours vérifier les unités attendues par le framework (`maxAge` en secondes pour AdonisJS).
- Les cookies ne sont pas partagés entre ports différents, même sur `localhost`.
- En Nuxt avec SSR, préférer les plugins `.client.ts` pour tout ce qui dépend des cookies navigateur.
- Prioriser le cache local pour éviter les redirections intempestives au refresh.
