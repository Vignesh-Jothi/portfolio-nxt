/* ============================================================
   BLOG POSTS DATA — Reusable data structure for system design
   and software engineering articles.
   Adding new articles in the future requires only appending to
   this array without touching HTML markup.
   ============================================================ */

const BLOG_POSTS = [
  {
    id: "scaling-web-apps",
    slug: "designing-scalable-web-applications",
    title: "Designing Scalable Web Applications: Architecture Patterns for High-Throughput Systems",
    category: "System Design",
    date: "Jan 20, 2026",
    readTime: "8 min read",
    summary: "A practical guide to architecting resilient web platforms capable of handling 500k+ daily requests — covering stateless compute, connection pooling, database read-replicas, and multi-tier caching.",
    tags: ["System Design", "Scalability", "PostgreSQL", "Redis", "Node.js", "AWS"],
    content: `
      <p class="lead">Scaling a web application is rarely about swapping in faster hardware or blindly switching to microservices. In production, scalability is a discipline of identifying bottlenecks, isolating state, and eliminating synchronous dependencies before they degrade user experience.</p>
      
      <h3>1. The Stateless Application Tier</h3>
      <p>The single most important principle when scaling the application layer is <strong>zero in-memory session state</strong>. When user sessions, cached tokens, or transient states reside in Node.js server memory, horizontal scaling behind a Layer 7 Load Balancer (ALB) becomes fragile.</p>
      
      <div class="code-block">
        <div class="code-block-header"><span class="code-lang">TypeScript / Express</span><span class="code-title">Stateless Session Handling via Redis Token Store</span></div>
        <pre><code>// Centralized session management using Redis
import { createClient } from 'redis';
import session from 'express-session';
import RedisStore from 'connect-redis';

const redisClient = createClient({ url: process.env.REDIS_URL });
await redisClient.connect();

export const sessionMiddleware = session({
  store: new RedisStore({ client: redisClient, prefix: 'sess:' }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax'
  }
});</code></pre>
      </div>

      <p>With externalized session state, autoscaling groups can spin instances up or down based on CPU utilization or queue backlog without dropping active user connections or requiring sticky routing.</p>

      <h3>2. Database Scaling: Connection Pooling &amp; Read Replicas</h3>
      <p>In 90% of web systems, the database becomes the first true wall. Relational databases like <strong>PostgreSQL</strong> create a dedicated backend process for each TCP connection, consuming memory and causing context-switching overhead.</p>

      <div class="callout callout-info">
        <div class="callout-title">💡 Production Bottleneck: Connection Churn</div>
        <p>Opening and closing SSL connections on serverless functions or microservices can saturate PostgreSQL process limits within seconds. Introducing <strong>PgBouncer</strong> or AWS RDS Proxy maintains a warm pool of pooled database connections, reducing database CPU load by over 40%.</p>
      </div>

      <p>To scale read queries which typically outnumber writes 10-to-1:</p>
      <ul>
        <li><strong>Primary-Replica Topologies:</strong> Direct all write operations (<code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code>) to the Primary node, while routing idempotent read traffic to read replicas via asynchronous replication.</li>
        <li><strong>CQRS-Lite Query Routing:</strong> Implement repository layers that automatically route read-only queries to replica pools while retaining write-consistency on transactions.</li>
      </ul>

      <h3>3. Multi-Tier Caching &amp; The Cache-Aside Pattern</h3>
      <p>The fastest database query is the one that never executes. A robust multi-tier caching strategy comprises:</p>
      <ol>
        <li><strong>Edge/CDN Caching (Cloudflare/CloudFront):</strong> Cache static assets and public cacheable API responses with optimal <code>Cache-Control</code> headers and <code>stale-while-revalidate</code>.</li>
        <li><strong>In-Memory Distributed Cache (Redis):</strong> Store hot entity records, serialized API responses, and rate limit counters with explicit TTLs.</li>
      </ol>

      <div class="code-block">
        <div class="code-block-header"><span class="code-lang">TypeScript</span><span class="code-title">Cache-Aside Pattern with Single-Flight Stampede Protection</span></div>
        <pre><code>async function getCachedEntity&lt;T&gt;(
  key: string,
  fetcher: () => Promise&lt;T&gt;,
  ttlSeconds: number = 300
): Promise&lt;T&gt; {
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached) as T;
  }

  // Fetch fresh data from persistent storage
  const freshData = await fetcher();
  
  if (freshData) {
    await redis.set(key, JSON.stringify(freshData), { EX: ttlSeconds });
  }
  
  return freshData;
}</code></pre>
      </div>

      <h3>4. Resiliency: Circuit Breakers and Graceful Degradation</h3>
      <p>When third-party integrations (payment gateways, AI services, SMS APIs) fail or experience high latency, cascading failures can bring down the entire system. Implementing <strong>Circuit Breakers</strong> (e.g., via <code>opossum</code> or resilience middleware) prevents request queues from exhausting system resources when external dependencies falter.</p>

      <div class="callout callout-success">
        <div class="callout-title">Key Architectural Takeaway</div>
        <p>Design every component with failure in mind: keep instances stateless, protect databases behind connection poolers and replicas, leverage Redis cache-aside, and decouple long-running operations into background queues.</p>
      </div>
    `
  },
  {
    id: "queues-caching-async-workflows",
    slug: "understanding-queues-caching-and-asynchronous-workflows",
    title: "Understanding Queues, Caching, and Asynchronous Workflows in Production",
    category: "Backend Engineering",
    date: "Dec 14, 2025",
    readTime: "9 min read",
    summary: "How to decouple synchronous web requests using Redis Streams, BullMQ, and message queues to build fault-tolerant, idempotent background workflows that scale reliably.",
    tags: ["Queues", "Redis", "BullMQ", "Architecture", "Node.js", "Docker"],
    content: `
      <p class="lead">In high-traffic systems, keeping the request-response cycle fast is non-negotiable. If an API endpoint attempts to send confirmation emails, process media files, generate invoices, or execute AI transcriptions inline, response times balloon and timeouts inevitably occur. Asynchronous queue architectures solve this by transforming synchronous bottlenecks into resilient background pipelines.</p>

      <h3>1. The Anatomy of Background Queue Processing</h3>
      <p>A message queue architecture decouples the <strong>Producer</strong> (the web HTTP handler) from the <strong>Consumer</strong> (the worker process). The producer simply validates the payload, pushes an event to the queue (such as Redis or SQS), and returns an immediate <code>202 Accepted</code> or job ticket to the client.</p>

      <div class="code-block">
        <div class="code-block-header"><span class="code-lang">TypeScript / BullMQ</span><span class="code-title">Producer: Enqueueing Background Job</span></div>
        <pre><code>import { Queue } from 'bullmq';

const exportQueue = new Queue('data-export-queue', {
  connection: { host: '127.0.0.1', port: 6379 }
});

// Fast HTTP Endpoint handler
export async function handleReportExport(req: Request, res: Response) {
  const { userId, dateRange, format } = req.body;
  
  // Enqueue job with unique idempotency key
  const job = await exportQueue.add('generate-report', {
    userId,
    dateRange,
    format
  }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000 // 2s, 4s, 8s
    },
    removeOnComplete: true
  });

  return res.status(202).json({
    status: 'queued',
    jobId: job.id,
    message: 'Report is generating in background'
  });
}</code></pre>
      </div>

      <h3>2. Guaranteeing Idempotency: Solving Duplicate Processing</h3>
      <p>In distributed systems, the network is unreliable. When worker nodes crash mid-job or message acknowledgments get lost, queue brokers will redeliver the message (<strong>at-least-once delivery</strong>). Without idempotency, a payment could be charged twice or a duplicate refund initiated.</p>

      <div class="callout callout-warning">
        <div class="callout-title">⚠️ The Golden Rule of Queue Consumers</div>
        <p>Never assume a job will execute exactly once. Always design worker tasks so that executing the same job payload multiple times produces the exact same outcome without unintended side effects.</p>
      </div>

      <div class="code-block">
        <div class="code-block-header"><span class="code-lang">TypeScript / Worker</span><span class="code-title">Idempotent Worker Implementation</span></div>
        <pre><code>import { Worker, Job } from 'bullmq';
import { db } from '../db';
import { redis } from '../cache';

export const reportWorker = new Worker('data-export-queue', async (job: Job) => {
  const lockKey = \`lock:job:\${job.id}\`;
  
  // Acquire distributed lock with 60s auto-release
  const acquired = await redis.set(lockKey, 'processing', { NX: true, EX: 60 });
  if (!acquired) {
    console.log(\`Job \${job.id} is already in progress by another worker.\`);
    return;
  }

  try {
    // Check if task was already marked completed in DB
    const existing = await db.reports.findUnique({ where: { jobId: job.id } });
    if (existing && existing.status === 'COMPLETED') {
      return existing;
    }

    // Perform heavy processing
    const fileUrl = await generateReportFile(job.data);
    
    // Save state transactionally
    await db.reports.create({
      data: { jobId: job.id, fileUrl, status: 'COMPLETED' }
    });
  } finally {
    await redis.del(lockKey);
  }
});</code></pre>
      </div>

      <h3>3. Preventing the Cache Stampede (Thundering Herd)</h3>
      <p>When a heavily requested cached key expires during peak traffic, hundreds of concurrent requests may simultaneously query the underlying database to refresh the cache. This phenomenon—the <strong>Cache Stampede</strong>—can knock databases offline.</p>
      
      <p>Two battle-tested techniques to prevent stampedes:</p>
      <ul>
        <li><strong>Probabilistic Early Expiration (XFetch):</strong> Recompute the cached item asynchronously before it officially expires based on remaining TTL and computation cost.</li>
        <li><strong>Distributed Mutex Lock:</strong> Ensure only the first requesting thread performs the DB query while other concurrent threads wait or receive stale data temporarily.</li>
      </ul>

      <h3>4. Dead-Letter Queues (DLQ) &amp; Observability</h3>
      <p>When a worker repeatedly fails (e.g. malformed data or permanent external API rejection), jobs should transition to a <strong>Dead-Letter Queue (DLQ)</strong> after exhausting configured exponential retries. This isolates poisoned messages, triggers alerts (via Slack/PagerDuty), and allows developers to replay failed tasks once bugs are patched.</p>
    `
  },
  {
    id: "maintainable-fullstack-architecture",
    slug: "structuring-maintainable-fullstack-systems",
    title: "Structuring Maintainable Full-Stack Systems: From Clean Architecture to Next.js & Node.js",
    category: "Software Architecture",
    date: "Nov 28, 2025",
    readTime: "9 min read",
    summary: "A blueprint for structuring scalable TypeScript applications across the stack — combining clean layered architecture in Node.js with component modularity and type-safety in Next.js.",
    tags: ["Architecture", "TypeScript", "React", "Next.js", "Node.js", "Clean Code"],
    content: `
      <p class="lead">Software systems spend 80% of their lifecycle in maintenance. When applications grow from simple proofs of concept to multi-team platforms, architectural clarity dictates whether feature velocity remains high or slows to a painful crawl due to spaghetti code and tight coupling.</p>

      <h3>1. Layered Backend Architecture (Separation of Concerns)</h3>
      <p>To avoid massive controllers that handle HTTP parsing, business rules, database queries, and third-party integrations all in one file, enforce a strict three-layer architecture:</p>
      
      <div class="code-block">
        <div class="code-block-header"><span class="code-lang">Architecture Map</span><span class="code-title">Request Flow through Architectural Layers</span></div>
        <pre><code>HTTP Request ──▶ [ Controller / Route ]  (Validation, Status Codes, Cookies)
                        │
                        ▼
                 [ Service Layer ]       (Business Logic, Workflows, Domain Rules)
                        │
                        ▼
                 [ Repository Layer ]    (Database Queries, ORM, Caching, DB Schema)
                        │
                        ▼
                 [ PostgreSQL / Redis ]</code></pre>
      </div>

      <div class="code-block">
        <div class="code-block-header"><span class="code-lang">TypeScript</span><span class="code-title">Domain Service Layer Example</span></div>
        <pre><code>// services/RefundService.ts
export class RefundService {
  constructor(
    private refundRepo: IRefundRepository,
    private paymentGateway: IPaymentGateway,
    private auditLogger: IAuditLogger
  ) {}

  async processRefund(bookingId: string, amount: number, initiatorId: string) {
    const booking = await this.refundRepo.findBookingById(bookingId);
    if (!booking) throw new NotFoundError('Booking not found');
    if (booking.refundStatus === 'PROCESSED') {
      throw new ConflictError('Refund already completed');
    }

    // Execute refund via gateway
    const gatewayTxn = await this.paymentGateway.refund({
      transactionId: booking.gatewayTxnId,
      amount
    });

    // Update DB & log audit trail atomically
    const refundRecord = await this.refundRepo.saveRefundTransaction({
      bookingId,
      amount,
      gatewayRef: gatewayTxn.id,
      initiatorId
    });

    await this.auditLogger.log({
      action: 'REFUND_PROCESSED',
      entityId: bookingId,
      userId: initiatorId,
      metadata: { amount, gatewayTxnId: gatewayTxn.id }
    });

    return refundRecord;
  }
}</code></pre>
      </div>

      <h3>2. End-to-End Type Safety with TypeScript</h3>
      <p>Sharing type definitions and schema validators (such as <strong>Zod</strong>) between frontend and backend eliminates an entire class of runtime contract bugs. When backend schemas change, TypeScript compiler checks flag outdated frontend consumers immediately at build time.</p>

      <div class="code-block">
        <div class="code-block-header"><span class="code-lang">TypeScript / Zod</span><span class="code-title">Shared Validation Contracts</span></div>
        <pre><code>import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['ADMIN', 'ENGINEER', 'SUPPORT']),
  department: z.string()
});

export type CreateUserInput = z.infer&lt;typeof CreateUserSchema&gt;;</code></pre>
      </div>

      <h3>3. Frontend Modularity in Next.js and React</h3>
      <p>Maintainable React applications follow clean composition principles:</p>
      <ul>
        <li><strong>Server Components by Default (Next.js App Router):</strong> Fetch data directly on the server to reduce client-side bundle sizes and avoid waterfall requests.</li>
        <li><strong>Presentational vs. Container Components:</strong> Keep UI components pure and testable; isolate side effects, state machines, and data hooks into specialized custom hooks.</li>
        <li><strong>Predictable State Management:</strong> Use localized component state where possible, lightweight global stores (e.g. <code>Zustand</code>) for cross-cutting application state, and <code>TanStack Query</code> for server state caching and deduplication.</li>
      </ul>

      <h3>4. Testing Strategy: High Confidence, Low Friction</h3>
      <p>Rather than chasing 100% code coverage on trivial boilerplate, focus testing investment where risk lives:</p>
      <ol>
        <li><strong>Unit Tests (Jest / Vitest):</strong> Test pure business calculations, domain validation rules, and utility transforms.</li>
        <li><strong>Integration Tests:</strong> Test database repositories against real containerized PostgreSQL instances (using Docker Testcontainers) and API endpoints with Supertest.</li>
        <li><strong>E2E Tests (Playwright):</strong> Test critical user journeys (authentication, checkout, core workflow completion).</li>
      </ol>

      <div class="callout callout-success">
        <div class="callout-title">Summary Checklist</div>
        <p>A maintainable system separates presentation from domain logic, guarantees end-to-end type safety, keeps frontend components focused and composable, and validates critical paths with automated integration tests.</p>
      </div>
    `
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BLOG_POSTS };
}
