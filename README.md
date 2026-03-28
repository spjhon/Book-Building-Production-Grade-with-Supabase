# DEMO SISTEMA DE TICKETS PARA PROBAR LAS CAPACIDADES DE SUPABASE Y NEXT JS

Sistema de tickets escalable que permite a múltiples organizaciones (tenants) operar de forma aislada bajo sus propios subdominios. El proyecto demuestra el dominio de arquitecturas modernas donde el Middleware de Next.js actúa como un orquestador de tráfico inteligente.

Los usuarios pueden registrarse en tenants específicos, crear tickets y gestionar su flujo de trabajo. La seguridad está blindada: solo el autor puede eliminar o cerrar un ticket, mientras que la colaboración se potencia con un feed de comentarios en tiempo real y carga de archivos, todo ejecutándose sobre una infraestructura distribuida en el Edge con Cloudflare Workers.

---

## 🛠️ Herramientas utilizadas

- **🚀 Framework:** Next.js 16 (App Router) para un renderizado híbrido de alto rendimiento.
- **🐘 Base de Datos:** PostgreSQL en **Supabase** con estrategias de particionamiento lógico para escalabilidad, migraciones por medio del CLI.
- **🌐 Infraestructura:** **Cloudflare Workers** para el despliegue del Middleware y el Proxy de subdominios en el *Edge*.
- **🛡️ Seguridad:** Auth (SSR), **JWT Claims** personalizados y políticas **RLS** (Row Level Security) para aislamiento total.
- **⚡ Real-time:** WebSockets vía **Supabase Realtime** para la actualización instantánea de comentarios.
- **🎨 UI/UX:** Componentes de **Shadcn/ui** con **Tailwind CSS**, diseñados para ser minimalistas, modernos y coherentes.
- **📸 Optimización de Imágenes:** Procesamiento dinámico con **Sharp** en el Edge para redimensionamiento eficiente.
- **💾 Gestión de Errores:** Sistema de registro con **Rollback manual** en transacciones críticas para asegurar la integridad de los datos.

---

## 🚀 Características Principales (Core Features)

### 🏢 Arquitectura Multi-tenant & Infraestructura Edge

- **🌐 Sistema de Subdominios Dinámicos:** Implementación de un **Proxy en el Edge** mediante Middleware de Next.js, permitiendo el aislamiento total de marcas y datos por cliente (ej: `empresa.saas.com`).
- **⚡ Despliegue en Cloudflare Workers:** Middleware optimizado para correr en el borde, reduciendo la latencia de redirección a milisegundos.
- **📂 Particionamiento de Base de Datos:** Uso de **PostgreSQL Partitioning** en la tabla de tickets por `tenant_id`, garantizando un rendimiento constante incluso con millones de registros.

### 🎫 Gestión de Tickets & Workflow

- **🛠️ Control de Estado Granular:** Sistema de estados (Abierto, En Progreso, Finalizado, etc.) con **actualizaciones optimistas** en la UI para una respuesta instantánea.
- **👤 Asignación Inteligente:** Capacidad de cambiar el responsable (*assignee*) de cada ticket con sincronización automática de nombres y disponibilidad.
- **🔍 Filtrado Avanzado por URL:** Filtros de búsqueda persistentes que utilizan la URL como fuente de verdad, permitiendo compartir vistas específicas entre miembros del equipo.

### 💬 Colaboración & Real-time

- **💬 Comentarios en Tiempo Real:** Feed de comentarios interactivo utilizando **WebSockets (Supabase Realtime)** para una colaboración sin recargas de página.
- **📎 Gestión de Adjuntos:** Sistema de carga de archivos integrado con **Supabase Storage** y visualización de adjuntos por comentario.
- **📸 CDN de Imágenes Dinámico:** Procesamiento y redimensionamiento de imágenes en el servidor utilizando **Sharp**, optimizando el ancho de banda según el dispositivo.

### 🔐 Seguridad & Resiliencia

