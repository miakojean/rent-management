import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import { getOpenApiSpec } from '#config/swagger'

export default class DocsController {
  /**
   * Retourne la spec OpenAPI (JSON) générée par swagger-jsdoc.
   * GET /api-docs/spec
   */
  async spec({ response }: HttpContext) {
    const spec = getOpenApiSpec()
    return response.header('Content-Type', 'application/json').send(JSON.stringify(spec))
  }

  /**
   * Sert l'interface Swagger UI (page HTML interactive).
   * GET /api-docs
   */
  async ui({ response, request }: HttpContext) {
    const baseUrl = `${request.protocol()}://${request.hostname()}:${env.get('PORT')}`
    const specUrl = `${baseUrl}/api-docs/spec`

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rent Management API - Swagger UI</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js" crossorigin></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js" crossorigin></script>
  <script>
    window.onload = function() {
      window.ui = SwaggerUIBundle({
        url: "${specUrl}",
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "StandaloneLayout"
      });
    };
  </script>
</body>
</html>`

    return response.header('Content-Type', 'text/html').send(html)
  }
}
