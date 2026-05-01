# GitHub Actions — Required Secrets

This document lists all secrets required by the GitHub Actions workflows.
Set these in **Settings → Secrets and variables → Actions**.

## Required Secrets

| Secret Name | Description | Where to Get It |
|-------------|-------------|-----------------|
| `SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `SUPABASE_ANON_KEY` | Public anon key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** service role key (server-side only) | Supabase Dashboard → Settings → API |
| `SUPABASE_DB_PASSWORD` | PostgreSQL password | Supabase Dashboard → Settings → Database |
| `SUPABASE_PROJECT_ID` | Project reference ID | Supabase Dashboard → Settings → General |

## Optional Secrets (for production features)

| Secret Name | Description |
|-------------|-------------|
| `STRIPE_SECRET_KEY` | Stripe API key (server-side) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `EXPO_TOKEN` | Expo access token for EAS builds |
| `APPLE_ID` | Apple Developer account email |
| `APPLE_TEAM_ID` | Apple Developer Team ID |
| `GOOGLE_SERVICES_JSON` | Base64-encoded google-services.json |

## Secret Rotation Policy

- **JWT secrets**: Rotate every 90 days. Rotating invalidates all active sessions.
- **Service role key**: Rotate immediately if suspected of compromise.
- **Stripe keys**: Rotate via Stripe Dashboard; update webhook endpoints accordingly.
- **Database password**: Rotate via Supabase Dashboard → Settings → Database → Reset password.

## Setup Instructions

1. Go to your repository on GitHub
2. Navigate to **Settings → Secrets and variables → Actions**
3. Click **New repository secret**
4. Add each secret from the table above

⚠️ **NEVER** commit secrets to the repository. All secrets must be referenced via `${{ secrets.SECRET_NAME }}` in workflow files.
