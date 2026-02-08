import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Prism from './components/Prism';
import IDELayout from './layouts/IDELayout';
import HeroPage from './components/HeroPage';
import UserForm from './components/UserForm';
import UserInterviewView from './components/UserInterviewView';
import ContextPanel from './panels/ContextPanel';
import InterviewPanel from './panels/InterviewPanel';
import AnalysisPanel from './panels/AnalysisPanel';
import ResearchLogPanel from './panels/ResearchLogPanel';
import { ResearchProvider } from './context/ResearchContext';
import { fetchAnalyses, checkHealth } from './services/api';
import { useIssues } from './hooks/useIssues';
import { useCompetitors } from './hooks/useCompetitors';
import { useAnalytics } from './hooks/useAnalytics';
import { useExaTrigger } from './hooks/useExaTrigger';
import type { AnalysisEntry } from './services/api';
import type { UserFormData } from './components/UserForm';

type View = 'hero' | 'user-form' | 'user-interview' | 'ide';

function getInitialView(): View {
  const params = new URLSearchParams(window.location.search);
  return params.get('role') === 'user' ? 'user-form' : 'hero';
}

function IDEView() {
  const [connected, setConnected] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const { data: issues } = useIssues();
  const { refresh: refreshCompetitors } = useCompetitors();
  const { data: analytics } = useAnalytics();
  const [latestUserContext, setLatestUserContext] = useState<AnalysisEntry['user_context'] | null>(null);
  const lastSeenCount = useRef(0);

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

  const interviewCount = analytics?.total_personas ?? 0;

  // Health check polling
  useEffect(() => {
    const poll = () => {
      checkHealth()
        .then((ok) => {
          setConnected(ok);
          if (ok) setLastSync(new Date());
        })
        .catch(() => setConnected(false));
    };
    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, []);

  // Poll for new analyses
  useEffect(() => {
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
          lastSeenCount.current = entries.length;
        }
      } catch {
        // Silently ignore polling errors
      }
    };

    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, []);

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
        <ResearchProvider>
          <IDELayout
            connected={connected}
            lastSync={lastSync}
            interviewCount={interviewCount}
            left={<ContextPanel />}
            center={<InterviewPanel />}
            right={<AnalysisPanel />}
            bottom={<ResearchLogPanel />}
          />
        </ResearchProvider>
      </div>
    </div>
  );
}

function App() {
  const [view, setView] = useState<View>(getInitialView);
  const [userFormData, setUserFormData] = useState<UserFormData | null>(null);

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

  return <IDEView />;
}

export default App;
