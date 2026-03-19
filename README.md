# DEMO SISTEMA DE TICKETS PARA PROBAR LAS CAPACIDADES DE SUPABASE Y NEXT JS

Sistema de tickets escalable que permite a múltiples organizaciones (tenants) operar de forma aislada bajo sus propios subdominios. El proyecto demuestra el dominio de arquitecturas modernas donde el Middleware de Next.js actúa como un orquestador de tráfico inteligente.

Los usuarios pueden registrarse en tenants específicos, crear tickets y gestionar su flujo de trabajo. La seguridad está blindada: solo el autor puede eliminar o cerrar un ticket, mientras que la colaboración se potencia con un feed de comentarios en tiempo real y carga de archivos, todo ejecutándose sobre una infraestructura distribuida en el Edge con Cloudflare Workers.

Teoria aplicada a la practica del libro:

- [Building Production-Grade Web Applications with Supabase: A comprehensive guide to database design, security, real-time data, storage, multi-tenancy, and more by David Lorenz](https://www.amazon.com/Building-Production-Grade-Applications-Supabase-comprehensive/dp/1837630682)

![cover del book](./book_cover.jpg)

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
