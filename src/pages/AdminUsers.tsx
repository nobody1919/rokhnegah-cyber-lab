import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { Users, ArrowLeft, Shield, Trash2, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  user_id: string;
  username: string | null;
  points: number;
  level: string;
  created_at: string;
}

interface UserRole {
  user_id: string;
  role: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const [{ data: profiles }, { data: userRoles }] = await Promise.all([
      supabase.from("profiles").select("*").order("points", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    setUsers((profiles as UserProfile[]) ?? []);
    setRoles((userRoles as UserRole[]) ?? []);
    setLoading(false);
  };

  const isUserAdmin = (userId: string) =>
    roles.some((r) => r.user_id === userId && r.role === "admin");

  const toggleAdmin = async (userId: string) => {
    if (isUserAdmin(userId)) {
      await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
      toast({ title: "Admin role removed" });
    } else {
      await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
      toast({ title: "Admin role granted" });
    }
    loadUsers();
  };

  const resetPoints = async (userId: string) => {
    await supabase.from("profiles").update({ points: 0 }).eq("user_id", userId);
    toast({ title: "Points reset to 0" });
    loadUsers();
  };

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

  return (
    <div className="min-h-screen cyber-gradient cyber-grid">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/admin" className="text-sm text-primary hover:underline mb-4 inline-flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Back to Admin
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-8">
            <Users className="h-6 w-6 text-primary" />
            User Management
            <span className="text-sm font-normal text-muted-foreground ml-2">({users.length} users)</span>
          </h1>
        </motion.div>

        <div className="space-y-3">
          {users.map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="cyber-card p-4 flex items-center gap-4 flex-wrap"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold truncate">{user.username ?? "Anonymous"}</p>
                  {isUserAdmin(user.user_id) && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyber-yellow/10 text-cyber-yellow border border-cyber-yellow/30">
                      ADMIN
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {user.level} · {user.points} pts · Joined {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleAdmin(user.user_id)}
                  className={`text-xs gap-1 ${isUserAdmin(user.user_id) ? "border-cyber-yellow/30 text-cyber-yellow" : "border-border/50"}`}
                >
                  <Crown className="h-3 w-3" />
                  {isUserAdmin(user.user_id) ? "Remove Admin" : "Make Admin"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => resetPoints(user.user_id)}
                  className="text-xs gap-1 border-cyber-red/30 text-cyber-red hover:bg-cyber-red/10"
                >
                  <Trash2 className="h-3 w-3" />
                  Reset Points
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
