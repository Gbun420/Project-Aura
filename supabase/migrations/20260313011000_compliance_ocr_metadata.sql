-- Add ocr_metadata for manual verification comparison
ALTER TABLE public.compliance_documents ADD COLUMN IF NOT EXISTS ocr_metadata JSONB DEFAULT '{}'::jsonb;
