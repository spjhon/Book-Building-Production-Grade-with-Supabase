-- Asegurar que el trigger no se duplique
DROP TRIGGER IF EXISTS trg_set_ticket_assignee_name ON public.tickets;

-- Crear el trigger
CREATE TRIGGER trg_set_ticket_assignee_name
BEFORE INSERT OR UPDATE OF assignee ON public.tickets
FOR EACH ROW
EXECUTE FUNCTION public.set_ticket_assignee_name();