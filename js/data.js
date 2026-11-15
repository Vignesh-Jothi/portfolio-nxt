/* ============================================================
   DATA — Global portfolio content & testimonials.
   ============================================================ */

const TESTIMONIALS = [
  {
    tag: "Trippie Launch",
    title: "A faster, smoother Trippie experience",
    summary: "Two launches shipped in under a week: a Test Arena for Trip Custodians and a migration from function calling to MCP, reducing failed escalations and making responses faster.",
    quotes: [
      { name: "Nishanth Thilagar", role: "Product Manager, PickYourTrail", quote: "Vignesh scoped, built, and launched both improvements in rapid succession, making Trippie genuinely better for customers." },
      { name: "Business Owner", role: "PickYourTrail", quote: "Two Trippie launches in under a week, with customers feeling the difference within hours — that’s real impact." }
    ]
  },
  {
    tag: "Unity Launch",
    title: "From launch to 100 conversions in 60 days",
    summary: "Unity became a catalyst for sales teams, helping them improve outcomes and reach their goals through more effective itinerary workflows.",
    quotes: [
      { name: "Srivatsa Kannan", role: "Supply ASM, PickYourTrail", quote: "Unity crossed 100 conversions from its itineraries within 60 days of launch." }
    ]
  },
  {
    tag: "Plato Experience",
    title: "Making an operational tool more human",
    summary: "Plato is used across PickYourTrail every day. Adding thoughtful animations made routine screens feel more engaging without getting in the way of the work.",
    quotes: [
      { name: "Sathya J", role: "Product Manager, PickYourTrail", quote: "Vignesh brought fun UI animations to Plato, making an everyday operational tool more enjoyable to use." },
      { name: "Ajay", role: "Backend Team, PickYourTrail", quote: "When a backend developer has fun with UI and UX, this is the result. Super work." },
      { name: "Thiliban Ravichandran", role: "Frontend Developer, PickYourTrail", quote: "Love this. Great job — inspiring the frontend developers these days." }
    ]
  },
  {
    tag: "BLS Launch",
    title: "Stepping in when launch pressure was highest",
    summary: "When requirements arrived at short notice, Vignesh joined late the night before launch to provide the extra engineering support the team needed.",
    quotes: [
      { name: "Sandheep S", role: "Product Manager, PickYourTrail", quote: "Vignesh stepped up at short notice and worked late before launch to provide the extra support the team needed." },
      { name: "Nishanth Thilagar", role: "Product Manager, PickYourTrail", quote: "It’s great to see the effort become real solutions for customer problems. Excited to see the impact on BLS." }
    ]
  },
  {
    tag: "Quality Ownership",
    title: "Testing beyond the happy path",
    summary: "The work went beyond reaching the finish line: it included probing edge conditions, validating assumptions, and turning feedback into a more reliable product.",
    quotes: [
      { name: "Priya Ravi", role: "Frontend Team Lead, PickYourTrail", quote: "Vignesh showed incredible ownership during testing, exploring new cases, validating edge conditions, and helping improve product quality." }
    ]
  },
  {
    tag: "Product Ownership",
    title: "Turning unfamiliar systems into shipped outcomes",
    summary: "A consistent approach to legacy and unfamiliar code: understand the system deeply, then take responsibility for the fix or feature through delivery.",
    quotes: [
      { name: "Hari", role: "Co-founder, PickYourTrail", quote: "Vignesh is a real-life saver and enabler who thinks through product features without needing to be prompted." },
      { name: "Sathya J", role: "Product Manager, PickYourTrail", quote: "Instead of saying he is unfamiliar with a codebase, Vignesh asks for time to understand it and then fixes or builds what is needed." }
    ]
  },
  {
    tag: "Finance Workflows",
    title: "Making booking-cost changes traceable",
    summary: "Recurring booking-cost updates and reason logs now give Finance a dependable view of what changed, when it changed, and why.",
    quotes: [
      { name: "Karthik Neelakantan", role: "Product Manager, PickYourTrail", quote: "The booking-cost update email and reason logs are helping Finance understand exactly what changed and why." }
    ]
  },
  {
    tag: "Visa Dashboard",
    title: "Giving the Visa team clearer daily visibility",
    summary: "The Visa Dashboard addressed long-standing task-visibility and allocation challenges, making the team’s day-to-day work easier to manage.",
    quotes: [
      { name: "Karthik Neelakantan", role: "Product Manager, PickYourTrail", quote: "The Visa Dashboard gave the team easier visibility into daily tasks and made allocations easier to manage." },
      { name: "Jawahar", role: "Customer Experience, PickYourTrail", quote: "Vignesh worked tirelessly on the backend — like a wizard behind the curtain." }
    ]
  },
  {
    tag: "LockerRoom",
    title: "Replacing a painful paper process",
    summary: "LockerRoom brought employee and performance workflows into a simpler digital system, reducing the friction of a previously paper-driven process.",
    quotes: [
      { name: "Karthik M.", role: "Product Manager, PickYourTrail", quote: "LockerRoom replaced a genuinely painful paper process. Vignesh made it simple to use without over-engineering it." }
    ]
  }
];

