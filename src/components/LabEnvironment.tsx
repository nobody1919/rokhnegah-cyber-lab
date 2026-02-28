import { useState } from "react";
import { Terminal, AlertTriangle, Shield, BookOpen, Zap, Rocket } from "lucide-react";
import {
  XSSEventHandlerLab, XSSFilterBypassLab, XSSAttributeLab, XSSJSContextLab,
  XSSCookieStealLab, XSSPolyglotLab, XSSBlindLab,
  SQLiErrorLab, SQLiBlindBoolLab, SQLiTimeBlindLab, SQLiStackedLab,
  SQLiSecondOrderLab, SQLiWhereLab, SQLiOrderByLab, SQLiWAFBypassLab,
  CSRFPasswordLab,
  AuthDefaultLab, AuthJWTNoneLab,
  AccessForcedBrowseLab, AccessPathTraversalLab,
  FileMimeBypassLab, FileExtBypassLab,
  IDORApiLab,
  CmdBlindLab, CmdFilterBypassLab,
} from "./LabEnvironmentExtra";

interface LabEnvironmentProps {
  labType: string | null;
  onFlagFound?: (flag: string) => void;
}

export default function LabEnvironment({ labType, onFlagFound }: LabEnvironmentProps) {
  switch (labType) {
    case "xss_reflected": return <XSSReflectedLab onFlagFound={onFlagFound} />;
    case "xss_stored": return <XSSStoredLab onFlagFound={onFlagFound} />;
    case "xss_dom": return <XSSDOMLab onFlagFound={onFlagFound} />;
    case "xss_event_handler": return <XSSEventHandlerLab onFlagFound={onFlagFound} />;
    case "xss_filter_bypass": return <XSSFilterBypassLab onFlagFound={onFlagFound} />;
    case "xss_attribute": return <XSSAttributeLab onFlagFound={onFlagFound} />;
    case "xss_js_context": return <XSSJSContextLab onFlagFound={onFlagFound} />;
    case "xss_cookie_steal": return <XSSCookieStealLab onFlagFound={onFlagFound} />;
    case "xss_polyglot": return <XSSPolyglotLab onFlagFound={onFlagFound} />;
    case "xss_blind": return <XSSBlindLab onFlagFound={onFlagFound} />;
    case "sqli_login": return <SQLiLoginLab onFlagFound={onFlagFound} />;
    case "sqli_union": return <SQLiUnionLab onFlagFound={onFlagFound} />;
    case "sqli_error": return <SQLiErrorLab onFlagFound={onFlagFound} />;
    case "sqli_blind_bool": return <SQLiBlindBoolLab onFlagFound={onFlagFound} />;
    case "sqli_time_blind": return <SQLiTimeBlindLab onFlagFound={onFlagFound} />;
    case "sqli_stacked": return <SQLiStackedLab onFlagFound={onFlagFound} />;
    case "sqli_second_order": return <SQLiSecondOrderLab onFlagFound={onFlagFound} />;
    case "sqli_where": return <SQLiWhereLab onFlagFound={onFlagFound} />;
    case "sqli_orderby": return <SQLiOrderByLab onFlagFound={onFlagFound} />;
    case "sqli_waf_bypass": return <SQLiWAFBypassLab onFlagFound={onFlagFound} />;
    case "csrf_missing": return <CSRFMissingLab onFlagFound={onFlagFound} />;
    case "csrf_password": return <CSRFPasswordLab onFlagFound={onFlagFound} />;
    case "auth_weak": return <AuthWeakLab onFlagFound={onFlagFound} />;
    case "auth_default": return <AuthDefaultLab onFlagFound={onFlagFound} />;
    case "auth_jwt_none": return <AuthJWTNoneLab onFlagFound={onFlagFound} />;
    case "access_idor": return <AccessIDORLab onFlagFound={onFlagFound} />;
    case "access_forced_browse": return <AccessForcedBrowseLab onFlagFound={onFlagFound} />;
    case "access_path_traversal": return <AccessPathTraversalLab onFlagFound={onFlagFound} />;
    case "file_unrestricted": return <FileUploadLab onFlagFound={onFlagFound} />;
    case "file_mime_bypass": return <FileMimeBypassLab onFlagFound={onFlagFound} />;
    case "file_ext_bypass": return <FileExtBypassLab onFlagFound={onFlagFound} />;
    case "idor_basic": return <IDORBasicLab onFlagFound={onFlagFound} />;
    case "idor_api": return <IDORApiLab onFlagFound={onFlagFound} />;
    case "cmd_basic": return <CmdInjectionLab onFlagFound={onFlagFound} />;
    case "cmd_blind": return <CmdBlindLab onFlagFound={onFlagFound} />;
    case "cmd_filter_bypass": return <CmdFilterBypassLab onFlagFound={onFlagFound} />;
    default:
      return (
        <div className="cyber-card p-6 text-center">
          <Rocket className="mx-auto mb-3 h-8 w-8 text-primary" />
          <h3 className="text-lg font-bold mb-2 text-foreground">Coming Soon</h3>
          <p className="text-muted-foreground text-sm">
            The interactive simulation for this lab is under development. You can still solve the challenge using the objective and hints provided!
          </p>
        </div>
      );
  }
}

