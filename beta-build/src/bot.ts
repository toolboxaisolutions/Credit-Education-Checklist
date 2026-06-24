import { sendWhatsAppMessage } from './whatsapp';
import { ghlService } from './ghl';
import { tasks, getTask, getPhaseTasks, TaskDefinition } from './tasks';

interface UserState {
  contactId: string;
  currentTask: number;
  currentPhase: number;
  completedTasks: number[];
}

/**
 * Get or create user state
 */
async function getUserState(phone: string): Promise<UserState> {
  let contact = await ghlService.getContactByPhone(phone);
  
  if (!contact) {
    // New user - create contact
    contact = await ghlService.upsertContact({
      phone,
      customFields: {
        current_phase: 1,
        current_task: 1,
        signup_date: new Date().toISOString(),
        last_active: new Date().toISOString(),
        subscription_status: 'active',
      },
    });
  } else {
    // Update last active
    await ghlService.updateContact(contact.id, {
      last_active: new Date().toISOString(),
    });
  }

  const currentTask = parseInt(contact.customFields.current_task || '1');
  const currentPhase = parseInt(contact.customFields.current_phase || '1');
  
  const completedTasks = tasks
    .filter(t => contact?.customFields[t.field] === true || contact?.customFields[t.field] === 'true')
    .map(t => t.id);

  return {
    contactId: contact.id,
    currentTask,
    currentPhase,
    completedTasks,
  };
}

/**
 * Check if all tasks in a phase are complete
 */
function isPhaseComplete(phase: number, completedTasks: number[]): boolean {
  const phaseTasks = getPhaseTasks(phase);
  return phaseTasks.every(t => completedTasks.includes(t.id));
}

/**
 * Get next available task
 */
function getNextTask(currentTask: number, completedTasks: number[]): TaskDefinition | null {
  // Check if gates are met for each task
  for (const task of tasks) {
    if (completedTasks.includes(task.id)) continue; // already done
    
    // Check if all gates are satisfied
    const gatesMet = task.gate.every(gateId => completedTasks.includes(gateId));
    if (gatesMet) {
      return task;
    }
  }
  return null;
}

/**
 * Complete a task and advance
 */
async function completeTask(phone: string, taskId: number): Promise<void> {
  const state = await getUserState(phone);
  
  if (!state.completedTasks.includes(taskId)) {
    const task = getTask(taskId);
    if (!task) return;

    // Mark task complete
    await ghlService.updateContact(state.contactId, {
      [task.field]: true,
    });

    state.completedTasks.push(taskId);

    // Check if phase is complete
    if (isPhaseComplete(task.phase, state.completedTasks)) {
      const phaseField = `phase${task.phase}_complete`;
      await ghlService.updateContact(state.contactId, {
        [phaseField]: true,
      });

      // Send phase complete message
      await sendPhaseCompleteMessage(phone, task.phase);

      // Advance to next phase
      if (task.phase < 5) {
        await ghlService.updateContact(state.contactId, {
          current_phase: task.phase + 1,
        });
      }
    }

    // Find next task
    const nextTask = getNextTask(state.currentTask, state.completedTasks);
    if (nextTask) {
      await ghlService.updateContact(state.contactId, {
        current_task: nextTask.id,
      });

      // Send next task message
      await sendTaskMessage(phone, nextTask, state.completedTasks.length);
    } else if (state.completedTasks.length === tasks.length) {
      // All tasks complete!
      await sendWhatsAppMessage(phone, 
        `🎉 Congratulations! You've completed all 16 tasks!\n\nYour credit is now in great shape. Keep up the good work and remember to check your credit reports annually.\n\nStay awesome! 🚀`
      );
    }
  }
}

/**
 * Send task instruction message
 */
async function sendTaskMessage(phone: string, task: TaskDefinition, progress: number): Promise<void> {
  const gateStatus = task.gate.length > 0 && task.gate.some(g => !state.completedTasks.includes(g))
    ? `\n\n⏳ Wait for tasks ${task.gate.join(', ')} to finish first.`
    : '';

  const message = `
*Task ${task.id}/16: ${task.title}*
_${task.description}_

⏱️ ${task.time}

Here's what you need to do...

[Task instructions go here]

Reply *DONE* when you've finished this task.${gateStatus}

Progress: ${progress}/16 tasks complete
`.trim();

  await sendWhatsAppMessage(phone, message);
}

/**
 * Send phase complete message
 */
async function sendPhaseCompleteMessage(phone: string, phase: number): Promise<void> {
  const phaseNames: Record<number, string> = {
    1: 'Foundation',
    2: 'Clean Up',
    3: 'Build',
    4: 'Optimize',
    5: 'Maintain',
  };

  const message = `
🎉 *Phase ${phase} Complete: ${phaseNames[phase]}* 🎉

Great job! You're making excellent progress.

Let's move on to Phase ${phase + 1}.

Ready for the next step?
`.trim();

  await sendWhatsAppMessage(phone, message);
}

/**
 * Handle incoming message
 */
export async function handleMessage(phone: string, message: string): Promise<void> {
  const text = message.trim().toUpperCase();

  // Get user state
  const state = await getUserState(phone);

  // Handle commands
  if (text === 'DONE') {
    await completeTask(phone, state.currentTask);
    return;
  }

  if (text === 'NEXT') {
    const task = getTask(state.currentTask);
    if (task) {
      await sendTaskMessage(phone, task, state.completedTasks.length);
    }
    return;
  }

  if (text === 'PROGRESS' || text === 'STATUS') {
    const progress = (state.completedTasks.length / tasks.length * 100).toFixed(0);
    await sendWhatsAppMessage(phone, 
      `📊 *Your Progress*\n\n${state.completedTasks.length}/16 tasks complete (${progress}%)\n\nCurrent task: ${state.currentTask}/16`
    );
    return;
  }

  if (text === 'HELP') {
    await sendWhatsAppMessage(phone,
      `*Available Commands:*\n\n` +
      `• DONE - Mark current task as complete\n` +
      `• NEXT - See current task instructions\n` +
      `• PROGRESS - Check your progress\n` +
      `• HELP - Show this menu\n\n` +
      `Just reply with a command!`
    );
    return;
  }

  // Default: show current task if first message, otherwise ignore
  if (state.completedTasks.length === 0) {
    const task = getTask(1);
    if (task) {
      await sendTaskMessage(phone, task, 0);
    }
  } else {
    // Silent - don't spam user
  }
}
