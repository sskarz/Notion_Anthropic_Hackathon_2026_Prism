import { useCallback, useEffect, useRef, useState } from 'react';
import {
  LiveKitRoom,
  useVoiceAssistant,
  BarVisualizer,
  RoomAudioRenderer,
  DisconnectButton,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Mic, Phone, PhoneOff } from 'lucide-react';
import { useTranscriptCollector, type TranscriptEntry } from '../hooks/useTranscriptCollector';

const TOKEN_URL = import.meta.env.VITE_TOKEN_URL || '/api/token';

interface VoiceAssistantUIProps {
  transcriptRef: React.MutableRefObject<TranscriptEntry[]>;
}

function VoiceAssistantUI({ transcriptRef }: VoiceAssistantUIProps) {
  const { state, audioTrack } = useVoiceAssistant();
  const collectedTranscript = useTranscriptCollector();

  useEffect(() => {
    transcriptRef.current = collectedTranscript.current;
  });

  const label =
    state === 'listening'
      ? 'Listening...'
      : state === 'thinking'
        ? 'Thinking...'
        : state === 'speaking'
          ? 'Speaking...'
          : state === 'connecting'
            ? 'Connecting...'
            : 'Ready';

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6">
      <div className="h-32 w-full max-w-xs">
        <BarVisualizer
          state={state}
          barCount={5}
          trackRef={audioTrack}
          style={{
            height: '100%',
            width: '100%',
          }}
          options={{ minHeight: 8 }}
        />
      </div>
      <p className="text-sm font-medium text-text-secondary">{label}</p>
      <RoomAudioRenderer />
      <DisconnectButton className="flex items-center gap-2 rounded-lg border border-error/40 bg-error/10 px-4 py-2 text-xs text-error transition-colors hover:bg-error/20">
        <PhoneOff size={14} />
        End Interview
      </DisconnectButton>
    </div>
  );
}

interface LiveKitSessionProps {
  onInterviewComplete?: (transcript: TranscriptEntry[]) => void;
}

export default function LiveKitSession({ onInterviewComplete }: LiveKitSessionProps) {
  const [connectionDetails, setConnectionDetails] = useState<{
    token: string;
    url: string;
  } | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const transcriptRef = useRef<TranscriptEntry[]>([]);

  const startInterview = useCallback(async () => {
    setConnecting(true);
    setError(null);
    try {
      const roomName = `prism-interview-${Date.now()}`;
      const resp = await fetch(
        `${TOKEN_URL}?room=${encodeURIComponent(roomName)}&identity=participant`
      );
      if (!resp.ok) throw new Error('Failed to get token');
      const data = await resp.json();
      setConnectionDetails({ token: data.token, url: data.url });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Connection failed');
    } finally {
      setConnecting(false);
    }
  }, []);

  const handleDisconnect = useCallback(() => {
    const transcript = transcriptRef.current;
    setConnectionDetails(null);
    if (transcript.length > 0 && onInterviewComplete) {
      onInterviewComplete(transcript);
    }
    transcriptRef.current = [];
  }, [onInterviewComplete]);

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <p className="text-xs text-error">{error}</p>
        <button
          onClick={() => setError(null)}
          className="rounded-lg border border-border-primary bg-bg-tertiary px-4 py-2 text-xs text-text-secondary transition-colors hover:bg-bg-hover hover:text-text-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!connectionDetails) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-accent-cyan/30 bg-accent-cyan/5">
          <Mic size={24} className="text-accent-cyan" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-text-primary">Voice Interview</p>
          <p className="mt-1 text-xs text-text-secondary">
            Start a live interview session with the Prism AI agent
          </p>
        </div>
        <button
          onClick={startInterview}
          disabled={connecting}
          className="flex items-center gap-2 rounded-lg border border-accent-cyan/40 bg-accent-cyan/10 px-6 py-2.5 text-sm font-medium text-accent-cyan transition-all hover:bg-accent-cyan/20 disabled:opacity-50"
        >
          <Phone size={14} />
          {connecting ? 'Connecting...' : 'Start Interview'}
        </button>
      </div>
    );
  }

  return (
    <div className="h-full" data-lk-theme="default">
      <LiveKitRoom
        token={connectionDetails.token}
        serverUrl={connectionDetails.url}
        connect={true}
        audio={true}
        video={false}
        onDisconnected={handleDisconnect}
        style={{ height: '100%' }}
      >
        <VoiceAssistantUI transcriptRef={transcriptRef} />
      </LiveKitRoom>
    </div>
  );
}