/* ============ Shared Components ============ */

interface VulnInfoProps {
  title: string;
  titleEn: string;
  description: string;
  impact: string[];
  severity: "critical" | "high" | "medium" | "low";
  cweId: string;
  owaspCategory: string;
}

function VulnInfoCard({ title, titleEn, description, impact, severity, cweId, owaspCategory }: VulnInfoProps) {
  const [expanded, setExpanded] = useState(true);
  const severityColors: Record<string, string> = {
    critical: "bg-cyber-red/10 text-cyber-red border-cyber-red/30",
    high: "bg-cyber-orange/10 text-cyber-orange border-cyber-orange/30",
    medium: "bg-cyber-yellow/10 text-cyber-yellow border-cyber-yellow/30",
    low: "bg-cyber-green/10 text-cyber-green border-cyber-green/30",
  };
  const severityLabel: Record<string, string> = {
    critical: "Critical",
    high: "High",
    medium: "Medium",
    low: "Low",
  };

  return (
    <div className="cyber-card mb-4 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full border-b border-border/50 bg-secondary/20 px-5 py-3 flex items-center justify-between hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-foreground">📚 Vulnerability Info</span>
        </div>
        <span className="text-xs text-muted-foreground">{expanded ? "Collapse ▲" : "Expand ▼"}</span>
      </button>
      {expanded && (
        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-lg font-bold text-foreground">{title}</h3>
              <p className="text-sm text-primary font-mono">{titleEn}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`rounded-full border px-3 py-1 text-xs font-bold ${severityColors[severity]}`}>
                {severityLabel[severity]}
              </span>
              <span className="rounded-full border border-border/50 bg-secondary/30 px-3 py-1 text-xs font-mono text-muted-foreground">
                {cweId}
              </span>
              <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-mono text-primary">
                {owaspCategory}
              </span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-cyber-orange" />
              <span className="text-sm font-bold text-cyber-orange">Impact</span>
            </div>
            <ul className="space-y-1">
              {impact.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <Zap className="h-3.5 w-3.5 mt-0.5 shrink-0 text-cyber-yellow" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function SimulatedAlert({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#f0f0f0] border-2 border-[#999] rounded shadow-2xl w-[400px] max-w-[90vw]">
        <div className="bg-gradient-to-r from-[#0078d7] to-[#005a9e] px-4 py-2 flex items-center gap-2">
          <Shield className="h-4 w-4 text-white" />
          <span className="text-white text-sm font-bold">JavaScript Alert</span>
        </div>
        <div className="p-6 text-center">
          <div className="mb-4 flex justify-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500" />
          </div>
          <p className="text-[#333] font-mono text-sm mb-6 break-all">{message}</p>
          <button
            onClick={onClose}
            className="bg-[#e1e1e1] hover:bg-[#d0d0d0] border border-[#adadad] rounded px-8 py-1.5 text-sm text-[#333] font-medium"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

function BrowserBar({ url }: { url: string }) {
  return (
    <div className="border-b border-border/50 bg-secondary/30 px-4 py-2 flex items-center gap-2">
      <div className="flex gap-1.5">
        <div className="h-3 w-3 rounded-full bg-cyber-red/60" />
        <div className="h-3 w-3 rounded-full bg-cyber-yellow/60" />
        <div className="h-3 w-3 rounded-full bg-cyber-green/60" />
      </div>
      <span className="text-xs font-mono text-muted-foreground ml-2">{url}</span>
    </div>
  );
}

/* ============ XSS Reflected ============ */
function XSSReflectedLab({ onFlagFound }: { onFlagFound?: (f: string) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string | null>(null);
  const [flagRevealed, setFlagRevealed] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [phase, setPhase] = useState<"searching" | "alert" | "flag" | null>(null);

  const handleSearch = () => {
    const scriptMatch = query.match(/<script>\s*alert\(([^)]*)\)\s*<\/script>/i);
    const hasXSS = /<script>|onerror=|onload=|javascript:/i.test(query);

    if (hasXSS) {
      setResults(`Search results for: ${query}`);
      setPhase("searching");
      
      setTimeout(() => {
        setAlertMsg(scriptMatch ? scriptMatch[1].replace(/['"]/g, "") : "XSS");
        setShowAlert(true);
        setPhase("alert");
      }, 500);
    } else {
      setResults(`Search results for: ${query} — No results found.`);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    setFlagRevealed(true);
    setPhase("flag");
    setResults(`✅ XSS successfully executed!\n\nYour injected code ran in the victim's browser.\n\n🎉 FLAG{xss_reflected_basic}`);
    onFlagFound?.("FLAG{xss_reflected_basic}");
  };

  return (
    <>
      {showAlert && <SimulatedAlert message={alertMsg} onClose={handleAlertClose} />}
      <VulnInfoCard
        title="Reflected Cross-Site Scripting"
        titleEn="Reflected Cross-Site Scripting (XSS)"
        description="In this vulnerability, user input is reflected directly in the HTML page without any filtering or encoding. An attacker can inject malicious JavaScript code via the URL or search form, and when a victim opens the tainted link, the code executes in their browser."
        impact={[
          "Cookie theft and session hijacking",
          "Page defacement",
          "Redirect to phishing sites",
          "Perform actions on behalf of the victim",
          "Steal sensitive information like passwords",
        ]}
        severity="high"
        cweId="CWE-79"
        owaspCategory="OWASP A03:2021"
      />
      <div className="cyber-card overflow-hidden">
        <BrowserBar url="vulnerable-app.local/search" />
        <div className="p-6">
          <h3 className="mb-4 text-lg font-bold">🔍 Product Search</h3>
          <div className="flex gap-2 mb-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='e.g.: <script>alert(1)</script>'
              className="flex-1 rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none"
              dir="ltr"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button onClick={handleSearch} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Search
            </button>
          </div>
          {results && (
            <pre className={`rounded-md border p-4 text-sm font-mono whitespace-pre-wrap ${flagRevealed ? "border-accent/50 bg-accent/5 text-accent" : "border-border/50 bg-secondary/20 text-foreground"}`}>
              {results}
            </pre>
          )}
          {!results && (
            <p className="text-xs text-muted-foreground mt-2">
              💡 This page displays your input directly in HTML without filtering. Try injecting JavaScript code and see what happens!
            </p>
          )}
        </div>
      </div>
    </>
  );
}

/* ============ XSS Stored ============ */
function XSSStoredLab({ onFlagFound }: { onFlagFound?: (f: string) => void }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    { user: "admin", text: "Welcome to our website!" },
    { user: "user1", text: "Great product." },
  ]);
  const [flagRevealed, setFlagRevealed] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const handlePost = () => {
    if (!comment.trim()) return;
    const scriptMatch = comment.match(/<script>\s*alert\(([^)]*)\)\s*<\/script>/i);
    const hasXSS = /<img|<script|onerror=|onload=|javascript:/i.test(comment);
    setComments([...comments, { user: "you", text: comment }]);
    if (hasXSS && !flagRevealed) {
      setTimeout(() => {
        setAlertMsg(scriptMatch ? scriptMatch[1].replace(/['"]/g, "") : "XSS");
        setShowAlert(true);
      }, 300);
    }
    setComment("");
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    setFlagRevealed(true);
    setComments((prev) => [
      ...prev,
      { user: "⚠️ system", text: "✅ Stored XSS executed! Every user who opens this page will have your code run in their browser.\n\n🎉 FLAG{xss_stored_comments}" },
    ]);
    onFlagFound?.("FLAG{xss_stored_comments}");
  };

  return (
    <>
      {showAlert && <SimulatedAlert message={alertMsg} onClose={handleAlertClose} />}
      <VulnInfoCard
        title="Stored Cross-Site Scripting"
        titleEn="Stored Cross-Site Scripting (XSS)"
        description="In Stored XSS, the attacker's malicious code is saved in the server's database (e.g., in comments). Every user who opens the infected page will have the malicious code execute in their browser. This is more dangerous than Reflected XSS because no special link click is required."
        impact={[
          "Permanent web page infection",
          "Data theft from all visitors",
          "Web worm creation that self-propagates",
          "Turn the site into a phishing page",
          "Install keylogger to capture passwords",
        ]}
        severity="critical"
        cweId="CWE-79"
        owaspCategory="OWASP A03:2021"
      />
      <div className="cyber-card overflow-hidden">
        <BrowserBar url="vulnerable-app.local/blog/comments" />
        <div className="p-6">
          <h3 className="mb-4 text-lg font-bold">💬 Comments Section</h3>
          <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
            {comments.map((c, i) => (
              <div key={i} className={`rounded-md border p-3 text-sm ${c.user === "⚠️ system" ? "border-accent/50 bg-accent/5" : "border-border/30 bg-secondary/20"}`}>
                <span className="font-bold text-primary font-mono text-xs">{c.user}:</span>
                <span className="ml-2 font-mono text-xs" dangerouslySetInnerHTML={{ __html: c.text }} />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder='<script>alert("hacked")</script>'
              className="flex-1 rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none"
              dir="ltr"
              onKeyDown={(e) => e.key === "Enter" && handlePost()}
            />
            <button onClick={handlePost} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Post
            </button>
          </div>
          {!flagRevealed && (
            <p className="text-xs text-muted-foreground mt-2">
              💡 Comments are rendered as HTML without filtering. Try injecting JavaScript code!
            </p>
          )}
        </div>
      </div>
    </>
  );
}

/* ============ XSS DOM ============ */
function XSSDOMLab({ onFlagFound }: { onFlagFound?: (f: string) => void }) {
  const [hashInput, setHashInput] = useState("");
  const [output, setOutput] = useState("");
  const [flagRevealed, setFlagRevealed] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const handleLoad = () => {
    const scriptMatch = hashInput.match(/alert\(([^)]*)\)/i);
    const hasXSS = /<img|<script|onerror=|onload=/i.test(hashInput);
    if (hasXSS && !flagRevealed) {
      setOutput(`Welcome, ${hashInput}!`);
      setTimeout(() => {
        setAlertMsg(scriptMatch ? scriptMatch[1].replace(/['"]/g, "") : "XSS");
        setShowAlert(true);
      }, 300);
    } else {
      setOutput(`Welcome, ${hashInput || "user"}!`);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    setFlagRevealed(true);
    setOutput(`✅ DOM XSS executed!\n\nYour code entered the DOM via location.hash without filtering.\n\n🎉 FLAG{xss_dom_fragment}`);
    onFlagFound?.("FLAG{xss_dom_fragment}");
  };

  return (
    <>
      {showAlert && <SimulatedAlert message={alertMsg} onClose={handleAlertClose} />}
      <VulnInfoCard
        title="DOM-Based Cross-Site Scripting"
        titleEn="DOM-Based Cross-Site Scripting"
        description="In DOM XSS, the vulnerability occurs entirely on the client side (JavaScript). Client-side code places user input (e.g., from URL hash) directly into the DOM without sanitization. This attack works even without sending a request to the server."
        impact={[
          "Bypass Web Application Firewalls (WAF)",
          "Attack without server-side logging",
          "Steal client-side data",
          "Modify application behavior",
        ]}
        severity="high"
        cweId="CWE-79"
        owaspCategory="OWASP A03:2021"
      />
      <div className="cyber-card overflow-hidden">
        <BrowserBar url="vulnerable-app.local/welcome#" />
        <div className="p-6">
          <h3 className="mb-2 text-lg font-bold">👋 Welcome Page</h3>
          <p className="text-xs text-muted-foreground mb-4">This page reads the username from URL hash and places it directly into the DOM.</p>
          <div className="mb-4 rounded-md border border-border/30 bg-secondary/20 p-3">
            <code className="text-xs text-muted-foreground">
              {`document.getElementById("welcome").innerHTML = location.hash.slice(1);`}
            </code>
          </div>
          <div className="flex gap-2 mb-4">
            <span className="rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono text-muted-foreground">#</span>
            <input
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              placeholder='<img src=x onerror=alert(1)>'
              className="flex-1 rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none"
              dir="ltr"
              onKeyDown={(e) => e.key === "Enter" && handleLoad()}
            />
            <button onClick={handleLoad} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Load
            </button>
          </div>
          {output && (
            <pre className={`rounded-md border p-4 text-sm font-mono whitespace-pre-wrap ${flagRevealed ? "border-accent/50 bg-accent/5 text-accent" : "border-border/50 bg-secondary/20"}`}>
              {output}
            </pre>
          )}
        </div>
      </div>
    </>
  );
}

/* ============ SQLi Login ============ */
function SQLiLoginLab({ onFlagFound }: { onFlagFound?: (f: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [output, setOutput] = useState("");
  const [flagRevealed, setFlagRevealed] = useState(false);

  const handleLogin = () => {
    const hasSQLi = /('.*OR.*1=1|'.*OR.*'1'='1|admin'--|'.*--.*)$/i.test(username);
    if (hasSQLi) {
      setFlagRevealed(true);
      setOutput(`✅ Login successful as admin!\n\nQuery: SELECT * FROM users WHERE username='${username}' AND password='${password}'\n\n⚠️ Your input made the WHERE condition always True!\n\n🎉 FLAG{sqli_login_bypass}`);
      onFlagFound?.("FLAG{sqli_login_bypass}");
    } else if (username === "admin" && password === "admin") {
      setOutput("✅ Login successful (but you used the actual password — try SQL injection!)");
    } else {
      setOutput(`❌ Login failed.\n\nQuery: SELECT * FROM users WHERE username='${username}' AND password='${password}'`);
    }
  };

  return (
    <>
      <VulnInfoCard
        title="SQL Injection - Login Bypass"
        titleEn="SQL Injection - Login Bypass"
        description="In this attack, the attacker injects SQL code into the input field to alter the database query structure. When input is placed directly in the query without parameterization, the attacker can bypass authentication and log in without a password."
        impact={[
          "Unauthorized access to user accounts",
          "Complete authentication bypass",
          "Access to admin panel",
          "Read, modify, or delete the entire database",
          "Execute OS commands (in advanced cases)",
        ]}
        severity="critical"
        cweId="CWE-89"
        owaspCategory="OWASP A03:2021"
      />
      <div className="cyber-card overflow-hidden">
        <BrowserBar url="vulnerable-app.local/login" />
        <div className="p-6">
          <h3 className="mb-4 text-lg font-bold">🔐 System Login</h3>
          <div className="space-y-3 mb-4 max-w-sm">
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin' OR 1=1--" className="w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" dir="ltr" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" dir="ltr" onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
            <button onClick={handleLogin} className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Login</button>
          </div>
          {output && (
            <pre className={`rounded-md border p-4 text-xs font-mono whitespace-pre-wrap ${flagRevealed ? "border-accent/50 bg-accent/5 text-accent" : "border-border/50 bg-secondary/20"}`}>{output}</pre>
          )}
          {!output && (
            <div className="rounded-md border border-border/30 bg-secondary/20 p-3 mt-2">
              <code className="text-xs text-muted-foreground">{`SELECT * FROM users WHERE username='$input' AND password='$input'`}</code>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ============ SQLi UNION ============ */
function SQLiUnionLab({ onFlagFound }: { onFlagFound?: (f: string) => void }) {
  const [search, setSearch] = useState("");
  const [output, setOutput] = useState("");
  const [flagRevealed, setFlagRevealed] = useState(false);

  const handleSearch = () => {
    const hasUnion = /UNION\s+SELECT/i.test(search);
    if (hasUnion) {
      setFlagRevealed(true);
      setOutput(`Results:\n┌──────────┬──────────────────┐\n│ username │ password         │\n├──────────┼──────────────────┤\n│ admin    │ s3cret_p@ss!     │\n│ user1    │ password123      │\n└──────────┴──────────────────┘\n\n⚠️ With UNION SELECT you extracted data from another table!\n\n🎉 FLAG{sqli_union_extract}`);
      onFlagFound?.("FLAG{sqli_union_extract}");
    } else {
      setOutput(`Results for "${search}":\n┌────┬───────────────┬────────┐\n│ id │ product       │ price  │\n├────┼───────────────┼────────┤\n│ 1  │ Laptop        │ $999   │\n│ 2  │ Keyboard      │ $49    │\n└────┴───────────────┴────────┘`);
    }
  };

  return (
    <>
      <VulnInfoCard
        title="SQL Injection - UNION Data Extraction"
        titleEn="SQL Injection - UNION Based Data Extraction"
        description="In UNION-based SQLi, the attacker appends a UNION SELECT to the original query to extract data from other tables (like the users table). The key requirement is that the number of columns in the original SELECT and the UNION SELECT must match."
        impact={[
          "Extract usernames and passwords",
          "Access confidential information",
          "Identify database structure",
          "Extract financial and personal data",
        ]}
        severity="critical"
        cweId="CWE-89"
        owaspCategory="OWASP A03:2021"
      />
      <div className="cyber-card overflow-hidden">
        <BrowserBar url="vulnerable-app.local/products?search=" />
        <div className="p-6">
          <h3 className="mb-4 text-lg font-bold">🛒 Product Search</h3>
          <div className="flex gap-2 mb-4">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="' UNION SELECT username, password FROM users--" className="flex-1 rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" dir="ltr" onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
            <button onClick={handleSearch} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Search</button>
          </div>
          {output && (
            <pre className={`rounded-md border p-4 text-xs font-mono whitespace-pre-wrap ${flagRevealed ? "border-accent/50 bg-accent/5 text-accent" : "border-border/50 bg-secondary/20"}`}>{output}</pre>
          )}
          <p className="text-xs text-muted-foreground mt-2">💡 The products table has 2 columns. The users table contains username and password.</p>
        </div>
      </div>
    </>
  );
}

/* ============ CSRF Missing ============ */
function CSRFMissingLab({ onFlagFound }: { onFlagFound?: (f: string) => void }) {
  const [email, setEmail] = useState("admin@example.com");
  const [newEmail, setNewEmail] = useState("");
  const [flagRevealed, setFlagRevealed] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const handleChange = () => {
    if (newEmail.trim()) {
      setLog((l) => [...l, `[POST] /api/change-email → email=${newEmail} (No CSRF token!)`, `✅ Email changed successfully without CSRF token!`, `🎉 FLAG{csrf_missing_token}`]);
      setEmail(newEmail);
      setFlagRevealed(true);
      onFlagFound?.("FLAG{csrf_missing_token}");
    }
  };

  return (
    <>
      <VulnInfoCard
        title="Cross-Site Request Forgery"
        titleEn="Cross-Site Request Forgery (CSRF)"
        description="In a CSRF attack, the attacker tricks the victim into unknowingly sending a request (e.g., changing email) to the target site. If the site doesn't use a CSRF token, the server cannot determine whether the request is legitimate or crafted by the attacker."
        impact={[
          "Change user's email and password",
          "Unauthorized fund transfers",
          "Modify account settings",
          "Send messages on behalf of the victim",
        ]}
        severity="medium"
        cweId="CWE-352"
        owaspCategory="OWASP A01:2021"
      />
      <div className="cyber-card overflow-hidden">
        <BrowserBar url="vulnerable-app.local/settings" />
        <div className="p-6">
          <h3 className="mb-4 text-lg font-bold">⚙️ Account Settings</h3>
          <div className="mb-4 rounded-md border border-border/30 bg-secondary/20 p-3">
            <span className="text-xs text-muted-foreground">Current email: </span>
            <span className="text-sm font-mono text-primary">{email}</span>
          </div>
          <div className="mb-2 rounded-md border border-cyber-yellow/30 bg-cyber-yellow/5 p-3">
            <code className="text-xs text-cyber-yellow whitespace-pre">{`<form action="/api/change-email" method="POST">\n  <!-- ❌ No CSRF token! -->\n  <input name="email" value="...">\n</form>`}</code>
          </div>
          <div className="flex gap-2 mt-4 max-w-sm">
            <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="hacker@evil.com" className="flex-1 rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" dir="ltr" />
            <button onClick={handleChange} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Change</button>
          </div>
          {log.length > 0 && (
            <pre className={`mt-4 rounded-md border p-4 text-xs font-mono whitespace-pre-wrap ${flagRevealed ? "border-accent/50 bg-accent/5 text-accent" : "border-border/50 bg-secondary/20"}`}>{log.join("\n")}</pre>
          )}
        </div>
      </div>
    </>
  );
}

/* ============ Auth Weak ============ */
function AuthWeakLab({ onFlagFound }: { onFlagFound?: (f: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [output, setOutput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [flagRevealed, setFlagRevealed] = useState(false);

  const handleLogin = () => {
    setAttempts((a) => a + 1);
    if (username.toLowerCase() === "admin" && password === "password123") {
      setFlagRevealed(true);
      setOutput(`✅ Login successful!\nWelcome, admin!\n\n⚠️ The password was weak and there was no brute-force protection!\n\n🎉 FLAG{auth_weak_password}\n\nAttempts: ${attempts + 1}`);
      onFlagFound?.("FLAG{auth_weak_password}");
    } else {
      setOutput(`❌ Invalid credentials.\nAttempts: ${attempts + 1}\n\n💡 Try common passwords: admin, password, 123456, password123...`);
    }
  };

  return (
    <>
      <VulnInfoCard
        title="Weak Authentication"
        titleEn="Weak Authentication / Brute Force"
        description="When a system allows weak passwords and has no rate limiting on login attempts, an attacker can gain access by trying common passwords (dictionary attack) or through brute force."
        impact={[
          "Unauthorized access to user accounts",
          "Admin account takeover",
          "Access to confidential information",
          "Unlimited brute-force attacks",
        ]}
        severity="high"
        cweId="CWE-307"
        owaspCategory="OWASP A07:2021"
      />
      <div className="cyber-card overflow-hidden">
        <BrowserBar url="vulnerable-app.local/admin-login" />
        <div className="p-6">
          <h3 className="mb-4 text-lg font-bold">🔐 Admin Panel</h3>
          <div className="space-y-3 mb-4 max-w-sm">
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" className="w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" dir="ltr" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password123" className="w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" dir="ltr" onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
            <button onClick={handleLogin} className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Login</button>
          </div>
          {output && (
            <pre className={`rounded-md border p-4 text-xs font-mono whitespace-pre-wrap ${flagRevealed ? "border-accent/50 bg-accent/5 text-accent" : "border-border/50 bg-secondary/20"}`}>{output}</pre>
          )}
        </div>
      </div>
    </>
  );
}

/* ============ Access Control / IDOR ============ */
function AccessIDORLab({ onFlagFound }: { onFlagFound?: (f: string) => void }) {
  const [userId, setUserId] = useState("1001");
  const [output, setOutput] = useState("");
  const [flagRevealed, setFlagRevealed] = useState(false);

  const handleView = () => {
    if (userId === "1001") {
      setOutput(`Profile #1001 (Your profile)\n{\n  "name": "John",\n  "email": "john@example.com",\n  "role": "user"\n}`);
    } else if (userId === "1" || userId === "1000") {
      setFlagRevealed(true);
      setOutput(`Profile #${userId} (Admin profile!)\n{\n  "name": "Admin",\n  "email": "admin@company.com",\n  "role": "admin",\n  "secret": "FLAG{access_control_idor}"\n}\n\n⚠️ The server doesn't check if you're authorized to view this profile!`);
      onFlagFound?.("FLAG{access_control_idor}");
    } else {
      setOutput(`Profile #${userId}\n{\n  "name": "User ${userId}",\n  "email": "user${userId}@example.com",\n  "role": "user"\n}`);
    }
  };

  return (
    <>
      <VulnInfoCard
        title="Insecure Direct Object Reference"
        titleEn="Insecure Direct Object Reference (IDOR)"
        description="In IDOR, the server doesn't check user authorization. An attacker can access other users' information by simply changing the ID in the URL or API request."
        impact={[
          "View other users' personal information",
          "Modify or delete others' data",
          "Access confidential files",
          "Privilege escalation",
        ]}
        severity="high"
        cweId="CWE-639"
        owaspCategory="OWASP A01:2021"
      />
      <div className="cyber-card overflow-hidden">
        <BrowserBar url={`vulnerable-app.local/api/profile?id=${userId}`} />
        <div className="p-6">
          <h3 className="mb-4 text-lg font-bold">👤 View Profile</h3>
          <div className="flex gap-2 mb-4 max-w-sm">
            <span className="rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono text-muted-foreground">?id=</span>
            <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="1" className="flex-1 rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" dir="ltr" onKeyDown={(e) => e.key === "Enter" && handleView()} />
            <button onClick={handleView} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">View</button>
          </div>
          {output && (
            <pre className={`rounded-md border p-4 text-xs font-mono whitespace-pre-wrap ${flagRevealed ? "border-accent/50 bg-accent/5 text-accent" : "border-border/50 bg-secondary/20"}`}>{output}</pre>
          )}
          <p className="text-xs text-muted-foreground mt-2">💡 Your ID is 1001. Try IDs 1 or 1000.</p>
        </div>
      </div>
    </>
  );
}

/* ============ File Upload ============ */
function FileUploadLab({ onFlagFound }: { onFlagFound?: (f: string) => void }) {
  const [fileName, setFileName] = useState("");
  const [output, setOutput] = useState("");
  const [flagRevealed, setFlagRevealed] = useState(false);

  const handleUpload = () => {
    if (!fileName.trim()) return;
    const isDangerous = /\.(php|jsp|asp|aspx|js|py|sh|exe|bat)$/i.test(fileName);
    if (isDangerous) {
      setFlagRevealed(true);
      setOutput(`✅ File uploaded: ${fileName}\n📁 Location: /uploads/${fileName}\n\n⚠️ Dangerous file accepted without any validation!\nAn attacker can execute malicious code by accessing /uploads/${fileName}.\n\n🎉 FLAG{file_upload_unrestricted}`);
      onFlagFound?.("FLAG{file_upload_unrestricted}");
    } else {
      setOutput(`✅ File uploaded: ${fileName}\n📁 Location: /uploads/${fileName}\n\n(Safe file type — try uploading a .php or .jsp file)`);
    }
  };

  return (
    <>
      <VulnInfoCard
        title="Unrestricted File Upload"
        titleEn="Unrestricted File Upload"
        description="When the server performs no validation on uploaded file types, an attacker can upload executable files (like web shells) and gain complete control over the server."
        impact={[
          "Remote Code Execution (RCE)",
          "Full server access (Web Shell)",
          "Read sensitive server files",
          "Lateral movement in internal network",
        ]}
        severity="critical"
        cweId="CWE-434"
        owaspCategory="OWASP A04:2021"
      />
      <div className="cyber-card overflow-hidden">
        <BrowserBar url="vulnerable-app.local/upload" />
        <div className="p-6">
          <h3 className="mb-4 text-lg font-bold">📤 File Upload</h3>
          <div className="flex gap-2 mb-4 max-w-sm">
            <input value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="shell.php" className="flex-1 rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" dir="ltr" onKeyDown={(e) => e.key === "Enter" && handleUpload()} />
            <button onClick={handleUpload} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Upload</button>
          </div>
          {output && (
            <pre className={`rounded-md border p-4 text-xs font-mono whitespace-pre-wrap ${flagRevealed ? "border-accent/50 bg-accent/5 text-accent" : "border-border/50 bg-secondary/20"}`}>{output}</pre>
          )}
        </div>
      </div>
    </>
  );
}

/* ============ IDOR Basic ============ */
function IDORBasicLab({ onFlagFound }: { onFlagFound?: (f: string) => void }) {
  const [invoiceId, setInvoiceId] = useState("42");
  const [output, setOutput] = useState("");
  const [flagRevealed, setFlagRevealed] = useState(false);

  const handleView = () => {
    if (invoiceId === "1337") {
      setFlagRevealed(true);
      setOutput(`Invoice #1337 (Restricted!)\n{\n  "owner": "CEO",\n  "amount": "$50,000",\n  "status": "paid",\n  "secret": "FLAG{idor_invoice_access}"\n}\n\n⚠️ Confidential invoice displayed without authorization check!`);
      onFlagFound?.("FLAG{idor_invoice_access}");
    } else if (invoiceId === "42") {
      setOutput(`Invoice #42 (Your invoice)\n{\n  "owner": "You",\n  "amount": "$150",\n  "status": "pending"\n}`);
    } else {
      setOutput(`Invoice #${invoiceId}\n{\n  "owner": "User",\n  "amount": "$${Math.floor(Math.random() * 1000)}",\n  "status": "paid"\n}`);
    }
  };

  return (
    <>
      <VulnInfoCard
        title="IDOR - Invoice Access"
        titleEn="IDOR - Invoice Access"
        description="This lab demonstrates how changing a simple ID in the URL can give access to confidential data when authorization checks are missing."
        impact={[
          "Disclosure of confidential financial information",
          "Access to other users' invoices",
          "Privacy violation",
          "Financial exploitation",
        ]}
        severity="high"
        cweId="CWE-639"
        owaspCategory="OWASP A01:2021"
      />
      <div className="cyber-card overflow-hidden">
        <BrowserBar url={`vulnerable-app.local/api/invoice?id=${invoiceId}`} />
        <div className="p-6">
          <h3 className="mb-4 text-lg font-bold">🧾 View Invoice</h3>
          <div className="flex gap-2 mb-4 max-w-sm">
            <span className="rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono text-muted-foreground">invoice_id=</span>
            <input value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)} placeholder="1337" className="flex-1 rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" dir="ltr" onKeyDown={(e) => e.key === "Enter" && handleView()} />
            <button onClick={handleView} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">View</button>
          </div>
          {output && (
            <pre className={`rounded-md border p-4 text-xs font-mono whitespace-pre-wrap ${flagRevealed ? "border-accent/50 bg-accent/5 text-accent" : "border-border/50 bg-secondary/20"}`}>{output}</pre>
          )}
          <p className="text-xs text-muted-foreground mt-2">💡 Your invoice is #42. Invoice #1337 belongs to the CEO.</p>
        </div>
      </div>
    </>
  );
}

/* ============ Command Injection ============ */
function CmdInjectionLab({ onFlagFound }: { onFlagFound?: (f: string) => void }) {
  const [ip, setIp] = useState("");
  const [output, setOutput] = useState("");
  const [flagRevealed, setFlagRevealed] = useState(false);

  const handlePing = () => {
    const hasCmdInj = /[;&|`$]/.test(ip);
    if (hasCmdInj) {
      setFlagRevealed(true);
      const parts = ip.split(/[;&|`$]/);
      const cmd = parts.slice(1).join("").trim();
      setOutput(`$ ping -c 4 ${parts[0].trim()}\nPING ${parts[0].trim()}: 64 bytes, icmp_seq=1 ttl=64\n\n$ ${cmd || "whoami"}\nroot\n\n⚠️ Your command was executed directly on the server shell!\n\n🎉 FLAG{cmd_injection_basic}`);
      onFlagFound?.("FLAG{cmd_injection_basic}");
    } else {
      setOutput(`$ ping -c 4 ${ip || "..."}\n${ip ? `PING ${ip}: 64 bytes from ${ip}: icmp_seq=1 ttl=64 time=0.5ms\nPING ${ip}: 64 bytes from ${ip}: icmp_seq=2 ttl=64 time=0.3ms\n\n--- ${ip} ping statistics ---\n4 packets transmitted, 4 received, 0% packet loss` : "Usage: Enter an IP address to ping."}`);
    }
  };

  return (
    <>
      <VulnInfoCard
        title="OS Command Injection"
        titleEn="OS Command Injection"
        description="When the application uses user input directly in OS commands without filtering, an attacker can use special characters (like ; or |) to execute arbitrary commands and gain complete control over the server."
        impact={[
          "Remote Code Execution (RCE)",
          "Read sensitive files (/etc/passwd)",
          "Create backdoor for persistent access",
          "Lateral movement in the network",
          "Data deletion or encryption (Ransomware)",
        ]}
        severity="critical"
        cweId="CWE-78"
        owaspCategory="OWASP A03:2021"
      />
      <div className="cyber-card overflow-hidden">
        <BrowserBar url="vulnerable-app.local/network-tools" />
        <div className="p-6">
          <h3 className="mb-4 text-lg font-bold">🌐 Network Tools - Ping</h3>
          <div className="flex gap-2 mb-4 max-w-md">
            <input value={ip} onChange={(e) => setIp(e.target.value)} placeholder="127.0.0.1; cat /etc/passwd" className="flex-1 rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" dir="ltr" onKeyDown={(e) => e.key === "Enter" && handlePing()} />
            <button onClick={handlePing} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Ping</button>
          </div>
          {output && (
            <pre className={`rounded-md border p-4 text-xs font-mono whitespace-pre-wrap ${flagRevealed ? "border-accent/50 bg-accent/5 text-accent" : "border-border/50 bg-secondary/20 text-foreground/80"}`}>{output}</pre>
          )}
          <p className="text-xs text-muted-foreground mt-2">💡 The server runs <code className="text-primary">ping -c 4 $input</code> without filtering. Use ; or | to chain commands.</p>
        </div>
      </div>
    </>
  );
}
