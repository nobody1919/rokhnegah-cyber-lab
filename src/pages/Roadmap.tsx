import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import {
  Network, Globe, Search, Bug, Wrench, Target, ShieldCheck,
  BookOpen, Terminal, Code, Eye, FileSearch, Zap, Server
} from "lucide-react";

const phases = [
  {
    phase: 1,
    title: "Foundations",
    icon: Network,
    color: "text-cyber-green",
    borderColor: "border-cyber-green/30",
    glowColor: "shadow-[0_0_15px_hsl(160_84%_39%/0.2)]",
    description: "Build your core technical knowledge before diving into security.",
    topics: [
      { icon: Globe, label: "Networking — TCP/IP, DNS, HTTP/HTTPS, OSI Model" },
      { icon: Terminal, label: "Linux Basics — Command line, file system, permissions" },
      { icon: Code, label: "Programming — Python, Bash scripting, basic web dev" },
    ],
    resources: ["TryHackMe: Pre-Security Path", "OverTheWire: Bandit", "Linux Journey"],
  },
  {
    phase: 2,
    title: "Web Security Basics",
    icon: Globe,
    color: "text-primary",
    borderColor: "border-primary/30",
    glowColor: "shadow-[0_0_15px_hsl(199_89%_48%/0.2)]",
    description: "Understand how web applications work and where vulnerabilities hide.",
    topics: [
      { icon: BookOpen, label: "OWASP Top 10 — Most critical web app risks" },
      { icon: Eye, label: "HTTP Deep Dive — Methods, headers, cookies, sessions" },
      { icon: Wrench, label: "Browser DevTools — Network tab, inspector, console" },
    ],
    resources: ["PortSwigger Web Security Academy", "OWASP Testing Guide", "HackTheBox Academy"],
  },
  {
    phase: 3,
    title: "Reconnaissance",
    icon: Search,
    color: "text-cyber-yellow",
    borderColor: "border-cyber-yellow/30",
    glowColor: "shadow-[0_0_15px_hsl(48_96%_53%/0.2)]",
    description: "Learn to gather intelligence and map your target's attack surface.",
    topics: [
      { icon: FileSearch, label: "Subdomain Enumeration — Amass, Subfinder, crt.sh" },
      { icon: Server, label: "Port Scanning — Nmap, Masscan, service fingerprinting" },
      { icon: Eye, label: "OSINT & Google Dorking — Shodan, Censys, advanced searches" },
    ],
    resources: ["Bug Bounty Hunting Essentials", "Nahamsec Recon Playlist", "OSINT Framework"],
  },
  {
    phase: 4,
    title: "Vulnerability Discovery",
    icon: Bug,
    color: "text-cyber-red",
    borderColor: "border-destructive/30",
    glowColor: "shadow-[0_0_15px_hsl(0_72%_51%/0.2)]",
    description: "Identify and exploit common web application vulnerabilities.",
    topics: [
      { icon: Zap, label: "Injection Attacks — XSS, SQLi, Command Injection" },
      { icon: Bug, label: "Logic Flaws — IDOR, CSRF, broken access control" },
      { icon: Server, label: "Server-Side — SSRF, file upload bugs, path traversal" },
    ],
    resources: ["PortSwigger Labs", "DVWA", "bWAPP", "HackTheBox Challenges"],
  },
  {
    phase: 5,
    title: "Exploitation & Tools",
    icon: Wrench,
    color: "text-cyber-orange",
    borderColor: "border-cyber-orange/30",
    glowColor: "shadow-[0_0_15px_hsl(25_95%_53%/0.2)]",
    description: "Master the essential tools of the trade for penetration testing.",
    topics: [
      { icon: Wrench, label: "Burp Suite — Proxy, repeater, intruder, scanner" },
      { icon: Terminal, label: "CLI Tools — Nmap, SQLMap, ffuf, Nuclei" },
      { icon: Code, label: "Custom Scripts — Python exploits, automation, scrapers" },
    ],
    resources: ["Burp Suite Certified Practitioner", "IppSec YouTube", "Metasploit Unleashed"],
  },
  {
    phase: 6,
    title: "Bug Bounty Hunting",
    icon: Target,
    color: "text-cyber-pink",
    borderColor: "border-cyber-pink/30",
    glowColor: "shadow-[0_0_15px_hsl(330_81%_60%/0.2)]",
    description: "Start hunting real bugs and earning bounties on live targets.",
    topics: [
      { icon: Target, label: "Platforms — HackerOne, Bugcrowd, Intigriti, YesWeHack" },
      { icon: BookOpen, label: "Report Writing — Clear PoC, impact, reproduction steps" },
      { icon: ShieldCheck, label: "Responsible Disclosure — Ethics, scope, legal considerations" },
    ],
    resources: ["HackerOne Hacktivity", "Bugcrowd University", "Nahamsec's Beginner Guide"],
  },
  {
    phase: 7,
    title: "Advanced Topics",
    icon: ShieldCheck,
    color: "text-cyber-purple",
    borderColor: "border-cyber-purple/30",
    glowColor: "shadow-[0_0_15px_hsl(263_70%_50%/0.2)]",
    description: "Level up with advanced attack vectors and specialized domains.",
    topics: [
      { icon: Server, label: "API Security — REST, GraphQL, authentication bypass" },
      { icon: Globe, label: "Cloud Security — AWS/GCP/Azure misconfigurations" },
      { icon: Zap, label: "Privilege Escalation — Linux/Windows privesc, lateral movement" },
    ],
    resources: ["Pentester Lab", "Hack The Box Pro Labs", "OSCP Certification"],
  },
];

export default function Roadmap() {
  return (
    <div className="min-h-screen bg-background cyber-grid">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold shimmer-text font-mono mb-4">
            Cybersecurity Roadmap
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your step-by-step path from beginner to bug bounty hunter. Follow each phase to build real-world hacking skills.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-accent/50 to-cyber-purple/50" />

          <div className="space-y-12">
            {phases.map((phase, i) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative pl-16 md:pl-20"
              >
                {/* Timeline dot */}
                <div className={`absolute left-3 md:left-5 top-2 w-7 h-7 rounded-full bg-background border-2 ${phase.borderColor} flex items-center justify-center ${phase.glowColor}`}>
                  <span className={`text-xs font-bold font-mono ${phase.color}`}>{phase.phase}</span>
                </div>

                <div className={`cyber-card p-6 border ${phase.borderColor}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <phase.icon className={`h-6 w-6 ${phase.color}`} />
                    <h2 className={`text-xl font-bold font-mono ${phase.color}`}>
                      Phase {phase.phase}: {phase.title}
                    </h2>
                  </div>

                  <p className="text-muted-foreground mb-4">{phase.description}</p>

                  <div className="space-y-2 mb-4">
                    {phase.topics.map((topic, j) => (
                      <div key={j} className="flex items-start gap-3 text-sm">
                        <topic.icon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                        <span className="text-foreground/80">{topic.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border/50 pt-3">
                    <p className="text-xs font-mono text-muted-foreground mb-1">Recommended Resources:</p>
                    <div className="flex flex-wrap gap-2">
                      {phase.resources.map((r, j) => (
                        <span key={j} className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground font-mono">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
