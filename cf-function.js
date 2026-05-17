/**
 * CloudFront Function — viewer request
 * 
 * SPA routing multi-locale con cookie de idioma.
 * 
 * Configuración en CloudFront:
 * 1. Asociar esta función al viewer request del Default Behavior (*)
 * 2. Origin: S3 bucket apuntando a la raíz
 * 3. Custom Error Response opcional: 403 → /es/index.html (200) como fallback
 * 
 * Los assets estáticos (con extensión) se dejan pasar directamente.
 * Las rutas SPA se redirigen al index.html del locale según la cookie "locale".
 * 
 * Estructura del S3 bucket:
 *   /
 *   ├── es/
 *   │   ├── index.html      (base href="/es/")
 *   │   ├── main-*.js
 *   │   └── chunk-*.js
 *   ├── en/
 *   │   ├── index.html      (base href="/en/")
 *   │   ├── main-*.js
 *   │   └── chunk-*.js
 *   ├── Logo.svg            ← assets compartidos en raíz
 *   ├── favicon.ico
 *   └── iconos/
 */

function handler(event) {
    var request = event.request;
    var uri = request.uri;

    // 1. Assets estáticos — pasar sin modificar
    if (/\.\w+$/.test(uri)) {
        return request;
    }

    // 2. Determinar locale por cookie
    var locale = 'es';

    if (request.cookies && request.cookies.locale) {
        var cookieVal = request.cookies.locale.value;
        if (cookieVal === 'en') {
            locale = 'en';
        }
    }

    // 3. SPA routing: servir index.html del locale correspondiente
    request.uri = '/' + locale + '/index.html';
    return request;
}
