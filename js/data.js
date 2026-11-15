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
  { title: "Rookie of the Year", date: "PickYourTrail", description: "For delivering the Visa Allocation Dashboard, Auto-Quote Engine and Instant Voucher service, and supporting refund systems during launch." },
  { title: "Top Contributor: 10+ modules, 50+ features", date: "PickYourTrail", description: "Ranked #1 contributor across Plato CRM and Locker Room HRM, owning delivery from RFC to production." },
  { title: "Trippie AI launches shipped in under a week", date: "PickYourTrail", description: "Built a pre-production test environment for Trip Custodians and moved agent tool wiring to MCP, reducing escalation failures and speeding up responses." },
  { title: "Unity: 100 conversions in 60 days", date: "PickYourTrail", description: "Contributed to the core itinerary generation engine, which passed 100 direct sales conversions within two months of rollout." },
  { title: "Zero-downtime enterprise migration", date: "PickYourTrail", description: "Moved 5 departments from legacy spreadsheets and scattered tools onto one platform with 100% data integrity and zero business disruption." }
];

const CERTIFICATIONS = [];

/* CHANGE THIS to your own passcode before sharing this file. */
const ADMIN_PASSCODE = "vignesh2026";

/* ============================================================
   ABOUT — "Ask me anything" chat. Add your own questions here.
   ============================================================ */
