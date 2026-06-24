# Product Requirements Document

## Product Vision

**Credit Comeback** is an interactive, guided system that takes people with poor credit (300-629 FICO) from "I don't know what to do" to "my credit is fixed" through a structured, gamified journey.

## Problem Statement

- 45M+ Americans have poor or fair credit
- Most credit repair advice is vague: "pay bills on time, reduce debt"
- People don't know the exact sequence of actions to take
- They get overwhelmed and give up
- No single tool shows the complete path from start to finish

## Solution

A step-by-step interactive checklist that:
1. Shows the entire journey visually (node-based map)
2. Guides users through each task with explicit instructions
3. Gates dependent steps until prerequisites are complete
4. Tracks progress visually and psychologically
5. Provides personalized credit card recommendations
6. (Optional) Pulls credit reports and shows score trajectory

## Target Users

- **Primary:** Adults 25-45 with credit scores 300-629
- **Secondary:** Recent immigrants building credit from scratch
- **Tertiary:** Young adults (18-24) with thin credit files

## User Personas

### Persona 1: "Restart Rachel" (32, divorced, credit score 580)
- Went through divorce, ex ran up debt in her name
- Now rebuilding alone, doesn't know where to start
- Works full-time, has income, but doesn't understand credit
- Needs: Clear steps, no jargon, emotional support

### Persona 2: "Young Jake" (24, score 610)
- Had credit card issues in college
- Now employed, wants to buy a car/house
- Doesn't understand utilization, dispute process
- Needs: Quick wins, clear explanations, card recommendations

### Persona 3: "Immigrant Maria" (38, no credit history)
- Moved to US 5 years ago, has ITIN
- Has cash but no credit history
- Confused by US credit system
- Needs: Foundational education, secured card path, clear steps

## Core Features

### 1. Visual Journey Map
- **Left third of screen:** Node-based visualization
- **Nodes represent:** Individual tasks/steps
- **Colors:**
  - Locked (gray): Can't do yet (dependencies not met)
  - Available (blue/teal): Ready to do
  - In Progress (yellow): Started but not complete
  - Complete (green): Done ✓
- **Parallel tracks:** Some branches can run simultaneously
- **Critical gates:** Certain nodes block all subsequent progress

### 2. Task Detail Panel
- **Right two-thirds:** Current task details
- **Content:**
  - What to do (plain English)
  - Why it matters (brief)
  - How long it takes
  - Links to resources/tools
  - Checkboxes for sub-steps
  - "Mark Complete" button (unlocks next nodes)
  - "Need Help?" link to FAQ/support

### 3. Checklist Phases (The Journey)

#### Phase 1: Foundation (Week 1-2)
1. **Pull Your Free Credit Reports**
   - Links to AnnualCreditReport.com (free)
   - Instructions for reading the report
   - Highlight key sections to examine
   - *Gate:* Must complete before disputes

2. **Understand Your Credit Score**
   - What FICO vs VantageScore means
   - The 5 factors (payment history, utilization, age, mix, inquiries)
   - Where they stand now
   - *No gate* — can run parallel with report review

3. **Set Up a Budget**
   - Template provided (Google Sheets/Excel)
   - Calculate disposable income
   - Determine realistic payment amounts

4. **Open a High-Yield Savings Account**
   - Why: Emergency fund prevents new debt
   - Recommendations: Ally, Marcus, Discover (0% intro)
   - Link to apply (affiliate potential)

#### Phase 2: Clean Up (Week 2-6)
5. **Dispute Inaccuracies**
   - Step-by-step dispute letter templates
   - Links to Experian/Equifax/TransUnion dispute portals
   - How to track disputes
   - *Gate:* Must complete Phase 1 first

6. **Negotiate with Collections**
   - Scripts for calling collection agencies
   - "Pay-for-delete" strategy
   - When to settle vs. pay in full
   - Documentation requirements

7. **Set Up Autopay for All Existing Accounts**
   - Prevent new late payments
   - Calendar reminders as backup
   - Bank bill pay setup

#### Phase 3: Build (Month 2-6)
8. **Apply for a Secured Credit Card**
   - Lifestyle quiz: travel, cashback, general
   - Recommendations: Discover it Secured, Capital One Platinum
   - How to use it (30% utilization rule)
   - *Gate:* Must have 1 month of on-time payments

