
-- Drop all restrictive policies and recreate as permissive

-- lab_instances
DROP POLICY IF EXISTS "Users can create own instances" ON public.lab_instances;
DROP POLICY IF EXISTS "Users can update own instances" ON public.lab_instances;
DROP POLICY IF EXISTS "Users can view own instances" ON public.lab_instances;

CREATE POLICY "Users can view own instances" ON public.lab_instances
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create own instances" ON public.lab_instances
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own instances" ON public.lab_instances
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- submissions
DROP POLICY IF EXISTS "Users can create submissions" ON public.submissions;
DROP POLICY IF EXISTS "Users can view own submissions" ON public.submissions;

CREATE POLICY "Users can view own submissions" ON public.submissions
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create submissions" ON public.submissions
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- profiles
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- lab_categories
DROP POLICY IF EXISTS "Anyone can view categories" ON public.lab_categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.lab_categories;

CREATE POLICY "Anyone can view categories" ON public.lab_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.lab_categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- labs
DROP POLICY IF EXISTS "Anyone can view published labs" ON public.labs;
DROP POLICY IF EXISTS "Admins can manage labs" ON public.labs;

CREATE POLICY "Anyone can view published labs" ON public.labs FOR SELECT USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage labs" ON public.labs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- user_roles
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;

CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
