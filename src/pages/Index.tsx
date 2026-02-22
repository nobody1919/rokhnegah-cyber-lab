import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Terminal, Bug, FlaskConical, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const features = [
  { icon: Terminal, title: "آزمایشگاه‌های تعاملی", desc: "تمرین حملات واقعی در محیط امن" },
  { icon: Bug, title: "آسیب‌پذیری‌های واقعی", desc: "XSS، SQL Injection، CSRF و بیشتر" },
  { icon: FlaskConical, title: "محیط ایزوله", desc: "هر کاربر محیط اختصاصی خود را دارد" },
  { icon: Shield, title: "یادگیری گام‌به‌گام", desc: "از مبتدی تا پیشرفته" },
];

export default function Index() {
  return (
    <div className="min-h-screen cyber-gradient cyber-grid">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-24 md:py-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <Shield className="h-4 w-4" />
              اولین پلتفرم آموزش امنیت سایبری افغانستان
            </div>

            <h1 className="mb-6 text-5xl font-black tracking-tight md:text-7xl">
              <span className="text-primary glow-text-primary font-mono">رخنه‌گاه</span>
            </h1>

            <p className="mb-4 text-xl text-muted-foreground md:text-2xl">
              آزمایشگاه امنیت سایبری افغانستان
            </p>
            <p className="mb-10 text-base text-muted-foreground/70 max-w-xl mx-auto">
              هک اخلاقی را در محیطی امن و کنترل‌شده تمرین کنید. آسیب‌پذیری‌های واقعی را کشف کنید و مهارت‌های خود را ارتقا دهید.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth">
                <Button size="lg" className="glow-primary text-lg px-8 gap-2">
                  شروع یادگیری
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/labs">
                <Button variant="outline" size="lg" className="text-lg px-8 border-primary/30 text-primary hover:bg-primary/10">
                  مشاهده آزمایشگاه‌ها
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
              className="cyber-card p-6 hover:glow-primary transition-shadow duration-300"
            >
              <f.icon className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 text-lg font-bold text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-border/50 bg-secondary/30">
        <div className="container mx-auto grid grid-cols-2 gap-8 px-4 py-16 md:grid-cols-4">
          {[
            { value: "8+", label: "دسته‌بندی" },
            { value: "11+", label: "آزمایشگاه" },
            { value: "3", label: "سطح دشواری" },
            { value: "∞", label: "یادگیری" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-black text-primary font-mono glow-text-primary">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p className="font-mono text-primary/60">رخنه‌گاه © {new Date().getFullYear()}</p>
          <p className="mt-1 text-xs">آزمایشگاه امنیت سایبری افغانستان</p>
        </div>
      </footer>
    </div>
  );
}
