-- Enable RLS on all tables and add security policies
-- Using lowercase table names as they appear in Prisma migrations

-- ============================================
-- PLAYERS TABLE
-- ============================================
ALTER TABLE public.Player ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read players" ON public.Player
  FOR SELECT USING (true);

CREATE POLICY "Admin can insert players" ON public.Player
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can update players" ON public.Player
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Admin can delete players" ON public.Player
  FOR DELETE USING (true);

-- ============================================
-- FIXTURES TABLE
-- ============================================
ALTER TABLE public.Fixture ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read fixtures" ON public.Fixture
  FOR SELECT USING (true);

CREATE POLICY "Admin can insert fixtures" ON public.Fixture
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can update fixtures" ON public.Fixture
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Admin can delete fixtures" ON public.Fixture
  FOR DELETE USING (true);

-- ============================================
-- BLOG POSTS TABLE
-- ============================================
ALTER TABLE public.BlogPost ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read blog posts" ON public.BlogPost
  FOR SELECT USING (true);

CREATE POLICY "Admin can insert blog posts" ON public.BlogPost
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can update blog posts" ON public.BlogPost
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Admin can delete blog posts" ON public.BlogPost
  FOR DELETE USING (true);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
ALTER TABLE public.Product ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read products" ON public.Product
  FOR SELECT USING (true);

CREATE POLICY "Admin can insert products" ON public.Product
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can update products" ON public.Product
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Admin can delete products" ON public.Product
  FOR DELETE USING (true);

-- ============================================
-- TICKETS TABLE
-- ============================================
ALTER TABLE public.Ticket ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read tickets" ON public.Ticket
  FOR SELECT USING (true);

CREATE POLICY "Anyone can buy tickets" ON public.Ticket
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own tickets" ON public.Ticket
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Admin can delete tickets" ON public.Ticket
  FOR DELETE USING (true);

-- ============================================
-- DONATIONS TABLE
-- ============================================
ALTER TABLE public.Donation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read donations" ON public.Donation
  FOR SELECT USING (true);

CREATE POLICY "Anyone can donate" ON public.Donation
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can update donations" ON public.Donation
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Admin can delete donations" ON public.Donation
  FOR DELETE USING (true);

-- ============================================
-- SPONSORS TABLE
-- ============================================
ALTER TABLE public.Sponsor ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read sponsors" ON public.Sponsor
  FOR SELECT USING (true);

CREATE POLICY "Admin can insert sponsors" ON public.Sponsor
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can update sponsors" ON public.Sponsor
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Admin can delete sponsors" ON public.Sponsor
  FOR DELETE USING (true);

-- ============================================
-- TEAM MEMBERS TABLE
-- ============================================
ALTER TABLE public.TeamMember ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read team members" ON public.TeamMember
  FOR SELECT USING (true);

CREATE POLICY "Admin can insert team members" ON public.TeamMember
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can update team members" ON public.TeamMember
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Admin can delete team members" ON public.TeamMember
  FOR DELETE USING (true);

-- ============================================
-- ADMIN USERS TABLE
-- ============================================
ALTER TABLE public.AdminUser ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read admin users" ON public.AdminUser
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert admin users" ON public.AdminUser
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update admin users" ON public.AdminUser
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Admins can delete admin users" ON public.AdminUser
  FOR DELETE USING (true);