- **🛡️ Seguridad a Nivel de Fila (RLS):** Políticas de base de datos que aseguran que un usuario **solo** pueda ver y editar lo que le pertenece según su Tenant y su Rol.
- **🔑 Autenticación SSR Segura:** Manejo de sesiones del lado del servidor (Server-Side Rendering) para evitar brechas de seguridad y mejorar el SEO.
- **🔄 Registro con Rollback Manual:** Proceso de "Sign Up" robusto que asegura la integridad de los datos, revirtiendo cambios si ocurre un fallo en la creación del perfil o el tenant.
- **🛠️Infraestructura como Código (IaC):** Utilizo el flujo de migraciones de Supabase CLI para asegurar que el esquema de producción sea una copia exacta del entorno de desarrollo, facilitando despliegues predecibles y seguros.

### 🎨 UX/UI & Rendimiento

- **📱 Diseño 100% Responsivo:** Interfaz adaptativa construida con **Tailwind CSS**, ofreciendo una experiencia fluida desde smartphones hasta monitores ultrawide.
- **🌓 Componentes Modernos:** Librería de UI basada en **Shadcn/ui**, garantizando accesibilidad (A11y) y una estética minimalista profesional.
- **⏳ Carga Progresiva (Streaming):** Uso de `loading.tsx` y **React Suspense** para mostrar esqueletos de carga (*Skeletons*), mejorando la percepción de velocidad del usuario.
- **📦 Caché Inteligente (ISR):** Implementación de **Incremental Static Regeneration** para páginas de éxito y landing pages, maximizando el uso del CDN.

---

## Screenshot

![screenshot](./Screenshots.jpg)

---

## Teoria aplicada a la practica del libro

