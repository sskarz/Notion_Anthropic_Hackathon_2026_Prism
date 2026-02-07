export interface ResearchProject {
  id: string;
  name: string;
  description: string;
  status: 'Planning' | 'Researching' | 'Synthesizing' | 'Complete';
  interview_style: 'Exploratory' | 'Structured' | 'Mixed';
  total_interviews_planned: number;
  total_interviews_completed: number;
  key_questions: string[];
  created_at: string;
  updated_at: string;
}
