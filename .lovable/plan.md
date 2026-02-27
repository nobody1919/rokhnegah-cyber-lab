

## Plan: Add Roadmap Page for Bug Bounty / Cybersecurity / Ethical Hacking

### Overview
Create a new `/roadmap` page with a visually appealing, step-by-step learning roadmap for bug bounty, cybersecurity, and ethical hacking. Add a link in the Navbar.

### Steps

1. **Create `src/pages/Roadmap.tsx`**
   - Build a structured roadmap with phases:
     - **Phase 1: Foundations** - Networking (TCP/IP, DNS, HTTP), Linux basics, programming (Python, Bash)
     - **Phase 2: Web Security Basics** - OWASP Top 10, HTTP methods, cookies/sessions, browser dev tools
     - **Phase 3: Reconnaissance** - Subdomain enumeration, port scanning, OSINT, Google dorking
     - **Phase 4: Vulnerability Discovery** - XSS, SQLi, CSRF, IDOR, SSRF, file upload bugs
     - **Phase 5: Exploitation & Tools** - Burp Suite, Nmap, SQLMap, Metasploit, custom scripts
     - **Phase 6: Bug Bounty Hunting** - Choosing programs, writing reports, responsible disclosure, platforms (HackerOne, Bugcrowd)
     - **Phase 7: Advanced Topics** - API security, mobile app testing, cloud security, privilege escalation
   - Use the existing cyber theme (`cyber-card`, `shimmer-text`, `glow-primary`) and framer-motion animations
   - Each phase displayed as a vertical timeline with icons, descriptions, and recommended resources

2. **Update `src/App.tsx`**
   - Import `Roadmap` page
   - Add route: `<Route path="/roadmap" element={<Roadmap />} />`

3. **Update `src/components/Navbar.tsx`**
   - Add a "Roadmap" link with `Map` icon from lucide-react, visible to all users (not just logged-in)

