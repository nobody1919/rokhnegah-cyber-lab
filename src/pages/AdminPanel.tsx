import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import {
  Users, FlaskConical, FileCheck, Activity, Trophy, TrendingUp,
  Shield, BarChart3, Clock, CheckCircle2, XCircle, ChevronRight
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Stats {
  totalUsers: number;
  totalLabs: number;
  totalSubmissions: number;
  correctSubmissions: number;
  totalInstances: number;
  completedInstances: number;
}

interface RecentSubmission {
  id: string;
  created_at: string;
  is_correct: boolean;
  submitted_flag: string;
  user_id: string;
  lab_id: string;
}

interface TopUser {
  user_id: string;
  username: string | null;
  points: number;
  level: string;
}

export default function AdminPanel() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0, totalLabs: 0, totalSubmissions: 0,
    correctSubmissions: 0, totalInstances: 0, completedInstances: 0,
  });
  const [recentSubs, setRecentSubs] = useState<RecentSubmission[]>([]);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    loadData();
  }, [isAdmin]);

  const loadData = async () => {
    setLoading(true);

    const [
      { count: userCount },
      { count: labCount },
      { count: subCount },
      { count: correctCount },
      { count: instanceCount },
      { count: completedCount },
      { data: subs },
      { data: users },
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("labs").select("*", { count: "exact", head: true }),
      supabase.from("submissions").select("*", { count: "exact", head: true }),
      supabase.from("submissions").select("*", { count: "exact", head: true }).eq("is_correct", true),
      supabase.from("lab_instances").select("*", { count: "exact", head: true }),
      supabase.from("lab_instances").select("*", { count: "exact", head: true }).eq("status", "completed"),
      supabase.from("submissions").select("*").order("created_at", { ascending: false }).limit(20),
      supabase.from("profiles").select("user_id, username, points, level").order("points", { ascending: false }).limit(10),
    ]);

    setStats({
      totalUsers: userCount ?? 0,
      totalLabs: labCount ?? 0,
      totalSubmissions: subCount ?? 0,
      correctSubmissions: correctCount ?? 0,
      totalInstances: instanceCount ?? 0,
      completedInstances: completedCount ?? 0,
    });

    setRecentSubs((subs as RecentSubmission[]) ?? []);
    setTopUsers((users as TopUser[]) ?? []);
    setLoading(false);
  };

  const successRate = stats.totalSubmissions > 0
    ? Math.round((stats.correctSubmissions / stats.totalSubmissions) * 100)
    : 0;

  const completionRate = stats.totalInstances > 0
    ? Math.round((stats.completedInstances / stats.totalInstances) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen cyber-gradient cyber-grid">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  const statCards = [
    { icon: Users, label: "Total Users", value: stats.totalUsers, color: "text-primary" },
    { icon: FlaskConical, label: "Total Labs", value: stats.totalLabs, color: "text-accent" },
    { icon: FileCheck, label: "Submissions", value: stats.totalSubmissions, color: "text-cyber-yellow" },
    { icon: CheckCircle2, label: "Correct Flags", value: stats.correctSubmissions, color: "text-cyber-green" },
    { icon: Activity, label: "Lab Instances", value: stats.totalInstances, color: "text-cyber-orange" },
    { icon: Trophy, label: "Completed", value: stats.completedInstances, color: "text-cyber-purple" },
  ];

  return (
    <div className="min-h-screen cyber-gradient cyber-grid">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-7 w-7 text-primary animate-pulse-glow" />
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>
          <p className="text-muted-foreground">Full monitoring & management dashboard</p>
        </motion.div>

        {/* Quick Nav */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          <Link to="/admin/users">
            <button className="cyber-card px-4 py-2 text-sm flex items-center gap-2 hover:glow-primary transition-all">
              <Users className="h-4 w-4 text-primary" /> Manage Users <ChevronRight className="h-3 w-3" />
            </button>
          </Link>
          <Link to="/admin/labs">
            <button className="cyber-card px-4 py-2 text-sm flex items-center gap-2 hover:glow-primary transition-all">
              <FlaskConical className="h-4 w-4 text-accent" /> Manage Labs <ChevronRight className="h-3 w-3" />
            </button>
          </Link>
          <Link to="/admin/submissions">
            <button className="cyber-card px-4 py-2 text-sm flex items-center gap-2 hover:glow-primary transition-all">
              <FileCheck className="h-4 w-4 text-cyber-yellow" /> Submissions <ChevronRight className="h-3 w-3" />
            </button>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {statCards.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
              className="cyber-card p-5"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-secondary/50`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Rates */}
        <div className="grid gap-4 sm:grid-cols-2 mb-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="cyber-card p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-cyber-green" />
                <span className="text-sm font-medium">Flag Success Rate</span>
              </div>
              <span className="text-sm font-mono text-cyber-green">{successRate}%</span>
            </div>
            <Progress value={successRate} className="h-2 bg-secondary [&>div]:bg-cyber-green" />
            <p className="text-xs text-muted-foreground mt-2">{stats.correctSubmissions} correct out of {stats.totalSubmissions} attempts</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="cyber-card p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-cyber-purple" />
                <span className="text-sm font-medium">Lab Completion Rate</span>
              </div>
              <span className="text-sm font-mono text-cyber-purple">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-2 bg-secondary [&>div]:bg-cyber-purple" />
            <p className="text-xs text-muted-foreground mt-2">{stats.completedInstances} completed out of {stats.totalInstances} started</p>
          </motion.div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Submissions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="cyber-card overflow-hidden"
          >
            <div className="border-b border-border/50 bg-secondary/20 px-5 py-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold">Recent Submissions</span>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {recentSubs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No submissions yet</p>
              ) : (
                recentSubs.map((sub) => (
                  <div key={sub.id} className="flex items-center gap-3 px-5 py-3 border-b border-border/30 last:border-0 hover:bg-secondary/10 transition-colors">
                    {sub.is_correct ? (
                      <CheckCircle2 className="h-4 w-4 text-cyber-green shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-cyber-red shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-foreground truncate">{sub.submitted_flag}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(sub.created_at).toLocaleString()}
                      </p>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${sub.is_correct ? "bg-cyber-green/10 text-cyber-green" : "bg-cyber-red/10 text-cyber-red"}`}>
                      {sub.is_correct ? "CORRECT" : "WRONG"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Top Users */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.65 }}
            className="cyber-card overflow-hidden"
          >
            <div className="border-b border-border/50 bg-secondary/20 px-5 py-3 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-cyber-yellow" />
              <span className="text-sm font-bold">Top Users</span>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {topUsers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No users yet</p>
              ) : (
                topUsers.map((user, i) => (
                  <div key={user.user_id} className="flex items-center gap-3 px-5 py-3 border-b border-border/30 last:border-0 hover:bg-secondary/10 transition-colors">
                    <span className={`font-mono font-bold text-sm w-6 text-center ${i === 0 ? "text-cyber-yellow" : i === 1 ? "text-muted-foreground" : i === 2 ? "text-cyber-orange" : "text-muted-foreground/50"}`}>
                      #{i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{user.username ?? "Anonymous"}</p>
                      <p className="text-[10px] text-muted-foreground">{user.level}</p>
                    </div>
                    <span className="font-mono font-bold text-sm text-primary">{user.points} pts</span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
