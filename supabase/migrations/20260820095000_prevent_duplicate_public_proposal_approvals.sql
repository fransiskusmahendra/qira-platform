create unique index if not exists proposal_decisions_one_approval_per_discovery_idx
on public.proposal_decisions (discovery_id)
where decision = 'approved';
