import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import {
  Users, ArrowLeft, Crown, Trash2, Ban, Mail, Search,
  Shield, ChevronDown, ChevronUp, Calendar, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  username: string | null;
  points: number;
  level: string;
  avatar_url: string | null;
  roles: string[];
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"points" | "created_at" | "email">("points");
  const [sortAsc, setSortAsc] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("admin-users", {
        body: null,
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });

      // Handle the edge function response
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users?action=list`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to load users:", err);
      toast({ title: "Error loading users", variant: "destructive" });
    }
    setLoading(false);
  };

  const callAdmin = async (action: string, body: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users?action=${action}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return response.json();
  };

  const toggleAdmin = async (userId: string) => {
    setActionLoading(userId);
    const result = await callAdmin("toggle-admin", { user_id: userId });
    toast({ title: result.action === "granted" ? "Admin role granted" : "Admin role removed" });
    await loadUsers();
    setActionLoading(null);
  };

  const resetPoints = async (userId: string) => {
    setActionLoading(userId);
    await callAdmin("reset-points", { user_id: userId });
    toast({ title: "Points reset to 0" });
    await loadUsers();
    setActionLoading(null);
  };

  const deleteUser = async (userId: string) => {
    setActionLoading(userId);
    await callAdmin("delete-user", { user_id: userId });
    toast({ title: "User deleted", variant: "destructive" });
    await loadUsers();
    setActionLoading(null);
  };

  const banUser = async (userId: string, ban: boolean) => {
    setActionLoading(userId);
    await callAdmin("ban-user", { user_id: userId, ban });
    toast({ title: ban ? "User banned" : "User unbanned" });
    await loadUsers();
    setActionLoading(null);
  };

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(false);
    }
  };

  const filtered = users
    .filter((u) => {
      const q = searchQuery.toLowerCase();
      return !q || u.email?.toLowerCase().includes(q) || u.username?.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortBy === "points") cmp = a.points - b.points;
      else if (sortBy === "created_at") cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      else cmp = (a.email ?? "").localeCompare(b.email ?? "");
      return sortAsc ? cmp : -cmp;
    });

  const SortIcon = ({ field }: { field: typeof sortBy }) =>
    sortBy === field ? (sortAsc ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />) : null;

  if (loading) {
    return (
      <div className="min-h-screen cyber-gradient cyber-grid">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading users from auth system...</p>
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
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">
            <Users className="h-6 w-6 text-primary" />
            User Management
          </h1>
          <p className="text-sm text-muted-foreground mb-6">{users.length} registered users · Emails, points, roles & actions</p>
        </motion.div>

        {/* Search & Sort */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by email or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background/50 border-border/50"
            />
          </div>
          <div className="flex gap-1">
            {([
              { field: "points" as const, label: "Points", icon: Zap },
              { field: "created_at" as const, label: "Joined", icon: Calendar },
              { field: "email" as const, label: "Email", icon: Mail },
            ]).map(({ field, label, icon: Icon }) => (
              <Button
                key={field}
                variant={sortBy === field ? "default" : "outline"}
                size="sm"
                onClick={() => toggleSort(field)}
                className="text-xs gap-1"
              >
                <Icon className="h-3 w-3" />
                {label}
                <SortIcon field={field} />
              </Button>
            ))}
          </div>
        </div>

        {/* User Table */}
        <div className="cyber-card overflow-hidden">
          {/* Header */}
          <div className="hidden md:grid grid-cols-12 gap-2 px-5 py-3 border-b border-border/50 bg-secondary/20 text-xs font-bold text-muted-foreground">
            <div className="col-span-3">User</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-1 text-center">Points</div>
            <div className="col-span-1 text-center">Level</div>
            <div className="col-span-1 text-center">Role</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>

          <div className="max-h-[65vh] overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No users found</p>
            ) : filtered.map((user, i) => {
              const isAdmin = user.roles.includes("admin");
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 px-5 py-4 border-b border-border/30 last:border-0 hover:bg-secondary/10 transition-colors"
                >
                  {/* Username & joined */}
                  <div className="md:col-span-3">
                    <div className="flex items-center gap-2">
                      <p className="font-bold truncate">{user.username ?? "Anonymous"}</p>
                      {isAdmin && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyber-yellow/10 text-cyber-yellow border border-cyber-yellow/30">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Joined {new Date(user.created_at).toLocaleDateString()}
                      {user.last_sign_in_at && (
                        <> · Last login {new Date(user.last_sign_in_at).toLocaleDateString()}</>
                      )}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="md:col-span-3 flex items-center">
                    <span className="text-xs font-mono text-foreground/80 truncate">{user.email}</span>
                  </div>

                  {/* Points */}
                  <div className="md:col-span-1 flex items-center justify-center">
                    <span className="font-mono font-bold text-primary">{user.points}</span>
                  </div>

                  {/* Level */}
                  <div className="md:col-span-1 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">{user.level}</span>
                  </div>

                  {/* Role */}
                  <div className="md:col-span-1 flex items-center justify-center">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isAdmin ? "bg-cyber-yellow/10 text-cyber-yellow" : "bg-secondary text-muted-foreground"}`}>
                      {isAdmin ? "admin" : "user"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-3 flex items-center justify-end gap-1 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAdmin(user.id)}
                      disabled={actionLoading === user.id}
                      className={`text-[10px] gap-1 h-7 px-2 ${isAdmin ? "border-cyber-yellow/30 text-cyber-yellow" : "border-border/50"}`}
                    >
                      <Crown className="h-3 w-3" />
                      {isAdmin ? "Demote" : "Promote"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resetPoints(user.id)}
                      disabled={actionLoading === user.id}
                      className="text-[10px] gap-1 h-7 px-2 border-cyber-orange/30 text-cyber-orange"
                    >
                      <Zap className="h-3 w-3" />
                      Reset Pts
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={actionLoading === user.id}
                          className="text-[10px] gap-1 h-7 px-2 border-cyber-red/30 text-cyber-red hover:bg-cyber-red/10"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="cyber-card border-cyber-red/30">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-cyber-red">Delete User</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete <strong>{user.username ?? user.email}</strong> and all their data. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteUser(user.id)} className="bg-cyber-red text-white hover:bg-cyber-red/80">
                            Delete Forever
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
