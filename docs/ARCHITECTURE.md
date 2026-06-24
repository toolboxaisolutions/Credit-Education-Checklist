# Technical Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  Next.js App (React) + Tailwind + Framer Motion            │
│  - Journey Map (left panel)                                │
│  - Task Detail (right panel)                               │
│  - Credit Score Dashboard                                  │
│  - User Profile & Settings                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ REST/GraphQL API
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                       Backend API                           │
│  Next.js API Routes (or separate Express server)           │
│  - Auth & session management                               │
│  - Task/progress tracking                                  │
│  - Credit data management                                   │
│  - Payment processing                                       │
│  - Email/SMS triggers                                       │
└────────┬────────────┬────────────┬──────────┬──────────────┘
         │            │            │          │
         ▼            ▼            ▼          ▼
    ┌────────┐  ┌──────────┐  ┌────────┐  ┌──────────┐
    │  Auth  │  │ Database │  │Payment │  │  Email   │
    │ Service│  │  (Postgres)│  │(Stripe)│  │(SendGrid)│
    └────────┘  └──────────┘  └────────┘  └──────────┘
         │            │            │          │
         │            │            │          │
         ▼            ▼            ▼          ▼
    ┌────────┐  ┌──────────┐  ┌────────┐  ┌──────────┐
    │Supabase│  │  Credit  │  │  Credit│  │   SMS    │
    │  Auth  │  │  Bureau  │  │ Monitor│  │ (Twilio) │
    │        │  │   APIs   │  │Services│  │          │
    └────────┘  └──────────┘  └────────┘  └──────────┘
```

## Technology Stack

### Frontend
**Framework:** Next.js 14+ (App Router)
- Why: Fast, SEO-friendly, great DX, Vercel hosting
- Alternative: SvelteKit (lighter, faster) but smaller ecosystem

**Styling:** Tailwind CSS + Headless UI
- Why: Rapid development, responsive by default, beautiful defaults
- Alternative: Styled Components (more flexible but slower)

**State Management:** Zustand
- Why: Simple, lightweight, no boilerplate
- Alternative: Redux (more robust but overkill for this)

**Animations:** Framer Motion
- Why: Smooth node transitions, gesture support
- Alternative: React Spring (good but less popular)

**Charts:** Recharts or Chart.js
- For: Credit score visualization over time

### Backend
**Framework:** Next.js API Routes
- Why: Same codebase, serverless, easy deployment
- Alternative: Express/Fastify on Railway/Fly.io

**Database:** Supabase (PostgreSQL)
- Why: Auth + DB + Storage + Realtime in one
- Alternative: PlanetScale (MySQL) or Neon (Postgres)

**ORM:** Prisma
- Why: Type-safe, easy migrations, great DX
- Alternative: Drizzle (lighter) or raw SQL

### Authentication
**Service:** Supabase Auth or NextAuth.js
- Email/password
- Google OAuth
- Apple OAuth (iOS requirement)
- Magic links (optional)

### Payments
**Provider:** Stripe
- Subscriptions (recurring billing)
- One-time payments (if needed)
- Customer portal (autopay, cancel, update card)
- Webhooks for payment events

**Implementation:**
```javascript
// Stripe subscription flow
1. User signs up → Create Stripe customer
2. Create subscription → Redirect to Checkout
3. Webhook: payment_intent.succeeded → Activate user
4. Webhook: customer.subscription.deleted → Downgrade user
5. Customer Portal → User manages subscription
```

### Email
**Provider:** SendGrid or Postmark
- Transactional emails (welcome, receipts, reminders)
- Marketing emails (progress updates, promotions)

**Automation:**
- User signs up → Welcome email (Day 0)
- Task completed → Progress email (Day 2, 7, etc.)
- Subscription renewal → Receipt email
- Churn risk → Win-back email sequence

### SMS (Optional)
**Provider:** Twilio
- Task reminders
- Score alerts
- Marketing messages (with consent)

### Credit Report Integration
**Option 1: Manual Entry (MVP)**
- User pulls report from AnnualCreditReport.com
- User manually enters score
- System stores and visualizes over time

**Option 2: Credit Bureau APIs (Pro)**
- Direct integration with Experian, Equifax, TransUnion
- Requires business agreements, compliance, $$$
- Monthly automated pulls with user consent

**Option 3: Third-Party Aggregators (Recommended)**
- **Credit Karma API** (if available)
- **Plaid** (bank connections, transaction data)
- **Finicity** (Mastercard's credit data service)
- **Identity.com** (credit monitoring API)
- **Credit Safe** (UK/EU focused)

**Recommended for MVP + Pro:**
Start with manual entry (free tier) → Add Identity.com or similar API later

### Infrastructure
**Hosting:** Vercel
- Why: Next.js optimized, edge functions, easy deploys
- Alternative: Railway, Fly.io, Render

**Database:** Supabase
- Why: All-in-one (Postgres + Auth + Storage + Realtime)
- Alternative: Neon (Postgres) + separate auth

**File Storage:** Supabase Storage
- For: User uploads, static assets
- Alternative: AWS S3, Cloudflare R2

**CDN:** Built-in (Vercel edge network)

**Monitoring:**
- Sentry (error tracking)
- Vercel Analytics (performance)
- PostHog (product analytics, self-hosted)

## Database Schema

### Core Tables

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  stripe_customer_id VARCHAR(255),
  subscription_status VARCHAR(50), -- 'free', 'essential', 'pro', 'vip'
  onboarding_complete BOOLEAN DEFAULT FALSE
);

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase INTEGER NOT NULL, -- 1-5
  order_index INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content JSONB, -- Rich text, links, resources
  dependencies UUID[], -- Task IDs that must be complete
  parallel BOOLEAN DEFAULT FALSE, -- Can run simultaneously
  estimated_time INTEGER, -- Minutes
  gated BOOLEAN DEFAULT FALSE -- Blocks subsequent tasks
);

-- User Progress
CREATE TABLE user_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id),
  status VARCHAR(50) DEFAULT 'locked', -- 'locked', 'available', 'in_progress', 'complete'
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  notes TEXT, -- User notes
  metadata JSONB, -- Custom data per task
  UNIQUE(user_id, task_id)
);

-- Credit Scores
CREATE TABLE credit_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  bureau VARCHAR(50), -- 'experian', 'equifax', 'transunion'
  score INTEGER,
  factors JSONB, -- {payment_history: 75, utilization: 60, ...}
  source VARCHAR(50), -- 'manual', 'api', 'credit_karma'
  recorded_at TIMESTAMP DEFAULT NOW()
);

-- Credit Report History
CREATE TABLE credit_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  raw_report JSONB, -- Full report data
  summary JSONB, -- Key metrics, issues
  pulled_at TIMESTAMP DEFAULT NOW()
);

-- Credit Card Recommendations
CREATE TABLE credit_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  issuer VARCHAR(255),
  min_credit_score INTEGER,
  annual_fee DECIMAL(10,2),
  apr DECIMAL(5,2),
  rewards_category VARCHAR(100), -- 'travel', 'cashback', 'dining', 'gas'
  rewards_rate DECIMAL(5,2), -- Cashback % or points multiplier
  secured BOOLEAN DEFAULT FALSE,
  application_url VARCHAR(500),
  affiliate_link VARCHAR(500)
);

-- User Card Preferences
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  lifestyle_category VARCHAR(50), -- 'travel', 'dining', 'entertainment', 'cashback', 'gas'
  international_travel BOOLEAN DEFAULT FALSE,
  credit_score_range VARCHAR(50), -- '300-579', '580-669', '670-739', '740+'
  preferred_rewards VARCHAR(50) -- 'points', 'cashback', 'miles'
);

-- Email Log
CREATE TABLE email_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  template VARCHAR(100),
  sent_at TIMESTAMP DEFAULT NOW(),
  opened BOOLEAN DEFAULT FALSE,
  clicked BOOLEAN DEFAULT FALSE
);
```

