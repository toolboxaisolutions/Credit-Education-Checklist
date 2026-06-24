/**
 * Task Definitions — The Complete 16-Task Credit Repair Journey
 * 
 * Each task has:
 * - id: Unique identifier (1-16)
 * - phase: Which phase it belongs to (1-5)
 * - title: Task name
 * - description: Detailed instructions for the user
 * - gate: Array of task IDs that must be complete before this unlocks
 *   - [] = no gates, available immediately
 *   - [1] = task 1 must be complete
 *   - [1, 2] = tasks 1 AND 2 must be complete
 * - parallel: Can this task run alongside others in the same phase?
 * - required: Is this task mandatory for the journey?
 * - field: GHL custom field name for tracking completion
 */

export interface Task {
  id: number;
  phase: number;
  title: string;
  description: string;
  gate: number[];
  parallel: boolean;
  required: boolean;
  field: string;
}

export const tasks: Task[] = [
  // ===== PHASE 1: FOUNDATION =====
  {
    id: 1,
    phase: 1,
    title: 'Pull Your Credit Reports',
    description: `Great, let's get started!

First, we need to see where you stand. Head to:

🔗 https://www.annualcreditreport.com

Pull your free credit reports from all three bureaus (Equifax, Experian, TransUnion).

This is the ONLY official free source. Don't use other sites!

Once you have your reports, let me know and we'll go through them together.`,
    gate: [],
    parallel: true,
    required: true,
    field: 'task01_complete',
  },
  {
    id: 2,
    phase: 1,
    title: 'Understand Your Credit Score',
    description: `Your credit score is a 3-digit number (300-850) that shows lenders how risky you are.

The 5 factors that make up your FICO score:

1️⃣ Payment History (35%) — Did you pay on time?
2️⃣ Credit Utilization (30%) — How much of your available credit are you using?
3️⃣ Length of History (15%) — How long have you had credit?
4️⃣ Credit Mix (10%) — Do you have different types of credit?
5️⃣ New Inquiries (10%) — Have you applied for credit recently?

Check your current score on Credit Karma or your bank's app.

Got it?`,
    gate: [],
    parallel: true,
    required: true,
    field: 'task02_complete',
  },
  {
    id: 3,
    phase: 1,
    title: 'Set Up a Budget',
    description: `Before we fix your credit, we need to know what you can afford to pay each month.

I'll send you a simple budget template.

Just fill in:
• Your income
• Fixed expenses (rent, utilities, etc.)
• Variable expenses (food, entertainment, etc.)

The goal is to find your "disposable income" — what's left after the essentials.

Ready to start your budget?`,
    gate: [1],
    parallel: false,
    required: true,
    field: 'task03_complete',
  },
  {
    id: 4,
    phase: 1,
    title: 'Build a Safety Net',
    description: `One emergency can wipe out all your progress. Let's build a cushion.

Open a high-yield savings account if you don't have one:
• Ally Bank (ally.com)
• Marcus by Goldman Sachs (marcus.com)
• Discover Savings (discover.com)

Set up an automatic transfer: $25-50/week.

Goal: $500-$1,000 emergency fund.

This keeps you from falling backward while you rebuild.`,
    gate: [3],
    parallel: false,
    required: true,
    field: 'task04_complete',
  },

  // ===== PHASE 2: CLEAN UP =====
  {
    id: 5,
    phase: 2,
    title: 'Dispute Errors on Your Reports',
    description: `Time to clean up your credit reports.

Review the reports you pulled in Task 1 and look for:

🚩 Red flags:
• Accounts you don't recognize
• Late payments that were actually on time
• Old negative items (7+ years)
• Mixed credit files
• Incorrect balances or credit limits
• Duplicate accounts

For each error, you'll need to dispute it with the bureau.

I'll send you a dispute letter template.

Ready to start disputing?`,
    gate: [1, 2, 3, 4],
    parallel: true,
    required: true,
    field: 'task05_complete',
  },
  {
    id: 6,
    phase: 2,
    title: 'Handle Collections',
    description: `If you have collections on your reports, we need to deal with them.

Your options:
1️⃣ Dispute (if it's not yours or not accurate)
2️⃣ Negotiate (try to settle for less than you owe)
3️⃣ Pay-for-Delete (pay in exchange for removal — get it in writing!)

NEVER give a collection agency direct access to your bank account.

I'll send you scripts for talking to collectors.

Do you have collections to deal with?`,
    gate: [1, 2, 3, 4],
    parallel: true,
    required: true,
    field: 'task06_complete',
  },
  {
    id: 7,
    phase: 2,
    title: 'Set Up Autopay',
    description: `One late payment wipes out months of progress.

Let's make sure it never happens again.

For each account you have:
• Credit cards
• Student loans
• Car loans
• Any other bills

Set up automatic payment for at LEAST the minimum amount.

Pro tip: Set it a few days before the due date, and keep a manual reminder as backup.

Ready to set up autopay?`,
    gate: [5],
    parallel: false,
    required: true,
    field: 'task07_complete',
  },

  // ===== PHASE 3: BUILD =====
  {
    id: 8,
    phase: 3,
    title: 'Get a Secured Credit Card',
    description: `Time to build positive credit history.

A secured card is like a regular credit card, but you put down a deposit first.

Top picks:
🥇 Discover it® Secured
   • No annual fee
   • Reports to all 3 bureaus
   • Deposit: $200 minimum

🥈 OpenSky® Secured Visa®
   • No credit check
   • Deposit: $200 minimum

🥉 Capital One Platinum Secured
   • May get higher limit
   • Deposit: $49-$200

Apply, get approved, and make small purchases ($25-50). Pay it off in full every month.

IMPORTANT: You need to keep this card for 1 full billing cycle with on-time payments before moving on.

Ready to apply?`,
    gate: [5, 7],
    parallel: false,
    required: true,
    field: 'task08_complete',
  },
  {
    id: 9,
    phase: 3,
    title: 'Become an Authorized User',
    description: `If a family member has great credit, they can add you to their card.

Their positive history gets added to YOUR report.

Look for someone who has:
✅ Credit score 700+
✅ Long credit history
✅ Low utilization (under 30%)
✅ Perfect payment history

Ask them to add you as an authorized user.

Important: Make sure the card reports authorized users to the bureaus (most do).

Wait 30 days for it to show up on your report.

Do you have someone who can help?`,
    gate: [5, 6],
    parallel: true,
    required: true,
    field: 'task09_complete',
  },
  {
    id: 10,
    phase: 3,
    title: 'Get a Credit-Builder Loan',
    description: `A credit-builder loan works in reverse:
You make payments first, then get the money at the end.

This adds an "installment loan" to your credit mix.

Top options:
🥇 Self Financial (self.inc)
   • Fully online
   • $25-50/month for 12-24 months
   • Reports to all 3 bureaus

🥈 Credit Union credit-builder loans
   • Often have better rates
   • Call your local credit union

🥉 Kikoff (kikoff.com)
   • $5-75/month
   • Reports to all 3 bureaus

Set up autopay and make every payment on time.

Ready to build more credit?`,
    gate: [8],
    parallel: false,
    required: true,
    field: 'task10_complete',
  },

  // ===== PHASE 4: OPTIMIZE =====
  {
    id: 11,
    phase: 4,
    title: 'Request Credit Limit Increases',
    description: `Higher credit limit + same spending = lower utilization = higher score.

Wait until you have 6+ months of on-time payments.

Then call or request online:

Script:
"I've been a responsible customer with on-time payments for the past 6 months. I'd like to request a credit limit increase."

They may ask about your income — just tell the truth.

Do one card at a time in case there's a hard pull.

Ready to ask for a raise?`,
    gate: [8, 10],
    parallel: true,
    required: true,
    field: 'task11_complete',
  },
  {
    id: 12,
    phase: 4,
    title: 'Apply for Better Credit Cards',
    description: `Your credit is stronger now. Time to upgrade.

I'll ask you some questions to find the best cards for YOU:

• What do you spend most on? (Gas, groceries, dining, travel, everything)
• Do you travel internationally?
• What's your credit score range?

Based on your answers, I'll recommend 2-3 cards with:
• No foreign transaction fees (if you travel)
• Great rewards for your spending
• Annual fee worth the benefits

Ready to get personalized recommendations?`,
    gate: [8, 9, 10],
    parallel: false,
    required: true,
    field: 'task12_complete',
  },
  {
    id: 13,
    phase: 4,
    title: 'Optimize Your Utilization',
    description: `Utilization is how much of your available credit you're using.

Goal: Under 30% is good. Under 10% is ideal.

Formula:
(Total balances ÷ Total credit limits) × 100 = Utilization %

Example:
$1,000 balance ÷ $10,000 total limit = 10% utilization ✅

If you're over 30%:
1️⃣ Pay down highest-utilization cards first
2️⃣ Request credit limit increases
3️⃣ Pay twice per month (before statement closes)

Check your current utilization and let me know where you stand.`,
    gate: [12],
    parallel: false,
    required: true,
    field: 'task13_complete',
  },

  // ===== PHASE 5: MAINTAIN =====
  {
    id: 14,
    phase: 5,
    title: 'Set Up Credit Monitoring',
    description: `Let's keep an eye on your credit going forward.

Free options:
• Credit Karma (creditkarma.com) — Daily monitoring
• Credit Sesame (creditsesame.com) — Free FICO scores
• Your bank might offer free scores too

Paid options:
• Identity Guard — Identity theft protection
• Credit Total Care — Full monitoring

Sign up and set up alerts for:
• New accounts opened
• Hard inquiries
• Score changes

Ready to protect what you've built?`,
    gate: [11, 12, 13],
    parallel: true,
    required: true,
    field: 'task14_complete',
  },
  {
    id: 15,
    phase: 5,
    title: 'Annual Credit Report Review',
    description: `Every year, pull your credit reports again from annualcreditreport.com.

Check for:
• New errors
• Accounts that fell off (negative items drop after 7 years!)
• Your progress

Compare to your reports from last year.

Set a calendar reminder for 1 year from today.

This task repeats annually — you've got this!`,
    gate: [14],
    parallel: true,
    required: true,
    field: 'task15_complete',
  },
  {
    id: 16,
    phase: 5,
    title: 'Set New Credit Goals',
    description: `You've made it! 🎉

Now set your next goals:

🎯 700+ — Good credit (most loans available)
🎯 740+ — Great credit (best interest rates)
🎯 800+ — Exceptional (all doors open)

Check your current score and pick your target.

Keep monitoring, keep paying on time, keep your utilization low.

You've got this! 💪

Need anything else? I'm always here to help.`,
    gate: [14, 15],
    parallel: false,
    required: true,
    field: 'task16_complete',
  },
];

