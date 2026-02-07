export type IssueType = 'Pain Point' | 'Feature Request' | 'Workflow Gap' | 'Unmet Need';
export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
export type GraphType = 'Bar' | 'Trend' | 'Heatmap' | 'None';

export interface Issue {
  id: string;
  created_time: string;
  issue_title: string;
  issue_type: IssueType;
  issue_details: string;
  severity: Severity;
  related_persona_id: string | null;
  related_quote_ids: string[];
  engineer_matching: string;
  graph_type: GraphType | null;
  exa_trigger: boolean;
}
