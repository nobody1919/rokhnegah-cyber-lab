import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Code, Database, Shield, Lock, Key, Upload, Eye, Terminal, ChevronRight, FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  name: string;
  name_fa: string | null;
  description: string | null;
  icon: string | null;
  color: string | null;
}

interface Lab {
  id: string;
  title: string;
  title_fa: string | null;
  description: string | null;
  difficulty: string;
  points: number;
  category_id: string;
}

const iconMap: Record<string, any> = {
  Code, Database, Shield, Lock, Key, Upload, Eye, Terminal,
};

const colorMap: Record<string, string> = {
  red: "border-cyber-red/30 hover:border-cyber-red/60",
  orange: "border-cyber-orange/30 hover:border-cyber-orange/60",
  yellow: "border-cyber-yellow/30 hover:border-cyber-yellow/60",
  blue: "border-primary/30 hover:border-primary/60",
  purple: "border-cyber-purple/30 hover:border-cyber-purple/60",
  green: "border-accent/30 hover:border-accent/60",
  cyan: "border-primary/30 hover:border-primary/60",
  pink: "border-cyber-pink/30 hover:border-cyber-pink/60",
};

const diffBadge: Record<string, string> = {
  beginner: "bg-cyber-green/10 text-cyber-green border-cyber-green/30",
  intermediate: "bg-cyber-yellow/10 text-cyber-yellow border-cyber-yellow/30",
  advanced: "bg-cyber-red/10 text-cyber-red border-cyber-red/30",
};

const diffLabel: Record<string, string> = {
  beginner: "مبتدی",
  intermediate: "متوسط",
  advanced: "پیشرفته",
};

export default function Labs() {
  const { categoryId } = useParams();
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [completedLabs, setCompletedLabs] = useState<Set<string>>(new Set());

  useEffect(() => {
    supabase.from("lab_categories").select("*").order("sort_order").then(({ data }) => {
      setCategories((data as Category[]) ?? []);
    });
  }, []);

  useEffect(() => {
    if (categoryId) {
      supabase.from("labs").select("*").eq("category_id", categoryId).eq("published", true).order("sort_order").then(({ data }) => {
        setLabs((data as Lab[]) ?? []);
      });
    }
  }, [categoryId]);

  useEffect(() => {
    if (user) {
      supabase.from("lab_instances").select("lab_id").eq("user_id", user.id).eq("status", "completed").then(({ data }) => {
        setCompletedLabs(new Set((data ?? []).map((d: any) => d.lab_id)));
      });
    }
  }, [user]);

  const selectedCategory = categories.find((c) => c.id === categoryId);

  return (
    <div className="min-h-screen cyber-gradient cyber-grid">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        {!categoryId ? (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="mb-2 text-2xl font-bold flex items-center gap-2">
                <FlaskConical className="h-6 w-6 text-primary" />
                دسته‌بندی آزمایشگاه‌ها
              </h1>
              <p className="mb-8 text-muted-foreground">یک دسته‌بندی را انتخاب کنید</p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((cat, i) => {
                const Icon = iconMap[cat.icon ?? "Code"] ?? Code;
                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                  >
                    <Link
                      to={`/labs/${cat.id}`}
                      className={`cyber-card block p-6 transition-all duration-300 ${colorMap[cat.color ?? "blue"]}`}
                    >
                      <Icon className="mb-3 h-8 w-8 text-primary" />
                      <h3 className="text-lg font-bold">{cat.name}</h3>
                      {cat.name_fa && <p className="text-sm text-muted-foreground">{cat.name_fa}</p>}
                      <p className="mt-2 text-xs text-muted-foreground/70">{cat.description}</p>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div className="mb-8">
              <Link to="/labs" className="text-sm text-primary hover:underline mb-2 inline-block">
                ← بازگشت به دسته‌بندی‌ها
              </Link>
              <h1 className="text-2xl font-bold">{selectedCategory?.name ?? "آزمایشگاه‌ها"}</h1>
              {selectedCategory?.name_fa && (
                <p className="text-muted-foreground">{selectedCategory.name_fa}</p>
              )}
            </div>

            <div className="space-y-4">
              {labs.map((lab, i) => (
                <motion.div
                  key={lab.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                >
                  <Link
                    to={`/lab/${lab.id}`}
                    className="cyber-card flex items-center gap-4 p-5 transition-all hover:glow-primary group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                          {lab.title}
                        </h3>
                        <Badge variant="outline" className={diffBadge[lab.difficulty]}>
                          {diffLabel[lab.difficulty] ?? lab.difficulty}
                        </Badge>
                        {completedLabs.has(lab.id) && (
                          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                            ✓ حل‌شده
                          </Badge>
                        )}
                      </div>
                      {lab.title_fa && (
                        <p className="text-sm text-muted-foreground">{lab.title_fa}</p>
                      )}
                      <p className="text-xs text-muted-foreground/70 mt-1">{lab.description}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-mono text-primary">{lab.points} pts</span>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              ))}
              {labs.length === 0 && (
                <p className="text-center text-muted-foreground py-12">هنوز آزمایشگاهی در این دسته‌بندی وجود ندارد</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
