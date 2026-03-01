# AION Publisher - Instrucciones

## Página de Marketing - Publicador Multiplataforma

### Estructura de páginas
- `/marketing/publisher` - Crear publicaciones, feed, borradores, programados, historial
- `/marketing/calendar` - Calendario de publicaciones
- `/marketing/campaigns` - Gestión de campañas
- `/marketing/social` - Estadísticas de redes

### APIs Creadas

**Facebook Posts:**
- `GET /api/facebook/posts?action=posts` - Obtener publicaciones
- `GET /api/facebook/posts?action=comments&postId=xxx` - Obtener comentarios
- `POST /api/facebook/posts` - Crear post, responder/eliminar/ocultar comentarios

**Instagram Posts:**
- `GET /api/instagram/posts?action=media` - Obtener media/publicaciones
- `GET /api/instagram/posts?action=comments&mediaId=xxx` - Obtener comentarios
- `POST /api/instagram/posts` - Responder/eliminar/ocultar comentarios

### Servicios (lib/services/)
- `FacebookMessageService`, `FacebookPostService`, `FacebookCommentService`
- `InstagramMessageService`, `InstagramPostService`, `InstagramCommentService`

### Hooks (marketing/publisher/hooks/)
- `useInstagramPosts()`, `useInstagramComments()`
- `useFacebookPosts()`, `useFacebookComments()`

### Requisitos para funcionar
1. Facebook: Token de acceso de página configurado en Redis (`app_config:facebook`)
2. Instagram: OAuth completado, credenciales en Redis (`credentials:instagram`)

### Botón Meta Business
Todas las páginas de marketing tienen botón "Meta Business" que链接 a business.facebook.com
