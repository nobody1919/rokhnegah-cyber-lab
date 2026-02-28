
-- Add new columns to lab_instances
ALTER TABLE public.lab_instances
  ADD COLUMN IF NOT EXISTS expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS progress jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS last_seen_at timestamptz DEFAULT now();

-- Partial unique index: only one correct submission per user per lab
CREATE UNIQUE INDEX IF NOT EXISTS idx_submissions_unique_correct
  ON public.submissions (user_id, lab_id)
  WHERE is_correct = true;