const ACHIEVEMENTS = [
  { title: "Rookie of the Year", date: "PickYourTrail", description: "Recognised for delivering the Visa Dashboard, Auto-quote, and Instant Voucher, and for stepping in to support the Refunds team during launch." },
  { title: "Trippie launches shipped in under a week", date: "PickYourTrail", description: "Delivered a dedicated Test Arena and migrated from function calling to MCP, improving escalation reliability and response speed." },
  { title: "Finance change visibility", date: "PickYourTrail", description: "Built recurring booking-cost updates and change-reason logs so the Finance team can understand what changed and why." },
  { title: "Visa Dashboard launch", date: "PickYourTrail", description: "Helped give the Visa team clearer daily task visibility and a more manageable way to handle allocations." },
  { title: "Quality and launch ownership", date: "PickYourTrail", description: "Recognised for stepping in on short notice for launches and for rigorous edge-case testing that strengthened product quality." },
  { title: "Unity milestone", date: "PickYourTrail", description: "Contributed to Unity, which crossed 100 conversions from Unity itineraries within 60 days of launch." }
];

const CERTIFICATIONS = [];

/* CHANGE THIS to your own passcode before sharing this file. */
const ADMIN_PASSCODE = "vignesh2026";

/* ============================================================
   ABOUT — "Ask me anything" chat. Add your own questions here.
   ============================================================ */
const ABOUT_QA = [
  { q: "What do you actually do?", a: "I build the internal platforms a travel company runs on: CRM, finance workflows and AI assistants. One of them is used by <b>400+ people across 7 teams</b> every day." },
  { q: "What's your favourite kind of problem?", a: "Messy manual workflows. If people are copy-pasting between spreadsheets or waiting days for a refund, I want to automate it. Refunds went from <b>3–5 days to under 24 hours</b>." },
  { q: "How do you use AI in production?", a: "Two shipped systems: an AI pipeline that summarises sales calls and moves CRM stages on its own, and <b>Trippie</b>, a travel assistant I moved to <b>MCP</b> with a test arena. My rule: the LLM reads the messy input, deterministic rules make the decision." },
  { q: "Backend or frontend?", a: "Both. Backend is home (Laravel, PostgreSQL, Redis), but I love UI polish too. A teammate once said: <i>“When a backend developer has fun with UI and UX, this is the result.”</i>" },
  { q: "How do you handle unfamiliar code?", a: "I don't say “I don't know this codebase.” I ask for time to understand it, then fix or build what's needed. Legacy code is just code nobody has explained yet." },
  { q: "What are you learning right now?", a: "Distributed systems beyond a single monolith, and AI agents that can own a workflow end to end, not just assist with it." },
  { q: "Why should we work together?", a: "I own things end to end: scope, build, test the edge cases, ship, and stay on it after launch. Trippie got <b>two releases in under a week</b>. I was named <b>Rookie of the Year</b> at PickYourTrail." },
  { q: "How can I reach you?", a: "Email <a href=\"mailto:vigneshjothishwaran@gmail.com\">vigneshjothishwaran@gmail.com</a>, or find me on <a href=\"https://www.linkedin.com/in/vignesh-jothi\" target=\"_blank\" rel=\"noopener\">LinkedIn</a> and <a href=\"https://github.com/vignesh-jothi\" target=\"_blank\" rel=\"noopener\">GitHub</a>." }
];

