import dotenv from 'dotenv';
dotenv.config();

import { taskDefinitions, TaskDefinition } from './definitions';
import { GHLContact } from '../ghl';

export function getCurrentTask(contact: GHLContact): TaskDefinition {
  const currentTaskNum = contact.customFields.current_task || 1;
  return taskDefinitions.find(t => t.id === currentTaskNum) || taskDefinitions[0];
}

export function canUnlockTask(contact: GHLContact, taskId: number): boolean {
  const task = taskDefinitions.find(t => t.id === taskId);
  if (!task) return false;

  // Check all required dependencies
  for (const depId of task.gates) {
    const depField = `task${depId}_complete`;
    if (!contact.customFields[depField]) {
      return false;
    }
  }
  return true;
}

export function getNextAvailableTask(contact: GHLContact): TaskDefinition | null {
  for (const task of taskDefinitions) {
    if (task.gates.length === 0) continue; // Skip intro tasks
    
    const isComplete = contact.customFields[`task${task.id}_complete`];
    if (isComplete) continue;

    if (canUnlockTask(contact, task.id)) {
      return task;
    }
  }
  return null;
}

export function getPhaseProgress(contact: GHLContact): { phase: number; complete: number; total: number } {
  const currentPhase = contact.customFields.current_phase || 1;
  
  // Count tasks in current phase
  const phaseTasks = taskDefinitions.filter(t => t.phase === currentPhase);
  const completeTasks = phaseTasks.filter(t => contact.customFields[`task${t.id}_complete`]).length;

  return {
    phase: currentPhase,
    complete: completeTasks,
    total: phaseTasks.length,
  };
}

export function formatProgressMessage(contact: GHLContact): string {
  const progress = getPhaseProgress(contact);
  const currentTask = getCurrentTask(contact);
  
  let message = `📊 *Your Progress*\n\n`;
  message += `Phase ${currentTask.phase}: ${currentTask.title}\n`;
  message += `Tasks complete: ${progress.complete}/${progress.total}\n`;
  message += `Current: Task ${currentTask.id}\n\n`;

  // Show completed tasks for this phase
  const phaseTasks = taskDefinitions.filter(t => t.phase === currentTask.phase);
  for (const task of phaseTasks) {
    const isComplete = contact.customFields[`task${task.id}_complete`];
    const isCurrent = task.id === currentTask.id;
    message += `${isComplete ? '✅' : isCurrent ? '⏳' : '⬜'} ${task.title}\n`;
  }

  return message;
}
