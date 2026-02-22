import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { FlaskConical, ArrowLeft, Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Lab {
  id: string;
  title: string;
  title_fa: string | null;
  description: string | null;
  difficulty: string;
  points: number;
  published: boolean;
  flag: string;
  lab_type: string | null;
  category_id: string;
  sort_order: number | null;
}

interface Category {
  id: string;
  name: string;
}

export default function AdminLabs() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Lab>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [{ data: labData }, { data: catData }] = await Promise.all([
      supabase.from("labs").select("*").order("sort_order"),
      supabase.from("lab_categories").select("id, name").order("sort_order"),
    ]);
    setLabs((labData as Lab[]) ?? []);
    setCategories((catData as Category[]) ?? []);
    setLoading(false);
  };

  const togglePublish = async (lab: Lab) => {
    await supabase.from("labs").update({ published: !lab.published }).eq("id", lab.id);
    toast({ title: lab.published ? "Lab unpublished" : "Lab published" });
    loadData();
  };

  const startEdit = (lab: Lab) => {
    setEditingId(lab.id);
    setEditForm({ title: lab.title, description: lab.description, points: lab.points, flag: lab.flag, difficulty: lab.difficulty });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await supabase.from("labs").update(editForm).eq("id", editingId);
    toast({ title: "Lab updated" });
    setEditingId(null);
    loadData();
  };

  const deleteLab = async (id: string) => {
    await supabase.from("labs").delete().eq("id", id);
    toast({ title: "Lab deleted" });
    loadData();
  };

  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? "Unknown";

  const diffBadge: Record<string, string> = {
    beginner: "bg-cyber-green/10 text-cyber-green border-cyber-green/30",
    intermediate: "bg-cyber-yellow/10 text-cyber-yellow border-cyber-yellow/30",
    advanced: "bg-cyber-red/10 text-cyber-red border-cyber-red/30",
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
            <FlaskConical className="h-6 w-6 text-accent" />
            Lab Management
            <span className="text-sm font-normal text-muted-foreground ml-2">({labs.length} labs)</span>
          </h1>
        </motion.div>

        <div className="space-y-3">
          {labs.map((lab, i) => (
            <motion.div
              key={lab.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="cyber-card p-4"
            >
              {editingId === lab.id ? (
                <div className="space-y-3">
                  <Input value={editForm.title ?? ""} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} placeholder="Title" className="bg-background/50" />
                  <Input value={editForm.description ?? ""} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} placeholder="Description" className="bg-background/50" />
                  <div className="flex gap-2">
                    <Input type="number" value={editForm.points ?? 0} onChange={(e) => setEditForm({ ...editForm, points: Number(e.target.value) })} placeholder="Points" className="bg-background/50 w-24" />
                    <Input value={editForm.flag ?? ""} onChange={(e) => setEditForm({ ...editForm, flag: e.target.value })} placeholder="Flag" className="bg-background/50 font-mono" />
                    <select
                      value={editForm.difficulty ?? "beginner"}
                      onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value })}
                      className="rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveEdit} className="glow-primary">Save</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-bold">{lab.title}</p>
                      <Badge variant="outline" className={diffBadge[lab.difficulty] ?? ""}>
                        {lab.difficulty}
                      </Badge>
                      <Badge variant="outline" className={lab.published ? "bg-cyber-green/10 text-cyber-green border-cyber-green/30" : "bg-cyber-red/10 text-cyber-red border-cyber-red/30"}>
                        {lab.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{getCategoryName(lab.category_id)} · {lab.points} pts · Flag: <span className="font-mono">{lab.flag}</span></p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => togglePublish(lab)} className="text-xs">
                      {lab.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => startEdit(lab)} className="text-xs">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteLab(lab.id)} className="text-xs text-cyber-red hover:text-cyber-red">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
