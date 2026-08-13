create index support_tickets_created_by_idx on public.support_tickets(created_by) where created_by is not null;
create index support_tickets_assigned_to_idx on public.support_tickets(assigned_to) where assigned_to is not null;
