import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Flag, Lightbulb, Eye, EyeOff, Play, CheckCircle2, XCircle } from "lucide-react";
import LabEnvironment from "@/components/LabEnvironment";

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
  flag: string;
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
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lab, setLab] = useState<Lab | null>(null);
  const [instance, setInstance] = useState<LabInstance | null>(null);
  const [flagInput, setFlagInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);

  useEffect(() => {
    if (!labId) return;
    supabase.from("labs").select("*").eq("id", labId).single().then(({ data }) => {
      if (data) {
        setLab({ ...(data as any), flag: "" });
      }
    });
  }, [labId]);

  useEffect(() => {
    if (!user || !labId) return;
    supabase
      .from("lab_instances")
      .select("*")
      .eq("user_id", user.id)
      .eq("lab_id", labId)
      .maybeSingle()
      .then(({ data }) => setInstance(data as LabInstance | null));
  }, [user, labId]);

  const startLab = async () => {
    if (!user || !labId) {
      navigate("/auth");
      return;
    }
    const { data, error } = await supabase
      .from("lab_instances")
      .insert({ user_id: user.id, lab_id: labId })
      .select()
      .single();
    if (error) {
      if (error.code === "23505") {
        const { data: existing } = await supabase
          .from("lab_instances")
          .select("*")
          .eq("user_id", user.id)
          .eq("lab_id", labId)
          .single();
        setInstance(existing as LabInstance);
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    } else {
      setInstance(data as LabInstance);
      toast({ title: "Lab Started!", description: "Your dedicated environment has been created." });
    }
  };

  const submitFlag = async () => {
    if (!user || !instance || !labId || !flagInput.trim()) return;
    setSubmitting(true);
    setResult(null);

    const { data: labData } = await supabase
      .from("labs")
      .select("flag, points")
      .eq("id", labId)
      .single();

    const isCorrect = labData?.flag === flagInput.trim();

    await supabase.from("submissions").insert({
      user_id: user.id,
      lab_id: labId,
      lab_instance_id: instance.id,
      submitted_flag: flagInput.trim(),
      is_correct: isCorrect,
    });

    if (isCorrect) {
      setResult("correct");
      await supabase
        .from("lab_instances")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("id", instance.id);
      setInstance({ ...instance, status: "completed" });

      const { data: profile } = await supabase
        .from("profiles")
        .select("points")
        .eq("user_id", user.id)
        .single();
      if (profile) {
        await supabase
          .from("profiles")
          .update({ points: (profile as any).points + (labData?.points ?? 0) })
          .eq("user_id", user.id);
      }
      await refreshProfile();
      toast({ title: "🎉 Congratulations!", description: `Correct flag! You earned ${labData?.points} points.` });
    } else {
      setResult("wrong");
      toast({ title: "❌ Wrong Flag", description: "Try again.", variant: "destructive" });
    }
    setSubmitting(false);
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

  const isCompleted = instance?.status === "completed";

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
                {isCompleted && (
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

          {/* Start Lab / Submit Flag */}
          <div className="cyber-card p-6 mb-4">
            {!instance ? (
              <div className="text-center py-4">
                <p className="mb-4 text-muted-foreground">Click the button below to start the lab</p>
                <Button onClick={startLab} className="glow-primary gap-2" size="lg">
                  <Play className="h-5 w-5" />
                  Start Lab
                </Button>
              </div>
            ) : isCompleted ? (
              <div className="flex items-center gap-3 text-accent">
                <CheckCircle2 className="h-6 w-6" />
                <div>
                  <p className="font-bold">You have successfully solved this lab!</p>
                  <p className="text-sm text-muted-foreground">You can view the solution below.</p>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="mb-3 text-sm font-bold text-primary flex items-center gap-2">
                  <Flag className="h-4 w-4" /> Submit Flag
                </h2>
                <div className="flex gap-2">
                  <Input
                    value={flagInput}
                    onChange={(e) => setFlagInput(e.target.value)}
                    placeholder="FLAG{...}"
                    className="font-mono bg-background/50 border-border/50 focus:border-primary"
                    dir="ltr"
                    onKeyDown={(e) => e.key === "Enter" && submitFlag()}
                  />
                  <Button onClick={submitFlag} disabled={submitting || !flagInput.trim()} className="glow-primary shrink-0">
                    {submitting ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </div>
                {result === "wrong" && (
                  <div className="mt-3 flex items-center gap-2 text-destructive text-sm">
                    <XCircle className="h-4 w-4" />
                    Incorrect flag. Try again.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Lab Environment */}
          {instance && !isCompleted && (
            <div className="mb-4">
              <LabEnvironment
                labType={lab.lab_type}
                onFlagFound={(flag) => setFlagInput(flag)}
              />
            </div>
          )}

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

          {/* Solution */}
          {lab.solution && isCompleted && (
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
