export type ActionPriority = 'P0' | 'P1' | 'P2' | 'P3';

export type ActionType =
  | 'Feature'
  | 'Improvement'
  | 'Investigation'
  | 'Pivot';

export type ActionStatus = 'Proposed' | 'Accepted' | 'In Progress' | 'Done';

export interface ActionItem {
  id: string;
  project_id: string;
  title: string;
  description: string;
  priority: ActionPriority;
  type: ActionType;
  status: ActionStatus;
  supporting_insight_ids: string[];
  created_at: string;
  updated_at: string;
}
