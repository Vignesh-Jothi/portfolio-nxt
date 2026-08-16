/* ============================================================
   BLOG POSTS DATA — Reusable data structure for backend
   and software engineering articles (Laravel / PHP stack).
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
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BLOG_POSTS };
}
