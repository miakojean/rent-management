/*
|--------------------------------------------------------------------------
| HTTP kernel file
|--------------------------------------------------------------------------
|
| Le fichier kernel est utilisé pour enregistrer les middlewares auprès du
| serveur ou du routeur.
|
*/

import router from '@adonisjs/core/services/router'
import server from '@adonisjs/core/services/server'

/**
 * Le gestionnaire d'erreurs est utilisé pour convertir une exception
 * en une réponse HTTP.
 */
server.errorHandler(() => import('#exceptions/handler'))

/**
 * La pile de middlewares du serveur s'exécute sur TOUTES les requêtes HTTP,
 * même si aucune route n'est enregistrée pour l'URL demandée (ex: 404).
 */
server.use([
  () => import('#middleware/container_bindings_middleware'),
  () => import('#middleware/force_json_response_middleware'),
  () => import('@adonisjs/cors/cors_middleware'),
  () => import('#middleware/request_logger_middleware'),
  // ❌ Suppression de cookie_token_middleware ici car il doit s'exécuter 
  // après l'initialisation de l'auth dans le routeur.
])

/**
 * La pile de middlewares du routeur s'exécute sur toutes les requêtes HTTP
 * ayant une route enregistrée.
 */
router.use([
  () => import('@adonisjs/core/bodyparser_middleware'), 
  () => import('@adonisjs/auth/initialize_auth_middleware'),
  /**
   * ✅ On le garde ici : il s'exécute après initialize_auth_middleware,
   * ce qui lui permet d'accéder à l'objet 'auth' correctement.
   */
  () => import('#middleware/cookie_token_middleware')
])

/**
 * Collection de middlewares nommés à assigner explicitement
 * aux routes ou aux groupes de routes.
 */
export const middleware = router.named({
  auth: () => import('#middleware/auth_middleware'),
  role: () => import('#middleware/role_middleware'),
  activeUser: () => import('#middleware/active_user_middleware'),
})