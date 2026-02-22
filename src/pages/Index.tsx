import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Terminal, Bug, FlaskConical, ChevronRight, User, Mail, Github, Globe, Code, Search, Skull } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const features = [
  { icon: Terminal, title: "آزمایشگاه‌های تعاملی", desc: "تمرین حملات واقعی در محیط امن" },
  { icon: Bug, title: "آسیب‌پذیری‌های واقعی", desc: "XSS، SQL Injection، CSRF و بیشتر" },
  { icon: FlaskConical, title: "محیط ایزوله", desc: "هر کاربر محیط اختصاصی خود را دارد" },
  { icon: Shield, title: "یادگیری گام‌به‌گام", desc: "از مبتدی تا پیشرفته" },
];

const skills = [
  { icon: Search, label: "Bug Hunter" },
  { icon: Globe, label: "Web App Pentester" },
  { icon: Shield, label: "Ethical Hacker" },
  { icon: Code, label: "Programmer" },
  { icon: Skull, label: "Founder of رخنه‌گاه" },
];

export default function Index() {
  return (
    <div className="min-h-screen cyber-gradient cyber-grid">
      <Navbar />

      {/* Hero */}
      <section id="home" className="relative overflow-hidden">
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

        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 pb-24">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-3xl font-black mb-12 text-foreground"
        >
          چرا <span className="text-primary glow-text-primary font-mono">رخنه‌گاه</span>؟
        </motion.h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
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

      {/* About */}
      <section id="about" className="border-t border-border/50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl"
          >
            <h2 className="text-center text-3xl font-black mb-2 text-foreground">
              درباره <span className="text-primary glow-text-primary font-mono">بنیان‌گذار</span>
            </h2>
            <p className="text-center text-muted-foreground mb-10">ذهن پشت رخنه‌گاه</p>

            <div className="cyber-card p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full blur-3xl" />
              
              <div className="relative flex flex-col md:flex-row items-center gap-8">
                <div className="shrink-0">
                  <div className="h-28 w-28 rounded-full border-2 border-primary/50 bg-secondary/50 flex items-center justify-center glow-primary">
                    <User className="h-14 w-14 text-primary" />
                  </div>
                </div>
                <div className="text-center md:text-right flex-1">
                  <h3 className="text-2xl font-black text-primary font-mono glow-text-primary mb-1">
                    Zero Trace
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    متخصص امنیت سایبری و بنیان‌گذار پلتفرم رخنه‌گاه
                  </p>
                  <p className="text-sm text-foreground/70 leading-relaxed mb-6">
                    من Zero Trace هستم، یک هکر اخلاقی و محقق امنیت سایبری. هدفم ایجاد بستری امن برای آموزش و تمرین هک اخلاقی در افغانستان است. با سال‌ها تجربه در کشف آسیب‌پذیری، تست نفوذ وب‌اپلیکیشن‌ها و برنامه‌نویسی، رخنه‌گاه را ساختم تا نسل جدیدی از متخصصان امنیت سایبری را پرورش دهم.
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill.label}
                        className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-mono text-primary"
                      >
                        <skill.icon className="h-3 w-3" />
                        {skill.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-border/50 py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-black mb-2 text-foreground">
              <span className="text-primary glow-text-primary font-mono">تماس</span> با ما
            </h2>
            <p className="text-muted-foreground mb-10">سؤال، پیشنهاد یا همکاری؟ با ما در تماس باشید.</p>

            <div className="grid gap-4 sm:grid-cols-2">
              <a href="mailto:contact@rakhnegah.af" className="cyber-card p-6 flex items-center gap-4 hover:glow-primary transition-shadow duration-300 group">
                <Mail className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">ایمیل</p>
                  <p className="text-xs text-muted-foreground font-mono">contact@rakhnegah.af</p>
                </div>
              </a>
              <a href="https://github.com/zerotrace" target="_blank" rel="noopener noreferrer" className="cyber-card p-6 flex items-center gap-4 hover:glow-primary transition-shadow duration-300 group">
                <Github className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">گیت‌هاب</p>
                  <p className="text-xs text-muted-foreground font-mono">github.com/zerotrace</p>
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p className="font-mono text-primary/60">رخنه‌گاه © {new Date().getFullYear()}</p>
          <p className="mt-1 text-xs">ساخته‌شده توسط Zero Trace 🇦🇫</p>
        </div>
      </footer>
    </div>
  );
}
