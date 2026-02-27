import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Trophy, LayoutDashboard, FlaskConical, Info, Mail, Settings, Map, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import logo from "@/assets/logo.png";

export default function Navbar() {
  const { user, signOut, profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    setOpen(false);
  };

  const scrollTo = (id: string) => {
    setOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => {
    const cls = mobile
      ? "flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
      : "gap-2 text-muted-foreground hover:text-foreground";

    if (mobile) {
      return (
        <div className="flex flex-col gap-1">
          <button onClick={() => scrollTo("about")} className={cls}>
            <Info className="h-4 w-4" /> About
          </button>
          <button onClick={() => scrollTo("contact")} className={cls}>
            <Mail className="h-4 w-4" /> Contact
          </button>
          <Link to="/roadmap" onClick={() => setOpen(false)} className={cls}>
            <Map className="h-4 w-4" /> Roadmap
          </Link>

          {user ? (
            <>
              <div className="my-1 h-px bg-border" />
              <Link to="/dashboard" onClick={() => setOpen(false)} className={cls}>
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
              <Link to="/labs" onClick={() => setOpen(false)} className={cls}>
                <FlaskConical className="h-4 w-4" /> Labs
              </Link>
              <Link to="/leaderboard" onClick={() => setOpen(false)} className={cls}>
                <Trophy className="h-4 w-4" /> Leaderboard
              </Link>
              {isAdmin && (
                <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md text-cyber-yellow hover:text-cyber-yellow/80 hover:bg-muted/50 transition-colors">
                  <Settings className="h-4 w-4" /> Admin
                </Link>
              )}
              <div className="my-1 h-px bg-border" />
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm text-primary font-mono">{profile?.points ?? 0} pts</span>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-destructive">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="my-1 h-px bg-border" />
              <Link to="/auth" onClick={() => setOpen(false)} className="px-3">
                <Button size="sm" className="w-full glow-primary hover-scale">
                  Login / Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 hover-scale">
          <img src={logo} alt="AFPROPENT" className="h-8 w-8 rounded" />
          <span className="text-xl font-bold shimmer-text font-mono">
            AFPROPENT
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <button onClick={() => scrollTo("about")}>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground" asChild>
              <span><Info className="h-4 w-4" /> About</span>
            </Button>
          </button>
          <button onClick={() => scrollTo("contact")}>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground" asChild>
              <span><Mail className="h-4 w-4" /> Contact</span>
            </Button>
          </button>
          <Link to="/roadmap">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <Map className="h-4 w-4" /> Roadmap
            </Button>
          </Link>

          {user ? (
            <>
              <div className="mx-1 h-6 w-px bg-border" />
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Button>
              </Link>
              <Link to="/labs">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                  <FlaskConical className="h-4 w-4" /> Labs
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                  <Trophy className="h-4 w-4" /> Leaderboard
                </Button>
              </Link>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm" className="gap-2 text-cyber-yellow hover:text-cyber-yellow/80">
                    <Settings className="h-4 w-4" /> Admin
                  </Button>
                </Link>
              )}
              <div className="mx-2 h-6 w-px bg-border" />
              <span className="text-sm text-primary font-mono mr-2">{profile?.points ?? 0} pts</span>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-destructive">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="glow-primary hover-scale">Login / Sign Up</Button>
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-background/95 backdrop-blur-xl border-border">
              <SheetTitle className="text-lg font-bold font-mono shimmer-text mb-4">Menu</SheetTitle>
              <NavItems mobile />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
