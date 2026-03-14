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
4. supabase no genera types para los buckets

## Pendientes

1. pasar todo lo que se pueda a rpc
2. manejar mejor el control de errores
3. mejorar apariencia
4. revizar el rls de todas las tablas para comprobar si a parte de la restriccion por tenant de pronto se necesite alguna otra restriccion
5. revizar el rls del bucket de comments_attachments para no solo bloquear por tenant sino tambien por ticket y hasta por commment.
6. Se recomienda en la arquitectura multitenant, dejar el tenant en todas las tablas para la politica de rls sea mas facil y se recomienda un trigger para agregar este tenant en las tablas donde se necesite basandose en otros campos y en el uid().
7. organizar todo el typescript para que sea mas funcional
8. organizar todos los errores de acuerdo a tocketComments
9. ordenar los nombres ya que me confundi a creer que los adjuntos iban por ticket y no, iban por comentario en el ticket
10. en cuanto al resize de las imagenes, el trabajo en supabase vale dinero pero se puede por ejemplo transformarlas en el cliente antes de subirlas y subir las imagenes a la base de datos ya listas.
11. No olvidar los tips de seguridad de los dos ultimos capitulos incluyendo la seguridad para las columnas created_at para no permitir que se modifiquen al hacer un update
12. El rate limiting a la base de datos se puede implementar con el middleware especial de supabase para todas las llamada api
13. proteccion para que solo escuche la ip que querramos
14. forzar el ssl
15. busqueda vectorial por medio de AI y el guardado de embedings en las tablas
16. Supabnase tiene algo llamado wrappers que es para meter tablas externas en la base de datos y asi poder consultar e insertar info, muy util para un sistema de pagos.
17. hecharle ojo a las edge
18. los cronjobs
19. validacion de json con la extencion pj_jsonschema, muy util en las validaciones de las rpc
20. deshabilitar graphql y otras cosas cuando no se necesita.