const PRINCIPLES = [
  { icon: "trend", title: "Ship without downtime", text: "Migrated live workflows while hundreds of people kept working on them. Zero maintenance windows." },
  { icon: "shield-check", title: "Make it traceable", text: "Every price change and status move records why it happened, so Finance never has to guess." },
  { icon: "sparkle", title: "Automate the boring", text: "Queue workers and AI pipelines take the busywork, so people keep the decisions." },
  { icon: "lightning", title: "Fix slow before it burns", text: "Hunt N+1 queries and missing indexes early. Cut API latency by 40%+." }
];

/* ============================================================
   PROJECTS — cards + case-study modal.
   category: ai | platform | automation
   ============================================================ */
const PROJECTS = [
  {
    id: "ai-call", title: "AI Call Intelligence", icon: "sparkle", hue: "violet", featured: true, wide: true,
    category: ["ai", "automation"],
    tagline: "Calls get summarised and the CRM updates itself.",
    metric: { value: "100%", label: "of calls auto-summarised" },
    tech: ["TypeScript", "Node.js", "OpenAI", "MCP", "Redis Queue"],
    problem: "Agents listened to 20–30 minute recordings to log intent and objections, then moved CRM stages by hand.",
    solution: "An async pipeline that transcribes each call, writes a structured summary with action items, and moves the deal to the right stage by rule.",
    impact: ["Pipeline updates the moment a call ends", "Shared, auditable insights for CX and Sales", "Hours of agent time back every shift"],
    flow: ["Call ingested", "Whisper + LLM summary", "MCP stage rules", "PostgreSQL + Redis", "Live UI sync"]
  },
  {
    id: "trippie", title: "Trippie AI Assistant", icon: "award", hue: "pink", featured: true,
    category: ["ai"],
    tagline: "A pre-trip AI assistant moved to MCP, with a safe test arena.",
    metric: { value: "2", label: "releases in under 7 days" },
    tech: ["MCP", "Next.js", "Node.js", "LLM tooling"],
    problem: "Escalation tool calls failed or timed out under rigid function-calling schemas, and there was nowhere safe to test prompt changes.",
    solution: "A sandboxed Test Arena for Trip Custodians to try edge-case prompts, plus a migration to Model Context Protocol for modular tool wiring.",
    impact: ["Far fewer failed escalations", "Responses noticeably faster within hours", "Prompt changes tested before customers see them"],
    hardest: "Migrating live tool schemas without breaking active customer conversations."
  },
  {
    id: "plato", title: "Plato Operations Platform", icon: "layout", hue: "blue", featured: true, wide: true,
    category: ["platform"],
    tagline: "One platform replacing spreadsheets across 7 departments.",
    metric: { value: "400+", label: "daily active users" },
    tech: ["React", "Next.js", "Laravel", "PostgreSQL", "Redis", "AWS"],
    problem: "CX, Sales, Product, Visa and Finance each kept their own spreadsheets. Data drifted between handoffs and leaders had no live view.",
    solution: "A unified platform with shared data models, granular RBAC, Redis-backed caching and queue jobs, rolled out in phases.",
    impact: ["40% faster API responses", "7 departments on one source of truth", "Zero downtime during rollout"],
    hardest: "A phased rollout with zero downtime for 400+ live daily users."
  },
  {
    id: "refunds", title: "Refund Automation", icon: "clock", hue: "amber",
    category: ["automation"],
    tagline: "Refunds that move themselves through CX and Finance.",
    metric: { value: "<24h", label: "turnaround, was 3–5 days" },
    tech: ["Laravel", "Queue workers", "Webhooks"],
    problem: "Every refund needed manual hand-offs between CX and Finance, taking 3–5 days.",
    solution: "Automated approval pipelines with queue workers and immutable reason logs.",
    impact: ["Refunds done in under 24 hours", "Finance freed from per-refund busywork", "Full audit trail on every step"]
  },
  {
    id: "stream", title: "Stream Workspace", icon: "kanban", hue: "teal",
    category: ["platform"],
    tagline: "Five browser tabs collapsed into one live workspace.",
    metric: { value: "5→1", label: "tabs per customer action" },
    tech: ["React", "Next.js", "TypeScript"],
    problem: "Agents jumped between five tools to handle a single customer.",
    solution: "A single real-time workspace that brings every customer action into one screen.",
    impact: ["No more context switching", "Faster handling per customer"]
  },
  {
    id: "lockerroom", title: "LockerRoom HRM", icon: "file-text", hue: "green",
    category: ["platform", "automation"],
    tagline: "Paper HR files turned into a simple digital system.",
    metric: { value: "50%", label: "less HR admin work" },
    tech: ["React", "Node.js"],
    problem: "Employee records and performance reviews lived on paper.",
    solution: "Digital records and review workflows, kept deliberately simple. Full-stack owner.",
    impact: ["Half the manual HR admin", "Reviews tracked in one place"]
  },
  {
    id: "deal", title: "Deal Size Engine", icon: "shield-check", hue: "indigo",
    category: ["automation"],
    tagline: "Deterministic deal recalculation with a full audit trail.",
    metric: { value: "100%", label: "auditable changes" },
    tech: ["PostgreSQL", "Redis", "Idempotent jobs"],
    problem: "Manual deal-size calculations drifted and nobody could tell why a number changed.",
    solution: "Idempotent recalculation jobs with reason logs for every change, plus recurring cost-update emails for Finance.",
    impact: ["Finance sees what changed and why", "No more drifting numbers"]
  }
];

