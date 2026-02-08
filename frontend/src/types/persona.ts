export type CommunicationStyle = 'Analytical' | 'Narrative' | 'Terse' | 'Verbose';

export interface Persona {
  id: string;
  created_time: string;
  persona_type: string;
  primary_use_case: string;
  communication_style: CommunicationStyle;
  goals: string;
  constraints: string;
  speaker_name: string;
  persona_summary: string;
}
