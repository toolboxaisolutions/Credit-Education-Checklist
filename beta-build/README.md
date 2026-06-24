# Credit Comeback Bot

WhatsApp bot that guides users through a 16-task credit repair journey, tracked in GoHighLevel.

## Architecture

```
User (WhatsApp) → Twilio → Express Webhook → Bot Logic → GoHighLevel
```

- **WhatsApp**: User interface via Twilio Business API
- **Bot**: Node.js/TypeScript Express server handling messages and state
- **GoHighLevel**: CRM storing user progress, custom fields, and automation triggers

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```

Edit `.env` with:
- **GHL_API_KEY**: From GoHighLevel Settings → Business Profile → API Keys
- **GHL_SUBDOMAIN**: Your GoHighLevel subdomain (e.g., `yourname.gohighlevel.com`)
- **GHL_LOCATION_ID**: Your GoHighLevel location/subaccount ID
- **TWILIO_ACCOUNT_SID**: From Twilio Console
- **TWILIO_AUTH_TOKEN**: From Twilio Console
- **TWILIO_WHATSAPP_NUMBER**: Your Twilio WhatsApp number

### 3. Seed GHL custom fields
```bash
npm run seed-fields
```

This creates all 28 custom fields in your GoHighLevel account.

### 4. Start the bot
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

### 5. Configure Twilio webhook
Point your Twilio WhatsApp webhook to:
```
https://your-domain.com/webhook
```

## Task Flow

**Phase 1: Foundation** (Tasks 1-4)
1. Pull credit reports
2. Understand credit score
3. Set up budget
4. Build safety net

**Phase 2: Clean Up** (Tasks 5-7)
5. Dispute credit errors (gate: task 1)
6. Negotiate collections (gate: task 1)
7. Set up autopay (gate: task 7)

**Phase 3: Build** (Tasks 8-10)
8. Get secured credit card (gate: tasks 5, 7)
9. Become authorized user (gate: tasks 5, 6)
10. Get credit-builder loan (gate: task 8)

**Phase 4: Optimize** (Tasks 11-13)
11. Request credit limit increase (gate: tasks 8, 10)
12. Apply for better cards (gate: tasks 8, 9, 10)
13. Optimize utilization (gate: task 12)

**Phase 5: Maintain** (Tasks 14-16)
14. Set up credit monitoring (gate: tasks 11, 12, 13)
15. Annual credit report review (gate: task 14)
16. Set new score goals (gate: tasks 14, 15)

## User Commands

- **DONE** — Mark current task complete
- **NEXT** — See current task instructions
- **PROGRESS** — Check progress
- **HELP** — Show available commands

## Custom Fields

28 fields created in GoHighLevel:
- 2 progress tracking (current_phase, current_task)
- 5 phase completion flags
- 16 task completion flags
- 2 credit score fields
- 1 lifestyle preference
- 2 metadata (signup_date, last_active)
- 1 subscription status

## Deployment

Recommended: Deploy to Railway, Render, or Fly.io

Example Railway setup:
```bash
railway init
railway up
```

## Next Steps

- [ ] Add detailed task instructions from `docs/MARKETING-PLAN.md`
- [ ] Implement GHL workflow triggers for phase completions
- [ ] Add reminder logic (3 days inactive)
- [ ] Integrate credit score tracking
- [ ] Add card recommendation logic
- [ ] Test with beta users
