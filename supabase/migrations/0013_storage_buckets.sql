-- ============================================================
-- Migration: 0013_storage_buckets
-- Description: Supabase Storage bucket configuration
-- ============================================================

-- ---- Avatar bucket ----
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  TRUE,
  5242880, -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- ---- Documents bucket (contracts, membership docs — private) ----
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  FALSE,
  52428800, -- 50 MB
  ARRAY['application/pdf', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- ---- Assets bucket (gym photos, class images — public) ----
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'assets',
  'assets',
  TRUE,
  10485760, -- 10 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- ---- Storage RLS Policies ----

-- Avatars: users can upload/update their own avatar
CREATE POLICY "avatars_upload_own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars_update_own"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

-- Avatars: all authenticated users can read
CREATE POLICY "avatars_read_authenticated"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'avatars');

-- Documents: only the owner and admins can access
CREATE POLICY "documents_read_own_or_admin"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'documents'
    AND (
      auth.uid()::TEXT = (storage.foldername(name))[1]
      OR EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
    )
  );

CREATE POLICY "documents_upload_admin"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents'
    AND EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'receptionist'))
  );

-- Assets: admins can upload; everyone can read (bucket is public)
CREATE POLICY "assets_read_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'assets');

CREATE POLICY "assets_write_admin"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'assets'
    AND EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  );
