export interface TranscriptParticipant {
  name: string;
  role: string;
  company: string;
  industry: string;
}

export interface InterviewTranscript {
  id: string;
  project_id: string;
  participant: TranscriptParticipant;
  duration_minutes: number;
  coverage_score: number;
  key_topics: string[];
  summary: string;
  conducted_at: string;
  created_at: string;
}
