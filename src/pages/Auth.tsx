import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Shield, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "خطا در ورود", description: error.message, variant: "destructive" });
      } else {
        navigate("/dashboard");
      }
    } else {
      if (!username.trim()) {
        toast({ title: "خطا", description: "نام کاربری الزامی است", variant: "destructive" });
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, username);
      if (error) {
        toast({ title: "خطا در ثبت‌نام", description: error.message, variant: "destructive" });
      } else {
        toast({
          title: "ثبت‌نام موفق!",
          description: "لطفاً ایمیل خود را برای تأیید حساب بررسی کنید.",
        });
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center cyber-gradient cyber-grid px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Shield className="mx-auto mb-4 h-12 w-12 text-primary animate-pulse-glow" />
          <h1 className="text-3xl font-bold text-primary glow-text-primary font-mono">رخنه‌گاه</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isLogin ? "وارد حساب خود شوید" : "حساب جدید بسازید"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="cyber-card p-8 space-y-5">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">نام کاربری</label>
              <div className="relative">
                <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="نام کاربری شما"
                  className="pr-10 bg-background/50 border-border/50 focus:border-primary"
                  dir="ltr"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">ایمیل</label>
            <div className="relative">
              <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="pr-10 bg-background/50 border-border/50 focus:border-primary"
                dir="ltr"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">رمز عبور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pr-10 bg-background/50 border-border/50 focus:border-primary"
                dir="ltr"
                required
                minLength={6}
              />
            </div>
          </div>

          <Button type="submit" className="w-full glow-primary gap-2" disabled={loading}>
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <>
                {isLogin ? "ورود" : "ثبت‌نام"}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline"
            >
              {isLogin ? "حساب ندارید؟ ثبت‌نام کنید" : "حساب دارید؟ وارد شوید"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
