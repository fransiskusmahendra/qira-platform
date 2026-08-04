alter table public.invitations
  add constraint invitations_acceptance_state_consistent
  check (
    (
      status = 'accepted'
      and accepted_by is not null
      and accepted_at is not null
    )
    or (
      status <> 'accepted'
      and accepted_by is null
      and accepted_at is null
    )
  ) not valid;

alter table public.invitations
  validate constraint invitations_acceptance_state_consistent;

comment on constraint invitations_acceptance_state_consistent on public.invitations is
  'Prevents reusable or ambiguous invitation state by coupling accepted status to its actor and timestamp.';
