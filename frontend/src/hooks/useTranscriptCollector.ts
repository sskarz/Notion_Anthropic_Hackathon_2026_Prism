import { useEffect, useRef } from 'react';
import {
  useVoiceAssistant,
  useTrackTranscription,
  useLocalParticipant,
} from '@livekit/components-react';
import { Track } from 'livekit-client';

export interface TranscriptEntry {
  speaker: 'user' | 'agent';
  text: string;
  timestamp: number;
}

export function useTranscriptCollector() {
  const { agentTranscriptions } = useVoiceAssistant();
  const { localParticipant, microphoneTrack } = useLocalParticipant();

  const micTrackRef = microphoneTrack
    ? { participant: localParticipant, publication: microphoneTrack, source: Track.Source.Microphone }
    : undefined;

  const { segments: userSegments } = useTrackTranscription(micTrackRef);

  const transcriptRef = useRef<TranscriptEntry[]>([]);

  useEffect(() => {
    const entries: TranscriptEntry[] = [];

    for (const seg of agentTranscriptions) {
      if (seg.final) {
        entries.push({
          speaker: 'agent',
          text: seg.text,
          timestamp: seg.firstReceivedTime,
        });
      }
    }

    for (const seg of userSegments) {
      if (seg.final) {
        entries.push({
          speaker: 'user',
          text: seg.text,
          timestamp: seg.firstReceivedTime,
        });
      }
    }

    entries.sort((a, b) => a.timestamp - b.timestamp);
    transcriptRef.current = entries;
  }, [agentTranscriptions, userSegments]);

  return transcriptRef;
}
