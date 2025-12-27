import { createBrowserClient } from "@supabase/ssr";

export const createSupabaseBrowserClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createBrowserClient(url, anonKey);
};




/**
 * 
 * Diferencia clave en UNA frase

createClient crea un cliente genérico que NO maneja sesiones SSR ni cookies.
createBrowserClient crea un cliente especial para Next.js que usa las cookies de Supabase para manejar la sesión automáticamente en el browser.

Esa es la diferencia fundamental.
 */








//Esta es la forma normal de hacerlo sin ssr, desde el cliente pero con la desventaja de que puede
//estarse creando varias instancias del mismo cliente y eso es un problema con las cookies.


/**
import { createClient } from "@supabase/supabase-js";


export const createSupabaseClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(url, anonKey);
};

 */  



/** 
export const createSupabaseClient = () =>
createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
*/

/**
 * Esta es la explicacion linea por linea del codigo basico de js para vit
 * 
 * Perfecto — vamos línea por línea y en detalle, con notas útiles al final (sobre Vite, seguridad y mejoras). Voy explicando cada línea del fragmento que diste:

```js
import { createClient } from "@supabase/supabase-js";
```

1. `import { createClient } from "@supabase/supabase-js";`

   * Importas la función `createClient` del SDK oficial de Supabase para JavaScript.
   * `createClient` es la fábrica que construye un cliente configurado para comunicarte con tu proyecto Supabase (realiza peticiones al REST/Realtime/PostgREST, maneja autenticación, etc.).

```js
export const createSupabaseClient = () => {
```

2. `export const createSupabaseClient = () => {`

   * Defines y exportas una función llamada `createSupabaseClient`.
   * Es una función anónima asignada a la constante `createSupabaseClient` y exportada para que otros módulos la importen.
   * Al no recibir argumentos, la función toma su configuración desde variables de entorno (ver más abajo).

```js
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
```

3. `const url = process.env.NEXT_PUBLIC_SUPABASE_URL;`

   * Lee la variable de entorno `NEXT_PUBLIC_SUPABASE_URL` y la guarda en la constante `url`.
   * Esa variable debe contener la URL pública de tu instancia de Supabase (algo como `https://xxxx.supabase.co`).
   * Nota: el prefijo `NEXT_PUBLIC_` es la convención de Next.js para exponer variables al cliente; si estás en Vite u otro entorno, las variables de entorno se nombran distinto (ver notas abajo).

```js
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
```

4. `const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;`

   * Lee la variable de entorno `NEXT_PUBLIC_SUPABASE_ANON_KEY` y la guarda en `anonKey`.
   * Esa variable contiene la **anon key** (clave pública) de Supabase — es la clave para el cliente público (no debe usarse para operaciones con privilegios de servidor como `service_role`).

```js
  if (!url || !anonKey) {
    throw new Error("Missing Supabase environment variables");
  }
```

5. `if (!url || !anonKey) { throw new Error("Missing Supabase environment variables"); }`

   * Verifica que `url` y `anonKey` existan y no sean falsy (`undefined`, `null`, cadena vacía...).
   * Si falta alguna, lanza un `Error` para fallar rápido con un mensaje claro — evita que el app intente inicializar Supabase sin configuración y falle de forma silenciosa más adelante.

```js
  return createClient(url, anonKey);
};
```

6. `return createClient(url, anonKey);`

   * Llama a `createClient` con la `url` y la `anonKey` y devuelve el cliente creado.
   * El objeto retornado expone métodos para autenticación (`auth`), acceso a la base de datos (`from('tabla').select()`), y otras utilidades de Supabase.
   * Cierre de la función: `};`

---

### Notas prácticas y recomendaciones (por lo que mencionaste: Vite / “proyecto de vite”)

* Variables de entorno en Vite: Vite **usa** `import.meta.env` y por convención las variables expuestas al cliente deben empezar con `VITE_`.

  * Ejemplo para Vite: `const url = import.meta.env.VITE_SUPABASE_URL;` y `const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;`
  * `process.env.NEXT_PUBLIC_...` funciona en Next.js, no en Vite (a menos que uses algún plugin que emule `process.env`).

* Seguridad de la `anonKey`:

  * La `anon key` está pensada para uso **público** (front-end). Tiene permisos limitados según las RLS (Row Level Security).
  * **Nunca** pongas la `service_role` key en el cliente; esa sólo va en servidores seguros.

* Mejoras comunes al patrón:

  * **Singleton**: normalmente conviene crear el cliente **una sola vez** y reutilizarlo (evita crear múltiples instancias). Ejemplo simple:

    ```js
    let supabase;
    export const getSupabase = () => {
      if (!supabase) supabase = createSupabaseClient();
      return supabase;
    };
    ```
  * **TypeScript**: puedes añadir tipos al retorno (`SupabaseClient`) si usas TS para autocompletado y seguridad de tipos.
  * **Configuración extra**: `createClient` acepta un tercer parámetro con opciones (headers, fetch, análisis, etc.) si necesitas adaptar fetch o habilitar Realtime.

* Uso típico después de llamar a `createSupabaseClient()`:

  ```js
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from('usuarios').select('*');
  ```

---

Si quieres, te convierto esto a:

* una versión **compatible con Vite** (usando `import.meta.env`),
* o a **TypeScript** con tipos,
* o una **versión singleton** lista para importar en todo el proyecto.

¿Cuál prefieres que haga ahora?
s
 * 
 * 
 */