export function getTaskById(id: number): Task | undefined {
  return tasks.find(t => t.id === id);
}

export function getTasksByPhase(phase: number): Task[] {
  return tasks.filter(t => t.phase === phase);
}

export function canStartTask(taskId: number, completedTasks: number[]): boolean {
  const task = getTaskById(taskId);
  if (!task) return false;
  
  // Check if all gates are met
  return task.gate.every(gateId => completedTasks.includes(gateId));
}

export function getNextTask(currentTaskId: number, completedTasks: number[]): Task | null {
  // Check if current task is complete
  if (!completedTasks.includes(currentTaskId)) {
    return getTaskById(currentTaskId);
  }
  
  // Find next available task
  for (const task of tasks) {
    if (!completedTasks.includes(task.id) && canStartTask(task.id, completedTasks)) {
      return task;
    }
  }
  
  return null;
}

export function getAllTasksStatus(completedTasks: number[]): { completed: Task[]; available: Task[]; locked: Task[] } {
  const completed: Task[] = [];
  const available: Task[] = [];
  const locked: Task[] = [];
  
  for (const task of tasks) {
    if (completedTasks.includes(task.id)) {
      completed.push(task);
    } else if (canStartTask(task.id, completedTasks)) {
      available.push(task);
    } else {
      locked.push(task);
    }
  }
  
  return { completed, available, locked };
}
