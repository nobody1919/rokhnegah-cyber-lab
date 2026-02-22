import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Trophy, Medal, Crown, Award } from "lucide-react";

interface LeaderboardEntry {
  user_id: string;
  username: string | null;
  points: number;
  level: string;
}

const rankIcons = [Crown, Medal, Award];

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("user_id, username, points, level")
      .order("points", { ascending: false })
      .limit(50)
      .then(({ data }) => setEntries((data as LeaderboardEntry[]) ?? []));
  }, []);

  return (
    <div className="min-h-screen cyber-gradient cyber-grid">
      <Navbar />
      <div className="container mx-auto max-w-2xl px-4 py-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="mb-2 text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-cyber-yellow" />
            Leaderboard
          </h1>
          <p className="mb-8 text-muted-foreground">Top hackers of AFPROPENT</p>
        </motion.div>

        <div className="space-y-3">
          {entries.map((entry, i) => {
            const Icon = rankIcons[i] ?? null;
            return (
              <motion.div
                key={entry.user_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                className={`cyber-card flex items-center gap-4 p-4 ${
                  i === 0 ? "border-cyber-yellow/40" : i === 1 ? "border-muted-foreground/30" : i === 2 ? "border-cyber-orange/30" : ""
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full font-mono font-bold text-sm ${
                  i === 0
                    ? "bg-cyber-yellow/10 text-cyber-yellow"
                    : i === 1
                    ? "bg-muted text-muted-foreground"
                    : i === 2
                    ? "bg-cyber-orange/10 text-cyber-orange"
                    : "bg-secondary text-muted-foreground"
                }`}>
                  {Icon ? <Icon className="h-5 w-5" /> : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">{entry.username ?? "Anonymous"}</p>
                  <p className="text-xs text-muted-foreground">{entry.level}</p>
                </div>
                <span className="font-mono font-bold text-primary">{entry.points} pts</span>
              </motion.div>
            );
          })}
          {entries.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No users have registered yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
