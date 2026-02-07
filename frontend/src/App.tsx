import { useState, useCallback } from 'react';
import Prism from './components/Prism';
import IDELayout from './layouts/IDELayout';
import HeroPage from './components/HeroPage';
import { ResearchProvider } from './context/ResearchContext';
import ContextPanel from './panels/ContextPanel';
import InterviewPanel from './panels/InterviewPanel';
import AnalysisPanel from './panels/AnalysisPanel';
import ResearchLogPanel from './panels/ResearchLogPanel';
import { simulateNewInterviewData } from './services/api';
import { mockPersonas, mockQuotes, mockIssues } from './mocks/data';

function App() {
  const [view, setView] = useState<'hero' | 'ide'>('hero');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSimulate = useCallback(() => {
    const { personas, quotes, issues } = simulateNewInterviewData();
    mockPersonas.push(...personas);
    mockQuotes.push(...quotes);
    mockIssues.push(...issues);
    setRefreshKey((k) => k + 1);
  }, []);

  if (view === 'hero') {
    return <HeroPage onStart={() => setView('ide')} />;
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
        <ResearchProvider>
          <IDELayout
            onLogoClick={() => setView('hero')}
            onSimulate={handleSimulate}
            left={<ContextPanel key={refreshKey} />}
            center={<InterviewPanel key={refreshKey} />}
            right={<AnalysisPanel key={refreshKey} />}
            bottom={<ResearchLogPanel key={refreshKey} />}
          />
        </ResearchProvider>
      </div>
    </div>
  );
}

export default App;
