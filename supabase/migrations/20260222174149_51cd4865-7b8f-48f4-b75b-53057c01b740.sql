
-- Roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Helper function for role check
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  username TEXT,
  avatar_url TEXT,
  level TEXT NOT NULL DEFAULT 'Novice',
  points INTEGER NOT NULL DEFAULT 0,
  rank_position INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Lab categories
CREATE TABLE public.lab_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_fa TEXT,
  description TEXT,
  icon TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.lab_categories ENABLE ROW LEVEL SECURITY;

-- Labs
CREATE TABLE public.labs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.lab_categories(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  title_fa TEXT,
  description TEXT,
  objective TEXT,
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  points INTEGER NOT NULL DEFAULT 10,
  flag TEXT NOT NULL,
  hint TEXT,
  solution TEXT,
  vulnerable_code TEXT,
  lab_type TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.labs ENABLE ROW LEVEL SECURITY;

-- Lab instances per user
CREATE TABLE public.lab_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lab_id UUID REFERENCES public.labs(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE (user_id, lab_id)
);
ALTER TABLE public.lab_instances ENABLE ROW LEVEL SECURITY;

-- Submissions
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lab_id UUID REFERENCES public.labs(id) ON DELETE CASCADE NOT NULL,
  lab_instance_id UUID REFERENCES public.lab_instances(id) ON DELETE CASCADE NOT NULL,
  submitted_flag TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Trigger for auto-creating profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username');
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_labs_updated_at
  BEFORE UPDATE ON public.labs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- RLS Policies

-- user_roles: users can read their own, admins can read all
CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- profiles
CREATE POLICY "Anyone can view profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- lab_categories: anyone can read, admins can manage
CREATE POLICY "Anyone can view categories" ON public.lab_categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON public.lab_categories
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- labs: anyone can read published, admins can manage all
CREATE POLICY "Anyone can view published labs" ON public.labs
  FOR SELECT USING (published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage labs" ON public.labs
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- lab_instances: users own their instances
CREATE POLICY "Users can view own instances" ON public.lab_instances
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create own instances" ON public.lab_instances
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own instances" ON public.lab_instances
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- submissions
CREATE POLICY "Users can view own submissions" ON public.submissions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create submissions" ON public.submissions
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Seed lab categories
INSERT INTO public.lab_categories (name, name_fa, description, icon, color, sort_order) VALUES
  ('XSS', 'حملات XSS', 'Cross-Site Scripting vulnerabilities', 'Code', 'red', 1),
  ('SQL Injection', 'تزریق SQL', 'SQL Injection attack techniques', 'Database', 'orange', 2),
  ('CSRF', 'جعل درخواست', 'Cross-Site Request Forgery', 'Shield', 'yellow', 3),
  ('Authentication', 'احراز هویت', 'Authentication bypass flaws', 'Lock', 'blue', 4),
  ('Access Control', 'کنترل دسترسی', 'Broken access control vulnerabilities', 'Key', 'purple', 5),
  ('File Upload', 'آپلود فایل', 'Insecure file upload vulnerabilities', 'Upload', 'green', 6),
  ('IDOR', 'ارجاع مستقیم', 'Insecure Direct Object References', 'Eye', 'cyan', 7),
  ('Command Injection', 'تزریق فرمان', 'OS command injection attacks', 'Terminal', 'pink', 8);

-- Seed some labs
INSERT INTO public.labs (category_id, title, title_fa, description, objective, difficulty, points, flag, hint, solution, lab_type, published, sort_order)
SELECT 
  c.id,
  'Reflected XSS in Search',
  'XSS بازتابی در جستجو',
  'A search feature that reflects user input without sanitization.',
  'Execute an alert(1) via the search parameter.',
  'beginner',
  10,
  'FLAG{xss_reflected_basic}',
  'Try injecting a script tag in the search box.',
  'Enter <script>alert(1)</script> in the search field.',
  'xss_reflected',
  true,
  1
FROM public.lab_categories c WHERE c.name = 'XSS';

INSERT INTO public.labs (category_id, title, title_fa, description, objective, difficulty, points, flag, hint, solution, lab_type, published, sort_order)
SELECT 
  c.id,
  'Stored XSS in Comments',
  'XSS ذخیره‌شده در نظرات',
  'A comment section that stores and renders user input without escaping.',
  'Store a persistent XSS payload in a comment.',
  'intermediate',
  25,
  'FLAG{xss_stored_comments}',
  'Comments are rendered as HTML. What can you inject?',
  'Post a comment containing <img src=x onerror=alert(1)>.',
  'xss_stored',
  true,
  2
FROM public.lab_categories c WHERE c.name = 'XSS';

INSERT INTO public.labs (category_id, title, title_fa, description, objective, difficulty, points, flag, hint, solution, lab_type, published, sort_order)
SELECT 
  c.id,
  'DOM XSS via URL Fragment',
  'XSS مبتنی بر DOM',
  'The page reads from the URL fragment and injects it into the DOM.',
  'Execute JavaScript through the URL hash.',
  'advanced',
  50,
  'FLAG{xss_dom_fragment}',
  'Check how the page processes location.hash.',
  'Navigate to #<img src=x onerror=alert(1)>.',
  'xss_dom',
  true,
  3
FROM public.lab_categories c WHERE c.name = 'XSS';

INSERT INTO public.labs (category_id, title, title_fa, description, objective, difficulty, points, flag, hint, solution, lab_type, published, sort_order)
SELECT 
  c.id,
  'Login Bypass via SQL Injection',
  'دور زدن ورود با تزریق SQL',
  'A login form vulnerable to classic SQL injection.',
  'Login as admin without knowing the password.',
  'beginner',
  10,
  'FLAG{sqli_login_bypass}',
  'What happens if you enter a single quote in the username?',
  'Use admin'' OR 1=1-- as the username.',
  'sqli_login',
  true,
  1
FROM public.lab_categories c WHERE c.name = 'SQL Injection';

INSERT INTO public.labs (category_id, title, title_fa, description, objective, difficulty, points, flag, hint, solution, lab_type, published, sort_order)
SELECT 
  c.id,
  'UNION-Based Data Extraction',
  'استخراج داده با UNION',
  'Extract hidden data using UNION-based SQL injection.',
  'Retrieve the admin password from the database.',
  'intermediate',
  25,
  'FLAG{sqli_union_extract}',
  'Try to determine the number of columns first.',
  'Use '' UNION SELECT username, password FROM users-- in the search.',
  'sqli_union',
  true,
  2
FROM public.lab_categories c WHERE c.name = 'SQL Injection';

INSERT INTO public.labs (category_id, title, title_fa, description, objective, difficulty, points, flag, hint, solution, lab_type, published, sort_order)
SELECT 
  c.id,
  'Missing CSRF Token',
  'عدم وجود توکن CSRF',
  'A form that changes user email without CSRF protection.',
  'Craft a page that changes the victim''s email.',
  'beginner',
  10,
  'FLAG{csrf_missing_token}',
  'The form has no anti-CSRF mechanism.',
  'Create an auto-submitting form targeting the email change endpoint.',
  'csrf_missing',
  true,
  1
FROM public.lab_categories c WHERE c.name = 'CSRF';

INSERT INTO public.labs (category_id, title, title_fa, description, objective, difficulty, points, flag, hint, solution, lab_type, published, sort_order)
SELECT 
  c.id,
  'Broken Authentication - Weak Password',
  'رمز عبور ضعیف',
  'An application with weak password requirements.',
  'Login to the admin account using common passwords.',
  'beginner',
  10,
  'FLAG{auth_weak_password}',
  'Try common passwords like admin, password, 123456.',
  'The admin password is "password123".',
  'auth_weak',
  true,
  1
FROM public.lab_categories c WHERE c.name = 'Authentication';

INSERT INTO public.labs (category_id, title, title_fa, description, objective, difficulty, points, flag, hint, solution, lab_type, published, sort_order)
SELECT 
  c.id,
  'Horizontal Privilege Escalation',
  'افزایش سطح دسترسی افقی',
  'Access another user''s data by manipulating the user ID.',
  'View another user''s profile data.',
  'beginner',
  10,
  'FLAG{access_control_idor}',
  'Check the URL parameter when viewing your profile.',
  'Change the user ID in the URL to access other profiles.',
  'access_idor',
  true,
  1
FROM public.lab_categories c WHERE c.name = 'Access Control';

INSERT INTO public.labs (category_id, title, title_fa, description, objective, difficulty, points, flag, hint, solution, lab_type, published, sort_order)
SELECT 
  c.id,
  'Unrestricted File Upload',
  'آپلود فایل بدون محدودیت',
  'Upload any file type including executable scripts.',
  'Upload a PHP web shell to the server.',
  'beginner',
  10,
  'FLAG{file_upload_unrestricted}',
  'There is no file type validation on the server.',
  'Upload a .php file containing <?php system($_GET["cmd"]); ?>.',
  'file_unrestricted',
  true,
  1
FROM public.lab_categories c WHERE c.name = 'File Upload';

INSERT INTO public.labs (category_id, title, title_fa, description, objective, difficulty, points, flag, hint, solution, lab_type, published, sort_order)
SELECT 
  c.id,
  'Direct Object Reference Bypass',
  'دور زدن ارجاع مستقیم',
  'Access restricted resources by changing object identifiers.',
  'Access invoice #1337 that belongs to another user.',
  'beginner',
  10,
  'FLAG{idor_invoice_access}',
  'Check how the invoice ID is passed in the request.',
  'Change the invoice_id parameter to 1337.',
  'idor_basic',
  true,
  1
FROM public.lab_categories c WHERE c.name = 'IDOR';

INSERT INTO public.labs (category_id, title, title_fa, description, objective, difficulty, points, flag, hint, solution, lab_type, published, sort_order)
SELECT 
  c.id,
  'Basic Command Injection',
  'تزریق فرمان ساده',
  'A ping utility that doesn''t sanitize input.',
  'Execute the whoami command on the server.',
  'beginner',
  10,
  'FLAG{cmd_injection_basic}',
  'Try adding a semicolon after the IP address.',
  'Enter 127.0.0.1; whoami in the input field.',
  'cmd_basic',
  true,
  1
FROM public.lab_categories c WHERE c.name = 'Command Injection';
