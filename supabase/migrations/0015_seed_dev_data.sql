-- ============================================================
-- Migration: 0015_seed_dev_data
-- Description: Development seed data (NOT for production)
-- ============================================================

-- ============================================================
-- NOTE: This migration is idempotent and safe to re-run.
-- Remove or skip in production deployments.
-- ============================================================

DO $$
DECLARE
  v_paris_gym_id UUID;
  v_lyon_gym_id UUID;
BEGIN

-- Get gym IDs
SELECT id INTO v_paris_gym_id FROM public.gym_locations WHERE name LIKE '%Paris%' LIMIT 1;
SELECT id INTO v_lyon_gym_id FROM public.gym_locations WHERE name LIKE '%Lyon%' LIMIT 1;

-- ---- Membership Plans: Paris ----
IF v_paris_gym_id IS NOT NULL THEN
  INSERT INTO public.membership_plans (gym_id, name, description, price_cents, contract_type, duration_days, features, sort_order)
  VALUES
    (v_paris_gym_id, 'Pass Journée', 'Accès 1 journée', 1500, 'day_pass', 1, ARRAY['Accès à toutes les zones', 'Vestiaires'], 1),
    (v_paris_gym_id, 'Formule Mensuelle', 'Sans engagement, résiliable à tout moment', 4999, 'monthly', 30, ARRAY['Accès illimité', 'Cours collectifs', 'Application mobile'], 2),
    (v_paris_gym_id, 'Formule Annuelle', 'Meilleur rapport qualité-prix', 39999, 'annual', 365, ARRAY['Accès illimité', 'Cours collectifs', 'Application mobile', 'Bilan forme offert', '2 séances coaching'], 3),
    (v_paris_gym_id, 'Offre Découverte', '7 jours pour tester le club', 999, 'trial', 7, ARRAY['Accès complet 7 jours', 'Cours collectifs inclus'], 0)
  ON CONFLICT DO NOTHING;
END IF;

-- ---- Membership Plans: Lyon ----
IF v_lyon_gym_id IS NOT NULL THEN
  INSERT INTO public.membership_plans (gym_id, name, description, price_cents, contract_type, duration_days, features, sort_order)
  VALUES
    (v_lyon_gym_id, 'Pass Journée', 'Accès 1 journée', 1200, 'day_pass', 1, ARRAY['Accès à toutes les zones', 'Vestiaires'], 1),
    (v_lyon_gym_id, 'Formule Mensuelle', 'Sans engagement', 3999, 'monthly', 30, ARRAY['Accès illimité', 'Cours collectifs', 'Application mobile'], 2),
    (v_lyon_gym_id, 'Formule Annuelle', 'Le meilleur prix', 34999, 'annual', 365, ARRAY['Accès illimité', 'Cours collectifs', 'Application mobile', 'Bilan forme'], 3)
  ON CONFLICT DO NOTHING;
END IF;

END;
$$;
