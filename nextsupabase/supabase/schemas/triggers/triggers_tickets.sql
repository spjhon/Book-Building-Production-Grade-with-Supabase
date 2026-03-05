create trigger set_tickets_updated_at
before update on public.tickets
for each row
execute function public.set_updated_at();





CREATE TRIGGER tr_set_author
BEFORE INSERT ON public.tickets
FOR EACH ROW EXECUTE FUNCTION public.set_created_by_table_tickets();




CREATE TRIGGER tr_set_ticket_number
BEFORE INSERT ON public.tickets
FOR EACH ROW
EXECUTE FUNCTION public.set_next_ticket_number();