import { motion } from "framer-motion";
import { Shield, Terminal, Search, Bug, Wrench, Award, Cpu, BookOpen, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";

const phases = [
  {
    phase: 1,
    title: "Foundations",
    icon: Terminal,
    color: "text-green-400",
    borderColor: "border-green-400/30",
    bgColor: "bg-green-400/5",
    topics: [
      "Networking fundamentals (TCP/IP, DNS, HTTP/HTTPS)",
      "Linux command line & Bash scripting",
      "Programming basics (Python, JavaScript)",
      "Operating system concepts",
    ],
    resources: ["TryHackMe - Pre Security", "OverTheWire - Bandit", "Linux Journey"],
  },
  {
    phase: 2,
    title: "Web Security Basics",
    icon: Shield,
    color: "text-blue-400",
    borderColor: "border-blue-400/30",
    bgColor: "bg-blue-400/5",
    topics: [
      "OWASP Top 10 vulnerabilities",
      "HTTP methods, headers & status codes",
      "Cookies, sessions & authentication",
      "Browser developer tools mastery",
    ],
    resources: ["PortSwigger Web Security Academy", "OWASP WebGoat", "AFPROPENT Labs"],
  },
  {
    phase: 3,
    title: "Reconnaissance",
    icon: Search,
    color: "text-yellow-400",
    borderColor: "border-yellow-400/30",
    bgColor: "bg-yellow-400/5",
    topics: [
      "Subdomain enumeration (Subfinder, Amass)",
      "Port scanning (Nmap, Masscan)",
      "OSINT techniques & tools",
      "Google dorking & Shodan",
    ],
    resources: ["Bug Bounty Methodology - Jason Haddix", "Nahamsec Recon Playlist", "OSINT Framework"],
  },
  {
    phase: 4,
    title: "Vulnerability Discovery",
    icon: Bug,
    color: "text-red-400",
    borderColor: "border-red-400/30",
    bgColor: "bg-red-400/5",
    topics: [
      "XSS (Reflected, Stored, DOM-based)",
      "SQL Injection & NoSQL Injection",
      "CSRF, SSRF, IDOR",
      "File upload vulnerabilities & LFI/RFI",
    ],
    resources: ["PortSwigger Labs", "AFPROPENT Labs", "HackTheBox"],
  },
  {
    phase: 5,
    title: "Exploitation & Tools",
    icon: Wrench,
    color: "text-orange-400",
    borderColor: "border-orange-400/30",
    bgColor: "bg-orange-400/5",
    topics: [
      "Burp Suite Professional",
      "SQLMap, Nmap scripting",
      "Custom exploit development",
      "Metasploit Framework basics",
    ],
    resources: ["Burp Suite Certified Practitioner", "Offensive Security Labs", "VulnHub"],
  },
  {
    phase: 6,
    title: "Bug Bounty Hunting",
    icon: Award,
    color: "text-purple-400",
    borderColor: "border-purple-400/30",
    bgColor: "bg-purple-400/5",
    topics: [
      "Choosing bug bounty programs",
      "Writing professional reports",
      "Responsible disclosure practices",
      "Platforms: HackerOne, Bugcrowd, Intigriti",
    ],
    resources: ["HackerOne Hacktivity", "Bugcrowd University", "Bug Bounty Playbook"],
  },
  {
    phase: 7,
    title: "Advanced Topics",
    icon: Cpu,
    color: "text-cyan-400",
    borderColor: "border-cyan-400/30",
    bgColor: "bg-cyan-400/5",
    topics: [
      "API security testing (REST, GraphQL)",
      "Mobile application penetration testing",
      "Cloud security (AWS, Azure, GCP)",
      "Privilege escalation & post-exploitation",
    ],
    resources: ["SANS Training", "PentesterLab Pro", "Real-world bug bounty reports"],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function Roadmap() {
  return (
    <div className="min-h-screen cyber-gradient cyber-grid">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary">
            <BookOpen className="h-4 w-4" />
            Learning Path
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="shimmer-text font-mono">Cybersecurity</span> Roadmap
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your complete guide to becoming a professional ethical hacker and bug bounty hunter. Follow each phase step by step.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-border/50" />

          {phases.map((phase, i) => (
            <motion.div
              key={phase.phase}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08 }}
              className="relative pl-16 md:pl-20 mb-12 last:mb-0"
            >
              {/* Phase number circle */}
              <div className={`absolute left-0 top-0 h-12 w-12 md:h-16 md:w-16 rounded-full border-2 ${phase.borderColor} ${phase.bgColor} flex items-center justify-center`}>
                <phase.icon className={`h-5 w-5 md:h-6 md:w-6 ${phase.color}`} />
              </div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                className={`cyber-card p-6 border ${phase.borderColor}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-xs font-mono ${phase.color} bg-secondary/50 px-2 py-0.5 rounded`}>
                    Phase {phase.phase}
                  </span>
                  <h3 className={`text-xl font-black ${phase.color}`}>{phase.title}</h3>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-bold text-foreground mb-2">Topics:</h4>
                  <ul className="space-y-1.5">
                    {phase.topics.map((topic) => (
                      <li key={topic} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ChevronRight className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${phase.color}`} />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-foreground mb-2">Resources:</h4>
                  <div className="flex flex-wrap gap-2">
                    {phase.resources.map((r) => (
                      <span
                        key={r}
                        className={`text-xs font-mono px-2.5 py-1 rounded-full border ${phase.borderColor} ${phase.bgColor} ${phase.color}`}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p className="font-mono text-primary/60">AFPROPENT © {new Date().getFullYear()}</p>
          <p className="mt-1 text-xs">Built by Zero Trace 🇦🇫</p>
        </div>
      </footer>
    </div>
  );
}
