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
   PROJECTS — cards + case study modal.
   category: ai | platform | automation
   Source of truth: resume/resume.json (keep them in sync).
   ============================================================ */
const PROJECTS = [
  {
    id: "ai-call", title: "AI Call Intelligence",
    category: ["ai", "automation"],
    tagline: "Call summaries and CRM updates, done by an AI agent after every call.",
    tech: ["OpenAI API", "MCP", "Queues", "Laravel"],
    problem: "Manual post call logging was creating overhead for CX and Sales teams, and CRM stages were moved by hand.",
    solution: "An AI agent workflow using the OpenAI API and Model Context Protocol (MCP) tool wiring that summarises each call and moves the CRM pipeline automatically.",
    impact: ["Call summaries without manual logging", "CRM pipeline transitions happen on their own", "CX and Sales spend time with customers, not forms"],
    flow: ["Call ends", "Queued job", "LLM summary", "MCP stage rules", "CRM updated"]
  },
  {
    id: "voice", title: "Voice AI Automation",
    category: ["ai", "automation"],
    tagline: "AI voice agents for follow ups, lead qualification and trip help.",
    tech: ["Voice agents", "LLM orchestration", "Webhooks", "Laravel"],
    problem: "Customer follow ups, lead qualification and trip assistance were all handled manually.",
    solution: "Backend workflows that power AI voice automation, using LLM agent tooling and orchestration to run these touchpoints end to end.",
    impact: ["Follow ups and lead qualification run automatically", "Trip assistance available without a person on every call", "Agents hand off to people when needed"],
    flow: ["Trigger (cron / webhook)", "Voice agent call", "LLM orchestration", "Tool calls", "Outcome logged"]
  },
  {
    id: "trippie", title: "Trippie AI Assistant",
    category: ["ai"],
    tagline: "AI voice and chat assistant for travellers before their trip, built on MCP.",
    metric: { value: "<1 wk", label: "for two AI launches" },
    tech: ["MCP", "OpenAI API", "Voice and chat", "Laravel"],
    problem: "Agent tool calls were hard to scale and there was nowhere safe to test agent behaviour before customers saw it.",
    solution: "Backend workflows for an AI voice/chat assistant, agent tool execution moved to MCP for shared context across tools, plus a sandboxed test environment for internal operators.",
    impact: ["Fewer escalation failures", "Faster responses", "Changes validated before customer rollout"],
    hardest: "Moving live agent tool wiring to MCP without disrupting customers."
  },
  {
    id: "plato", title: "Plato Internal CRM",
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
    id: "unity", title: "Unity Itinerary Engine",
    category: ["platform"],
    tagline: "Itinerary builder and quotation service for the Sales team.",
    metric: { value: "100+", label: "conversions in 60 days" },
    tech: ["Laravel", "MySQL", "Pricing logic"],
    problem: "Sales needed to build itineraries and quotes quickly, with pricing they could trust.",
    solution: "Contributed to the itinerary generation engine and optimised checkout and pricing calculations for fast, reliable responses.",
    impact: ["100+ closed conversions within 60 days of launch", "Fast, reliable pricing and checkout"]
  },
  {
    id: "lockerroom", title: "Locker Room HRM",
    category: ["platform", "automation"],
    tagline: "Internal HR platform for employee data and performance.",
    metric: { value: "50%", label: "less manual HR work" },
    tech: ["Laravel", "MySQL"],
    problem: "HR processing was manual and data was hard to see in one place.",
    solution: "Automated HR workflows and improved reporting, plus reliability and performance work.",
    impact: ["Manual HR processing time cut by 50%", "Better data visibility and reporting accuracy"]
  },
  {
    id: "redis", title: "API & Caching Overhaul",
    category: ["automation", "platform"],
    tagline: "Query tuning and Redis caching across key modules.",
    metric: { value: "40%+", label: "faster API responses" },
    tech: ["MySQL", "Redis", "Laravel"],
    problem: "Key modules had slow API responses and repeated queries were putting redundant load on the database.",
    solution: "Optimised API performance and database queries, and added Redis caching for repeated reads.",
    impact: ["Response time cut by 40%+ across key modules", "Less database load", "Pest tests guarding critical business logic"]
  }
];

/* ============================================================
   SKILLS — grouped as in resume/resume.json.
   ============================================================ */
const SKILL_GROUPS = [
  { id: "ai", label: "AI and agents", skills: [
    { name: "OpenAI API" },
    { name: "MCP" },
    { name: "LLM agent orchestration" },
    { name: "Voice agents" },
    { name: "Prompt engineering" },
    { name: "Agent workflow automation" },
    { name: "AI assisted dev & review" }
  ]},
  { id: "backend", label: "Backend", skills: [
    { name: "PHP" },
    { name: "Laravel" },
    { name: "REST APIs" },
    { name: "MySQL" },
    { name: "Redis" },
    { name: "Queue systems" },
    { name: "Cron jobs" },
    { name: "Webhooks" },
    { name: "GraphQL" }
  ]},
  { id: "arch", label: "Architecture", skills: [
    { name: "System design" },
    { name: "API design" },
    { name: "Database optimisation" },
    { name: "Caching strategies" },
    { name: "Workflow automation" },
    { name: "Legacy migration" }
  ]},
  { id: "security", label: "Security", skills: [
    { name: "Authentication" },
    { name: "Authorization" },
    { name: "Data encryption" }
  ]},
  { id: "frontend", label: "Frontend", skills: [
    { name: "React" },
    { name: "Next.js" }
  ]},
  { id: "tools", label: "Tools & testing", skills: [
    { name: "Pest" },
    { name: "Git" },
    { name: "Linux (Ubuntu)" },
    { name: "Nginx" }
  ]}
];
