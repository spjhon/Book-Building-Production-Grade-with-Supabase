create or replace function public.set_ticket_assignee_name()
returns trigger
language plpgsql
set search_path = public
as $$
begin
    IF (NEW.assignee IS NULL) THEN
        NEW.assignee_name = NULL;
        
    ELSE NEW.assignee_name = (
        SELECT full_name FROM service_users WHERE id = NEW.assignee AND EXISTS (
            SELECT FROM tenant_permissions p WHERE
            p.tenant_id = NEW.tenant_id AND p.id=NEW.created_by
        )
    );

    IF (NEW.assignee_name IS NULL) THEN
    NEW.assignee = NULL;
    END IF;

    END IF;
    RETURN NEW;
end;
$$;