- [Building Production-Grade Web Applications with Supabase: A comprehensive guide to database design, security, real-time data, storage, multi-tenancy, and more by David Lorenz](https://www.amazon.com/Building-Production-Grade-Applications-Supabase-comprehensive/dp/1837630682)

![cover del book](./book_cover.jpg)

---

## Database Schema

Diagrama ERD representando las tablas utilizadas, la tabla tickets tiene un particion por cada tenant para soportar grandes cantidades de datos, y este es un ejemplo de una estructura multi tenant donde el tenant es el orquestador de toda la app en cuanto a permisos RLS.

### Diagrama de Relación de Base de Datos (Mermaid)

```mermaid
erDiagram
    %% ==========================================
    %% Entidad Principal Multi-tenant
    %% ==========================================
    tenants {
        uuid id PK
        text name
        text domain "UNIQUE"
        text slug "UNIQUE"
        timestamptz created_at
    }

    %% ==========================================
    %% Entidades de Usuario y Permisos
    %% ==========================================
    auth_users {
        uuid id PK "Supabase Auth"
    }

    service_users {
        uuid id PK
        uuid auth_user_id FK "UNIQUE"
        text full_name
        boolean is_available
    }

    tenant_permissions {
        uuid id PK
        uuid tenant_id FK
        uuid service_user_id FK
        text role "owner,admin,member"
    }

    %% ==========================================
    %% Entidades de Negocio (Tickets y Colaboración)
    %% ==========================================
    tickets {
        uuid id PK "Composite with tenant_id"
        bigint ticket_number "Secuencial por tenant"
        uuid tenant_id PK, FK
        uuid created_by FK
        uuid assignee FK
        text title
        text status "open,in_progress,etc."
        text assignee_name "cached"
    }

    comments {
        uuid id PK
        uuid ticket_id FK
        uuid tenant_id FK
        uuid created_by FK
        text comment_text
        text author_name "cached"
    }

    comment_attachments {
        uuid id PK
        uuid comment_id FK
        uuid tenant_id FK
        text file_path
    }

    %% ==========================================
    %% Definición de Relaciones
    %% ==========================================
    
    %% Relación con Supabase Auth
    auth_users ||--|| service_users : "Mapea a (1:1)"

    %% Relaciones de Multi-tenancy e Identidad
    tenants ||--o{ tenant_permissions : "Tiene (1:N)"
    service_users ||--o{ tenant_permissions : "Pertenece a (1:N)"

    %% Relaciones de Tickets
    tenants ||--o{ tickets : "Aísla (1:N)"
    service_users ||--o{ tickets : "Crea (1:N)"
    service_users ||--o{ tickets : "Es asignado (1:N)"

    %% Relaciones de Comentarios y Adjuntos
    %% Nota: La FK de comments a tickets es compuesta (id, tenant_id)
    tickets ||--o{ comments : "Contiene (1:N)"
    service_users ||--o{ comments : "Escribe (1:N)"
    comments ||--o{ comment_attachments : "Adjunta (1:N)"
    
    %% Relaciones de auditoría/aislamiento directo (opcionales en diagrama, pero presentes en DDL)
    tenants ||--o{ comments : "Aísla (1:N)"
    tenants ||--o{ comment_attachments : "Aísla (1:N)"

```

### Puntos Clave del Diseño

- **Aislamiento Multi-tenant:** La tabla `tenants` es la raíz. Las tablas críticas (`tickets`, `comments`, `comment_attachments`) incluyen `tenant_id` para garantizar el aislamiento de datos mediante políticas RLS (Row Level Security).
- **Particionamiento de Tickets:** La tabla `tickets` está particionada por `LIST (tenant_id)`, lo que optimiza el rendimiento y la gestión de datos a gran escala. Su Clave Primaria es compuesta: `(id, tenant_id)`.
- **Integridad Compuesta:** Los comentarios se relacionan con los tickets usando una clave foránea compuesta `(ticket_id, tenant_id)` para asegurar que un comentario no pueda pertenecer a un ticket de otro cliente.
- **Desnormalización Estratégica:** Se utilizan campos caché como `author_name` en `comments` y `assigne

---

## Estructura del projecto Next js (carpeta src)

Estructura de carpetas del front-end con Next JS 16 App Router, los componentes REACT se encuentran en la carpeta features para mantener la carpeta app solo con las rutas del demo.

```js
src                                        //   
├─ app                                     //   CAPA DE RUTAS (App Router)
│  ├─ favicon.ico                          //   
│  ├─ globals.css                          //   Global ShadCN CSS
│  ├─ layout.tsx                           //   -RootLayout (static SERVER LAYOUT COMPONENT)
│  ├─ loading.tsx                          //   Loading (static SERVER COMPONENT)
│  ├─ not-found                            //   
│  │  └─ page.tsx                          //   PageNotFound (static SERVER COMPONENT)
│  ├─ not-found.tsx                        //   NotFound (static SERVER COMPONENT)
│  ├─ page.tsx                             //   Home (static SERVER COMPONENT) Landing page de listado de tenants disponibles
│  └─ [tenant]                             //   [tenant] Esta es la ruta principal a donde redirige el proxy (next middleware) de acuerdo al host
│     ├─ auth                              //   
│     │  ├─ confirm                        //
│     │  │  └─ route.ts                    //   GET (ROUTE HANDLER) Recibe las llamadas del magic link y de la confirmacion que son envidas por email
│     │  ├─ forgot-password                //
│     │  │  └─ page.tsx                    //   ForgotPasswordPage (dynamic SERVER COMPONENT)
│     │  ├─ login                          //
│     │  │  ├─ api                         //
│     │  │  │  └─ route.ts                 //   POST (ROUTE HANDLER) Procesa el inicio de session cuando javascript esta desactivado en el browser
│     │  │  └─ page.tsx                    //   Login (dynamic SERVER COMPONENT) Utiliza un getclaims para verifcar usuario y cargar componentes
│     │  ├─ login-magic-link               //
│     │  │  └─ api                         //
│     │  │     └─ route.ts                 //   GET (ROUTE HANDLER) No tiene uso por ahora solo devuelve un mensaje
│     │  ├─ logout                         //
│     │  │  └─ api                         //
│     │  │     └─ route.ts                 //   POST (ROUTE HANDLER) Se encarga del logout cuando javascript esta desactiva en el browser
│     │  ├─ magic-thanks                   //
│     │  │  └─ page.tsx                    //   MagicLinkSuccessPage (ISR dynamic SERVER COMPONENT) Mensaje de que se envio el correo magicLink
│     │  ├─ page.tsx                       //   AuthPage (static SERVER COMPONENT) Hace redireccion a tickets por si alguien entra a [tanant]/auth
│     │  ├─ update-password                //   
│     │  │  └─ page.tsx                    //   UpdatePasswordFormPage (static SERVER COMPONENT) Ruta para actualizar el password desde un 
│     │  └─ verify-oauth                   //
│     │     └─ api                         //
│     │        └─ route.ts                 //   GET (ROUTE HANDLER) Aqui se verifica la redireccion cuando se hace login por medio de google
│     ├─ cdn                               //
│     │  └─ api                            //
│     │     └─ route.ts                    //   GET (ROUTE HANDLER) Aqui se procesa una imagen con sharp y la devuelve con un rezise
│     ├─ error                             //
│     │  └─ page.tsx                       //   ErrorPage (dynamic SERVER COMPONENT) Componente a donde se redireccionan los errores de consultas a DB
│     ├─ layout.tsx                        //   - TenantLayout (dynamic SERVER COMPONENT) este layout hace una comprobacion para saber si el que se logeo si esta en su tenant
│     ├─ page.tsx                          //   TenantPage (static SERVER COMPONENT) Hace redireccion automatica a /tickets si el usuario visita /[tenant]
│     ├─ register                          //
│     │  ├─ api                            //
│     │  │  └─ route.ts                    //   POST (ROUTE HANDLER) Se encarga de procesar un nuevo registro, con un rollback manual por si hay errores.
│     │  └─ page.tsx                       //   RegisterPage (dynamic SERVER COMPONENT) Pagina para registrar un nuevo usuario bajo un tenant
│     └─ tickets                           //
│        ├─ details                        //
│        │  └─ [slugId]                    //
│        │     └─ page.tsx                 //   TicketDetailPage (dynamic SERVER COMPONENT) Aqui se extrae informacion que se utiliza para el renderizado de los detalles de un ticket
│        ├─ layout.tsx                     //   -TicketsLayout (static SERVER COMPONENT) layout que controla el area protegida de tickets
│        ├─ new                            //
│        │  └─ page.tsx                    //   CreateTicketPage (static SERVER COMPONENT) 
│        ├─ page.tsx                       //   TicketsPage (dynamic SERVER COMPONENT) Esta pagina tiene el titulo y carga la tabla con los tickets.
│        └─ users                          //
│           └─ page.tsx                    //   UserList (dynamic SERVER COMPONENT) Se hace fetch de la infor del tenant, la lista de usuarios y el usuario actual para renderizar la lista con un select
├─ components                              //   COMPONENTES DE SHADCN
│  └─ ui                                   //
│     ├─ badge.tsx                         //   
│     ├─ button.tsx                        //
│     ├─ card.tsx                          //
│     ├─ drawer.tsx                        //
│     ├─ input.tsx                         //
│     ├─ label.tsx                         //
│     ├─ navigation-menu.tsx               //
│     └─ select.tsx                        //
├─ features                                //   CAPA DE LÓGICA DE NEGOCIO (Domain Driven)
│  ├─ auth                                 //
│  │  └─ components                        //
│  │     ├─ AuthListener.tsx               //   AuthListener (CLIENT COMPONENT) useEffect Presente. componente que carga un vigilante de session
│  │     ├─ forgot-password-form.tsx       //   ForgotPasswordForm (CLIENT COMPONENT) Formulario para enviar el magic link de recuperacion de correo
│  │     ├─ LoginForm.tsx                  //   LoginForm (CLIENT COMPONENTS) Formulario de login separado por tenant
│  │     └─ update-password-form.tsx       //   UpdatePasswordForm (CLIENT COMPONENT) Pequeño formulario despues del magic link para cambiar la contraseña
│  ├─ register                             //
│  │  └─ components                        //
│  │     └─ SignUpForm.tsx                 //   SignUpForm (CLIENT COMPONENT) Formulario de sign up a nuevos usuarios para un tenantt en particular
│  └─ tickets                              //
│     └─ components                        //
│        ├─ AssigneeSelect.tsx             //   AssigneeSelect (SERVER COMPONENT) Renderiza el select para asignar o cambiar el assignee del ticket
│        ├─ AssigneeWrapper.tsx            //   AssigneeWrapper (CLIENT COMPONENT) Es un wrapper para mantener el AssigneeSelect como server (no es muy buena idea)
│        ├─ AvailabilitySelect.tsx         //   AvailabilitySelect (CLIENT COMPONENT) Select para asignar la disponibilidad de un usuario en la tabla USERS
│        ├─ CreateTicketForm.tsx           //   CreateTicketForm (CLIENT COMPONENT) Formulario para la creacion de un nuevo ticket
│        ├─ DeleteButton.tsx               //   DeleteButton (CLIENT COMPONENT) Boton para eliminar un ticket que solo es visible por el usuario que lo creo
│        ├─ LogoutButton.tsx               //   LogoutButton (CLIENT COMPONENT) Boton de logout que se encuentra en el navbar
│        ├─ NavBar                         //
│        │  ├─ MobileMenu.tsx              //   MobileMenu (SERVER COMPONENT) Menu que es visible solo para la version mobil
│        │  └─ Navbar.tsx                  //   Navbar (SERVER COMPONENT) Menu de navegacion simple
│        ├─ TenantName.tsx                 //   TenantName (CLIENT COMPONENT) useEffect Presente. Componente solo de demostracion del useEffect y loading state
│        ├─ ticketComment.tsx              //   TicketComments (CLIENT COMPONENT) Componete complejo que maneja no solo los comentarios sino tambien los archivos adjuntos
│        ├─ TicketList.tsx                 //   TicketList (SERVER COMPONENT) Se renderiza la tabla y se tiene un sistema basico de paginacion.
│        ├─ TicketsFilter.tsx              //   TicketFilters (CLIENT COMPONENT) Filtro de busqueca cuyo state se guarda en la url
│        └─ TicketStatusSelect.tsx         //   TicketStatusSelect (CLIENT COMPONENT) Select que se encarga de cambiar el status del ticket, solo lo puede cambiar el usuario que lo creo
├─ lib                                     //   CAPA DE INFRAESTRUCTURA (Core Services)
│  ├─ dbFunctions                          //
│  │  └─ fetch_tenant_domain_cached.ts     //   fetchTenantDataCached (SERVER ACTION) Ejemplo de cache request y request memoization
│  ├─ server_actions                       //
│  │  └─ emails.ts                         //   Aqui estan las funciones de resend
│  ├─ supabase                             //
│  │  ├─ admin.ts                          //   createSupabaseAdminClient (SUPABASE SERVICE KEY CLIENT) Cliente supabase que EXPONE la service key.
│  │  ├─ client.ts                         //   createSupabaseBrowserClient (SUPABASE BROWSER) Cliente supabase para utilizar en componentes clientes
│  │  ├─ proxy.ts                          //   Proxy (middleware) de supabase el cual filtra cada request y reescribe la ruta para poder tener multi-tenancy
│  │  └─ server.ts                         //   createServerClient (SUPABASE SERVER) Cliente supabase para utilizar en server components
│  └─ utils.ts                             //   Funciones especiales de tailwind (cn dependency)
├─ proxy.ts                                //   Proxy principal de Next js que pasa el request al proxy especial de supabase
├─ types                                   //   
└─ utils                                   //   types types generados por el cli de supabase
   └─ url-helpers.ts                       //   Funciones que reconstruyen rutas absolutas para incluir el tenant que se encuentra en el host.

```

---

## Estructura del projecto Supabase (carpeta supabase)

Las migraciones se encuentran en la carpeta migrations, sin embargo para mayor entendimiento todo el schema se encuentra en este directorio, cada migracion conlleva la modificacion correspondient en este schema.

```js
schemas                                                            //
├─ buckets                                                         //
│  ├─ comments_attachments.sql                                     //
│  └─ tickets_attachment.sql                                       //
├─ db_configurations                                               //
│  └─ time_zone.sql                                                //   Configuracion para establecer la hora local donde estoy hubicado
├─ functions                                                       //   Funciones RPC que se llaman desde el front-end
│  ├─ funciton_get_service_users_with_tenant.sql                   //
│  ├─ function_get_tenant_data.sql                                 //
│  └─ internal_functions                                           //   Funciones que se utilizan en triggers para llenar datos en ciertas tablas
│     ├─ function_derive_tenant_from_ticket-table-comments.sql     //
│     ├─ function_set_comment_author_name.sql                      //
│     ├─ function_set_created-by_value_table-tickets.sql           //
│     ├─ function_set_created_by_value-table_comments.sql          //
│     ├─ function_set_next_ticket_number.sql                       //
│     ├─ function_set_ticket_assignee_name.sql                     //
│     └─ function_set_updated_at.sql                               //
├─ seed.sql                                                        //   Seed basico con tenants DEMO
├─ tables                                                          //
│  ├─ comments.sql                                                 //
│  ├─ comments_attachments.sql                                     //
│  ├─ service_users.sql                                            //
│  ├─ tables_partitions.sql                                        //
│  ├─ tenants.sql                                                  //
│  ├─ tenant_permissions.sql                                       //
│  └─ tickets.sql                                                  //
└─ triggers                                                        //
   ├─ triggers_comments.sql                                        //
   ├─ triggers_comment_attachments.sql                             //
   ├─ triggers_service_users.sql                                   //
   ├─ triggers_tenants.sql                                         //
   ├─ triggers_tenants_permissions.sql                             //
   └─ triggers_tickets.sql                                         //

```

---

## Licencia

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contacto

Para cualquier pregunta o recomendacion

- **Email**: [spjhon@gmail.com](spjhon@gmail.com)
- **GitHub**: [github.com/spjhon](https://github.com/spjhon)

---

## Comandos CLI que utilizo bastante

Local Types Generation: pnpx supabase gen types typescript --local > supabase/types/database.types.ts
hacer backup completo del sistema local: pnpx supabase db dump --local > backup_completo.sql
para hacer link con los env establecidos: pnpx supabase link --project-ref hborskybnjzxsazqhhex -- pnpx supabase link --project-ref qwtpfbwovcvybtfzdbcd

---

## bugs que organizar

1. La funcion max() de una de las funciones rpc no es eficiente con grandes volumenes
2. el middleware proxy esta haciendo un llamado a la base de datos por cada request, se puede cambiar pero no habria seguridad.
3. Al iniciar sesion si se va a /update-password, deja cambiar el password al ponerle una constraseña nueva.
4. Si se envia el link de invitacion despues del registro, si el magik link falla, no hay otra forma de volverlo a enviar y el usuario ya esta registrado, no quedaria activado.
5. en los tickets al cmbiar el status, no hay una carga adecuada mientras se carga el nuevo status
6. un mensaje de advertencia antes de borrar el ticket por que si se borra, se va comentarios y attachments
7. cuadrar la url al utilizar la opcion de buscar
8. en modo start, al hacer login y no hay credenciales, si se colocan las credenciales que son, no pasa nada.
9. cuadrar para que el cambio de contraseña pida confirmacion del correo para que si alguien optiene la contraseña, no logre cambiar la contraseña al menos que haya una confirmacio con el correo
10. si se intenta logear en otro tenant y sale un error de que el tenant no es compatible, se va a invalidar la session en otros lados

---

## Pendientes

1. pasar todo lo que se pueda a rpc
2. manejar mejor el control de errores (utilizar los toasts)
3. -
4. -
5. revizar el rls del bucket de comments_attachments para no solo bloquear por tenant sino tambien por ticket y hasta por commment.
6. Se recomienda en la arquitectura multitenant, dejar el tenant en todas las tablas para la politica de rls sea mas facil y se recomienda un trigger para agregar este tenant en las tablas donde se necesite basandose en otros campos y en el uid().
7. -
8. -
9. -
10. en cuanto al resize de las imagenes, el trabajo en supabase vale dinero pero se puede por ejemplo transformarlas en el cliente antes de subirlas y subir las imagenes a la base de datos ya listas.
11. No olvidar los tips de seguridad de los dos ultimos capitulos incluyendo la seguridad para las columnas created_at para no permitir que se modifiquen al hacer un update
12. El rate limiting a la base de datos se puede implementar con el middleware especial de supabase para todas las llamada api
13. proteccion para que solo escuche la ip que querramos
14. forzar el ssl
15. busqueda vectorial por medio de AI y el guardado de embedings en las tablas
16. Supabnase tiene algo llamado wrappers que es para meter tablas externas en la base de datos y asi poder consultar e insertar info, muy util para un sistema de pagos.
17. -
18. los cronjobs
19. validacion de json con la extencion pj_jsonschema, muy util en las validaciones de las rpc
20. deshabilitar graphql y otras cosas cuando no se necesita.
21. -
22. en el componente de CreateTicketForm agregar un try catch ya que no esta agarrando todos los errores
23. cambiar los alert por toats

24. Agregar el tour
25. Implementar dark/light
26. Implementar internacionalizacion

## Mejoras de rendimiento a futuro

1. Utilizar una libreria llamada jose para captuar el jwt en el middlware y comprobar la info para los permisos en lugar de hacer un llamado a la base de datos por cada request que pase por el middleware.
