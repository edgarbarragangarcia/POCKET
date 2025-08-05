# Templates de Email para Campañas

Este directorio contiene los templates personalizados para los emails de confirmación de la aplicación Campañas.

## Archivos incluidos

- `confirmation-email.html` - Template HTML moderno con diseño responsive
- `confirmation-email.txt` - Versión en texto plano del email
- `README.md` - Este archivo con instrucciones

## Configuración en Supabase

Para aplicar estos templates en tu proyecto de Supabase:

### 1. Acceder al panel de Supabase
1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. Navega a **Authentication** > **Email Templates**

### 2. Configurar el template de confirmación
1. Selecciona **Confirm signup** en la lista de templates
2. Reemplaza el contenido HTML con el contenido de `confirmation-email.html`
3. Reemplaza el contenido de texto con el contenido de `confirmation-email.txt`

### 3. Variables disponibles
Los templates utilizan las siguientes variables de Supabase:
- `{{ .ConfirmationURL }}` - URL de confirmación generada automáticamente
- `{{ .Email }}` - Email del usuario que se está registrando

### 4. Personalización adicional
Puedes personalizar:
- **Colores**: Modifica los gradientes y colores en el CSS
- **Logo**: Reemplaza el texto "Campañas" con tu logo
- **Contenido**: Ajusta los mensajes según tu marca
- **Información de contacto**: Añade información de soporte

## Características del diseño

✅ **Responsive**: Se adapta a dispositivos móviles
✅ **Moderno**: Diseño con gradientes y sombras
✅ **Accesible**: Contraste adecuado y estructura semántica
✅ **Profesional**: Tipografía y espaciado cuidados
✅ **Seguro**: Incluye notas de seguridad y expiración

## Vista previa

El template incluye:
- Header con branding y gradiente
- Mensaje de bienvenida personalizado
- Botón CTA prominente
- Enlace alternativo para casos de compatibilidad
- Nota de seguridad
- Footer con información de la empresa

## Soporte para clientes de email

El template está optimizado para:
- Gmail
- Outlook
- Apple Mail
- Thunderbird
- Clientes web y móviles

## Notas técnicas

- CSS inline para máxima compatibilidad
- Fallbacks para clientes que no soportan CSS
- Estructura de tabla para Outlook legacy
- Meta tags para responsive design