/* ============================================================
   SKILLS — level: 3 = daily driver, 2 = shipped in production,
   1 = familiar. `used` links to PROJECTS ids.
   ============================================================ */
const SKILL_GROUPS = [
  { id: "frontend", label: "Frontend", skills: [
    { name: "React", level: 3, used: ["plato", "stream", "lockerroom"] },
    { name: "Next.js", level: 3, used: ["plato", "stream", "trippie"] },
    { name: "TypeScript", level: 3, used: ["ai-call", "stream"] },
    { name: "JavaScript", level: 3 },
    { name: "TailwindCSS", level: 2 },
    { name: "Modern CSS", level: 3 },
    { name: "Zustand / Redux", level: 2 },
    { name: "Vite / Webpack", level: 2 }
  ]},
  { id: "uiux", label: "UI / UX", skills: [
    { name: "Design systems", level: 2 },
    { name: "Micro-interactions", level: 3, used: ["plato"] },
    { name: "Accessibility", level: 2 },
    { name: "Responsive layouts", level: 3 },
    { name: "Core Web Vitals", level: 2 },
    { name: "Figma to code", level: 2 }
  ]},
  { id: "backend", label: "Backend", skills: [
    { name: "PHP / Laravel", level: 3, used: ["plato", "refunds"] },
    { name: "Node.js", level: 3, used: ["ai-call", "trippie", "lockerroom"] },
    { name: "REST APIs", level: 3, used: ["plato"] },
    { name: "GraphQL", level: 1 },
    { name: "Queues / Horizon", level: 3, used: ["refunds", "ai-call"] },
    { name: "Sanctum & JWT", level: 2 },
    { name: "WebSockets", level: 2, used: ["stream"] }
  ]},
  { id: "data", label: "Data", skills: [
    { name: "PostgreSQL", level: 3, used: ["plato", "deal", "ai-call"] },
    { name: "MySQL", level: 3 },
    { name: "Redis", level: 3, used: ["plato", "deal", "ai-call"] },
    { name: "PgBouncer", level: 2, used: ["plato"] },
    { name: "Query tuning", level: 3, used: ["plato"] },
    { name: "Read replicas", level: 2 }
  ]},
  { id: "cloud", label: "Cloud & DevOps", skills: [
    { name: "AWS", level: 2, used: ["plato"] },
    { name: "Docker", level: 2 },
    { name: "Kubernetes", level: 1 },
    { name: "GitHub Actions", level: 2 },
    { name: "Nginx & PHP-FPM", level: 2 },
    { name: "Linux", level: 2 }
  ]},
  { id: "ai", label: "AI & Testing", skills: [
    { name: "MCP", level: 3, used: ["trippie", "ai-call"] },
    { name: "OpenAI API", level: 3, used: ["ai-call", "trippie"] },
    { name: "LLM agent tooling", level: 2, used: ["trippie"] },
    { name: "Pest / PHPUnit", level: 2 },
    { name: "Jest / Playwright", level: 2 }
  ]}
];

/* ============================================================
   JOURNEY — resume timeline.
   ============================================================ */
