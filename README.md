# DEMO SISTEMA DE TICKETS PARA PROBAR LAS CAPACIDADES DE SUPABASE Y NEXT JS

Sistema de tickets escalable que permite a múltiples organizaciones (tenants) operar de forma aislada bajo sus propios subdominios. El proyecto demuestra el dominio de arquitecturas modernas donde el Middleware de Next.js actúa como un orquestador de tráfico inteligente.

Los usuarios pueden registrarse en tenants específicos, crear tickets y gestionar su flujo de trabajo. La seguridad está blindada: solo el autor puede eliminar o cerrar un ticket, mientras que la colaboración se potencia con un feed de comentarios en tiempo real y carga de archivos, todo ejecutándose sobre una infraestructura distribuida en el Edge con Cloudflare Workers.

![screenshot](./Screenshots.jpg)

Teoria aplicada a la practica del libro:

- [Building Production-Grade Web Applications with Supabase: A comprehensive guide to database design, security, real-time data, storage, multi-tenancy, and more by David Lorenz](https://www.amazon.com/Building-Production-Grade-Applications-Supabase-comprehensive/dp/1837630682)

![cover del book](./book_cover.jpg)

## Database Schema

Aquí tienes un diagrama de relación de entidades (ERD) diseñado específicamente para el README de tu GitHub. He utilizado Mermaid.js, que es el estándar nativo de GitHub para renderizar diagramas directamente desde el código Markdown.

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

## Herramientas utilizadas

- Framework: Next.js 15 (App Router).
- Infraestructura: Cloudflare Workers para el despliegue del Middleware y el Proxy de subdominios.
- Base de Datos: PostgreSQL en Supabase con estrategias de particionamiento lógico.
- Seguridad: Auth (SSR), JWT Claims personalizados y políticas RLS.
- Real-time: WebSockets vía Supabase Realtime para la sección de comentarios.
- UI/UX: Componentes de Shadcn/ui con Tailwind CSS, diseñados para ser minimalistas y coherentes.

## CLI most used commands

Local Types Generation: pnpx supabase gen types typescript --local > supabase/types/database.types.ts
hacer backup completo del sistema local: pnpx supabase db dump --local > backup_completo.sql

## bugs que organizar

1. La funcion max() de una de las funciones rpc no es eficiente con grandes volumenes
2. el middleware proxy esta haciendo un llamado a la base de datos por cada request, se puede cambiar pero no hay seguridad.

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

## Estructura del projecto (carpeta src)

```js
src                                        //   
├─ app                                     //   
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
│     │  │  └─ page.tsx                    //   ForgotPasswordPage (static SERVER COMPONENT)
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
│     │  ├─ page.tsx                       //
│     │  ├─ update-password                //
│     │  │  └─ page.tsx                    //
│     │  └─ verify-oauth                   //
│     │     └─ api                         //
│     │        └─ route.ts                 //
│     ├─ cdn                               //
│     │  └─ api                            //
│     │     └─ route.ts                    //
│     ├─ error                             //
│     │  └─ page.tsx                       //
│     ├─ layout.tsx                        //
│     ├─ page.tsx                          //
│     ├─ register                          //
│     │  ├─ api                            //
│     │  │  └─ route.ts                    //
│     │  └─ page.tsx                       //
│     └─ tickets                           //
│        ├─ details                        //
│        │  └─ [slugId]                    //
│        │     └─ page.tsx                 //
│        ├─ layout.tsx                     //
│        ├─ new                            //
│        │  └─ page.tsx                    //
│        ├─ page.tsx                       //
│        └─ users                          //
│           └─ page.tsx                    //
├─ components                              //
│  └─ ui                                   //
│     ├─ badge.tsx                         //
│     ├─ button.tsx                        //
│     ├─ card.tsx                          //
│     ├─ drawer.tsx                        //
│     ├─ input.tsx                         //
│     ├─ label.tsx                         //
│     ├─ navigation-menu.tsx               //
│     └─ select.tsx                        //
├─ features                                //
│  ├─ auth                                 //
│  │  └─ components                        //
│  │     ├─ AuthListener.tsx               //
│  │     ├─ forgot-password-form.tsx       //
│  │     ├─ LoginForm.tsx                  //
│  │     └─ update-password-form.tsx       //
│  ├─ register                             //
│  │  └─ components                        //
│  │     └─ SignUpForm.tsx                 //
│  └─ tickets                              //
│     └─ components                        //
│        ├─ AssigneeSelect.tsx             //
│        ├─ AssigneeWrapper.tsx            //
│        ├─ AvailabilitySelect.tsx         //
│        ├─ CreateTicketForm.tsx           //
│        ├─ DeleteButton.tsx               //
│        ├─ LogoutButton.tsx               //
│        ├─ NavBar                         //
│        │  ├─ MobileMenu.tsx              //
│        │  └─ Navbar.tsx                  //
│        ├─ TenantName.tsx                 //
│        ├─ ticketComment.tsx              //
│        ├─ TicketList.tsx                 //
│        ├─ TicketsFilter.tsx              //
│        └─ TicketStatusSelect.tsx         //
├─ lib                                     //
│  ├─ dbFunctions                          //
│  │  └─ fetch_tenant_domain_cached.ts     //
│  ├─ supabase                             //
│  │  ├─ admin.ts                          //
│  │  ├─ client.ts                         //
│  │  ├─ proxy.ts                          //
│  │  └─ server.ts                         //
│  └─ utils.ts                             //
├─ proxy.ts                                //
├─ types                                   //
└─ utils                                   //
   └─ url-helpers.ts                       //

```
