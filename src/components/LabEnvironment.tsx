import { useState } from "react";
import { Terminal, AlertTriangle, Shield, BookOpen, Zap } from "lucide-react";

interface LabEnvironmentProps {
  labType: string | null;
  onFlagFound?: (flag: string) => void;
}

export default function LabEnvironment({ labType, onFlagFound }: LabEnvironmentProps) {
  switch (labType) {
    case "xss_reflected":
      return <XSSReflectedLab onFlagFound={onFlagFound} />;
    case "xss_stored":
      return <XSSStoredLab onFlagFound={onFlagFound} />;
    case "xss_dom":
      return <XSSDOMLab onFlagFound={onFlagFound} />;
    case "sqli_login":
      return <SQLiLoginLab onFlagFound={onFlagFound} />;
    case "sqli_union":
      return <SQLiUnionLab onFlagFound={onFlagFound} />;
    case "csrf_missing":
      return <CSRFMissingLab onFlagFound={onFlagFound} />;
    case "auth_weak":
      return <AuthWeakLab onFlagFound={onFlagFound} />;
    case "access_idor":
      return <AccessIDORLab onFlagFound={onFlagFound} />;
    case "file_unrestricted":
      return <FileUploadLab onFlagFound={onFlagFound} />;
    case "idor_basic":
      return <IDORBasicLab onFlagFound={onFlagFound} />;
    case "cmd_basic":
      return <CmdInjectionLab onFlagFound={onFlagFound} />;
    default:
      return (
        <div className="cyber-card p-6 text-center text-muted-foreground">
          <Terminal className="mx-auto mb-3 h-8 w-8" />
          <p>محیط شبیه‌سازی برای این آزمایشگاه در دسترس نیست.</p>
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
    critical: "بحرانی",
    high: "بالا",
    medium: "متوسط",
    low: "پایین",
  };

  return (
    <div className="cyber-card mb-4 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full border-b border-border/50 bg-secondary/20 px-5 py-3 flex items-center justify-between hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-foreground">📚 آموزش آسیب‌پذیری</span>
        </div>
        <span className="text-xs text-muted-foreground">{expanded ? "بستن ▲" : "باز کردن ▼"}</span>
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
              <span className="text-sm font-bold text-cyber-orange">تأثیرات (Impact)</span>
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
      setResults(`نتیجه جستجو برای: ${query}`);
      setPhase("searching");
      
      setTimeout(() => {
        setAlertMsg(scriptMatch ? scriptMatch[1].replace(/['"]/g, "") : "XSS");
        setShowAlert(true);
        setPhase("alert");
      }, 500);
    } else {
      setResults(`نتیجه جستجو برای: ${query} — هیچ موردی یافت نشد.`);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    setFlagRevealed(true);
    setPhase("flag");
    setResults(`✅ XSS با موفقیت اجرا شد!\n\nکد تزریق‌شده شما در مرورگر قربانی اجرا شد.\n\n🎉 FLAG{xss_reflected_basic}`);
    onFlagFound?.("FLAG{xss_reflected_basic}");
  };

  return (
    <>
      {showAlert && <SimulatedAlert message={alertMsg} onClose={handleAlertClose} />}
      <VulnInfoCard
        title="اسکریپت بین‌سایتی بازتابی"
        titleEn="Reflected Cross-Site Scripting (XSS)"
        description="در این آسیب‌پذیری، ورودی کاربر بدون هیچ فیلتر یا رمزگذاری (encoding) مستقیماً در صفحه HTML بازتاب داده می‌شود. مهاجم می‌تواند کد JavaScript مخرب را در URL یا فرم جستجو تزریق کند و وقتی قربانی لینک آلوده را باز کند، کد در مرورگر او اجرا می‌شود."
        impact={[
          "سرقت کوکی‌ها و توکن‌های نشست (Session Hijacking)",
          "تغییر محتوای صفحه (Defacement)",
          "ریدایرکت به سایت فیشینگ",
          "اجرای عملیات به نام کاربر قربانی",
          "سرقت اطلاعات حساس مانند رمز عبور",
        ]}
        severity="high"
        cweId="CWE-79"
        owaspCategory="OWASP A03:2021"
      />
      <div className="cyber-card overflow-hidden">
        <BrowserBar url="vulnerable-app.local/search" />
        <div className="p-6">
          <h3 className="mb-4 text-lg font-bold">🔍 جستجوی محصولات</h3>
          <div className="flex gap-2 mb-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='مثلاً: <script>alert(1)</script>'
              className="flex-1 rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none"
              dir="ltr"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button onClick={handleSearch} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              جستجو
            </button>
          </div>
          {results && (
            <pre className={`rounded-md border p-4 text-sm font-mono whitespace-pre-wrap ${flagRevealed ? "border-accent/50 bg-accent/5 text-accent" : "border-border/50 bg-secondary/20 text-foreground"}`}>
              {results}
            </pre>
          )}
          {!results && (
            <p className="text-xs text-muted-foreground mt-2">
              💡 این صفحه ورودی شما را بدون فیلتر در HTML نمایش می‌دهد. سعی کنید کد JavaScript تزریق کنید و ببینید چه اتفاقی می‌افتد!
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
    { user: "admin", text: "به وبسایت ما خوش آمدید!" },
    { user: "user1", text: "محصول عالی بود." },
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
      { user: "⚠️ system", text: "✅ Stored XSS اجرا شد! هر کاربری که این صفحه را باز کند، کد شما اجرا می‌شود.\n\n🎉 FLAG{xss_stored_comments}" },
    ]);
    onFlagFound?.("FLAG{xss_stored_comments}");
  };

  return (
    <>
      {showAlert && <SimulatedAlert message={alertMsg} onClose={handleAlertClose} />}
      <VulnInfoCard
        title="اسکریپت بین‌سایتی ذخیره‌شده"
        titleEn="Stored Cross-Site Scripting (XSS)"
        description="در XSS ذخیره‌شده، کد مخرب مهاجم در دیتابیس سرور ذخیره می‌شود (مثلاً در نظرات). هر کاربری که صفحه آلوده را باز کند، کد مخرب در مرورگرش اجرا می‌شود. این خطرناک‌تر از Reflected XSS است چون نیازی به کلیک روی لینک خاص نیست."
        impact={[
          "آلوده‌سازی دائمی صفحه وب",
          "سرقت اطلاعات تمام بازدیدکنندگان",
          "ایجاد کرم وب (Web Worm) که خودش منتشر شود",
          "تبدیل سایت به صفحه فیشینگ",
          "نصب کی‌لاگر برای ضبط رمز عبور",
        ]}
        severity="critical"
        cweId="CWE-79"
        owaspCategory="OWASP A03:2021"
      />
      <div className="cyber-card overflow-hidden">
        <BrowserBar url="vulnerable-app.local/blog/comments" />
        <div className="p-6">
          <h3 className="mb-4 text-lg font-bold">💬 بخش نظرات</h3>
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
              ارسال
            </button>
          </div>
          {!flagRevealed && (
            <p className="text-xs text-muted-foreground mt-2">
              💡 نظرات به صورت HTML رندر می‌شوند و فیلتر نمی‌شوند. سعی کنید کد JavaScript تزریق کنید!
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
      setOutput(`خوش آمدید، ${hashInput}!`);
      setTimeout(() => {
        setAlertMsg(scriptMatch ? scriptMatch[1].replace(/['"]/g, "") : "XSS");
        setShowAlert(true);
      }, 300);
    } else {
      setOutput(`خوش آمدید، ${hashInput || "کاربر"}!`);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    setFlagRevealed(true);
    setOutput(`✅ DOM XSS اجرا شد!\n\nکد شما از طریق location.hash بدون فیلتر وارد DOM شد.\n\n🎉 FLAG{xss_dom_fragment}`);
    onFlagFound?.("FLAG{xss_dom_fragment}");
  };

  return (
    <>
      {showAlert && <SimulatedAlert message={alertMsg} onClose={handleAlertClose} />}
      <VulnInfoCard
        title="اسکریپت بین‌سایتی مبتنی بر DOM"
        titleEn="DOM-Based Cross-Site Scripting"
        description="در DOM XSS، آسیب‌پذیری کاملاً در سمت کلاینت (JavaScript) رخ می‌دهد. کد سمت کلاینت مقدار ورودی (مثلاً از URL hash) را بدون sanitization مستقیماً در DOM قرار می‌دهد. این حمله حتی بدون ارسال درخواست به سرور انجام می‌شود."
        impact={[
          "دور زدن فایروال‌های وب (WAF)",
          "حمله بدون ثبت در لاگ سرور",
          "سرقت داده‌های سمت کلاینت",
          "تغییر رفتار اپلیکیشن",
        ]}
        severity="high"
        cweId="CWE-79"
        owaspCategory="OWASP A03:2021"
      />
      <div className="cyber-card overflow-hidden">
        <BrowserBar url="vulnerable-app.local/welcome#" />
        <div className="p-6">
          <h3 className="mb-2 text-lg font-bold">👋 صفحه خوش‌آمدگویی</h3>
          <p className="text-xs text-muted-foreground mb-4">این صفحه نام کاربر را از URL hash می‌خواند و مستقیماً در DOM قرار می‌دهد.</p>
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
              بارگذاری
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
      setOutput(`✅ Login successful as admin!\n\nQuery: SELECT * FROM users WHERE username='${username}' AND password='${password}'\n\n⚠️ ورودی شما باعث شد شرط WHERE همیشه True شود!\n\n🎉 FLAG{sqli_login_bypass}`);
      onFlagFound?.("FLAG{sqli_login_bypass}");
    } else if (username === "admin" && password === "admin") {
      setOutput("✅ Login successful (اما شما از رمز واقعی استفاده کردید، SQL injection را امتحان کنید!)");
    } else {
      setOutput(`❌ Login failed.\n\nQuery: SELECT * FROM users WHERE username='${username}' AND password='${password}'`);
    }
  };

  return (
    <>
      <VulnInfoCard
        title="تزریق SQL - دور زدن ورود"
        titleEn="SQL Injection - Login Bypass"
        description="در این حمله، مهاجم با تزریق کد SQL در فیلد ورودی، ساختار query دیتابیس را تغییر می‌دهد. وقتی ورودی بدون parametrization مستقیماً در query قرار بگیرد، مهاجم می‌تواند شرط احراز هویت را دور بزند و بدون رمز عبور وارد شود."
        impact={[
          "دسترسی غیرمجاز به حساب‌های کاربری",
          "دور زدن کامل سیستم احراز هویت",
          "دسترسی به پنل مدیریت",
          "خواندن، تغییر یا حذف کل دیتابیس",
          "اجرای دستورات سیستم‌عامل (در موارد پیشرفته)",
        ]}
        severity="critical"
        cweId="CWE-89"
        owaspCategory="OWASP A03:2021"
      />
      <div className="cyber-card overflow-hidden">
        <BrowserBar url="vulnerable-app.local/login" />
        <div className="p-6">
          <h3 className="mb-4 text-lg font-bold">🔐 ورود به سیستم</h3>
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
      setOutput(`Results:\n┌──────────┬──────────────────┐\n│ username │ password         │\n├──────────┼──────────────────┤\n│ admin    │ s3cret_p@ss!     │\n│ user1    │ password123      │\n└──────────┴──────────────────┘\n\n⚠️ با UNION SELECT توانستید داده‌های جدول دیگر را استخراج کنید!\n\n🎉 FLAG{sqli_union_extract}`);
      onFlagFound?.("FLAG{sqli_union_extract}");
    } else {
      setOutput(`Results for "${search}":\n┌────┬───────────────┬────────┐\n│ id │ product       │ price  │\n├────┼───────────────┼────────┤\n│ 1  │ Laptop        │ $999   │\n│ 2  │ Keyboard      │ $49    │\n└────┴───────────────┴────────┘`);
    }
  };

  return (
    <>
      <VulnInfoCard
        title="تزریق SQL - استخراج داده با UNION"
        titleEn="SQL Injection - UNION Based Data Extraction"
        description="در حمله UNION-based SQLi، مهاجم با اضافه کردن UNION SELECT به query اصلی، داده‌هایی از جداول دیگر (مثل جدول users) را استخراج می‌کند. شرط موفقیت این است که تعداد ستون‌های SELECT اصلی و UNION SELECT یکی باشد."
        impact={[
          "استخراج نام‌های کاربری و رمز عبور",
          "دسترسی به اطلاعات محرمانه",
          "شناسایی ساختار دیتابیس",
          "استخراج داده‌های مالی و شخصی",
        ]}
        severity="critical"
        cweId="CWE-89"
        owaspCategory="OWASP A03:2021"
      />
      <div className="cyber-card overflow-hidden">
        <BrowserBar url="vulnerable-app.local/products?search=" />
        <div className="p-6">
          <h3 className="mb-4 text-lg font-bold">🛒 جستجوی محصولات</h3>
          <div className="flex gap-2 mb-4">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="' UNION SELECT username, password FROM users--" className="flex-1 rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" dir="ltr" onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
            <button onClick={handleSearch} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Search</button>
          </div>
          {output && (
            <pre className={`rounded-md border p-4 text-xs font-mono whitespace-pre-wrap ${flagRevealed ? "border-accent/50 bg-accent/5 text-accent" : "border-border/50 bg-secondary/20"}`}>{output}</pre>
          )}
          <p className="text-xs text-muted-foreground mt-2">💡 جدول products دارای 2 ستون است. جدول users شامل username و password است.</p>
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
        title="جعل درخواست بین‌سایتی"
        titleEn="Cross-Site Request Forgery (CSRF)"
        description="در حمله CSRF، مهاجم قربانی را فریب می‌دهد تا بدون اطلاع، یک درخواست (مثلاً تغییر ایمیل) به سایت هدف ارسال کند. اگر سایت از CSRF token استفاده نکند، سرور نمی‌تواند تشخیص دهد که آیا درخواست واقعی است یا توسط مهاجم ساخته شده."
        impact={[
          "تغییر ایمیل و رمز عبور حساب کاربر",
          "انتقال وجه بدون اجازه",
          "تغییر تنظیمات حساب",
          "ارسال پیام از طرف قربانی",
        ]}
        severity="medium"
        cweId="CWE-352"
        owaspCategory="OWASP A01:2021"
      />
      <div className="cyber-card overflow-hidden">
        <BrowserBar url="vulnerable-app.local/settings" />
        <div className="p-6">
          <h3 className="mb-4 text-lg font-bold">⚙️ تنظیمات حساب</h3>
          <div className="mb-4 rounded-md border border-border/30 bg-secondary/20 p-3">
            <span className="text-xs text-muted-foreground">ایمیل فعلی: </span>
            <span className="text-sm font-mono text-primary">{email}</span>
          </div>
          <div className="mb-2 rounded-md border border-cyber-yellow/30 bg-cyber-yellow/5 p-3">
            <code className="text-xs text-cyber-yellow whitespace-pre">{`<form action="/api/change-email" method="POST">\n  <!-- ❌ No CSRF token! -->\n  <input name="email" value="...">\n</form>`}</code>
          </div>
          <div className="flex gap-2 mt-4 max-w-sm">
            <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="hacker@evil.com" className="flex-1 rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" dir="ltr" />
            <button onClick={handleChange} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">تغییر</button>
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
      setOutput(`✅ Login successful!\nWelcome, admin!\n\n⚠️ رمز عبور ضعیف بود و هیچ محدودیت brute-force وجود نداشت!\n\n🎉 FLAG{auth_weak_password}\n\nتعداد تلاش: ${attempts + 1}`);
      onFlagFound?.("FLAG{auth_weak_password}");
    } else {
      setOutput(`❌ Invalid credentials.\nتعداد تلاش: ${attempts + 1}\n\n💡 رمزهای رایج را امتحان کنید: admin, password, 123456, password123...`);
    }
  };

  return (
    <>
      <VulnInfoCard
        title="احراز هویت ضعیف"
        titleEn="Weak Authentication / Brute Force"
        description="وقتی سیستم از رمزهای عبور ضعیف اجازه می‌دهد و هیچ محدودیتی برای تعداد تلاش‌های ورود (rate limiting) ندارد، مهاجم می‌تواند با امتحان رمزهای رایج (dictionary attack) یا brute-force به حساب دسترسی پیدا کند."
        impact={[
          "دسترسی غیرمجاز به حساب‌های کاربری",
          "تصاحب حساب مدیر",
          "دسترسی به اطلاعات محرمانه",
          "حملات brute-force بدون محدودیت",
        ]}
        severity="high"
        cweId="CWE-307"
        owaspCategory="OWASP A07:2021"
      />
      <div className="cyber-card overflow-hidden">
        <BrowserBar url="vulnerable-app.local/admin-login" />
        <div className="p-6">
          <h3 className="mb-4 text-lg font-bold">🔐 پنل مدیریت</h3>
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
      setOutput(`Profile #${userId} (Admin profile!)\n{\n  "name": "Admin",\n  "email": "admin@company.com",\n  "role": "admin",\n  "secret": "FLAG{access_control_idor}"\n}\n\n⚠️ سرور بررسی نمی‌کند که آیا شما مجاز به دیدن این پروفایل هستید!`);
      onFlagFound?.("FLAG{access_control_idor}");
    } else {
      setOutput(`Profile #${userId}\n{\n  "name": "User ${userId}",\n  "email": "user${userId}@example.com",\n  "role": "user"\n}`);
    }
  };

  return (
    <>
      <VulnInfoCard
        title="نقص کنترل دسترسی (IDOR)"
        titleEn="Insecure Direct Object Reference (IDOR)"
        description="در IDOR، سرور مجوز دسترسی کاربر را بررسی نمی‌کند. مهاجم با تغییر شناسه (ID) در URL یا درخواست API، می‌تواند به اطلاعات کاربران دیگر دسترسی پیدا کند."
        impact={[
          "مشاهده اطلاعات شخصی کاربران دیگر",
          "تغییر یا حذف داده‌های دیگران",
          "دسترسی به فایل‌های محرمانه",
          "ارتقای سطح دسترسی",
        ]}
        severity="high"
        cweId="CWE-639"
        owaspCategory="OWASP A01:2021"
      />
      <div className="cyber-card overflow-hidden">
        <BrowserBar url={`vulnerable-app.local/api/profile?id=${userId}`} />
        <div className="p-6">
          <h3 className="mb-4 text-lg font-bold">👤 مشاهده پروفایل</h3>
          <div className="flex gap-2 mb-4 max-w-sm">
            <span className="rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono text-muted-foreground">?id=</span>
            <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="1" className="flex-1 rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" dir="ltr" onKeyDown={(e) => e.key === "Enter" && handleView()} />
            <button onClick={handleView} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">مشاهده</button>
          </div>
          {output && (
            <pre className={`rounded-md border p-4 text-xs font-mono whitespace-pre-wrap ${flagRevealed ? "border-accent/50 bg-accent/5 text-accent" : "border-border/50 bg-secondary/20"}`}>{output}</pre>
          )}
          <p className="text-xs text-muted-foreground mt-2">💡 شناسه شما 1001 است. شناسه‌های 1 یا 1000 را امتحان کنید.</p>
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
      setOutput(`✅ File uploaded: ${fileName}\n📁 Location: /uploads/${fileName}\n\n⚠️ فایل خطرناک بدون هیچ اعتبارسنجی پذیرفته شد!\nمهاجم می‌تواند با دسترسی به /uploads/${fileName} کد مخرب را اجرا کند.\n\n🎉 FLAG{file_upload_unrestricted}`);
      onFlagFound?.("FLAG{file_upload_unrestricted}");
    } else {
      setOutput(`✅ File uploaded: ${fileName}\n📁 Location: /uploads/${fileName}\n\n(نوع فایل امن - سعی کنید فایل با پسوند .php یا .jsp آپلود کنید)`);
    }
  };

  return (
    <>
      <VulnInfoCard
        title="آپلود فایل بدون محدودیت"
        titleEn="Unrestricted File Upload"
        description="وقتی سرور هیچ اعتبارسنجی روی نوع فایل آپلودی انجام نمی‌دهد، مهاجم می‌تواند فایل‌های اجرایی (مثل web shell) آپلود کند و کنترل کامل سرور را به دست بگیرد."
        impact={[
          "اجرای کد دلخواه روی سرور (RCE)",
          "دسترسی کامل به سرور (Web Shell)",
          "خواندن فایل‌های حساس سرور",
          "حرکت جانبی در شبکه داخلی",
        ]}
        severity="critical"
        cweId="CWE-434"
        owaspCategory="OWASP A04:2021"
      />
      <div className="cyber-card overflow-hidden">
        <BrowserBar url="vulnerable-app.local/upload" />
        <div className="p-6">
          <h3 className="mb-4 text-lg font-bold">📤 آپلود فایل</h3>
          <div className="flex gap-2 mb-4 max-w-sm">
            <input value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="shell.php" className="flex-1 rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" dir="ltr" onKeyDown={(e) => e.key === "Enter" && handleUpload()} />
            <button onClick={handleUpload} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">آپلود</button>
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
      setOutput(`Invoice #1337 (Restricted!)\n{\n  "owner": "CEO",\n  "amount": "$50,000",\n  "status": "paid",\n  "secret": "FLAG{idor_invoice_access}"\n}\n\n⚠️ فاکتور محرمانه بدون بررسی مجوز نمایش داده شد!`);
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
        title="دسترسی غیرمجاز به فاکتور (IDOR)"
        titleEn="IDOR - Invoice Access"
        description="این آزمایشگاه نشان می‌دهد چگونه بدون بررسی مجوز، تغییر یک شناسه ساده در URL می‌تواند به داده‌های محرمانه دسترسی دهد."
        impact={[
          "افشای اطلاعات مالی محرمانه",
          "دسترسی به فاکتورهای سایر کاربران",
          "نقض حریم خصوصی",
          "سوءاستفاده مالی",
        ]}
        severity="high"
        cweId="CWE-639"
        owaspCategory="OWASP A01:2021"
      />
      <div className="cyber-card overflow-hidden">
        <BrowserBar url={`vulnerable-app.local/api/invoice?id=${invoiceId}`} />
        <div className="p-6">
          <h3 className="mb-4 text-lg font-bold">🧾 مشاهده فاکتور</h3>
          <div className="flex gap-2 mb-4 max-w-sm">
            <span className="rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono text-muted-foreground">invoice_id=</span>
            <input value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)} placeholder="1337" className="flex-1 rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" dir="ltr" onKeyDown={(e) => e.key === "Enter" && handleView()} />
            <button onClick={handleView} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">مشاهده</button>
          </div>
          {output && (
            <pre className={`rounded-md border p-4 text-xs font-mono whitespace-pre-wrap ${flagRevealed ? "border-accent/50 bg-accent/5 text-accent" : "border-border/50 bg-secondary/20"}`}>{output}</pre>
          )}
          <p className="text-xs text-muted-foreground mt-2">💡 فاکتور شما #42 است. فاکتور #1337 متعلق به CEO است.</p>
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
      setOutput(`$ ping -c 4 ${parts[0].trim()}\nPING ${parts[0].trim()}: 64 bytes, icmp_seq=1 ttl=64\n\n$ ${cmd || "whoami"}\nroot\n\n⚠️ دستور شما مستقیماً در شل سرور اجرا شد!\n\n🎉 FLAG{cmd_injection_basic}`);
      onFlagFound?.("FLAG{cmd_injection_basic}");
    } else {
      setOutput(`$ ping -c 4 ${ip || "..."}\n${ip ? `PING ${ip}: 64 bytes from ${ip}: icmp_seq=1 ttl=64 time=0.5ms\nPING ${ip}: 64 bytes from ${ip}: icmp_seq=2 ttl=64 time=0.3ms\n\n--- ${ip} ping statistics ---\n4 packets transmitted, 4 received, 0% packet loss` : "Usage: Enter an IP address to ping."}`);
    }
  };

  return (
    <>
      <VulnInfoCard
        title="تزریق دستور سیستم‌عامل"
        titleEn="OS Command Injection"
        description="وقتی برنامه ورودی کاربر را مستقیماً در دستورات سیستم‌عامل استفاده می‌کند (بدون فیلتر)، مهاجم می‌تواند با کاراکترهای خاص (مثل ; یا |) دستورات دلخواه اجرا کند و کنترل کامل سرور را به دست بگیرد."
        impact={[
          "اجرای دستور دلخواه روی سرور (RCE)",
          "خواندن فایل‌های حساس (/etc/passwd)",
          "ایجاد backdoor و دسترسی دائمی",
          "حرکت جانبی در شبکه",
          "حذف یا رمزنگاری داده‌ها (Ransomware)",
        ]}
        severity="critical"
        cweId="CWE-78"
        owaspCategory="OWASP A03:2021"
      />
      <div className="cyber-card overflow-hidden">
        <BrowserBar url="vulnerable-app.local/network-tools" />
        <div className="p-6">
          <h3 className="mb-4 text-lg font-bold">🌐 ابزار شبکه - Ping</h3>
          <div className="flex gap-2 mb-4 max-w-md">
            <input value={ip} onChange={(e) => setIp(e.target.value)} placeholder="127.0.0.1; cat /etc/passwd" className="flex-1 rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" dir="ltr" onKeyDown={(e) => e.key === "Enter" && handlePing()} />
            <button onClick={handlePing} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Ping</button>
          </div>
          {output && (
            <pre className={`rounded-md border p-4 text-xs font-mono whitespace-pre-wrap ${flagRevealed ? "border-accent/50 bg-accent/5 text-accent" : "border-border/50 bg-secondary/20 text-foreground/80"}`}>{output}</pre>
          )}
          <p className="text-xs text-muted-foreground mt-2">💡 سرور دستور <code className="text-primary">ping -c 4 $input</code> را بدون فیلتر اجرا می‌کند. از ; یا | استفاده کنید.</p>
        </div>
      </div>
    </>
  );
}
