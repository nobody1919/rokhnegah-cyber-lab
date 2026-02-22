import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Mail, Trash2, Eye, EyeOff, ArrowLeft, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminMessages() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    loadMessages();
  }, [isAdmin]);

  const loadMessages = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    setMessages((data as ContactMessage[]) ?? []);
    setLoading(false);
  };

  const toggleRead = async (id: string, currentRead: boolean) => {
    await supabase.from("contact_messages").update({ is_read: !currentRead }).eq("id", id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: !currentRead } : m)));
  };

  const deleteMessage = async (id: string) => {
    await supabase.from("contact_messages").delete().eq("id", id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    toast({ title: "Message deleted" });
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Admin
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
              <Mail className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black font-mono">Contact Messages</h1>
              <p className="text-muted-foreground text-sm">
                {messages.length} messages · {unreadCount} unread
              </p>
            </div>
          </div>
        </motion.div>

        {messages.length === 0 ? (
          <div className="cyber-card p-12 text-center text-muted-foreground">No messages yet</div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`cyber-card p-5 ${!msg.is_read ? "border-primary/40 bg-primary/5" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-foreground">{msg.name}</span>
                      {!msg.is_read && (
                        <span className="text-[10px] font-mono bg-primary/20 text-primary px-2 py-0.5 rounded-full">NEW</span>
                      )}
                    </div>
                    <p className="text-xs text-primary font-mono mb-2">{msg.email}</p>
                    <p className="text-sm text-foreground/80 whitespace-pre-wrap">{msg.message}</p>
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(msg.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRead(msg.id, msg.is_read)}
                      className="text-muted-foreground hover:text-primary"
                    >
                      {msg.is_read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMessage(msg.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
