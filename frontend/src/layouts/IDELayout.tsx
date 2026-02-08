import type { ReactNode } from 'react';
import { Panel, Group, Separator } from 'react-resizable-panels';
import Toolbar from '../components/shared/Toolbar';
import StatusBar from '../components/shared/StatusBar';

interface IDELayoutProps {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  bottom?: ReactNode;
  onLogoClick?: () => void;
  connected: boolean;
  lastSync: Date | null;
  interviewCount: number;
}

function ResizeHandle({ orientation }: { orientation: 'horizontal' | 'vertical' }) {
  const isHorizontal = orientation === 'horizontal';
  return (
    <Separator
      className={`group relative flex items-center justify-center ${
        isHorizontal ? 'w-px' : 'h-px'
      }`}
    >
      <div
        className={`${
          isHorizontal ? 'h-full w-px cursor-col-resize' : 'h-px w-full cursor-row-resize'
        } bg-border-primary transition-colors group-hover:bg-accent-cyan group-[[data-separator-active]]:bg-accent-cyan`}
      />
    </Separator>
  );
}

function Placeholder({ label }: { label: string }) {
  return (
    <div className="flex h-full items-center justify-center text-sm text-text-tertiary">
      {label}
    </div>
  );
}

export default function IDELayout({ left, center, right, bottom, onLogoClick, connected, lastSync, interviewCount }: IDELayoutProps) {
  return (
    <div className="flex h-screen flex-col">
      <Toolbar onLogoClick={onLogoClick} connected={connected} interviewCount={interviewCount} />
      <div className="flex-1 overflow-hidden">
        <Group orientation="vertical">
          <Panel>
            <Group orientation="horizontal">
              <Panel defaultSize="22%" minSize="15%" maxSize="31%">
                {left || <Placeholder label="Left Panel" />}
              </Panel>
              <ResizeHandle orientation="horizontal" />
              <Panel minSize="31%">
                {center || <Placeholder label="Center Panel" />}
              </Panel>
              <ResizeHandle orientation="horizontal" />
              <Panel defaultSize="25%" minSize="15%" maxSize="31%">
                {right || <Placeholder label="Right Panel" />}
              </Panel>
            </Group>
          </Panel>
          <ResizeHandle orientation="vertical" />
          <Panel defaultSize="30%" minSize="20%" collapsible collapsedSize="0%">
            {bottom || <Placeholder label="Bottom Panel" />}
          </Panel>
        </Group>
      </div>
      <StatusBar connected={connected} lastSync={lastSync} interviewCount={interviewCount} />
    </div>
  );
}
