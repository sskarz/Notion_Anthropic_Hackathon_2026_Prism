import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ChevronDown } from 'lucide-react';

interface PanelContainerProps {
  title: string;
  icon: LucideIcon;
  active?: boolean;
  collapsible?: boolean;
  onCollapse?: () => void;
  headerExtra?: ReactNode;
  children: ReactNode;
}

export default function PanelContainer({
  title,
  icon: Icon,
  active = false,
  collapsible = false,
  onCollapse,
  headerExtra,
  children,
}: PanelContainerProps) {
  return (
    <div
      className={`flex h-full flex-col bg-bg-secondary ${
        active
          ? 'border-l-2 border-l-accent-cyan shadow-[inset_2px_0_8px_var(--color-accent-cyan-glow)]'
          : 'border-l-2 border-l-transparent'
      }`}
    >
      <div className="flex h-9 shrink-0 items-center gap-2 border-b border-border-primary px-3">
        <Icon size={14} className="text-text-secondary" />
        <span className="text-xs font-medium text-text-secondary">{title}</span>
        {headerExtra}
        {collapsible && (
          <button
            onClick={onCollapse}
            className="ml-auto text-text-tertiary transition-colors hover:text-text-primary"
          >
            <ChevronDown size={14} />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-auto p-3">
        {children}
      </div>
    </div>
  );
}