## API Endpoints

### Authentication
```
POST /api/auth/signup - Create account
POST /api/auth/login - Login
POST /api/auth/logout - Logout
POST /api/auth/reset-password - Password reset
```

### User
```
GET /api/user/profile - Get user profile
PATCH /api/user/profile - Update profile
GET /api/user/progress - Get overall progress
GET /api/user/preferences - Get credit card preferences
PATCH /api/user/preferences - Update preferences
```

### Tasks
```
GET /api/tasks - Get all tasks (with status for current user)
GET /api/tasks/:id - Get single task details
POST /api/tasks/:id/start - Mark task as in_progress
POST /api/tasks/:id/complete - Mark task as complete
GET /api/tasks/available - Get tasks user can do now
```

### Credit
```
GET /api/credit/scores - Get score history
POST /api/credit/scores - Add manual score entry
GET /api/credit/reports - Get saved reports
POST /api/credit/reports/pull - Pull new report (Pro tier)
GET /api/credit/analysis - Get credit analysis
```

### Credit Cards
```
GET /api/cards/recommendations - Get personalized recs
GET /api/cards - Get all cards
POST /api/cards/apply - Track card application (affiliate)
```

### Payments
```
POST /api/checkout/create-session - Create Stripe checkout
POST /api/webhooks/stripe - Stripe webhook handler
GET /api/billing/subscription - Get subscription status
POST /api/billing/cancel - Cancel subscription
```

## Security Architecture

### Data Protection
- **Encryption at rest:** All sensitive data encrypted (AES-256)
- **Encryption in transit:** HTTPS/TLS everywhere
- **PCI compliance:** Stripe handles all payment data
- **PII protection:** Minimize collection, encrypt what we store