9. **Become an Authorized User**
   - Script for asking family/friends
   - What to look for in a primary account holder
   - Risks and benefits

10. **Get a Credit-Builder Loan**
    - Links to credit unions with programs
    - Self, Atomic, Kikoff recommendations
    - How it works

#### Phase 4: Optimize (Month 6-12)
11. **Request Credit Limit Increases**
    - When to ask (6+ months on-time)
    - Script for calling
    - Soft pull vs. hard pull considerations

12. **Diversify Credit Mix**
    - Installment vs. revolving
    - Personal loan considerations
    - Timing and strategy

13. **Apply for Better Credit Cards**
    - Lifestyle quiz (detailed)
    - Recommendations based on score improvement
    - Balance transfer strategies
    - *Gate:* Score must be 640+

#### Phase 5: Maintain (Ongoing)
14. **Set Up Credit Monitoring**
    - Free options (Credit Karma, Credit Sesame)
    - Paid options with identity theft protection
    - Alert preferences

15. **Annual Review Checklist**
    - Pull reports again
    - Check for new errors
    - Reassess goals

### 4. Credit Card Decision Tree

**Lifestyle Quiz:**
1. What's your primary goal?
   - Build credit (any card works)
   - Earn rewards (continue)
   - Big purchase financing (continue)

2. What do you spend most on?
   - Gas → Gas-specific cards
   - Groceries → Grocery cashback
   - Dining/entertainment → Dining rewards
   - Travel → Travel points cards
   - Everything → Flat cashback

3. Do you travel internationally?
   - Yes → No foreign transaction fee cards
   - No → Domestic cards OK

4. Credit score range?
   - 300-579 → Secured cards
   - 580-669 → Fair credit cards
   - 670-739 → Good credit cards
   - 740+ → Premium cards

**Output:** 2-3 card recommendations with:
- Annual fee
- APR
– Rewards structure
- Why it's recommended
- Apply link (affiliate)

### 5. Credit Report Integration (Pro Tier)

**Feature: Score Tracking Dashboard**
- Monthly credit report pull (with user authorization)
- Visual graph showing score over time
- Factor breakdown (utilization, payment history, etc.)
- "What moved your score" explanations
- Alerts for significant changes

**Technical Implementation:**
- Integrate with credit bureau APIs (Experian, Equifax, TransUnion)
- OR use third-party aggregators (Credit Karma API, Identity.com)
- Store data securely (encryption at rest)
- User consent and authorization flows
- FCRA compliance documentation

**Upsell Strategy:**
- Free tier: Manual score entry (user types in score from Credit Karma)
- Pro tier: Automated monthly pulls
- Show "You could be saving $X/month with better credit" calculator

### 6. Email/SMS Sequences

**Day 0: Welcome**
- "You did it. You took the first step."
- Overview of what's coming
- First task: Pull your credit reports

**Day 2: Check-in**
- "How's it going?"
- Reminder if task not complete
- Encouragement

**Week 1: Progress**
- "You've completed X tasks!"
- What's coming next
- Social proof: "Join 10,000+ people rebuilding their credit"

**Month 1: Milestone**
- Score check-in
- What they've accomplished
- What to focus on next

**Month 3: Review**
- Progress report
- Card recommendations (if ready)
- Upgrade prompt (if on free/essential)

## Technical Requirements

### Frontend
- **Framework:** React + Next.js (or Svelte, Vue)
- **State Management:** Redux or Zustand
- **UI Components:** Tailwind CSS + Headless UI
- **Animations:** Framer Motion (for node transitions)
- **Mobile:** Responsive design, mobile-first

### Backend
- **Framework:** Node.js + Express or Next.js API routes
- **Database:** PostgreSQL (or Supabase for quick start)
- **Auth:** NextAuth.js or Supabase Auth
- **Payments:** Stripe (subscriptions, autopay, cancellation)
- **Email:** SendGrid or Postmark
- **SMS:** Twilio (optional)

### Credit Report Integration
- **Option 1:** Credit bureau direct APIs (expensive, complex)
- **Option 2:** Third-party aggregators
  - Credit Karma API (free, limited)
  - Plaid (bank connections)
  - Finicity (Mastercard)
  - Identity.com
