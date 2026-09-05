begin;

-- Subscriptions and paid access are outside the current educational product scope.
-- Keep the legacy table intact for a reversible migration, but make it inaccessible
-- to browser roles and remove its learner-facing policy.
drop policy if exists entitlements_select_own on public.entitlements;
revoke all on table public.entitlements from anon, authenticated;

comment on table public.entitlements is
  'Dormant legacy table. Subscriptions and paid entitlements are outside the current product scope; browser roles have no access.';

commit;
