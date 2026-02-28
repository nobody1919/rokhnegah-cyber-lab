import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Flag, Lightbulb, Eye, EyeOff, Play, CheckCircle2, RotateCcw, ArrowRight } from "lucide-react";

interface Lab {
  id: string;
  title: string;
  title_fa: string | null;
  description: string | null;
  objective: string | null;
  difficulty: string;
  points: number;
  hint: string | null;
  solution: string | null;
  lab_type: string | null;
  category_id: string;
}

interface LabInstance {
  id: string;
  status: string;
}

const diffBadge: Record<string, string> = {
  beginner: "bg-cyber-green/10 text-cyber-green border-cyber-green/30",
  intermediate: "bg-cyber-yellow/10 text-cyber-yellow border-cyber-yellow/30",
  advanced: "bg-cyber-red/10 text-cyber-red border-cyber-red/30",
};

const diffLabel: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function LabDetail() {
  const { labId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lab, setLab] = useState<Lab | null>(null);
  const [activeInstance, setActiveInstance] = useState<LabInstance | null>(null);
  const [hasSolved, setHasSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (!labId) return;
    supabase
      .from("labs")
      .select("id, title, title_fa, description, objective, difficulty, points, hint, solution, lab_type, category_id")
      .eq("id", labId)
      .single()
      .then(({ data }) => {
        if (data) setLab(data as Lab);
      });
  }, [labId]);

  useEffect(() => {
    if (!user || !labId) return;

    // Check for active instance
    supabase
      .from("lab_instances")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("lab_id", labId)
      .eq("status", "in_progress")
      .order("started_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        setActiveInstance(data?.[0] as LabInstance | null);
      });

    // Check if solved
    supabase
      .from("lab_instances")
      .select("id")
      .eq("user_id", user.id)
      .eq("lab_id", labId)
      .eq("status", "completed")
      .limit(1)
      .then(({ data }) => {
        setHasSolved((data?.length ?? 0) > 0);
      });
  }, [user, labId]);

  const startNewInstance = async () => {
    if (!user || !labId) {
      navigate("/auth");
      return;
    }
    setStarting(true);

    // Expire previous active instances
    await supabase
      .from("lab_instances")
      .update({ status: "expired" })
      .eq("user_id", user.id)
      .eq("lab_id", labId)
      .eq("status", "in_progress");

    // Create new instance
    const { data, error } = await supabase
      .from("lab_instances")
      .insert({ user_id: user.id, lab_id: labId })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setStarting(false);
      return;
    }

    toast({ title: "Lab Started!", description: "Your dedicated environment has been created." });
    navigate(`/lab/${labId}/instance/${data.id}`);
  };

  const resumeInstance = () => {
    if (activeInstance && labId) {
      navigate(`/lab/${labId}/instance/${activeInstance.id}`);
    }
  };

  if (!lab) {
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
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Header */}
          <div className="cyber-card p-6 mb-6">
            <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold">{lab.title}</h1>
                {lab.title_fa && <p className="text-muted-foreground">{lab.title_fa}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={diffBadge[lab.difficulty]}>
                  {diffLabel[lab.difficulty] ?? lab.difficulty}
                </Badge>
                <Badge variant="outline" className="border-primary/30 text-primary font-mono">
                  {lab.points} pts
                </Badge>
                {hasSolved && (
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                    ✓ Solved
                  </Badge>
                )}
              </div>
            </div>
            {lab.description && <p className="text-muted-foreground text-sm">{lab.description}</p>}
          </div>

          {/* Objective */}
          {lab.objective && (
            <div className="cyber-card p-5 mb-4">
              <h2 className="mb-2 text-sm font-bold text-primary flex items-center gap-2">
                <Flag className="h-4 w-4" /> Objective
              </h2>
              <p className="text-sm text-foreground">{lab.objective}</p>
            </div>
          )}

          {/* Actions */}
          <div className="cyber-card p-6 mb-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {activeInstance ? (
                <>
                  <Button onClick={resumeInstance} className="glow-primary gap-2 w-full sm:w-auto" size="lg">
                    <ArrowRight className="h-5 w-5" />
                    Resume Last Instance
                  </Button>
                  <Button onClick={startNewInstance} variant="outline" className="gap-2 w-full sm:w-auto" size="lg" disabled={starting}>
                    <RotateCcw className="h-5 w-5" />
                    Start New Instance
                  </Button>
                </>
              ) : (
                <Button onClick={startNewInstance} className="glow-primary gap-2 w-full sm:w-auto" size="lg" disabled={starting}>
                  {starting ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                  Start Lab
                </Button>
              )}
            </div>
            {hasSolved && (
              <p className="mt-3 text-sm text-accent flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                You've already solved this lab. You can start a new instance to practice again.
              </p>
            )}
          </div>

          {/* Hint */}
          {lab.hint && (
            <div className="cyber-card p-5 mb-4">
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex w-full items-center justify-between text-sm font-bold text-cyber-yellow"
              >
                <span className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Hint
                </span>
                {showHint ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              {showHint && <p className="mt-3 text-sm text-foreground/80 font-mono">{lab.hint}</p>}
            </div>
          )}

          {/* Solution - only if solved */}
          {lab.solution && hasSolved && (
            <div className="cyber-card p-5">
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="flex w-full items-center justify-between text-sm font-bold text-accent"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Solution
                </span>
                {showSolution ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              {showSolution && <p className="mt-3 text-sm text-foreground/80 font-mono">{lab.solution}</p>}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