### Authentication & Authorization
- JWT tokens (short-lived, refresh tokens)
- Row-level security (Supabase RLS)
- API rate limiting
- Brute force protection

### Compliance
- **GDPR:** Right to access, delete, export data
- **CCPA:** California privacy compliance
- **FCRA:** Fair credit reporting (if pulling reports)
- **SOC 2:** Eventually (for enterprise customers)

### Best Practices
- Input validation (Zod or similar)
- SQL injection prevention (parameterized queries)
- XSS prevention (React handles most)
- CSRF protection
- Security headers (CSP, HSTS, etc.)

## Deployment Pipeline

```
Local Development
  ↓
Git Push (main branch)
  ↓
GitHub Actions / Vercel Auto-deploy
  ↓
Build & Test
  ↓
Deploy to Preview (staging)
  ↓
Manual QA (optional)
  ↓
Deploy to Production
```

## Scalability Considerations

### Database
- **Read replicas** for heavy queries
- **Connection pooling** (Supabase handles this)
- **Indexing** on frequently queried fields
- **Partitioning** for large tables (credit_scores, email_log)

### API
- **Caching** (Redis/Vercel Edge) for static data
- **Rate limiting** per user/IP
- **Pagination** for large result sets
- **Background jobs** for email, credit pulls

### Frontend
- **Code splitting** (Next.js automatic)
- **Image optimization** (Next.js Image component)
- **CDN** for static assets
- **Service worker** for offline support (PWA)

### Infrastructure
- **Auto-scaling** (Vercel serverless)
- **Edge functions** for low-latency
- **Multi-region** (if international)

## Cost Estimates (Monthly)

### MVP Stage (< 1000 users)
- Vercel Pro: $20
- Supabase Pro: $25
- SendGrid: $15 (up to 50k emails)
- Stripe: 2.9% + $0.30 per transaction
- Sentry: Free tier
- **Total: ~$60/mo**

### Growth Stage (1000-10k users)
- Vercel Pro: $20
- Supabase Pro: $25
- SendGrid: $80 (up to 500k emails)
- Twilio: $50-100 (SMS)
- Credit API: $200-500 (if automated pulls)
- **Total: ~$500-800/mo**

### Scale Stage (10k+ users)
- Vercel Enterprise: $250+
- Supabase Scale: $599
- SendGrid Pro: $400+
- Twilio: $500+
- Credit APIs: $2000+
- **Total: ~$4000+/mo**

## Third-Party Services Summary

| Service | Purpose | Cost (MVP) | Cost (Scale) |
|---------|---------|------------|--------------|
| Vercel | Hosting | $20/mo | $250+/mo |
| Supabase | DB + Auth | $25/mo | $599/mo |
| Stripe | Payments | 2.9% | 2.9% |
| SendGrid | Email | $15/mo | $400+/mo |
| Twilio | SMS | - | $500+/mo |
| Sentry | Error tracking | Free | $100+/mo |
| PostHog | Analytics | Free | $100+/mo |
| Credit API | Reports | - | $2000+/mo |

## Build Order

### Phase 1: Foundation (Week 1-2)
1. [ ] Set up Next.js project
2. [ ] Configure Supabase (DB + Auth)
3. [ ] Create database schema
4. [ ] Set up Stripe integration
5. [ ] Basic auth flow (signup/login)

### Phase 2: Core Features (Week 3-4)
6. [ ] Build task data model
7. [ ] Create journey map UI component
8. [ ] Build task detail panel
9. [ ] Implement gating logic
10. [ ] Add progress tracking

### Phase 3: Polish (Week 5-6)
11. [ ] Email sequences (SendGrid)
12. [ ] Credit card decision tree
13. [ ] User preferences
14. [ ] Mobile responsive design
15. [ ] Customer portal (Stripe)

### Phase 4: Launch Prep (Week 7-8)
16. [ ] Marketing site
17. [ ] Landing page optimization
18. [ ] Analytics setup
19. [ ] Bug fixes & testing
20. [ ] Deploy to production

### Phase 5: Iteration (Ongoing)
21. [ ] Credit report integration
22. [ ] Score tracking dashboard
23. [ ] A/B testing
24. [ ] Performance optimization
25. [ ] Feature expansion

## Developer Notes

### Local Development Setup
```bash
# Clone repo
git clone https://github.com/yourusername/credit-comeback.git
cd credit-comeback

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your keys

# Set up Supabase
npx supabase start

# Run migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Environment Variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# SendGrid
SENDGRID_API_KEY=

# Twilio (optional)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Credit API (pro tier)
CREDIT_API_KEY=
CREDIT_API_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Testing
```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

### Deployment
```bash
# Deploy to Vercel
vercel deploy

# Deploy to production
vercel deploy --prod
```
