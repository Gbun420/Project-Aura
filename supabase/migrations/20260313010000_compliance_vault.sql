-- 1. Create the compliance_documents table
CREATE TABLE IF NOT EXISTS public.compliance_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- e.g., 'Passport', 'PDC', 'Skills_Pass'
  pulse_status TEXT NOT NULL DEFAULT 'PENDING', -- e.g., 'VERIFIED', 'EXPIRED', 'WARNING'
  expiry_date DATE,
  file_path TEXT, -- Storage path
  requires_manual_review BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add helper for days_until_expiry if needed, but we can calculate in query/component
-- For now, let's add it as a generated column if supported, or just keep as logic.
-- Let's just add it as a normal column for OCR model to populate
ALTER TABLE public.compliance_documents ADD COLUMN IF NOT EXISTS days_until_expiry INTEGER;

-- 2. Storage Bucket Setup
-- Note: Bucket creation is usually done via API, but we can add policies.
-- (Assuming compliance-vault bucket exists or will be created)

-- 3. SQL Hardening (Supabase Storage Policy)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Owner can read their own documents'
    ) THEN
        CREATE POLICY "Owner can read their own documents"
          ON storage.objects FOR SELECT
          USING ( bucket_id = 'compliance-vault' AND auth.uid() = (storage.foldername(name))[1]::uuid );
    END IF;
END
$$;

-- Ensure only the owner can insert/delete their own documents
CREATE POLICY "Owner can insert their own documents"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'compliance-vault' AND auth.uid() = (storage.foldername(name))[1]::uuid );

CREATE POLICY "Owner can delete their own documents"
  ON storage.objects FOR DELETE
  USING ( bucket_id = 'compliance-vault' AND auth.uid() = (storage.foldername(name))[1]::uuid );

-- 4. Enable RLS on compliance_documents
ALTER TABLE public.compliance_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own compliance documents"
  ON public.compliance_documents FOR SELECT
  USING ( auth.uid() = profile_id );

CREATE POLICY "Admins can view all compliance documents"
  ON public.compliance_documents FOR ALL
  USING ( 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'compliance_officer')
    )
  );

-- 5. Audit Trigger
CREATE OR REPLACE FUNCTION update_compliance_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER tr_update_compliance_timestamp
BEFORE UPDATE ON public.compliance_documents
FOR EACH ROW
EXECUTE FUNCTION update_compliance_timestamp();