- **Option 3:** Manual entry (MVP)
  - User pulls report manually
  - Enters score
  - System tracks over time

### Infrastructure
- **Hosting:** Vercel (Next.js) or Railway
- **Database:** Supabase (Postgres + Auth + Storage)
- **File Storage:** Supabase Storage or S3
- **CDN:** Built-in (Vercel/Netlify)
- **Monitoring:** Sentry
- **Analytics:** PostHog (self-hosted) or Plausible

### Security
- SOC 2 compliance (eventually)
- Encryption at rest (AES-256)
- HTTPS everywhere
- 2FA option
- GDPR/CCPA compliance
- FCRA compliance for credit data

## Monetization

### Revenue Streams
1. **Subscriptions** ($22-59/mo)
2. **Affiliate commissions**
   - Credit card applications ($50-150 per approval)
   - Credit builder loans ($20-50)
   - Savings accounts ($10-30)
   - Credit monitoring services
3. **Credit report upsells** (Pro tier)
4. **One-time products** (credit repair ebooks, courses)

### Unit Economics (Target)
- CAC (Customer Acquisition Cost): $50-80
- LTV (Lifetime Value): $264-708 (12-36 months at $22/mo)
- LTV:CAC Ratio: 5:1 to 9:1
- Monthly churn: <5% (target 3%)

## Success Metrics

### North Star Metric
**Users who complete the full checklist** (or reach 640+ score)

### Supporting Metrics
- Activation rate (complete first 3 tasks)
- Weekly active users
- Task completion rate
- Time to complete each phase
- Credit score improvement (average)
- Net Promoter Score (NPS)
- Monthly recurring revenue (MRR)
- Churn rate
- Affiliate conversion rate

## Competitive Landscape

### Direct Competitors
- Credit Karma (free, but not guided)
- Credit Sesame (similar, less interactive)
- myFICO (expensive, not user-friendly)
- Lexington Law (expensive service, not DIY)

### Indirect Competitors
- DIY blog posts and YouTube videos
- Credit repair services ($100-200/mo)
- Financial advisors

### Differentiation
- **Guided, not just informational**
- **Visual and interactive, not just text**
- **Gamified progress, not vague advice**
- **Personalized recommendations, not one-size-fits-all**
- **Affordable ($22/mo vs. $100-200/mo for services)**

## Legal Considerations

### Required Disclosures
- "We are not a credit repair company" (if not providing credit repair services)
- "Results vary. We cannot guarantee specific outcomes."
- "Credit reports and scores are provided by third parties."
- Affiliate relationship disclosures
- Terms of service, privacy policy

### Compliance
- FTC guidelines on advertising claims
- FCRA (Fair Credit Reporting Act)
- CROA (Credit Repair Organizations Act) — be careful here
- State-specific regulations (California, New York)
- GDPR/CCPA for data privacy

### Recommended Approach
- Position as "credit education" and "financial guidance"
- NOT "credit repair" (triggers CROA requirements)
- Provide tools and information, not "we'll fix it for you"
- Consult fintech/credit attorney before launch

## Timeline & Milestones

### MVP (Month 1-2)
- [ ] Core checklist UI
- [ ] User auth
- [ ] Manual task completion
- [ ] Basic email sequences
- [ ] Stripe integration
- [ ] Manual credit card recommendations

### Beta (Month 3)
- [ ] Credit card decision tree
- [ ] Affiliation links
- [ ] Email automation
- [ ] User feedback collection
- [ ] Bug fixes

### Launch (Month 4-5)
- [ ] Credit report integration (manual entry MVP)
- [ ] Score tracking dashboard
- [ ] Marketing site
- [ ] Paid ads (Facebook, Google)
- [ ] Content marketing

### Scale (Month 6-12)
- [ ] Automated credit report pulls
- [ ] SMS notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] A/B testing framework

## Next Steps

1. **Validate demand:** Landing page + waitlist
2. **Build MVP:** Core checklist UI + auth + payments
3. **Create content:** Write all task details, emails, scripts
4. **Test with users:** Beta group of 50-100 people
5. **Iterate:** Fix UX issues, add features based on feedback
6. **Launch:** Marketing push, paid acquisition
