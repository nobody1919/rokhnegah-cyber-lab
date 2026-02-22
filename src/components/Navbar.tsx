import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Shield, LogOut, Trophy, LayoutDashboard, FlaskConical, Info, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user, signOut, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const scrollTo = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-primary glow-text-primary font-mono">
            Rakhnegah
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <button onClick={() => scrollTo("about")}>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground" asChild>
              <span>
                <Info className="h-4 w-4" />
                <span className="hidden sm:inline">About</span>
              </span>
            </Button>
          </button>
          <button onClick={() => scrollTo("contact")}>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground" asChild>
              <span>
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">Contact</span>
              </span>
            </Button>
          </button>

          {user ? (
            <>
              <div className="mx-1 h-6 w-px bg-border hidden sm:block" />
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
              </Link>
              <Link to="/labs">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                  <FlaskConical className="h-4 w-4" />
                  <span className="hidden sm:inline">Labs</span>
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                  <Trophy className="h-4 w-4" />
                  <span className="hidden sm:inline">Leaderboard</span>
                </Button>
              </Link>
              <div className="mx-2 h-6 w-px bg-border" />
              <span className="text-sm text-primary font-mono mr-2">
                {profile?.points ?? 0} pts
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-destructive">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="glow-primary">
                Login / Sign Up
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
