/* ============================================================
   BLOG POSTS DATA — AI engineering, backend and software
   architecture articles. Listed newest first by date in main.js.
   Adding new articles in the future requires only appending to
   this array without touching HTML markup.
   ============================================================ */

const BLOG_POSTS = [
  {
    id: "scaling-laravel-apps",
    slug: "scaling-laravel",
    title: "Designing Scalable Laravel Applications: Architecture Patterns for High-Throughput Systems",
    category: "System Design",
    date: "Jan 20, 2026",
    readTime: "8 min read",
    summary: "A practical guide to architecting resilient Laravel platforms capable of handling 500k+ daily requests — covering stateless sessions, connection pooling, database read-replicas, and multi-tier caching with Redis.",
    tags: ["System Design", "Laravel", "Scalability", "PostgreSQL", "Redis", "PHP", "AWS"],
    content: `
      <p class="lead">Scaling a Laravel application is rarely about swapping in faster hardware or blindly switching to microservices. In production, scalability is a discipline of identifying bottlenecks, isolating state, and eliminating synchronous dependencies before they degrade user experience.</p>
      
      <h3>The Stateless Application Tier</h3>
      <p>The single most important principle when scaling the application layer is <strong>zero in-memory session state</strong>. When user sessions reside on a single PHP-FPM instance, horizontal scaling behind a Layer 7 Load Balancer (ALB) becomes fragile. Laravel makes this trivially easy to fix.</p>
      
      <div class="code-block">
        <div class="code-block-header"><span class="code-lang">PHP / Laravel</span><span class="code-title">Stateless Session Handling via Redis Driver</span></div>
        <pre><code>// config/session.php — switch driver to redis
return [
    'driver'     => env('SESSION_DRIVER', 'redis'),
    'lifetime'   => 10080, // 7 days in minutes
    'encrypt'    => true,
    'secure'     => env('SESSION_SECURE_COOKIE', true),
    'same_site'  => 'lax',
    'connection' => 'session', // dedicated Redis connection
];

// config/database.php — dedicated session connection
'redis' => [
    'session' => [
        'url'      => env('REDIS_URL'),
        'database' => env('REDIS_SESSION_DB', '1'),
    ],
],</code></pre>
      </div>

      <p>With externalized session state, autoscaling groups can spin instances up or down based on CPU utilization without dropping active user sessions or requiring sticky routing.</p>

      <h3>Database Scaling: Connection Pooling &amp; Read Replicas</h3>
      <p>In 90% of web systems, the database becomes the first true wall. Laravel's Eloquent ORM natively supports <strong>read/write connection splitting</strong>, routing SELECT queries to replica nodes automatically.</p>

      <div class="callout callout-info">
        <div class="callout-title">💡 Production Bottleneck: Connection Churn</div>
        <p>PHP-FPM processes open and close connections on every request. Fronting MySQL or PostgreSQL with <strong>PgBouncer</strong> (for Postgres) or <strong>ProxySQL</strong> (for MySQL) maintains a warm pool, reducing database CPU load by over 40%.</p>
      </div>

      <div class="code-block">
        <div class="code-block-header"><span class="code-lang">PHP / Laravel</span><span class="code-title">Read/Write Split in database.php</span></div>
        <pre><code>// config/database.php
'mysql' => [
    'read' => [
        'host' => [
            env('DB_READ_HOST_1', '10.0.1.10'),
            env('DB_READ_HOST_2', '10.0.1.11'),
        ],
    ],
    'write' => [
        'host' => env('DB_WRITE_HOST', '10.0.1.5'),
    ],
    'sticky'    => true,   // use write connection within same request
    'driver'    => 'mysql',
    'database'  => env('DB_DATABASE', 'app'),
    'username'  => env('DB_USERNAME', 'forge'),
    'password'  => env('DB_PASSWORD', ''),
    'charset'   => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
],</code></pre>
      </div>

      <h3>Multi-Tier Caching &amp; The Cache-Aside Pattern</h3>
      <p>The fastest database query is the one that never executes. Laravel's Cache facade makes the cache-aside pattern elegant and readable:</p>

      <div class="code-block">
        <div class="code-block-header"><span class="code-lang">PHP / Laravel</span><span class="code-title">Cache-Aside Pattern with remember()</span></div>
        <pre><code>use Illuminate\Support\Facades\Cache;

class ProductRepository
{
    public function findById(int $id): ?Product
    {
        return Cache::remember(
            key: "product:{$id}",
            ttl: now()->addMinutes(30),
            callback: fn () => Product::with('variants')->findOrFail($id)
        );
    }

    public function update(int $id, array $data): Product
    {
        $product = Product::findOrFail($id);
        $product->update($data);

        // Invalidate on write
        Cache::forget("product:{$id}");

        return $product->fresh();
    }
}</code></pre>
      </div>

      <h3>Resiliency: Circuit Breakers and Graceful Degradation</h3>
      <p>When third-party integrations (payment gateways, AI services, SMS APIs) fail, cascading failures can bring down the entire system. Laravel's <strong>retry helpers</strong> and custom middleware let you implement circuit-breaker patterns that return cached or degraded responses instead of propagating exceptions to the user.</p>

      <div class="callout callout-success">
        <div class="callout-title">Key Architectural Takeaway</div>
        <p>Design every component with failure in mind: keep instances stateless via Redis sessions, protect databases behind connection poolers and read replicas, leverage Laravel's Cache remember(), and decouple long-running operations into Horizon-managed background queues.</p>
      </div>
    `
  },
  {
    id: "laravel-queues-horizon",
    slug: "laravel-queues",
    title: "Mastering Laravel Queues & Horizon: Building Fault-Tolerant Async Workflows",
    category: "Backend Engineering",
    date: "Dec 14, 2025",
    readTime: "9 min read",
    summary: "How to decouple synchronous web requests using Laravel Jobs, queues, and Horizon to build fault-tolerant, idempotent background workflows that scale reliably in production.",
    tags: ["Laravel", "Queues", "Horizon", "Redis", "PHP", "Backend", "Docker"],
    content: `
      <p class="lead">In high-traffic systems, keeping the request-response cycle fast is non-negotiable. If a Laravel controller attempts to send confirmation emails, process media files, generate invoices, or execute AI transcriptions inline, response times balloon and timeouts inevitably occur. Laravel's queue system—especially with Horizon—transforms these bottlenecks into resilient background pipelines.</p>

      <h3>Dispatching Jobs: The Producer Side</h3>
      <p>A Laravel Job decouples the <strong>HTTP handler</strong> (producer) from the <strong>worker process</strong> (consumer). The controller validates the payload, dispatches the job, and returns an immediate <code>202 Accepted</code> to the client.</p>

      <div class="code-block">
        <div class="code-block-header"><span class="code-lang">PHP / Laravel</span><span class="code-title">Controller — Dispatching a Background Job</span></div>
        <pre><code>// app/Http/Controllers/ReportController.php
use App\Jobs\GenerateExportReport;

class ReportController extends Controller
{
    public function store(ExportReportRequest $request): JsonResponse
    {
        GenerateExportReport::dispatch(
            userId:    $request->user()->id,
            dateRange: $request->validated('date_range'),
            format:    $request->validated('format'),
        )->onQueue('reports');

        return response()->json([
            'status'  => 'queued',
            'message' => 'Report is generating in the background',
        ], 202);
    }
}</code></pre>
      </div>

      <h3>Implementing the Job: Idempotency First</h3>
      <p>In distributed systems, the network is unreliable. Queue brokers deliver messages <strong>at least once</strong>. Without idempotency, a payment could be charged twice or a duplicate email sent. Always check completion state before executing side effects.</p>

      <div class="callout callout-warning">
        <div class="callout-title">⚠️ The Golden Rule of Queue Jobs</div>
        <p>Never assume a job will execute exactly once. Design every <code>handle()</code> method so that processing the same payload multiple times produces the exact same outcome without unintended side effects.</p>
      </div>

      <div class="code-block">
        <div class="code-block-header"><span class="code-lang">PHP / Laravel</span><span class="code-title">Idempotent Job with ShouldBeUnique & Retry Logic</span></div>
        <pre><code>// app/Jobs/GenerateExportReport.php
use Illuminate\Contracts\Queue\ShouldBeUnique;

class GenerateExportReport implements ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int    $tries   = 3;
    public int    $backoff = 60;    // seconds between retries
    public int    $timeout = 300;   // 5 minutes max execution

    public function __construct(
        public readonly int    $userId,
        public readonly array  $dateRange,
        public readonly string $format,
    ) {}

    // Unique lock key — prevents duplicate jobs for same user+range
    public function uniqueId(): string
    {
        return "{$this->userId}:{$this->dateRange['from']}:{$this->dateRange['to']}";
    }

    public function handle(ReportService $service): void
    {
        // Guard: skip if already completed
        $existing = ExportReport::whereUserId($this->userId)
            ->whereDateRange($this->dateRange)
            ->whereStatus('completed')
            ->first();

        if ($existing) {
            return;
        }

        $fileUrl = $service->generate($this->userId, $this->dateRange, $this->format);

        ExportReport::create([
            'user_id'  => $this->userId,
            'file_url' => $fileUrl,
            'status'   => 'completed',
        ]);
    }

    public function failed(\Throwable $e): void
    {
        ExportReport::updateOrCreate(
            ['user_id' => $this->userId],
            ['status' => 'failed', 'error' => $e->getMessage()]
        );
    }
}</code></pre>
      </div>

      <h3>Laravel Horizon: Real-Time Queue Visibility</h3>
      <p>Horizon is Laravel's Redis-backed queue dashboard. It provides live job throughput, failure tracking, and fine-grained worker auto-scaling configuration:</p>

      <div class="code-block">
        <div class="code-block-header"><span class="code-lang">PHP / Laravel</span><span class="code-title">config/horizon.php — Auto-Balanced Supervisor</span></div>
        <pre><code>// config/horizon.php
'environments' => [
    'production' => [
        'supervisor-reports' => [
            'connection'      => 'redis',
            'queue'           => ['reports', 'default'],
            'balance'         => 'auto',
            'minProcesses'    => 2,
            'maxProcesses'    => 20,
            'balanceCooldown' => 3,
            'tries'           => 3,
            'timeout'         => 360,
        ],
        'supervisor-notifications' => [
            'connection' => 'redis',
            'queue'      => ['notifications'],
            'balance'    => 'simple',
            'processes'  => 5,
            'tries'      => 5,
        ],
    ],
],</code></pre>
      </div>

      <h3>Dead-Letter Queues (DLQ) &amp; Observability</h3>
      <p>When a job repeatedly fails, Laravel records it in the <code>failed_jobs</code> table after exhausting configured retries. Use Artisan to inspect, replay, or flush failed jobs:</p>

      <div class="code-block">
        <div class="code-block-header"><span class="code-lang">Bash</span><span class="code-title">Artisan — Inspect & Replay Failed Jobs</span></div>
        <pre><code># List all failed jobs
php artisan queue:failed

# Retry a specific failed job
php artisan queue:retry 5

# Replay all failed jobs in batch
php artisan queue:retry all

# Flush the dead-letter table (use with care)
php artisan queue:flush</code></pre>
      </div>
    `
  },
  {
    id: "maintainable-laravel-architecture",
    slug: "laravel-architecture",
    title: "Structuring Maintainable Laravel Systems: Clean Architecture & API Best Practices",
    category: "Software Architecture",
    date: "Nov 28, 2025",
    readTime: "9 min read",
    summary: "A blueprint for structuring scalable Laravel applications — combining clean layered architecture, Form Requests, Service classes, Repositories, and API Resources for maintainable back-end systems.",
    tags: ["Laravel", "PHP", "Architecture", "Clean Code", "API", "REST"],
    content: `
      <p class="lead">Software systems spend 80% of their lifecycle in maintenance. When Laravel applications grow from simple proofs of concept to multi-team platforms, architectural clarity dictates whether feature velocity remains high or slows to a crawl due to fat controllers and tight coupling.</p>

      <h3>Layered Architecture: Thin Controllers, Fat Services</h3>
      <p>The cardinal sin of Laravel development is the <strong>fat controller</strong>: a single class that handles HTTP parsing, business rules, database queries, and third-party integrations. Enforce a strict four-layer architecture instead:</p>
      
      <div class="code-block">
        <div class="code-block-header"><span class="code-lang">Architecture Map</span><span class="code-title">Request Flow through Laravel Layers</span></div>
        <pre><code>HTTP Request ──▶ [ FormRequest ]       (Validation, Authorization)
                       │
                       ▼
               [ Controller ]           (Coordinate request → service → response)
                       │
                       ▼
               [ Service Layer ]        (Business Logic, Domain Rules, Workflows)
                       │
                       ▼
               [ Repository Layer ]     (Eloquent Queries, DB Caching)
                       │
                       ▼
               [ MySQL / Redis ]</code></pre>
      </div>

      <div class="code-block">
        <div class="code-block-header"><span class="code-lang">PHP / Laravel</span><span class="code-title">Thin Controller + Service Layer Example</span></div>
        <pre><code>// app/Http/Controllers/RefundController.php
class RefundController extends Controller
{
    public function __construct(private RefundService $refundService) {}

    public function store(RefundRequest $request, int $bookingId): JsonResponse
    {
        $refund = $this->refundService->processRefund(
            bookingId:   $bookingId,
            amount:      $request->validated('amount'),
            initiatorId: $request->user()->id,
        );

        return new JsonResponse(new RefundResource($refund), 201);
    }
}

// app/Services/RefundService.php
class RefundService
{
    public function __construct(
        private BookingRepository  $bookings,
        private PaymentGateway     $gateway,
        private AuditLogger        $audit,
    ) {}

    public function processRefund(int $bookingId, int $amount, int $initiatorId): Refund
    {
        $booking = $this->bookings->findOrFail($bookingId);

        throw_if(
            $booking->refund_status === 'processed',
            ConflictException::class, 'Refund already completed.'
        );

        $txn    = $this->gateway->refund($booking->gateway_txn_id, $amount);
        $refund = $this->bookings->saveRefund($bookingId, $amount, $txn->id, $initiatorId);

        $this->audit->log('REFUND_PROCESSED', $bookingId, $initiatorId, compact('amount'));

        return $refund;
    }
}</code></pre>
      </div>

      <h3>Validation with Form Requests</h3>
      <p>Laravel <strong>Form Requests</strong> move validation and authorization out of controllers entirely, keeping each layer focused on its single responsibility:</p>

      <div class="code-block">
        <div class="code-block-header"><span class="code-lang">PHP / Laravel</span><span class="code-title">Form Request — Validation & Authorization</span></div>
        <pre><code>// app/Http/Requests/RefundRequest.php
class RefundRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('finance_admin');
    }

    public function rules(): array
    {
        return [
            'amount' => ['required', 'integer', 'min:100', 'max:1000000'],
            'reason' => ['required', 'string', 'max:500'],
        ];
    }
}</code></pre>
      </div>

      <h3>API Resources: Shaping Responses</h3>
      <p>Laravel <strong>API Resources</strong> decouple your database schema from your public API contract, preventing accidental data leaks and enabling versioning:</p>

      <div class="code-block">
        <div class="code-block-header"><span class="code-lang">PHP / Laravel</span><span class="code-title">API Resource</span></div>
        <pre><code>// app/Http/Resources/RefundResource.php
class RefundResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'booking_id'   => $this->booking_id,
            'amount'       => $this->amount,
            'currency'     => 'INR',
            'status'       => $this->status,
            'initiated_by' => new UserResource($this->whenLoaded('initiator')),
            'created_at'   => $this->created_at->toIso8601String(),
        ];
    }
}</code></pre>
      </div>

      <h3>Testing Strategy: High Confidence, Low Friction</h3>
      <p>Laravel ships with PHPUnit and Pest support out of the box. Focus testing investment where risk lives:</p>
      <ol>
        <li><strong>Feature Tests (HTTP layer):</strong> Use <code>actingAs()</code> and <code>assertJson()</code> to test full request-response cycles against a real SQLite or in-memory DB.</li>
        <li><strong>Unit Tests (Service layer):</strong> Test pure business logic, domain validation rules, and calculation functions with mocked repositories.</li>
        <li><strong>Browser Tests (Dusk / Pest Browser):</strong> Test critical user journeys end-to-end against a running server.</li>
      </ol>

      <div class="code-block">
        <div class="code-block-header"><span class="code-lang">PHP / Pest</span><span class="code-title">Feature Test — Refund API Endpoint</span></div>
        <pre><code>it('allows a finance admin to initiate a refund', function () {
    $admin   = User::factory()->financeAdmin()->create();
    $booking = Booking::factory()->paid()->create();

    actingAs($admin)
        ->postJson("/api/v1/bookings/{$booking->id}/refunds", [
            'amount' => 5000,
            'reason' => 'Customer cancellation within 24 hours',
        ])
        ->assertCreated()
        ->assertJsonStructure(['data' => ['id', 'amount', 'status', 'created_at']]);
});

it('rejects a duplicate refund with 409 Conflict', function () {
    $admin   = User::factory()->financeAdmin()->create();
    $booking = Booking::factory()->refunded()->create();

    actingAs($admin)
        ->postJson("/api/v1/bookings/{$booking->id}/refunds", ['amount' => 5000])
        ->assertConflict();
});</code></pre>
      </div>

      <div class="callout callout-success">
        <div class="callout-title">Summary Checklist</div>
        <p>A maintainable Laravel system keeps controllers thin, moves validation into Form Requests, encapsulates domain logic in Services, shields the DB in Repositories, and shapes API responses through Resources — all verified by a lean suite of Pest feature tests.</p>
      </div>
    `
  },
  {
    id: "laravel-backend-api",
    slug: "laravel-api",
    title: "Building Production‑Grade Laravel APIs: Sanctum Auth, Caching & Deployment",
    category: "Backend Engineering",
    date: "Aug 16, 2026",
    readTime: "10 min read",
    summary: "A practical guide to building production-grade Laravel REST APIs — covering Sanctum token authentication, rate limiting, Redis caching strategies, horizon-powered queue workers, and zero-downtime deployment on Forge/Vapor.",
    tags: ["Laravel", "PHP", "API", "Sanctum", "Redis", "Queues", "Deployment"],
    content: `
      <p class="lead">Laravel has evolved into one of the most productive frameworks for building production-grade REST APIs. In this post we walk through SPA authentication with Sanctum, API rate limiting, Redis caching, queue-backed async processing, and zero-downtime deployment — all in pure PHP without reaching for Node.js or TypeScript.</p>

      <h3>API Authentication with Laravel Sanctum</h3>
      <p>Sanctum provides a lightweight authentication system for SPAs and mobile apps using <strong>opaque API tokens</strong> or <strong>cookie-based sessions</strong>. Unlike Passport (which implements full OAuth2), Sanctum is simple to set up and sufficient for 95% of API use-cases.</p>

      <div class="code-block">
        <div class="code-block-header"><span class="code-lang">PHP / Laravel</span><span class="code-title">Sanctum Token Issuance & Revocation</span></div>
        <pre><code>// routes/api.php
Route::prefix('v1')->group(function () {
    Route::post('/auth/login',  [AuthController::class, 'login']);
    Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

    Route::middleware('auth:sanctum')->group(function () {
        Route::apiResource('bookings', BookingController::class);
        Route::apiResource('bookings.refunds', RefundController::class);
    });
});

// app/Http/Controllers/AuthController.php
class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        if (! Auth::attempt($request->only('email', 'password'))) {
            throw new AuthenticationException('Invalid credentials.');
        }

        $user  = Auth::user();
        $token = $user->createToken(
            name:      $request->header('User-Agent', 'api-client'),
            expiresAt: now()->addDays(30),
        );

        return response()->json([
            'token'      => $token->plainTextToken,
            'expires_at' => $token->accessToken->expires_at,
            'user'       => new UserResource($user),
        ]);
    }

    public function logout(Request $request): Response
    {
        $request->user()->currentAccessToken()->delete();
        return response()->noContent();
    }
}</code></pre>
      </div>

      <h3>API Rate Limiting</h3>
      <p>Laravel's rate limiter (backed by Redis) protects your API from abuse. Define named rate limiters in <code>AppServiceProvider</code> and attach them to route groups:</p>

      <div class="code-block">
        <div class="code-block-header"><span class="code-lang">PHP / Laravel</span><span class="code-title">Named Rate Limiters in AppServiceProvider</span></div>
        <pre><code>use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

// In AppServiceProvider::boot()
RateLimiter::for('api', function (Request $request) {
    return $request->user()
        ? Limit::perMinute(120)->by($request->user()->id)
        : Limit::perMinute(30)->by($request->ip());
});

RateLimiter::for('auth', function (Request $request) {
    return Limit::perMinute(5)
        ->by($request->input('email') . '|' . $request->ip())
        ->response(fn () => response()->json([
            'message' => 'Too many login attempts. Please wait 60 seconds.',
        ], 429));
});

// In routes/api.php
Route::middleware(['throttle:api'])->group(function () {
    Route::apiResource('bookings', BookingController::class);
});</code></pre>
      </div>

      <h3>Caching API Responses with Redis Tags</h3>
      <p>Redis-tagged caches let you invalidate <em>groups</em> of related cache keys with a single call — perfect for entity-scoped caching:</p>

      <div class="code-block">
        <div class="code-block-header"><span class="code-lang">PHP / Laravel</span><span class="code-title">Tagged Cache Invalidation</span></div>
        <pre><code>// Storing with tags
Cache::tags(["user:{$userId}", 'bookings'])
    ->remember("user:{$userId}:bookings:upcoming", 600, function () use ($userId) {
        return Booking::whereUserId($userId)
            ->upcoming()
            ->with(['destination', 'package'])
            ->get();
    });

// Invalidate all booking caches for this user on update
public function updated(Booking $booking): void
{
    Cache::tags(["user:{$booking->user_id}", 'bookings'])->flush();
}</code></pre>
      </div>

      <h3>Zero-Downtime Deployment with Laravel Forge & Octane</h3>
      <p><strong>Laravel Octane</strong> keeps the application boot in memory across requests, reducing P99 response times from ~120ms to ~8ms. Combined with Forge's atomic deployment pipeline, you get sub-second blue-green deployments:</p>

      <div class="code-block">
        <div class="code-block-header"><span class="code-lang">Bash</span><span class="code-title">Forge Deploy Script — Zero-Downtime</span></div>
        <pre><code>cd /home/forge/app.example.com

git pull origin $FORGE_SITE_BRANCH
composer install --no-dev --optimize-autoloader
php artisan migrate --force

# Rebuild caches atomically
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Reload workers gracefully
php artisan octane:reload
php artisan horizon:terminate && php artisan horizon &</code></pre>
      </div>

      <div class="callout callout-info">
        <div class="callout-title">💡 Why Octane?</div>
        <p>Standard PHP-FPM boots the entire Laravel framework on every request. Octane boots it once and keeps it resident in memory, delivering a 15x improvement in P99 latency with zero application code changes.</p>
      </div>

      <div class="callout callout-success">
        <div class="callout-title">Production-Readiness Checklist</div>
        <p>A production-grade Laravel API uses Sanctum for stateless token auth, Redis-backed rate limiting, tagged cache invalidation, Horizon-supervised queue workers, and Octane-powered zero-downtime deployments — no Node.js required.</p>
      </div>
    `
  },
  {
    id: "call-summary-agent-mcp",
    slug: "call-summary-agent",
    title: "Nobody Logs Calls Anymore: Building a Call Summary Agent with the OpenAI API and MCP",
    category: "AI Engineering",
    date: "Nov 12, 2026",
    readTime: "5 min read",
    summary: "How I replaced manual post-call logging for CX and Sales with an agent that summarises every call and moves the CRM pipeline on its own, and why the business decision still lives in plain code.",
    tags: ["AI Agents", "MCP", "OpenAI API", "Laravel", "Queues"],
    content: `
      <p class="lead">Every CX and Sales call at PickYourTrail used to end the same way: someone typing notes into the CRM and dragging the lead to the next stage by hand. It was slow, it was inconsistent, and it took time away from the next customer. So I built an agent that does both jobs the moment a call ends.</p>

      <h3>The Problem Was Never the Summary</h3>
      <p>Summarising a call is the part everyone thinks about first, and it is the easiest part for a language model. The real cost was everything around it. Notes were written differently by every person, some calls were never logged at all, and CRM stages moved whenever someone remembered to move them. Reports built on that data were only as good as the discipline of the busiest person on the team.</p>
      <p>So the goal was not "generate a nice summary". It was: <strong>after every call, the CRM should be correct without anyone touching it.</strong></p>

      <h3>The Pipeline: Five Small Steps</h3>
      <p>The whole flow is deliberately boring:</p>
      <ol>
        <li><strong>Call ends.</strong> The telephony provider sends a webhook.</li>
        <li><strong>Queued job.</strong> The webhook only records the event and dispatches a job, so the request returns immediately.</li>
        <li><strong>LLM summary.</strong> The job sends the transcript to the model and asks for a structured result, not free text.</li>
        <li><strong>Stage rules.</strong> Plain code decides whether the lead should move, using the structured result.</li>
        <li><strong>CRM updated.</strong> The note and the stage change are written through MCP tools, and every step is logged.</li>
      </ol>

      <div class="code-block">
        <div class="code-block-header"><span class="code-lang">PHP / Laravel</span><span class="code-title">Simplified: the webhook only queues work</span></div>
        <pre><code>// Route::post('/webhooks/call-ended', CallEndedController::class);
public function __invoke(Request $request)
{
    $call = CallLog::firstOrCreate(
        ['provider_call_id' => $request->input('call_id')], // retries don't create duplicates
        ['payload' => $request->all()]
    );

    SummariseCall::dispatch($call)->onQueue('agents');

    return response()->noContent();
}</code></pre>
      </div>

      <p>Keeping the webhook thin matters. Model calls are slow and occasionally fail; a queue gives you retries, backoff and visibility for free, and the provider never times out waiting on an LLM.</p>

      <h3>Let the Model Read, Let Code Decide</h3>
      <p>This is the rule I keep coming back to on every agent I build. A language model is excellent at reading messy input: a half-transcribed call with two people talking over each other. It is a poor place to put a business rule that someone will need to audit later.</p>
      <p>So the model's only job is to turn the transcript into fields: a short summary, the customer's intent, the agreed next step. Whether that means the lead moves from "Contacted" to "Quote sent" is decided by ordinary PHP that anyone on the team can read and test.</p>

      <div class="code-block">
        <div class="code-block-header"><span class="code-lang">PHP</span><span class="code-title">Simplified: the stage decision is plain, testable code</span></div>
        <pre><code>public function nextStage(Lead $lead, CallInsight $insight): ?Stage
{
    if (! $insight->isValid()) {
        return null; // bad model output never moves a lead
    }

    return match (true) {
        $insight->intent === 'not_interested'  => Stage::Closed,
        $insight->nextStep === 'send_quote'    => Stage::QuoteSent,
        $lead->stage === Stage::New            => Stage::Contacted,
        default                                => null,
    };
}</code></pre>
      </div>

      <div class="callout callout-info">
        <div class="callout-title">Why this split matters</div>
        <p>When someone asks "why did this lead move?", the answer is a rule in code plus the logged model output that fed it. Nobody has to argue with a prompt.</p>
      </div>

      <h3>MCP as the Boundary to the CRM</h3>
      <p>The agent does not call the CRM directly. It works through tools exposed over the Model Context Protocol: read the lead, add a note, change a stage. Each tool validates its input and does exactly one thing.</p>
      <p>That boundary paid off quickly. The same tools are reused by other agents, permissions live in one place, and when a tool misbehaves the logs show exactly which call, which input and which output caused it.</p>

      <h3>What I Would Tell Anyone Building One</h3>
      <ul>
        <li><strong>Queue everything.</strong> Webhooks record, jobs think.</li>
        <li><strong>Ask for structure.</strong> Validate the model's output before anything acts on it, and treat invalid output as "do nothing".</li>
        <li><strong>Keep decisions in code.</strong> The model reads, the code decides, and both are logged.</li>
        <li><strong>Make tools small.</strong> One tool, one action, its own validation.</li>
      </ul>

      <div class="callout callout-success">
        <div class="callout-title">The outcome</div>
        <p>Calls are summarised without manual logging, CRM pipeline transitions happen on their own, and CX and Sales spend that time with customers instead of forms.</p>
      </div>
    `
  },
  {
    id: "function-calling-to-mcp",
    slug: "function-calling-to-mcp",
    title: "From Function Calling to MCP: Moving a Live AI Assistant Without Customers Noticing",
    category: "AI Engineering",
    date: "Oct 22, 2026",
    readTime: "4 min read",
    summary: "What changed when I moved Trippie's agent tool calls from function calling to the Model Context Protocol, and why a sandbox for operators mattered as much as the migration itself.",
    tags: ["MCP", "AI Agents", "Function Calling", "Testing", "Laravel"],
    content: `
      <p class="lead">Trippie is PickYourTrail's AI assistant for travellers before their trip, by voice and by chat. As it grew, the way its tools were wired started to hold it back, and there was nowhere safe to try changes before customers saw them. Fixing both took two launches, and both shipped in under a week.</p>

      <h3>Where Function Calling Started to Hurt</h3>
      <p>Function calling is a great way to start. You describe a few functions, the model picks one, your code runs it. The trouble starts when the list grows and more than one surface uses it.</p>
      <ul>
        <li>Tool definitions lived next to each agent, so the same capability was described more than once and drifted.</li>
        <li>Context did not travel well between tools, so the agent kept re-asking for things it already knew.</li>
        <li>When a tool call failed, the escalation to a person did not always happen cleanly.</li>
      </ul>
      <p>None of these is dramatic on its own. Together they made every change slower and riskier than it should have been.</p>

      <h3>What MCP Changed</h3>
      <p>The Model Context Protocol moves tools out of the agent and behind a server. Each tool is defined once, with its own input schema and validation, and any agent that speaks MCP can use it.</p>
      <p>For Trippie that meant three practical things:</p>
      <ol>
        <li><strong>One definition per tool.</strong> Voice and chat use the same tools, so a fix lands everywhere at once.</li>
        <li><strong>Shared context.</strong> Tools can work from the same trip context instead of each one rebuilding it.</li>
        <li><strong>A clear failure path.</strong> A tool that cannot complete says so in a structured way, and the agent hands off to a person instead of guessing.</li>
      </ol>

      <div class="callout callout-info">
        <div class="callout-title">The mental model</div>
        <p>Function calling makes tools part of the prompt. MCP makes them part of your backend. Once tools are backend code, you get to treat them like backend code: versioned, validated, logged and tested.</p>
      </div>

      <h3>The Test Arena: A Sandbox for the People Who Know the Edge Cases</h3>
      <p>The second launch mattered as much as the first. Trip Custodians, the team who look after travellers, know exactly which questions break an assistant. Until then they had no way to try those questions without a real customer on the other end.</p>
      <p>So I built a sandboxed test environment where internal operators can talk to the agent, try the awkward cases, and see what it would do before a change reaches customers. Changes are validated there first, and only then rolled out.</p>

      <h3>Moving Live Wiring Without Disruption</h3>
      <p>The hardest part was not writing MCP tools. It was moving an assistant that customers were already using without them noticing. What made it safe was simple:</p>
      <ul>
        <li><strong>Same behaviour first.</strong> Each tool was moved to match what it already did before anything was improved.</li>
        <li><strong>Test before rollout.</strong> Every change went through the sandbox with the people who know the edge cases.</li>
        <li><strong>Watch the escalations.</strong> Failed handoffs were the signal that mattered most, so that is what I watched after each change.</li>
      </ul>

      <div class="callout callout-success">
        <div class="callout-title">The outcome</div>
        <p>Two launches shipped in under a week: the Test Arena for Trip Custodians and the move from function calling to MCP. Escalation failures dropped and responses got faster, and customers felt the difference within hours.</p>
      </div>
    `
  },
  {
    id: "voice-agents-follow-ups",
    slug: "voice-agents",
    title: "Voice Agents for Follow-Ups and Lead Qualification: The Backend Is the Real Work",
    category: "AI Engineering",
    date: "Sep 30, 2026",
    readTime: "4 min read",
    summary: "The call is the easy part. Notes on the backend behind AI voice agents that run customer follow-ups, lead qualification and trip help: triggers, orchestration, tool calls and knowing when to hand off.",
    tags: ["Voice Agents", "LLM Orchestration", "Webhooks", "Laravel", "AI Agents"],
    content: `
      <p class="lead">Follow-ups, lead qualification and trip assistance were all handled by people making calls. Voice agents now run those touchpoints end to end. The voice itself is the part people notice, but almost all of the engineering lives in the backend around it.</p>

      <h3>Every Call Starts as an Event</h3>
      <p>A voice agent never decides on its own to call someone. Something in the system says it is time: a scheduled job finds leads that are due a follow-up, or a webhook reports that something happened to a booking. Treating every call as the result of an event keeps the whole thing predictable.</p>
      <p>The flow is the same for every use case:</p>
      <ol>
        <li><strong>Trigger:</strong> a cron job or a webhook decides a call is needed.</li>
        <li><strong>Voice agent call:</strong> the call is placed with the context it needs.</li>
        <li><strong>LLM orchestration:</strong> the conversation is steered towards one clear goal.</li>
        <li><strong>Tool calls:</strong> the agent reads or updates real data during the call.</li>
        <li><strong>Outcome logged:</strong> the result is written back, and the next step is scheduled.</li>
      </ol>

      <div class="code-block">
        <div class="code-block-header"><span class="code-lang">PHP / Laravel</span><span class="code-title">Simplified: triggers queue calls, they never place them inline</span></div>
        <pre><code>// routes/console.php
Schedule::job(new QueueDueFollowUps)->everyFifteenMinutes();

// QueueDueFollowUps::handle()
Lead::dueForFollowUp()
    ->whereDoesntHave('openVoiceTask')   // never call the same person twice at once
    ->each(fn (Lead $lead) => PlaceFollowUpCall::dispatch($lead));</code></pre>
      </div>

      <h3>Webhooks Arrive Twice, Out of Order, or Not at All</h3>
      <p>Voice platforms talk back through webhooks: call started, call answered, call ended, transcript ready. In production those arrive late, arrive twice, and occasionally arrive in the wrong order. The backend has to be fine with all three.</p>
      <ul>
        <li><strong>Idempotent handlers.</strong> Every event is keyed by the provider's ID, so a repeat does nothing.</li>
        <li><strong>State, not assumptions.</strong> Each call moves through explicit states, and an event that does not fit the current state is logged instead of applied.</li>
        <li><strong>Timeouts.</strong> If "call ended" never arrives, a scheduled check closes the call and schedules a retry.</li>
      </ul>

      <h3>One Goal per Call</h3>
      <p>The orchestration layer keeps each call focused. A follow-up call has one job; a qualification call has another. The agent gets the context for that job and the tools for that job, nothing more. Smaller scopes make the agent easier to test and its mistakes easier to spot.</p>

      <div class="callout callout-info">
        <div class="callout-title">Same rule as every other agent</div>
        <p>The model handles the conversation. Whether a lead counts as qualified is decided by code, from the structured result of the call, so the rule can be read, tested and changed without touching a prompt.</p>
      </div>

      <h3>Knowing When to Hand Off</h3>
      <p>A voice agent that never gives up is worse than no agent. When the customer asks for a person, when the agent is unsure, or when a tool cannot complete, the call is handed to a human with the context already written down. The person picks up where the agent stopped, not from the beginning.</p>

      <h3>What Changed</h3>
      <div class="callout callout-success">
        <div class="callout-title">The outcome</div>
        <p>Follow-ups and lead qualification run automatically, trip assistance is available without a person on every call, and agents hand off to people when they should.</p>
      </div>
    `
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BLOG_POSTS };
}