const ABOUT_QA = [
  { q: "What do you actually do?", a: "I build the backend systems a travel company runs on: an internal CRM, workflow automation, and AI voice and chat agents. They serve <b>400+ people across 5 teams</b> every day." },
  { q: "What's your favourite kind of problem?", a: "Messy manual workflows. If people are copy-pasting between spreadsheets or logging calls by hand, I want to automate it. I moved <b>5 departments</b> off spreadsheets onto one platform with zero downtime." },
  { q: "How do you use AI in production?", a: "In production: <b>AI voice agents</b> for follow-ups and lead qualification, an agent that summarises calls and moves CRM stages, and <b>Trippie</b>, a travel assistant running on <b>MCP</b>. I also use AI tools daily for code review, debugging and docs." },
  { q: "Backend or frontend?", a: "Backend first: PHP, Laravel, MySQL and Redis. I also work in React and Next.js and love UI polish. A teammate once said: <i>“When a backend developer has fun with UI and UX, this is the result.”</i>" },
  { q: "How do you handle unfamiliar code?", a: "I don't say “I don't know this codebase.” I ask for time to understand it, then fix or build what's needed. Legacy code is just code nobody has explained yet." },
  { q: "What are you learning right now?", a: "Distributed systems beyond a single monolith, and AI agents that can own a workflow end to end, not just assist with it." },
  { q: "Why should we work together?", a: "I own things end to end: scope, build, test the edge cases (Pest), ship, and stay on it after launch. I was the <b>#1 contributor</b> (10+ modules, 50+ features) and <b>Rookie of the Year</b> at PickYourTrail." },
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
   Source of truth: resume/resume.json (keep them in sync).
   ============================================================ */
const PROJECTS = [
  {
    id: "ai-call", title: "AI Call Intelligence", icon: "sparkle", hue: "violet", featured: true, wide: true,
    category: ["ai", "automation"],
    tagline: "Post-call summaries and CRM updates, done by an AI agent.",
    metric: { value: "0", label: "manual post-call logging" },
    tech: ["Laravel", "OpenAI API", "MCP", "Queues"],
    problem: "Manual post-call logging was creating overhead for CX and Sales teams, and CRM stages were moved by hand.",
    solution: "An AI agent workflow using the OpenAI API and Model Context Protocol (MCP) tool wiring that summarises each call and moves the CRM pipeline automatically.",
    impact: ["Post-call summaries without manual logging", "CRM pipeline transitions happen on their own", "CX and Sales spend time with customers, not forms"],
    flow: ["Call ends", "Queued job", "LLM summary", "MCP stage rules", "CRM updated"]
  },
  {
    id: "voice", title: "Voice AI Automation", icon: "phone", hue: "pink", featured: true,
    category: ["ai", "automation"],
    tagline: "AI voice agents for follow-ups, lead qualification and trip help.",
    metric: { value: "E2E", label: "automated touchpoints" },
    tech: ["Laravel", "LLM orchestration", "Voice agents", "Webhooks"],
    problem: "Customer follow-ups, lead qualification and trip assistance were all handled manually.",
    solution: "Backend workflows that power AI-based voice automation, using LLM agent tooling and orchestration to run these touchpoints end to end.",
    impact: ["Follow-ups and lead qualification run automatically", "Trip assistance available without a person on every call", "Agents hand off to people when needed"],
    flow: ["Trigger (cron / webhook)", "Voice agent call", "LLM orchestration", "Tool calls", "Outcome logged"]
  },
  {
    id: "plato", title: "Plato Internal CRM", icon: "layout", hue: "blue", featured: true, wide: true,
    category: ["platform"],
    tagline: "One backend for CX, Sales, Product, Visa and Finance.",
    metric: { value: "400+", label: "daily active users" },
    tech: ["PHP", "Laravel", "MySQL", "Redis", "Cron jobs"],
    problem: "No shared backend served the five teams consistently, and a legacy PHP codebase was slowing delivery.",
    solution: "Migrated the legacy codebase to modern Laravel and built modules for workflow tracking, customer data processing and reporting, with background jobs and scheduled tasks for repetitive work.",
    impact: ["40% faster API responses (query tuning + caching)", "400+ daily users on a stable backend", "5 departments migrated with zero downtime"],
    hardest: "Migrating 5 departments off spreadsheets and legacy tools with 100% data integrity and zero business disruption."
  },
  {
    id: "trippie", title: "Trippie AI Assistant", icon: "award", hue: "teal",
    category: ["ai"],
    tagline: "Pre-trip AI voice/chat assistant on an MCP agent architecture.",
    metric: { value: "<1 wk", label: "for two AI launches" },
    tech: ["MCP", "OpenAI API", "Laravel", "Voice / chat"],
    problem: "Agent tool calls were hard to scale and there was nowhere safe to test agent behaviour before customers saw it.",
    solution: "Backend workflows for an AI voice/chat assistant, agent tool execution moved to MCP for shared context across tools, plus a sandboxed test environment for internal operators.",
    impact: ["Fewer escalation failures", "Faster responses", "Changes validated before customer rollout"],
    hardest: "Moving live agent tool wiring to MCP without disrupting customers."
  },
  {
    id: "unity", title: "Unity Itinerary Engine", icon: "trend", hue: "amber",
    category: ["platform"],
    tagline: "Itinerary builder and quotation service for the Sales team.",
    metric: { value: "100+", label: "conversions in 60 days" },
    tech: ["Laravel", "MySQL", "Pricing logic"],
    problem: "Sales needed to build itineraries and quotes quickly, with pricing they could trust.",
    solution: "Contributed to the itinerary generation engine and optimised checkout and pricing calculations for fast, reliable responses.",
    impact: ["100+ closed conversions within 60 days of launch", "Fast, reliable pricing and checkout"]
  },
  {
    id: "lockerroom", title: "Locker Room HRM", icon: "file-text", hue: "green",
    category: ["platform", "automation"],
    tagline: "Internal HR platform for employee data and performance.",
    metric: { value: "50%", label: "less manual HR work" },
    tech: ["Laravel", "MySQL"],
    problem: "HR processing was manual and data was hard to see in one place.",
    solution: "Automated HR workflows and improved reporting, plus reliability and performance work.",
    impact: ["Manual HR processing time cut by 50%", "Better data visibility and reporting accuracy"]
  },
  {
    id: "redis", title: "API & Caching Overhaul", icon: "lightning", hue: "indigo",
    category: ["automation", "platform"],
    tagline: "Query tuning and Redis caching across key modules.",
    metric: { value: "40%+", label: "faster API responses" },
    tech: ["MySQL", "Redis", "Laravel"],
    problem: "Key modules had slow API responses and repeated queries were putting redundant load on the database.",
    solution: "Optimised API performance and database queries, and added Redis-based caching for repeated reads.",
    impact: ["Response time cut by 40%+ across key modules", "Less database load", "Pest tests guarding critical business logic"]
  }
];

/* ============================================================
   SKILLS — level: 3 = daily driver, 2 = shipped in production,
   1 = familiar. `used` links to PROJECTS ids.
   Groups follow resume/resume.json.
   ============================================================ */
const SKILL_GROUPS = [
  { id: "backend", label: "Backend", skills: [
    { name: "PHP", level: 3, used: ["plato", "redis"] },
    { name: "Laravel", level: 3, used: ["plato", "ai-call", "voice", "unity", "lockerroom"] },
    { name: "REST APIs", level: 3, used: ["plato", "redis"] },
    { name: "MySQL", level: 3, used: ["plato", "unity", "redis"] },
    { name: "Redis", level: 3, used: ["redis", "plato"] },
    { name: "Queue systems", level: 3, used: ["ai-call", "plato"] },
    { name: "Cron jobs", level: 3, used: ["plato", "voice"] },
    { name: "Webhooks", level: 2, used: ["voice"] },
    { name: "GraphQL", level: 1 }
  ]},
  { id: "ai", label: "AI", skills: [
    { name: "OpenAI API", level: 3, used: ["ai-call", "trippie"] },
    { name: "MCP", level: 3, used: ["trippie", "ai-call"] },
    { name: "LLM agent orchestration", level: 3, used: ["voice", "trippie"] },
    { name: "Voice agents", level: 2, used: ["voice", "trippie"] },
    { name: "Prompt engineering", level: 2, used: ["trippie", "ai-call"] },
    { name: "AI-assisted dev & review", level: 3 }
  ]},
  { id: "arch", label: "Architecture", skills: [
    { name: "System design", level: 2, used: ["plato"] },
    { name: "API design", level: 3, used: ["plato"] },
    { name: "Database optimisation", level: 3, used: ["redis", "plato"] },
    { name: "Caching strategies", level: 3, used: ["redis"] },
    { name: "Workflow automation", level: 3, used: ["voice", "ai-call", "lockerroom"] },
    { name: "Legacy migration", level: 3, used: ["plato"] }
  ]},
  { id: "security", label: "Security", skills: [
    { name: "Authentication", level: 2 },
    { name: "Authorization", level: 2, used: ["plato"] },
    { name: "Data encryption", level: 2 }
  ]},
  { id: "frontend", label: "Frontend", skills: [
    { name: "React", level: 2 },
    { name: "Next.js", level: 2 }
  ]},
  { id: "tools", label: "Tools & testing", skills: [
    { name: "Pest", level: 2, used: ["redis"] },
    { name: "Git", level: 3 },
    { name: "Linux (Ubuntu)", level: 2 },
    { name: "Nginx", level: 2 }
  ]}
];

/* ============================================================
   JOURNEY — resume timeline.
   ============================================================ */
const JOURNEY = [
  { when: "2020", title: "Started CS degree", place: "Dr. Ambedkar Govt. Arts College", text: "B.Sc. Computer Science, Chennai (2020–2023). Where the code habit started.", icon: "file-text" },
  { when: "Oct 2023", title: "Associate Developer", place: "True Tracking", text: "30% system performance gain, hardened authentication and encryption, and ~50% more capacity through cloud integration.", icon: "monitor" },
  { when: "Sep 2024", title: "Jr. Software Developer", place: "PickYourTrail", text: "Laravel backends for 400+ daily users across 5 teams, AI voice and call agents with MCP, and 40%+ faster APIs.", icon: "layout" },
  { when: "Award", title: "Rookie of the Year", place: "PickYourTrail", text: "For the Visa Allocation Dashboard, Auto-Quote Engine, Instant Voucher, and supporting refund systems during launch.", icon: "award" },
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
      { type: "result", label: "Tool result", detail: "Queued for the Finance refund workflow", ms: 40 }
    ],
    reply: "Done. Your refund request is in, and you're eligible for a <b>full refund</b>. You'll get a confirmation as soon as Finance processes it."
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
