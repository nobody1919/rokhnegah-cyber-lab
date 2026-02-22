import { useState } from "react";
import { Terminal } from "lucide-react";

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

/* ============ XSS Reflected ============ */
function XSSReflectedLab({ onFlagFound }: { onFlagFound?: (f: string) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string | null>(null);
  const [flagRevealed, setFlagRevealed] = useState(false);

  const handleSearch = () => {
    // Simulate reflected XSS - if input contains script-like content, "execute" it
    const hasXSS = /<script>|onerror=|onload=|javascript:/i.test(query);
    if (hasXSS) {
      setFlagRevealed(true);
      setResults(`🎉 XSS Executed! FLAG{xss_reflected_basic}`);
      onFlagFound?.("FLAG{xss_reflected_basic}");
    } else {
      setResults(`نتیجه جستجو برای: ${query} — هیچ موردی یافت نشد.`);
    }
  };

  return (
    <div className="cyber-card overflow-hidden">
      <div className="border-b border-border/50 bg-secondary/30 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-cyber-red/60" />
          <div className="h-3 w-3 rounded-full bg-cyber-yellow/60" />
          <div className="h-3 w-3 rounded-full bg-cyber-green/60" />
        </div>
        <span className="text-xs font-mono text-muted-foreground ml-2">vulnerable-app.local/search</span>
      </div>
      <div className="p-6">
        <h3 className="mb-4 text-lg font-bold">🔍 جستجوی محصولات</h3>
        <div className="flex gap-2 mb-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="عبارت جستجو را وارد کنید..."
            className="flex-1 rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none"
            dir="ltr"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            جستجو
          </button>
        </div>
        {results && (
          <div className={`rounded-md border p-4 text-sm font-mono ${flagRevealed ? "border-accent/50 bg-accent/5 text-accent" : "border-border/50 bg-secondary/20 text-foreground"}`}>
            <div dangerouslySetInnerHTML={{ __html: results }} />
          </div>
        )}
        {!results && (
          <p className="text-xs text-muted-foreground mt-2">
            💡 این صفحه جستجو ورودی کاربر را بدون فیلتر نمایش می‌دهد. آیا می‌توانید کد JavaScript اجرا کنید؟
          </p>
        )}
      </div>
    </div>
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

  const handlePost = () => {
    if (!comment.trim()) return;
    const hasXSS = /<img|<script|onerror=|onload=|javascript:/i.test(comment);
    setComments([...comments, { user: "you", text: comment }]);
    if (hasXSS) {
      setFlagRevealed(true);
      setTimeout(() => {
        setComments((prev) => [
          ...prev,
          { user: "system", text: "🎉 Stored XSS Detected! FLAG{xss_stored_comments}" },
        ]);
        onFlagFound?.("FLAG{xss_stored_comments}");
      }, 500);
    }
    setComment("");
  };

  return (
    <div className="cyber-card overflow-hidden">
      <div className="border-b border-border/50 bg-secondary/30 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-cyber-red/60" />
          <div className="h-3 w-3 rounded-full bg-cyber-yellow/60" />
          <div className="h-3 w-3 rounded-full bg-cyber-green/60" />
        </div>
        <span className="text-xs font-mono text-muted-foreground ml-2">vulnerable-app.local/blog/comments</span>
      </div>
      <div className="p-6">
        <h3 className="mb-4 text-lg font-bold">💬 بخش نظرات</h3>
        <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
          {comments.map((c, i) => (
            <div key={i} className={`rounded-md border p-3 text-sm ${c.user === "system" ? "border-accent/50 bg-accent/5" : "border-border/30 bg-secondary/20"}`}>
              <span className="font-bold text-primary font-mono text-xs">{c.user}:</span>
              <span className="ml-2" dangerouslySetInnerHTML={{ __html: c.text }} />
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="نظر خود را بنویسید..."
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
            💡 نظرات به صورت HTML رندر می‌شوند. چه چیزی می‌توانید تزریق کنید؟
          </p>
        )}
      </div>
    </div>
  );
}

/* ============ XSS DOM ============ */
function XSSDOMLab({ onFlagFound }: { onFlagFound?: (f: string) => void }) {
  const [hashInput, setHashInput] = useState("");
  const [output, setOutput] = useState("");
  const [flagRevealed, setFlagRevealed] = useState(false);

  const handleLoad = () => {
    const hasXSS = /<img|<script|onerror=|onload=/i.test(hashInput);
    if (hasXSS) {
      setFlagRevealed(true);
      setOutput(`🎉 DOM XSS Executed! FLAG{xss_dom_fragment}`);
      onFlagFound?.("FLAG{xss_dom_fragment}");
    } else {
      setOutput(`خوش آمدید، ${hashInput || "کاربر"}!`);
    }
  };

  return (
    <div className="cyber-card overflow-hidden">
      <div className="border-b border-border/50 bg-secondary/30 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-cyber-red/60" />
          <div className="h-3 w-3 rounded-full bg-cyber-yellow/60" />
          <div className="h-3 w-3 rounded-full bg-cyber-green/60" />
        </div>
        <span className="text-xs font-mono text-muted-foreground ml-2">vulnerable-app.local/welcome#</span>
      </div>
      <div className="p-6">
        <h3 className="mb-2 text-lg font-bold">👋 صفحه خوش‌آمدگویی</h3>
        <p className="text-xs text-muted-foreground mb-4">این صفحه نام کاربر را از URL hash می‌خواند و در DOM نمایش می‌دهد.</p>
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
            placeholder="نام کاربر..."
            className="flex-1 rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none"
            dir="ltr"
            onKeyDown={(e) => e.key === "Enter" && handleLoad()}
          />
          <button onClick={handleLoad} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            بارگذاری
          </button>
        </div>
        {output && (
          <div className={`rounded-md border p-4 text-sm font-mono ${flagRevealed ? "border-accent/50 bg-accent/5 text-accent" : "border-border/50 bg-secondary/20"}`} id="welcome">
            <div dangerouslySetInnerHTML={{ __html: output }} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ SQLi Login ============ */
function SQLiLoginLab({ onFlagFound }: { onFlagFound?: (f: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [output, setOutput] = useState("");
  const [flagRevealed, setFlagRevealed] = useState(false);

  const handleLogin = () => {
    // Simulate SQL: SELECT * FROM users WHERE username='$user' AND password='$pass'
    const hasSQLi = /('.*OR.*1=1|'.*OR.*'1'='1|admin'--|'.*--.*)$/i.test(username);
    if (hasSQLi) {
      setFlagRevealed(true);
      setOutput(`✅ Login successful as admin!\n\n🎉 FLAG{sqli_login_bypass}\n\nQuery: SELECT * FROM users WHERE username='${username}' AND password='${password}'`);
      onFlagFound?.("FLAG{sqli_login_bypass}");
    } else if (username === "admin" && password === "admin") {
      setOutput("✅ Login successful (but you used the correct credentials, try SQL injection!)");
    } else {
      setOutput(`❌ Login failed.\n\nQuery: SELECT * FROM users WHERE username='${username}' AND password='${password}'`);
    }
  };

  return (
    <div className="cyber-card overflow-hidden">
      <div className="border-b border-border/50 bg-secondary/30 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-cyber-red/60" />
          <div className="h-3 w-3 rounded-full bg-cyber-yellow/60" />
          <div className="h-3 w-3 rounded-full bg-cyber-green/60" />
        </div>
        <span className="text-xs font-mono text-muted-foreground ml-2">vulnerable-app.local/login</span>
      </div>
      <div className="p-6">
        <h3 className="mb-4 text-lg font-bold">🔐 ورود به سیستم</h3>
        <div className="space-y-3 mb-4 max-w-sm">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none"
            dir="ltr"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none"
            dir="ltr"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <button onClick={handleLogin} className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Login
          </button>
        </div>
        {output && (
          <pre className={`rounded-md border p-4 text-xs font-mono whitespace-pre-wrap ${flagRevealed ? "border-accent/50 bg-accent/5 text-accent" : "border-border/50 bg-secondary/20"}`}>
            {output}
          </pre>
        )}
        {!output && (
          <div className="rounded-md border border-border/30 bg-secondary/20 p-3 mt-2">
            <code className="text-xs text-muted-foreground">
              {`SELECT * FROM users WHERE username='$input' AND password='$input'`}
            </code>
          </div>
        )}
      </div>
    </div>
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
      setOutput(`Results:\n┌──────────┬──────────────────┐\n│ username │ password         │\n├──────────┼──────────────────┤\n│ admin    │ s3cret_p@ss!     │\n│ user1    │ password123      │\n└──────────┴──────────────────┘\n\n🎉 FLAG{sqli_union_extract}`);
      onFlagFound?.("FLAG{sqli_union_extract}");
    } else {
      setOutput(`Results for "${search}":\n┌────┬───────────────┬────────┐\n│ id │ product       │ price  │\n├────┼───────────────┼────────┤\n│ 1  │ Laptop        │ $999   │\n│ 2  │ Keyboard      │ $49    │\n└────┴───────────────┴────────┘`);
    }
  };

  return (
    <div className="cyber-card overflow-hidden">
      <div className="border-b border-border/50 bg-secondary/30 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-cyber-red/60" />
          <div className="h-3 w-3 rounded-full bg-cyber-yellow/60" />
          <div className="h-3 w-3 rounded-full bg-cyber-green/60" />
        </div>
        <span className="text-xs font-mono text-muted-foreground ml-2">vulnerable-app.local/products?search=</span>
      </div>
      <div className="p-6">
        <h3 className="mb-4 text-lg font-bold">🛒 جستجوی محصولات</h3>
        <div className="flex gap-2 mb-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="flex-1 rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none"
            dir="ltr"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Search
          </button>
        </div>
        {output && (
          <pre className={`rounded-md border p-4 text-xs font-mono whitespace-pre-wrap ${flagRevealed ? "border-accent/50 bg-accent/5 text-accent" : "border-border/50 bg-secondary/20"}`}>
            {output}
          </pre>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          💡 جدول products دارای 2 ستون است. جدول users شامل username و password است.
        </p>
      </div>
    </div>
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
      setLog((l) => [...l, `[POST] /api/change-email → email=${newEmail} (No CSRF token!)`]);
      setEmail(newEmail);
      setFlagRevealed(true);
      setLog((l) => [...l, `✅ Email changed successfully without CSRF token!`, `🎉 FLAG{csrf_missing_token}`]);
      onFlagFound?.("FLAG{csrf_missing_token}");
    }
  };

  return (
    <div className="cyber-card overflow-hidden">
      <div className="border-b border-border/50 bg-secondary/30 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-cyber-red/60" />
          <div className="h-3 w-3 rounded-full bg-cyber-yellow/60" />
          <div className="h-3 w-3 rounded-full bg-cyber-green/60" />
        </div>
        <span className="text-xs font-mono text-muted-foreground ml-2">vulnerable-app.local/settings</span>
      </div>
      <div className="p-6">
        <h3 className="mb-4 text-lg font-bold">⚙️ تنظیمات حساب</h3>
        <div className="mb-4 rounded-md border border-border/30 bg-secondary/20 p-3">
          <span className="text-xs text-muted-foreground">ایمیل فعلی: </span>
          <span className="text-sm font-mono text-primary">{email}</span>
        </div>
        <div className="mb-2 rounded-md border border-cyber-yellow/30 bg-cyber-yellow/5 p-3">
          <code className="text-xs text-cyber-yellow">{`<form action="/api/change-email" method="POST">\n  <!-- ❌ No CSRF token! -->\n  <input name="email" value="...">\n</form>`}</code>
        </div>
        <div className="flex gap-2 mt-4 max-w-sm">
          <input
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="ایمیل جدید"
            className="flex-1 rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none"
            dir="ltr"
          />
          <button onClick={handleChange} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            تغییر
          </button>
        </div>
        {log.length > 0 && (
          <pre className={`mt-4 rounded-md border p-4 text-xs font-mono whitespace-pre-wrap ${flagRevealed ? "border-accent/50 bg-accent/5 text-accent" : "border-border/50 bg-secondary/20"}`}>
            {log.join("\n")}
          </pre>
        )}
      </div>
    </div>
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
      setOutput(`✅ Login successful!\nWelcome, admin!\n\n🎉 FLAG{auth_weak_password}\n\nAttempts: ${attempts + 1}`);
      onFlagFound?.("FLAG{auth_weak_password}");
    } else {
      setOutput(`❌ Invalid credentials.\nAttempts: ${attempts + 1}\n\n💡 Hint: Try common passwords like admin, password, 123456, password123...`);
    }
  };

  return (
    <div className="cyber-card overflow-hidden">
      <div className="border-b border-border/50 bg-secondary/30 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-cyber-red/60" />
          <div className="h-3 w-3 rounded-full bg-cyber-yellow/60" />
          <div className="h-3 w-3 rounded-full bg-cyber-green/60" />
        </div>
        <span className="text-xs font-mono text-muted-foreground ml-2">vulnerable-app.local/admin-login</span>
      </div>
      <div className="p-6">
        <h3 className="mb-4 text-lg font-bold">🔐 پنل مدیریت</h3>
        <div className="space-y-3 mb-4 max-w-sm">
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" dir="ltr" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" dir="ltr" onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
          <button onClick={handleLogin} className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Login</button>
        </div>
        {output && (
          <pre className={`rounded-md border p-4 text-xs font-mono whitespace-pre-wrap ${flagRevealed ? "border-accent/50 bg-accent/5 text-accent" : "border-border/50 bg-secondary/20"}`}>{output}</pre>
        )}
      </div>
    </div>
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
      setOutput(`Profile #${userId} (Admin profile!)\n{\n  "name": "Admin",\n  "email": "admin@company.com",\n  "role": "admin",\n  "secret": "FLAG{access_control_idor}"\n}`);
      onFlagFound?.("FLAG{access_control_idor}");
    } else {
      setOutput(`Profile #${userId}\n{\n  "name": "User ${userId}",\n  "email": "user${userId}@example.com",\n  "role": "user"\n}`);
    }
  };

  return (
    <div className="cyber-card overflow-hidden">
      <div className="border-b border-border/50 bg-secondary/30 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-cyber-red/60" />
          <div className="h-3 w-3 rounded-full bg-cyber-yellow/60" />
          <div className="h-3 w-3 rounded-full bg-cyber-green/60" />
        </div>
        <span className="text-xs font-mono text-muted-foreground ml-2">vulnerable-app.local/api/profile?id={userId}</span>
      </div>
      <div className="p-6">
        <h3 className="mb-4 text-lg font-bold">👤 مشاهده پروفایل</h3>
        <div className="flex gap-2 mb-4 max-w-sm">
          <span className="rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono text-muted-foreground">?id=</span>
          <input value={userId} onChange={(e) => setUserId(e.target.value)} className="flex-1 rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" dir="ltr" onKeyDown={(e) => e.key === "Enter" && handleView()} />
          <button onClick={handleView} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">مشاهده</button>
        </div>
        {output && (
          <pre className={`rounded-md border p-4 text-xs font-mono whitespace-pre-wrap ${flagRevealed ? "border-accent/50 bg-accent/5 text-accent" : "border-border/50 bg-secondary/20"}`}>{output}</pre>
        )}
        <p className="text-xs text-muted-foreground mt-2">💡 شناسه پروفایل شما 1001 است. آیا می‌توانید به پروفایل‌های دیگر دسترسی پیدا کنید؟</p>
      </div>
    </div>
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
      setOutput(`✅ File uploaded: ${fileName}\n📁 Location: /uploads/${fileName}\n\n⚠️ Dangerous file type accepted without validation!\n\n🎉 FLAG{file_upload_unrestricted}`);
      onFlagFound?.("FLAG{file_upload_unrestricted}");
    } else {
      setOutput(`✅ File uploaded: ${fileName}\n📁 Location: /uploads/${fileName}\n\n(Safe file type)`);
    }
  };

  return (
    <div className="cyber-card overflow-hidden">
      <div className="border-b border-border/50 bg-secondary/30 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-cyber-red/60" />
          <div className="h-3 w-3 rounded-full bg-cyber-yellow/60" />
          <div className="h-3 w-3 rounded-full bg-cyber-green/60" />
        </div>
        <span className="text-xs font-mono text-muted-foreground ml-2">vulnerable-app.local/upload</span>
      </div>
      <div className="p-6">
        <h3 className="mb-4 text-lg font-bold">📤 آپلود فایل</h3>
        <div className="flex gap-2 mb-4 max-w-sm">
          <input value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="filename.ext (e.g. shell.php)" className="flex-1 rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" dir="ltr" onKeyDown={(e) => e.key === "Enter" && handleUpload()} />
          <button onClick={handleUpload} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">آپلود</button>
        </div>
        {output && (
          <pre className={`rounded-md border p-4 text-xs font-mono whitespace-pre-wrap ${flagRevealed ? "border-accent/50 bg-accent/5 text-accent" : "border-border/50 bg-secondary/20"}`}>{output}</pre>
        )}
        <p className="text-xs text-muted-foreground mt-2">💡 سرور هیچ اعتبارسنجی روی نوع فایل انجام نمی‌دهد.</p>
      </div>
    </div>
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
      setOutput(`Invoice #1337 (Restricted!)\n{\n  "owner": "CEO",\n  "amount": "$50,000",\n  "status": "paid",\n  "secret": "FLAG{idor_invoice_access}"\n}`);
      onFlagFound?.("FLAG{idor_invoice_access}");
    } else if (invoiceId === "42") {
      setOutput(`Invoice #42 (Your invoice)\n{\n  "owner": "You",\n  "amount": "$150",\n  "status": "pending"\n}`);
    } else {
      setOutput(`Invoice #${invoiceId}\n{\n  "owner": "User",\n  "amount": "$${Math.floor(Math.random() * 1000)}",\n  "status": "paid"\n}`);
    }
  };

  return (
    <div className="cyber-card overflow-hidden">
      <div className="border-b border-border/50 bg-secondary/30 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-cyber-red/60" />
          <div className="h-3 w-3 rounded-full bg-cyber-yellow/60" />
          <div className="h-3 w-3 rounded-full bg-cyber-green/60" />
        </div>
        <span className="text-xs font-mono text-muted-foreground ml-2">vulnerable-app.local/api/invoice?id={invoiceId}</span>
      </div>
      <div className="p-6">
        <h3 className="mb-4 text-lg font-bold">🧾 مشاهده فاکتور</h3>
        <div className="flex gap-2 mb-4 max-w-sm">
          <span className="rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono text-muted-foreground">invoice_id=</span>
          <input value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)} className="flex-1 rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" dir="ltr" onKeyDown={(e) => e.key === "Enter" && handleView()} />
          <button onClick={handleView} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">مشاهده</button>
        </div>
        {output && (
          <pre className={`rounded-md border p-4 text-xs font-mono whitespace-pre-wrap ${flagRevealed ? "border-accent/50 bg-accent/5 text-accent" : "border-border/50 bg-secondary/20"}`}>{output}</pre>
        )}
        <p className="text-xs text-muted-foreground mt-2">💡 فاکتور شما شماره 42 است. فاکتور #1337 متعلق به کاربر دیگری است.</p>
      </div>
    </div>
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
      setOutput(`$ ping -c 4 ${parts[0].trim()}\nPING ${parts[0].trim()}: 64 bytes, icmp_seq=1 ttl=64\n\n$ ${cmd || "whoami"}\nroot\n\n🎉 Command injection successful!\nFLAG{cmd_injection_basic}`);
      onFlagFound?.("FLAG{cmd_injection_basic}");
    } else {
      setOutput(`$ ping -c 4 ${ip || "..."}\n${ip ? `PING ${ip}: 64 bytes from ${ip}: icmp_seq=1 ttl=64 time=0.5ms\nPING ${ip}: 64 bytes from ${ip}: icmp_seq=2 ttl=64 time=0.3ms\n\n--- ${ip} ping statistics ---\n4 packets transmitted, 4 received, 0% packet loss` : "Usage: Enter an IP address to ping."}`);
    }
  };

  return (
    <div className="cyber-card overflow-hidden">
      <div className="border-b border-border/50 bg-secondary/30 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-cyber-red/60" />
          <div className="h-3 w-3 rounded-full bg-cyber-yellow/60" />
          <div className="h-3 w-3 rounded-full bg-cyber-green/60" />
        </div>
        <span className="text-xs font-mono text-muted-foreground ml-2">vulnerable-app.local/network-tools</span>
      </div>
      <div className="p-6">
        <h3 className="mb-4 text-lg font-bold">🌐 ابزار شبکه - Ping</h3>
        <div className="flex gap-2 mb-4 max-w-md">
          <input value={ip} onChange={(e) => setIp(e.target.value)} placeholder="Enter IP address (e.g. 127.0.0.1)" className="flex-1 rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" dir="ltr" onKeyDown={(e) => e.key === "Enter" && handlePing()} />
          <button onClick={handlePing} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Ping</button>
        </div>
        {output && (
          <pre className={`rounded-md border p-4 text-xs font-mono whitespace-pre-wrap ${flagRevealed ? "border-accent/50 bg-accent/5 text-accent" : "border-border/50 bg-secondary/20 text-foreground/80"}`}>{output}</pre>
        )}
        <p className="text-xs text-muted-foreground mt-2">💡 سرور دستور <code className="text-primary">ping -c 4 $input</code> را بدون فیلتر اجرا می‌کند.</p>
      </div>
    </div>
  );
}
