# Book-Building-Production-Grade-with-Supabase

Teoria aplicada a la practica del libro BUILDING PRODUCTION-GRADE WEB APPLICATIONS WITH SUPABASE

EL TICKET SYSTEM

## CLI commands

Local Types Generation: pnpx supabase gen types typescript --local > supabase/types/database.types.ts

hacer backup completo del sistema local: pnpx supabase db dump --local > backup_completo.sql

## bugs que organizar

1. 
2. el buscador cuando se borra lo que se esta buscando, no se refresca la pagina y se queda ahi la url con los mismos params
3. no funciona el boton de crear ticket

## Pendientes

1. pasar todo lo que se pueda a rpc
2. manejar mejor el control de errores
3. mejorar apariencia
4. poder subir el mismo archivo y que el sistema automaticamente cambie el nombre para poder subir varios del mismo
5. revizar el rls del bucket de comments_attachments para no solo bloquear por tenant sino tambien por ticket y hasta por commment, utilizando los ids de las carpetas para hacer la comparacion
6. Se recomienda en la arquitectura multitenant, dejar el tenant en todas las tablas para la politica de rls sea mas facil y se recomienda un trigger para agregar este tenant en las tablas donde se necesite basandose en otros campos y en el uid().
