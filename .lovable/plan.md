

## Plan: Per-User Lab Instance System with Server-Side Flag Validation

This is a large feature touching database schema, an edge function, routing, and multiple pages. Here's the implementation plan:

---

### 1. Database Migration

**Alter `lab_instances` table** to add new columns:
- `expires_at timestamptz` (nullable)
- `progress jsonb DEFAULT '{}'`
- `last_seen_at timestamptz DEFAULT now()`

**Alter `submissions` table** — already has the needed columns (`user_id`, `lab_id`, `lab_instance_id`, `submitted_flag`, `is_correct`, `created_at`). No changes needed.

**Add a unique constraint** to prevent duplicate point grants: create a partial unique index on `submissions(user_id, lab_id)` where `is_correct = true` — ensures points granted only once per lab per user.

**RLS policies** — already in place for both tables. No changes needed.

---

### 2. Create Edge Function: `submit-flag`

**`supabase/functions/submit-flag/index.ts`**

- Receives `{ instance_id, lab_id, submitted_flag }` from authenticated user
- Validates JWT via `getClaims()`
- Uses service role client to fetch the lab's `flag` from the `labs` table (never exposed to client)
- Compares flags; if correct:
  - Inserts a submission row
  - Updates instance status to `completed`
  - Checks if user already got points for this lab (via the unique index or a query); if not, increments `profiles.points`
- Returns `{ correct: boolean, message: string, points?: number }`

**Update `supabase/config.toml`** to set `verify_jwt = false` for this function.

---

### 3. Create Instance Page: `src/pages/LabInstance.tsx`

- Route: `/lab/:labId/instance/:instanceId`
- Loads instance + lab data from database (only if `user_id` matches logged-in user)
- Renders the correct lab simulation via `LabEnvironment` component
- Flag submission calls the edge function instead of client-side comparison
- Shows "Coming Soon" panel when no simulation exists (instead of error), with objective, hint, solution (if unlocked)

---

### 4. Refactor `src/pages/LabDetail.tsx`

- Remove client-side flag fetching and comparison logic
- Add two buttons:
  - **"Start New Instance"** — creates a new `lab_instances` row, marks previous active instances as `expired`, navigates to `/lab/:labId/instance/:instanceId`
  - **"Resume Last Instance"** — finds latest active instance for user+lab, navigates to it
- Show "Solved" badge if any completed instance exists
- Remove inline `LabEnvironment` rendering (moved to instance page)

---

### 5. Update `src/components/LabEnvironment.tsx`

- Replace the default "No simulation environment available" message with a friendly "Coming Soon" panel showing lab objective, hint toggle, and solution (if unlocked)

---

### 6. Update `src/App.tsx`

- Import `LabInstance` page
- Add route: `<Route path="/lab/:labId/instance/:instanceId" element={<ProtectedRoute><LabInstance /></ProtectedRoute>} />`

---

### 7. Update Labs List (`src/pages/Labs.tsx`)

- Fetch user's instances and submissions to show per-lab status:
  - "Solved" (has correct submission)
  - "In Progress" (has active instance)
  - No badge (not started)

---

### 8. Security Summary

- Flag never sent to client; validated server-side in edge function
- RLS policies already enforce user-scoped access on `lab_instances` and `submissions`
- Points granted only once per lab via duplicate check before incrementing
- Instance page verifies `user_id` match before rendering