const JOURNEY = [
  { when: "2020", title: "Started CS degree", place: "Dr. Ambedkar Govt. Arts College", text: "B.Sc. Computer Science, Chennai. Where the code habit started.", icon: "file-text" },
  { when: "Oct 2023", title: "Associate Developer", place: "True Tracking", text: "Real-time telemetry dashboards, 30% more API throughput, RBAC and AWS scaling (~50% more capacity).", icon: "monitor" },
  { when: "Sep 2024", title: "Software Developer", place: "PickYourTrail", text: "Platform for 400+ daily users, AI call pipelines, 40% faster APIs, refunds under 24h.", icon: "layout" },
  { when: "Award", title: "Rookie of the Year", place: "PickYourTrail", text: "For the Visa Dashboard, Auto-quote, Instant Voucher, and stepping in on the Refunds launch.", icon: "award" },
  { when: "Next", title: "Bigger systems", place: "Your team?", text: "Distributed systems, production AI agents, and platform-level design.", icon: "sparkle" }
];

/* ============================================================
   AI AGENT PLAYGROUND — simulated MCP agent traces.
   step types: intent | tool | result | guard | reply
   ============================================================ */
const AGENT_SCENARIOS = [
  {
    prompt: "Where is my visa application?",
    steps: [
      { type: "intent", label: "Intent", detail: "visa_status · confidence 0.94", ms: 120 },
      { type: "tool", label: "MCP tool call", detail: 'get_booking({ traveller: "current" })', ms: 80 },
      { type: "result", label: "Tool result", detail: '{ booking: "PYT-8421", country: "Japan" }', ms: 40 },
      { type: "tool", label: "MCP tool call", detail: 'get_visa_status({ booking: "PYT-8421" })', ms: 90 },
      { type: "result", label: "Tool result", detail: '{ status: "submitted", eta_days: 3 }', ms: 60 }
    ],
    reply: "Your Japan visa was submitted and should be ready in about <b>3 working days</b>. I'll ping you when it's approved. ✈️"
  },
  {
    prompt: "Can I change my hotel in Bali?",
    steps: [
      { type: "intent", label: "Intent", detail: "modify_stay · confidence 0.91", ms: 110 },
      { type: "tool", label: "MCP tool call", detail: 'search_hotels({ city: "Bali", nights: 3, budget: "same" })', ms: 240 },
      { type: "result", label: "Tool result", detail: "3 options · price diff −₹1,200 to +₹2,800", ms: 30 },
      { type: "guard", label: "Guardrail", detail: "Price change → needs traveller confirmation", ms: 10 }
    ],
    reply: "Sure! I found <b>3 similar hotels</b>, one is even ₹1,200 cheaper. Want me to send the options for you to confirm?"
  },
  {
    prompt: "I want a refund for my cancelled tour.",
    steps: [
      { type: "intent", label: "Intent", detail: "refund_request · confidence 0.97", ms: 100 },
      { type: "tool", label: "MCP tool call", detail: 'check_refund_policy({ item: "tour", reason: "cancelled_by_vendor" })', ms: 70 },
      { type: "result", label: "Tool result", detail: "{ eligible: true, amount: \"full\" }", ms: 30 },
      { type: "tool", label: "MCP tool call", detail: 'create_refund_request({ priority: "normal" })', ms: 120 },
      { type: "result", label: "Tool result", detail: "Queued in the refund pipeline · SLA < 24h", ms: 40 }
    ],
    reply: "Done. Your refund request is in, and you're eligible for a <b>full refund</b>. It usually reaches you within <b>24 hours</b>."
  },
  {
    prompt: "My flight is delayed and nobody is helping!",
    steps: [
      { type: "intent", label: "Intent", detail: "complaint · sentiment: very negative", ms: 130 },
      { type: "guard", label: "Guardrail", detail: "Escalation rule matched: upset traveller + live trip", ms: 10 },
      { type: "tool", label: "MCP tool call", detail: 'escalate_to_custodian({ priority: "high", context: summary })', ms: 90 },
      { type: "result", label: "Tool result", detail: "Assigned to on-call Trip Custodian · ETA 2 min", ms: 30 }
    ],
    reply: "I'm really sorry. I've flagged this as <b>high priority</b> and a Trip Custodian will call you in about <b>2 minutes</b> with the full context, so you won't need to repeat yourself."
  },
  {
    prompt: "Write me a poem about pizza 🍕",
    steps: [
      { type: "intent", label: "Intent", detail: "off_topic · confidence 0.88", ms: 90 },
      { type: "guard", label: "Guardrail", detail: "Out of scope → no tools called, steer back politely", ms: 10 }
    ],
    reply: "Tempting! 🍕 But I'm your trip assistant, so I'll stick to travel. Want food recommendations near your hotel instead?"
  }
];
