interface StatusBarProps {
  connected: boolean;
  lastSync: Date | null;
  interviewCount: number;
}

function formatRelativeTime(date: Date): string {
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export default function StatusBar({ connected, lastSync, interviewCount }: StatusBarProps) {
  return (
    <div className="flex h-7 shrink-0 items-center justify-between border-t border-border-primary bg-bg-secondary px-4 text-xs text-text-tertiary">
      <div className="flex items-center gap-1.5">
        <div className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-success' : 'bg-error'}`} />
        <span>{connected ? 'Notion Connected' : 'Disconnected'}</span>
      </div>

      <span>{lastSync ? `Last sync: ${formatRelativeTime(lastSync)}` : 'No sync yet'}</span>

      <span>{interviewCount} interview{interviewCount !== 1 ? 's' : ''} completed</span>
    </div>
  );
}
