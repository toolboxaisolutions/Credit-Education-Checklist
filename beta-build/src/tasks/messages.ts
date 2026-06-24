/**
 * Message helpers — Format task messages for WhatsApp
 */

import { Task } from './task-definitions';

function escapeMarkdown(text: string): string {
  return text.replace(/\*/g, '\\*').replace(/_/g, '\\_');
}

/**
 * Welcome message for new users
 */
export function getWelcomeMessage(): string {
  return `Hey there! 👋

I'm your personal credit coach. I'll walk you through fixing your credit — one step at a time.

No jargon. No confusion. Just clear steps.

Ready to start? It takes about 15 minutes per task, and most people finish in 6-9 months.

Let's get started! 🚀`;
}

/**
 * Task message with full instructions
 */
export function getTaskMessage(task: Task): string {
  return `*Task ${task.id}: ${task.title}*

${escapeMarkdown(task.description)}`;
}

/**
 * Phase completion message
 */
export function getPhaseCompleteMessage(phase: number): string {
  const messages: Record<number, string> = {
    1: `🎉 PHASE 1 COMPLETE! 🎉

You've built the foundation:
✅ Pulled your credit reports
✅ Understood your credit score
✅ Set up a budget
✅ Started your emergency fund

Now we move to Phase 2: Clean Up

This is where we fix errors, handle collections, and block future late payments.

Ready to dive in? 🚀`,
    2: `🎉 PHASE 2 COMPLETE! 🎉

You've cleaned up the mess:
✅ Disputed credit report errors
✅ Handled collections
✅ Set up autopay on all accounts

Now we move to Phase 3: Build

Time to add positive credit history. This is where your score starts climbing! ⬆️`,
    3: `🎉 PHASE 3 COMPLETE! 🎉

You've got credit building:
✅ Secured credit card reporting positive history
✅ Authorized user account adding to your profile
✅ Credit-builder loan adding positive payments

Now we move to Phase 4: Optimize

Your score should be climbing fast. Let's maximize it! 💪`,
    4: `🎉 PHASE 4 COMPLETE! 🎉

You've optimized your credit:
✅ Higher credit limits (lower utilization!)
✅ Better credit cards with rewards
✅ Utilization dialed in

Now we move to Phase 5: Maintain

This is where we lock in your progress and protect what you've built.`,
    5: `🎉 CONGRATULATIONS! 🎉

You've completed all 16 tasks!

You've gone from credit repair to credit mastery. Keep monitoring, keep building, and remember: one late payment can wipe out months of progress.

Stay on track! 💪`,
  };

  return messages[phase] || `🎉 Phase ${phase} complete!`;
}

/**
 * Progress summary message
 */
export function getProgressMessage(completedTasks: number[], totalTasks: number): string {
  const completed = completedTasks.length;
  const percent = Math.round((completed / totalTasks) * 100);
  
  let message = `📊 Your Progress: ${percent}% complete\n\n`;
  message += `Completed: ${completed}/${totalTasks} tasks\n\n`;
  
  // Show phase breakdown
  const phases = [1, 2, 3, 4, 5];
  for (const phase of phases) {
    const phaseTasks = completedTasks.filter(id => {
      // We'd need to pass task objects to know their phase, but we can approximate
      // For now, just show overall progress
      return completedTasks.includes(id);
    });
    
    message += `Phase ${phase}: ${phaseTasks.length}/`;
  }
  
  message += `\n\nKeep going! You're doing great. 🚀`;
  
  return message;
}

/**
 * Reminder message (for inactive users)
 */
export function getReminderMessage(task: Task): string {
  return `Hey! 👋 Just checking in.

You've got a task waiting: Task ${task.id} — ${task.title}

It only takes about 15 minutes, and you're already on your way to better credit. Want to pick up where you left off?`;
}

/**
 * Help message
 */
export function getHelpMessage(): string {
  return `Here's what I can help you with:

• Reply *next* — Get your current task
• Reply *progress* — See how far you've come
• Reply *help* — Show this menu
• Just type your answer — I'll guide you through

Let's get your credit in shape! 💪`;
}

/**
 * Error message
 */
export function getErrorMessage(): string {
  return `Hmm, I'm not sure what you mean. 

Try replying *help* to see what I can do, or just tell me what you're working on!`;
}
