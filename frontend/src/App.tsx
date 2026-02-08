import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { BookOpen, MessageSquare, BarChart3, ScrollText } from 'lucide-react';
import Prism from './components/Prism';
import PanelContainer from './components/shared/PanelContainer';
import IDELayout from './layouts/IDELayout';
import HeroPage from './components/HeroPage';
import UserForm from './components/UserForm';
import UserInterviewView from './components/UserInterviewView';
import AnalysisPanel from './components/AnalysisPanel';
import { fetchAnalyses } from './services/api';
import type { AnalysisEntry } from './services/api';
import type { UserFormData } from './components/UserForm';
import { useIssues } from './hooks/useIssues';
import { useCompetitors } from './hooks/useCompetitors';
import { useExaTrigger } from './hooks/useExaTrigger';

type View = 'hero' | 'user-form' | 'user-interview' | 'ide';

function getInitialView(): View {
  const params = new URLSearchParams(window.location.search);
  return params.get('role') === 'user' ? 'user-form' : 'hero';
}

function App() {
  const [view, setView] = useState<View>(getInitialView);
  const [userFormData, setUserFormData] = useState<UserFormData | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [latestUserContext, setLatestUserContext] = useState<AnalysisEntry['user_context'] | null>(null);
  const lastSeenCount = useRef(0);

  const { data: issues } = useIssues();
  const { refresh: refreshCompetitors } = useCompetitors();

  const companyContext = useMemo(() => {
    if (!latestUserContext) return '';
    return `${latestUserContext.company} -- ${latestUserContext.problem_description}`;
  }, [latestUserContext]);

  const stableRefreshCompetitors = useCallback(refreshCompetitors, [refreshCompetitors]);

  useExaTrigger({
    issues,
    companyContext,
    onComplete: stableRefreshCompetitors,
  });

  // Poll for new analyses when in IDE view
  useEffect(() => {
    if (view !== 'ide') return;

    // Initialize the count on first load so we only show new analyses
    let initialized = false;

    const poll = async () => {
      try {
        const entries = await fetchAnalyses();
        if (!initialized) {
          lastSeenCount.current = entries.length;
          initialized = true;
          return;
        }
        if (entries.length > 0) {
          const latest = entries[entries.length - 1];
          setLatestUserContext(latest.user_context);
        }
        if (entries.length > lastSeenCount.current) {
          const latest = entries[entries.length - 1];
          setAnalysis(latest.analysis);
          setAnalysisLoading(false);
          lastSeenCount.current = entries.length;
        }
      } catch {
        // Silently ignore polling errors
      }
    };

    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [view]);

  if (view === 'hero') {
    return <HeroPage onStart={() => setView('ide')} />;
  }

  if (view === 'user-form') {
    return (
      <UserForm
        onComplete={(data) => {
          setUserFormData(data);
          setView('user-interview');
        }}
      />
    );
  }

  if (view === 'user-interview' && userFormData) {
    return <UserInterviewView userContext={userFormData} />;
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
              <div className="flex h-full flex-col items-center justify-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-accent-cyan/30 bg-accent-cyan/5">
                  <div className="h-3 w-3 animate-pulse rounded-full bg-accent-cyan/60" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-text-primary">Waiting for user interviews...</p>
                  <p className="mt-1 text-xs text-text-secondary">
                    Share the interview link (<span className="font-mono text-accent-cyan/80">?role=user</span>) with participants.
                    Analysis will appear in the right panel when an interview completes.
                  </p>
                </div>
              </div>
            </PanelContainer>
          }
          right={
            <PanelContainer title="Analysis" icon={BarChart3}>
              <AnalysisPanel analysis={analysis} loading={analysisLoading} error={null} />
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
