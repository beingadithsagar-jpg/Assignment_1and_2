import React, { useEffect } from 'react';
import {
  BookOpen,
  Compass,
  FileText,
  FlaskConical,
  Layers,
  Trash2,
  X,
} from 'lucide-react';
import type { NavigationSection, SavedResearchStudy } from '../types/research.ts';
import { Button } from './ui.tsx';

interface SidebarProps {
  activeSection: NavigationSection;
  onSelectSection: (section: NavigationSection) => void;
  studies: SavedResearchStudy[];
  activeStudyId: string;
  onSelectStudy: (study: SavedResearchStudy) => void;
  onDeleteStudy: (id: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS: Array<{
  id: NavigationSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'workspace', label: 'Research workspace', icon: Compass },
  { id: 'topic-questions', label: 'Topic & questions', icon: BookOpen },
  { id: 'literature-gaps', label: 'Literature & gaps', icon: Layers },
  { id: 'full-report', label: 'Structured report', icon: FileText },
  { id: 'few-shot-prompting', label: 'Few-shot methodology', icon: FlaskConical },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  studies,
  activeStudyId,
  onSelectStudy,
  onDeleteStudy,
  mobileOpen,
  onCloseMobile,
}) => {
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen, onCloseMobile]);

  const navContent = (
    <div className="flex h-full min-h-0 flex-col divide-y divide-border/35 bg-surface">
      <div className="flex items-center justify-between gap-3 px-5 py-5">
        <div className="min-w-0">
          <span className="block font-serif text-lg font-semibold tracking-tight text-foreground">
            Research Paper Agent
          </span>
          <span className="block text-caption text-muted">
            Academic synthesis &amp; report studio
          </span>
        </div>
        {mobileOpen && (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-control text-muted hover:bg-background hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav aria-label="Research sections" className="px-3 py-4">
        <p className="px-2.5 pb-2 text-caption font-medium text-muted">
          Analysis views
        </p>
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelectSection(item.id);
                    onCloseMobile();
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex min-h-11 w-full items-center gap-3 whitespace-nowrap rounded-control px-3 text-label font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-background'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        <div className="flex items-baseline justify-between px-2.5 pb-2">
          <span className="text-caption font-medium text-muted">Saved studies</span>
          <span className="text-caption text-muted tabular-nums">{studies.length}</span>
        </div>
        <ul className="divide-y divide-border/25">
          {studies.map((study) => {
            const isSelected = study.id === activeStudyId;
            return (
              <li key={study.id} className="py-1">
                <div className="group flex items-start gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectStudy(study);
                      onCloseMobile();
                    }}
                    title={study.topic}
                    className={`min-w-0 flex-1 rounded-control px-2.5 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
                      isSelected ? 'bg-background font-medium text-primary' : 'hover:bg-background'
                    }`}
                  >
                    <span className="line-clamp-2 block text-label leading-snug text-foreground">
                      {study.topic}
                    </span>
                    <span className="mt-1 block text-caption text-muted">
                      <span
                        className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle ${
                          study.hasProvidedMaterial ? 'bg-success' : 'bg-accent'
                        }`}
                      />
                      {study.createdAtLabel} ·{' '}
                      {study.hasProvidedMaterial ? 'Source text' : 'Topic synthesis'}
                    </span>
                  </button>
                  {studies.length > 1 && (
                    <Button
                      tone="ghost"
                      onClick={() => onDeleteStudy(study.id)}
                      aria-label={`Remove saved study ${study.topic}`}
                      title="Remove from saved studies"
                      className="mt-1 min-h-9 px-2 text-muted hover:text-danger"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="px-5 py-3.5">
        <p className="text-caption text-muted">
          Prompting architecture · Few-shot structured synthesis
        </p>
      </div>
    </div>
  );

  return (
    <>
      <aside className="no-print hidden w-72 shrink-0 border-r border-border/35 bg-surface md:sticky md:top-0 md:block md:h-dvh">
        {navContent}
      </aside>

      {mobileOpen && (
        <div
          className="no-print fixed inset-0 z-50 flex md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Workspace navigation"
        >
          <div
            className="fixed inset-0 bg-foreground/35"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 flex h-full w-72 max-w-[85vw] flex-col border-r border-border/40 bg-surface">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
