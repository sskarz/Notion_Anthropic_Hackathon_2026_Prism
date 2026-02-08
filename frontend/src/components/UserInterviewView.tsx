import { useState, useCallback } from 'react';
import Prism from './Prism';
import LiveKitSession from './LiveKitSession';
import { analyzeTranscript } from '../services/api';
import type { UserFormData } from './UserForm';
import type { TranscriptEntry } from '../hooks/useTranscriptCollector';

interface UserInterviewViewProps {
  userContext: UserFormData;
}

export default function UserInterviewView({ userContext }: UserInterviewViewProps) {
  const [interviewDone, setInterviewDone] = useState(false);

  const handleInterviewComplete = useCallback((transcript: TranscriptEntry[]) => {
    // Fire-and-forget: send transcript + user context to backend for PM dashboard
    analyzeTranscript(transcript, userContext as unknown as Record<string, string>).catch(() => {
      // Analysis is for the PM — user doesn't need to see errors
    });
    setInterviewDone(true);
  }, [userContext]);

  const metadata = JSON.stringify({ participant_type: 'user', ...userContext });

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden">
      <div className="fixed inset-0 z-0 opacity-15">
        <Prism
          animationType="rotate"
          glow={0.8}
          noise={0.3}
          scale={3.6}
          timeScale={0.3}
        />
      </div>
      <div className="fixed inset-0 z-0 bg-bg-primary/85" />

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Top bar */}
        <div className="flex items-center border-b border-border-primary/50 px-6 py-3">
          <span
            className="font-mono text-lg font-bold tracking-wider text-text-primary"
            style={{ textShadow: '0 0 20px rgba(0, 229, 255, 0.3)' }}
          >
            Prism
          </span>
          <span className="ml-3 text-xs text-text-secondary">
            Feedback Interview — {userContext.name}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col items-center gap-6 px-4 py-8">
          {!interviewDone ? (
            /* Interview card */
            <div className="w-full max-w-2xl rounded-xl border border-border-primary/60 bg-bg-secondary/60 p-6 backdrop-blur-xl">
              <div className="h-[400px]">
                <LiveKitSession
                  onInterviewComplete={handleInterviewComplete}
                  participantMetadata={metadata}
                />
              </div>
            </div>
          ) : (
            /* Thank-you card */
            <div className="w-full max-w-2xl rounded-xl border border-accent-cyan/30 bg-bg-secondary/60 p-10 text-center backdrop-blur-xl">
              <div
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-accent-cyan/40 bg-accent-cyan/10"
              >
                <svg
                  className="h-7 w-7 text-accent-cyan"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2
                className="mb-2 font-mono text-xl font-bold text-text-primary"
                style={{ textShadow: '0 0 20px rgba(0, 229, 255, 0.3)' }}
              >
                Thank You!
              </h2>
              <p className="text-sm text-text-secondary">
                Your feedback has been recorded and will help us improve the product.
                You can close this page now.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
