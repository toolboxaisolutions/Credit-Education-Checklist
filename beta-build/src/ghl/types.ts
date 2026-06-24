export interface GHLContact {
  id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  customFields: Record<string, any>;
  dateAdded: string;
  dateUpdated: string;
}

export interface GHLContactCreate {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  customFields: Record<string, any>;
}

export interface GHLCustomField {
  id: string;
  name: string;
  fieldType: 'TEXT' | 'DROPDOWN' | 'CHECKBOX' | 'NUMBER' | 'DATE' | 'INTEGER';
  options?: Array<{ label: string; value: string }>;
  customFieldCustomMetaTitle?: Record<string, any>;
  placeholder?: string;
}

export interface GHLWorkflow {
  id: string;
  name: string;
  status: 'published' | 'draft';
}

export const TASK_FIELDS = [
  'task1_pulled_reports',
  'task2_understands_score',
  'task3_budget_complete',
  'task4_safety_net_complete',
  'task5_disputes_filed',
  'task6_collections_handled',
  'task7_autopay_setup',
  'task8_secured_card_applied',
  'task9_authorized_user',
  'task10_credit_builder',
  'task11_credit_limit_increase',
  'task12_upgraded_card',
  'task13_utilization_optimized',
  'task14_monitoring_setup',
  'task15_annual_review',
  'task16_goal_setting',
] as const;

export const PHASE_FIELDS = [
  'phase1_complete',
  'phase2_complete',
  'phase3_complete',
  'phase4_complete',
  'phase5_complete',
] as const;

export type TaskField = typeof TASK_FIELDS[number];
export type PhaseField = typeof PHASE_FIELDS[number];
