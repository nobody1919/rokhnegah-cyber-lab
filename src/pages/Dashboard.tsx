import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Trophy, Target, Flame, ChevronRight, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface LabInstance {
  id: string;
  lab_id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
}

const RANKS = [
  { name: "Novice", min: 0, color: "text-muted-foreground" },
  { name: "Hunter", min: 50, color: "text-cyber-yellow" },
  { name: "Elite", min: 150, color: "text-cyber-orange" },
  { name: "Master", min: 500, color: "text-cyber-red" },
];

function getRank(points: number) {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (points >= RANKS[i].min) return RANKS[i];
  }
  return RANKS[0];
}

function getNextRank(points: number) {
  for (const rank of RANKS) {
    if (points < rank.min) return rank;
  }
  return null;
}

export default function Dashboard() {
  const { profile, user } = useAuth();
  const [instances, setInstances] = useState<LabInstance[]>([]);
  const [totalLabs, setTotalLabs] = useState(0);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("lab_instances")
      .select("*")
      .eq("user_id", user.id)
      .then(({ data }) => setInstances((data as LabInstance[]) ?? []));
    supabase
      .from("labs")
      .select("id", { count: "exact" })
      .eq("published", true)
      .then(({ count }) => setTotalLabs(count ?? 0));
  }, [user]);

  const completedCount = instances.filter((i) => i.status === "completed").length;
  const points = profile?.points ?? 0;
  const rank = getRank(points);
  const nextRank = getNextRank(points);
  const progress = nextRank ? ((points - rank.min) / (nextRank.min - rank.min)) * 100 : 100;

  return (
    <div className="min-h-screen cyber-gradient cyber-grid">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="mb-2 text-2xl font-bold">
            سلام، <span className="text-primary font-mono">{profile?.username ?? "هکر"}</span> 👋
          </h1>
          <p className="mb-8 text-muted-foreground">به داشبورد خود خوش آمدید</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Trophy, label: "رتبه", value: rank.name, color: rank.color },
            { icon: Flame, label: "امتیاز", value: `${points}`, color: "text-primary" },
            { icon: Target, label: "آزمایشگاه‌های انجام‌شده", value: `${completedCount}/${totalLabs}`, color: "text-accent" },
            { icon: CheckCircle2, label: "در حال انجام", value: `${instances.filter((i) => i.status === "in_progress").length}`, color: "text-cyber-yellow" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="cyber-card p-5"
            >
              <div className="flex items-center gap-3">
                <s.icon className={`h-6 w-6 ${s.color}`} />
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="cyber-card mb-8 p-6"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium">پیشرفت به رتبه بعدی</span>
            <span className="text-sm text-primary font-mono">
              {nextRank ? `${nextRank.name} (${nextRank.min} pts)` : "حداکثر رتبه!"}
            </span>
          </div>
          <Progress value={progress} className="h-3 bg-secondary [&>div]:bg-primary [&>div]:glow-primary" />
        </motion.div>

        {/* Quick actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/labs" className="flex-1">
            <Button variant="outline" className="w-full gap-2 border-primary/30 text-primary hover:bg-primary/10 py-6 text-base">
              مشاهده آزمایشگاه‌ها
              <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/leaderboard" className="flex-1">
            <Button variant="outline" className="w-full gap-2 border-accent/30 text-accent hover:bg-accent/10 py-6 text-base">
              جدول رتبه‌بندی
              <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
