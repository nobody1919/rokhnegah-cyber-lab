import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Shield, LogOut, Trophy, LayoutDashboard, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user, signOut, profile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-primary glow-text-primary font-mono">
            رخنه‌گاه
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">داشبورد</span>
                </Button>
              </Link>
              <Link to="/labs">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                  <FlaskConical className="h-4 w-4" />
                  <span className="hidden sm:inline">آزمایشگاه‌ها</span>
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                  <Trophy className="h-4 w-4" />
                  <span className="hidden sm:inline">رتبه‌بندی</span>
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
                ورود / ثبت‌نام
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
