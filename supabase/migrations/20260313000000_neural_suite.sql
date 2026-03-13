-- NEURAL SUITE: MINIMAL IMPLEMENTATION
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding columns
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS embedding vector(384);
ALTER TABLE public.vacancies ADD COLUMN IF NOT EXISTS job_embedding vector(384);

-- Function to calculate match score between a profile and a vacancy
CREATE OR REPLACE FUNCTION calculate_match(profile_id uuid, vacancy_id uuid)
RETURNS float AS $$
  SELECT 1 - (vacancies.job_embedding <=> profiles.embedding)
  FROM public.profiles, public.vacancies
  WHERE profiles.id = profile_id AND vacancies.id = vacancy_id;
$$ LANGUAGE sql STABLE;

-- Function to find top matching candidates for a vacancy
CREATE OR REPLACE FUNCTION match_candidates(vacancy_id uuid, match_threshold float DEFAULT 0.7, match_limit int DEFAULT 10)
RETURNS TABLE (
  id uuid,
  full_name text,
  email text,
  match_score float
) AS $$
  SELECT 
    p.id,
    p.full_name,
    p.email,
    1 - (v.job_embedding <=> p.embedding) as match_score
  FROM public.profiles p, public.vacancies v
  WHERE v.id = vacancy_id
    AND p.role = 'candidate'
    AND p.embedding IS NOT NULL
    AND 1 - (v.job_embedding <=> p.embedding) > match_threshold
  ORDER BY match_score DESC
  LIMIT match_limit;
$$ LANGUAGE sql STABLE;
