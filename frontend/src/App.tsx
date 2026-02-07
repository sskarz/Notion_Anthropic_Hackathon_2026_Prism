import { useState, useCallback } from 'react';
import { BookOpen, MessageSquare, BarChart3, ScrollText } from 'lucide-react';
import Prism from './components/Prism';
import PanelContainer from './components/shared/PanelContainer';
import IDELayout from './layouts/IDELayout';
import HeroPage from './components/HeroPage';
import SignUpForm from './components/SignUpForm';
import LiveKitSession from './components/LiveKitSession';
import AnalysisPanel from './components/AnalysisPanel';
import { analyzeTranscript } from './services/api';
import type { TranscriptEntry } from './hooks/useTranscriptCollector';

function App() {
  const [view, setView] = useState<'hero' | 'signup' | 'ide'>('hero');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleInterviewComplete = useCallback(async (transcript: TranscriptEntry[]) => {
    setAnalysisLoading(true);
    setAnalysisError(null);
    setAnalysis(null);
    try {
      const result = await analyzeTranscript(transcript);
      setAnalysis(result);
    } catch (e) {
      setAnalysisError(e instanceof Error ? e.message : 'Analysis failed');
    } finally {
      setAnalysisLoading(false);
    }
  }, []);

  if (view === 'hero') {
    return <HeroPage onStart={() => setView('signup')} />;
  }

  if (view === 'signup') {
    return <SignUpForm onComplete={() => setView('ide')} />;
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden">
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

      <div className="relative z-10 h-full">
        <IDELayout
          left={
            <PanelContainer title="Context" icon={BookOpen}>
              <div className="space-y-3">
                <div className="rounded border border-border-primary bg-bg-tertiary p-3">
                  <p className="text-xs text-text-secondary">Research context and documents will appear here.</p>
                </div>
              </div>
            </PanelContainer>
          }
          center={
            <PanelContainer title="Interview" icon={MessageSquare} active>
              <LiveKitSession onInterviewComplete={handleInterviewComplete} />
            </PanelContainer>
          }
          right={
            <PanelContainer title="Analysis" icon={BarChart3}>
              <AnalysisPanel analysis={analysis} loading={analysisLoading} error={analysisError} />
            </PanelContainer>
          }
          bottom={
            <PanelContainer title="Research Log" icon={ScrollText}>
              <div className="space-y-2">
                <div className="rounded border border-border-primary bg-bg-tertiary p-2">
                  <p className="text-xs text-text-secondary">Research log entries will appear here.</p>
                </div>
              </div>
            </PanelContainer>
          }
        />
      </div>
    </div>
  );
}

export default App;
