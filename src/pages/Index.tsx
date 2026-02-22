import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, Terminal, Bug, FlaskConical, ChevronRight, User, Mail, Github, Globe, Code, Search, Skull, Zap, Lock, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const features = [
  { icon: Terminal, title: "Interactive Labs", desc: "Practice real attacks in a safe environment" },
  { icon: Bug, title: "Real Vulnerabilities", desc: "XSS, SQL Injection, CSRF and more" },
  { icon: FlaskConical, title: "Isolated Environment", desc: "Each user gets their own dedicated environment" },
  { icon: Shield, title: "Step-by-Step Learning", desc: "From beginner to advanced" },
];

const skills = [
  { icon: Search, label: "Bug Hunter" },
  { icon: Globe, label: "Web App Pentester" },
  { icon: Shield, label: "Ethical Hacker" },
  { icon: Code, label: "Programmer" },
  { icon: Skull, label: "Founder of AFPROPENT" },
];

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Index() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  return (
    <div className="min-h-screen cyber-gradient cyber-grid">
      <Navbar />

      {/* Hero */}
      <section id="home" className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-24 md:py-36">
          <motion.div
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary animate-border-flow"
            >
              <Shield className="h-4 w-4 animate-pulse-glow" />
              Afghanistan's First Pro Pentesting Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mb-6 text-5xl font-black tracking-tight md:text-7xl"
            >
              <span className="shimmer-text font-mono">AFPROPENT</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-4 text-xl text-muted-foreground md:text-2xl"
            >
              Afghanistan's Pro Pentesting Lab
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-10 text-base text-muted-foreground/70 max-w-xl mx-auto"
            >
              Practice ethical hacking in a safe and controlled environment. Discover real vulnerabilities and level up your skills.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/auth">
                <Button size="lg" className="glow-primary text-lg px-8 gap-2 hover-scale animate-glow-pulse">
                  Start Learning
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/labs">
                <Button variant="outline" size="lg" className="text-lg px-8 border-primary/30 text-primary hover:bg-primary/10 hover-scale">
                  View Labs
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated background elements */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.08, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl"
        />

        {/* Floating icons */}
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-[10%] hidden lg:block"
        >
          <Lock className="h-6 w-6 text-primary/20" />
        </motion.div>
        <motion.div
          animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/3 right-[10%] hidden lg:block"
        >
          <Database className="h-6 w-6 text-accent/20" />
        </motion.div>
        <motion.div
          animate={{ y: [-5, 15, -5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-1/4 left-[15%] hidden lg:block"
        >
          <Zap className="h-5 w-5 text-cyber-yellow/20" />
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 pb-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-3xl font-black mb-12 text-foreground"
        >
          Why <span className="shimmer-text font-mono">AFPROPENT</span>?
        </motion.h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={scaleIn}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="cyber-card p-6 hover:glow-primary transition-shadow duration-300 group"
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.4 } }}
              >
                <f.icon className="mb-4 h-8 w-8 text-primary group-hover:text-accent transition-colors duration-300" />
              </motion.div>
              <h3 className="mb-2 text-lg font-bold text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stats */}
      <section className="border-t border-border/50 bg-secondary/30 particle-bg">
        <div className="container mx-auto grid grid-cols-2 gap-8 px-4 py-16 md:grid-cols-4">
          {[
            { value: "8", label: "Categories" },
            { value: "51+", label: "Labs" },
            { value: "3", label: "Difficulty Levels" },
            { value: "∞", label: "Learning" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, type: "spring" }}
              className="text-center"
            >
              <div className="text-3xl font-black text-primary font-mono glow-text-primary">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
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
              About the <span className="shimmer-text font-mono">Team</span>
            </h2>
            <p className="text-center text-muted-foreground mb-10">The minds behind Rakhnegah</p>

            {/* Zero Trace - Founder */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
              className="cyber-card p-8 relative overflow-hidden scanline"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full blur-3xl" />
              
              <div className="relative flex flex-col md:flex-row items-center gap-8">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                  className="shrink-0"
                >
                  <div className="h-28 w-28 rounded-full border-2 border-primary/50 bg-secondary/50 flex items-center justify-center animate-glow-pulse">
                    <User className="h-14 w-14 text-primary" />
                  </div>
                </motion.div>
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-2xl font-black text-primary font-mono glow-text-primary mb-1">
                    Zero Trace
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Founder & Lead Developer
                  </p>
                  <p className="text-sm text-foreground/70 leading-relaxed mb-6">
                    I'm Zero Trace, an ethical hacker and cybersecurity researcher. My goal is to create a safe platform for learning and practicing ethical hacking in Afghanistan. With years of experience in vulnerability discovery, web application penetration testing, and programming, I built AFPROPENT to nurture the next generation of cybersecurity professionals.
                  </p>
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex flex-wrap justify-center md:justify-start gap-2"
                  >
                    {skills.map((skill) => (
                      <motion.span
                        key={skill.label}
                        variants={fadeUp}
                        whileHover={{ scale: 1.1, y: -2 }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-mono text-primary cursor-default"
                      >
                        <skill.icon className="h-3 w-3" />
                        {skill.label}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Cynsys - Team Member */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
              className="cyber-card p-8 relative overflow-hidden scanline mt-6"
            >
              <div className="absolute top-0 left-0 w-24 h-24 bg-accent/5 rounded-full blur-3xl" />
              
              <div className="relative flex flex-col md:flex-row items-center gap-8">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                  className="shrink-0"
                >
                  <div className="h-28 w-28 rounded-full border-2 border-accent/50 bg-secondary/50 flex items-center justify-center animate-glow-pulse">
                    <Bug className="h-14 w-14 text-accent" />
                  </div>
                </motion.div>
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-2xl font-black text-accent font-mono mb-1">
                    Cynsys
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Security Researcher & Developer
                  </p>
                  <p className="text-sm text-foreground/70 leading-relaxed mb-6">
                    Bug hunter and programmer with a sharp eye for finding vulnerabilities. A key contributor to the AFPROPENT team, bringing hands-on experience in security research and development.
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {[
                      { icon: Search, label: "Bug Hunter" },
                      { icon: Code, label: "Programmer" },
                      { icon: Shield, label: "Security Researcher" },
                    ].map((skill) => (
                      <motion.span
                        key={skill.label}
                        whileHover={{ scale: 1.1, y: -2 }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/5 px-3 py-1.5 text-xs font-mono text-accent cursor-default"
                      >
                        <skill.icon className="h-3 w-3" />
                        {skill.label}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-border/50 py-20 bg-secondary/20 particle-bg">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-black mb-2 text-foreground">
              <span className="shimmer-text font-mono">Contact</span> Us
            </h2>
            <p className="text-muted-foreground mb-10">Questions, suggestions, or collaboration? Get in touch.</p>

            <div className="grid gap-4 sm:grid-cols-2">
              <motion.a
                href="mailto:contact@rakhnegah.af"
                whileHover={{ scale: 1.03, y: -3 }}
                transition={{ duration: 0.2 }}
                className="cyber-card p-6 flex items-center gap-4 hover:glow-primary transition-shadow duration-300 group"
              >
                <Mail className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <p className="text-sm font-bold text-foreground">Email</p>
                  <p className="text-xs text-muted-foreground font-mono">contact@rakhnegah.af</p>
                </div>
              </motion.a>
              <motion.a
                href="https://github.com/zerotrace"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03, y: -3 }}
                transition={{ duration: 0.2 }}
                className="cyber-card p-6 flex items-center gap-4 hover:glow-primary transition-shadow duration-300 group"
              >
                <Github className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <p className="text-sm font-bold text-foreground">GitHub</p>
                  <p className="text-xs text-muted-foreground font-mono">github.com/zerotrace</p>
                </div>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p className="font-mono text-primary/60">AFPROPENT © {new Date().getFullYear()}</p>
          <p className="mt-1 text-xs">Built by Zero Trace 🇦🇫</p>
        </div>
      </footer>
    </div>
  );
}
