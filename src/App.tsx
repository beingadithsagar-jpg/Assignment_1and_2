import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { AlertCircle, Check, Copy, Download, Loader2, Menu, RefreshCw } from 'lucide-react';
import {
  FutureScopeSection,
  LiteratureReviewSection,
  ResearchGapsSection,
  ResearchQuestionsSection,
  StudyMetricsStrip,
  TopicOverviewSection,
} from './components/AnalysisSections.tsx';
import { FewShotInspector } from './components/FewShotInspector.tsx';
import { ResearchInputPanel } from './components/ResearchInputPanel.tsx';
import { ResearchReportView } from './components/ResearchReportView.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { Button, Surface } from './components/ui.tsx';
import { INITIAL_SAVED_STUDIES, type QuickResearchPreset } from './data/seedStudies.ts';
import type {
  NavigationSection,
  ResearchAnalysisResult,
  SavedResearchStudy,
} from './types/research.ts';
import {
  formatLocalAcademicDate,
  formatReportAsMarkdown,
  formatReportAsPlainText,
  slugifyTopic,
} from './utils/reportFormatter.ts';

const STORAGE_KEY = 'research_paper_agent_studies_v1';

function loadStoredStudies(): SavedResearchStudy[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_SAVED_STUDIES;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return INITIAL_SAVED_STUDIES;
    }
    const valid = parsed.filter(
      (item): item is SavedResearchStudy =>
        Boolean(
          item &&
            typeof item === 'object' &&
            typeof (item as SavedResearchStudy).id === 'string' &&
            typeof (item as SavedResearchStudy).topic === 'string' &&
            (item as SavedResearchStudy).result?.report?.abstract
        )
    );
    return valid.length > 0 ? valid : INITIAL_SAVED_STUDIES;
  } catch {
    return INITIAL_SAVED_STUDIES;
  }
}

function saveStudiesToStorage(studies: SavedResearchStudy[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(studies));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

const SECTION_TITLES: Record<NavigationSection, { title: string; subtitle: string }> = {
  workspace: {
    title: 'Research Paper Agent',
    subtitle: 'Few-shot academic synthesis and structured reporting',
  },
  'topic-questions': {
    title: 'Topic analysis & research questions',
    subtitle: 'Conceptual framing and five investigable questions',
  },
  'literature-gaps': {
    title: 'Literature themes, gaps & future scope',
    subtitle: 'Thematic findings, limitations, and next directions',
  },
  'full-report': {
    title: 'Structured research report',
    subtitle: 'Eight-section formal academic manuscript view',
  },
  'few-shot-prompting': {
    title: 'Few-shot prompting methodology',
    subtitle: 'Multi-turn exemplars and citation verification rules',
  },
};

export default function App() {
  const [studies, setStudies] = useState<SavedResearchStudy[]>(() => loadStoredStudies());
  const [activeStudyId, setActiveStudyId] = useState<string>(() => {
    const initial = loadStoredStudies();
    return initial[0]?.id ?? INITIAL_SAVED_STUDIES[0].id;
  });

  const activeStudy = useMemo(
    () => studies.find((s) => s.id === activeStudyId) ?? studies[0] ?? INITIAL_SAVED_STUDIES[0],
    [studies, activeStudyId]
  );

  const [activeSection, setActiveSection] = useState<NavigationSection>('workspace');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [topic, setTopic] = useState<string>(() => activeStudy.topic);
  const [sourceMaterial, setSourceMaterial] = useState<string>(() => activeStudy.sourceMaterial);

  const [isGenerating, setIsGenerating] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [statusNotice, setStatusNotice] = useState<{
    message: string;
    undoLabel?: string;
    onUndo?: () => void;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    saveStudiesToStorage(studies);
  }, [studies]);

  useEffect(() => {
    if (!isGenerating) {
      setElapsedSeconds(0);
      return;
    }
    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isGenerating]);

  const showTransientStatus = useCallback(
    (message: string, undoLabel?: string, onUndo?: () => void) => {
      setStatusNotice({ message, undoLabel, onUndo });
    },
    []
  );

  const runGeneration = useCallback(
    async (targetTopic: string, targetMaterial: string) => {
      const cleanTopic = targetTopic.trim();
      if (!cleanTopic) {
        setErrorMessage('Please enter a research topic before generating a report.');
        return;
      }

      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsGenerating(true);
      setErrorMessage(null);
      setStatusNotice(null);

      try {
        const response = await fetch('/api/research/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: cleanTopic,
            sourceMaterial: targetMaterial.trim(),
          }),
          signal: controller.signal,
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            typeof payload?.error === 'string'
              ? payload.error
              : `Request failed with status ${response.status}.`
          );
        }

        const result = payload?.result as ResearchAnalysisResult | undefined;
        if (!result || !result.topicOverview || !result.report) {
          throw new Error(
            'Received an incomplete research structure from the server. Please try again.'
          );
        }

        const newStudy: SavedResearchStudy = {
          id: `study-${Date.now()}`,
          topic: cleanTopic,
          sourceMaterial: targetMaterial.trim(),
          createdAtLabel: formatLocalAcademicDate(new Date()),
          hasProvidedMaterial: targetMaterial.trim().length > 0,
          result,
        };

        setStudies((prev) => [newStudy, ...prev]);
        setActiveStudyId(newStudy.id);
        showTransientStatus(`Synthesized research report for "${cleanTopic}"`);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          showTransientStatus('Cancelled research synthesis request.');
          return;
        }
        const message =
          err instanceof Error
            ? err.message
            : 'An unexpected network error occurred while generating research.';
        setErrorMessage(message);
      } finally {
        setIsGenerating(false);
      }
    },
    [showTransientStatus]
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void runGeneration(topic, sourceMaterial);
  };

  const handleCancelGeneration = () => {
    abortControllerRef.current?.abort();
  };

  const handleClearReset = () => {
    const previousTopic = topic;
    const previousMaterial = sourceMaterial;
    setTopic('');
    setSourceMaterial('');
    setErrorMessage(null);
    showTransientStatus('Cleared topic and source material inputs.', 'Undo clear', () => {
      setTopic(previousTopic);
      setSourceMaterial(previousMaterial);
      setStatusNotice(null);
    });
  };

  const handleApplyPreset = (preset: QuickResearchPreset) => {
    setTopic(preset.topic);
    setSourceMaterial(preset.sourceMaterial);
    setErrorMessage(null);
    showTransientStatus(`Loaded preset "${preset.label}" into the input form.`);
  };

  const handleSelectStudy = (study: SavedResearchStudy) => {
    setActiveStudyId(study.id);
    setTopic(study.topic);
    setSourceMaterial(study.sourceMaterial);
    setErrorMessage(null);
  };

  const handleDeleteStudy = (id: string) => {
    const target = studies.find((s) => s.id === id);
    if (!target || studies.length <= 1) return;

    const remaining = studies.filter((s) => s.id !== id);
    setStudies(remaining);
    if (activeStudyId === id) {
      const next = remaining[0];
      setActiveStudyId(next.id);
      setTopic(next.topic);
      setSourceMaterial(next.sourceMaterial);
    }

    showTransientStatus(`Removed "${target.topic}" from saved studies.`, 'Undo', () => {
      setStudies((prev) => [target, ...prev]);
      setActiveStudyId(target.id);
      setStatusNotice(null);
    });
  };

  const handleCopyReport = async () => {
    const markdown = formatReportAsMarkdown(activeStudy);
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      showTransientStatus(`Copied full report for "${activeStudy.topic}" to clipboard.`);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setErrorMessage(
        'Clipboard access was blocked by the browser. Use Download Report to save the file directly.'
      );
    }
  };

  const triggerDownload = (content: string, extension: 'md' | 'txt', mimeType: string) => {
    const filename = `${slugifyTopic(activeStudy.topic)}-research-report.${extension}`;
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    showTransientStatus(`Downloaded "${filename}".`);
  };

  const handleDownloadMarkdown = () => {
    triggerDownload(
      formatReportAsMarkdown(activeStudy),
      'md',
      'text/markdown;charset=utf-8'
    );
  };

  const handleDownloadText = () => {
    triggerDownload(
      formatReportAsPlainText(activeStudy),
      'txt',
      'text/plain;charset=utf-8'
    );
  };

  const headerMeta = SECTION_TITLES[activeSection];

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-dvh w-full bg-background text-foreground">
        <Sidebar
          activeSection={activeSection}
          onSelectSection={setActiveSection}
          studies={studies}
          activeStudyId={activeStudy.id}
          onSelectStudy={handleSelectStudy}
          onDeleteStudy={handleDeleteStudy}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="no-print border-b border-border/35 bg-surface px-4 py-4 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <Button
                  tone="quiet"
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Open navigation sidebar"
                  className="px-2.5 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="min-w-0">
                  <h1 className="font-serif text-title font-semibold text-foreground">
                    {headerMeta.title}
                  </h1>
                  <p className="text-caption text-muted">{headerMeta.subtitle}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Button tone="quiet" onClick={handleCopyReport}>
                  {copied ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span>{copied ? 'Copied Report' : 'Copy Report'}</span>
                </Button>
                <Button tone="primary" onClick={handleDownloadMarkdown}>
                  <Download className="h-4 w-4" />
                  <span>Download Report</span>
                </Button>
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto max-w-6xl space-y-6">
              {statusNotice && (
                <div
                  role="status"
                  aria-live="polite"
                  className="no-print flex flex-wrap items-center justify-between gap-3 border-b border-border/35 pb-3 text-label text-foreground"
                >
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                    <span>{statusNotice.message}</span>
                  </span>
                  <div className="flex items-center gap-3">
                    {statusNotice.undoLabel && statusNotice.onUndo && (
                      <Button
                        tone="quiet"
                        onClick={statusNotice.onUndo}
                        className="min-h-8 px-3 py-1 text-caption"
                      >
                        {statusNotice.undoLabel}
                      </Button>
                    )}
                    <button
                      type="button"
                      onClick={() => setStatusNotice(null)}
                      className="text-caption font-medium text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {errorMessage && (
                <Surface className="no-print divide-y divide-border/35 border-danger/45">
                  <div
                    role="alert"
                    className="flex flex-wrap items-start justify-between gap-4 px-5 py-4 sm:px-6"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
                      <div className="min-w-0 space-y-1">
                        <h2 className="text-label font-semibold text-danger">
                          Unable to complete research synthesis
                        </h2>
                        <p className="text-label leading-relaxed text-foreground">
                          {errorMessage}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        tone="quiet"
                        onClick={() => void runGeneration(topic, sourceMaterial)}
                        disabled={isGenerating || !topic.trim()}
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Retry</span>
                      </Button>
                      <Button tone="ghost" onClick={() => setErrorMessage(null)}>
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </Surface>
              )}

              {activeSection === 'workspace' && (
                <ResearchInputPanel
                  topic={topic}
                  sourceMaterial={sourceMaterial}
                  onTopicChange={setTopic}
                  onSourceMaterialChange={setSourceMaterial}
                  onGenerate={handleFormSubmit}
                  onClearReset={handleClearReset}
                  onApplyPreset={handleApplyPreset}
                  isGenerating={isGenerating}
                  elapsedSeconds={elapsedSeconds}
                />
              )}

              {isGenerating && (
                <Surface className="no-print divide-y divide-border/35" aria-busy="true">
                  <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <div>
                        <p className="text-label font-semibold text-foreground">
                          Synthesizing structured research analysis for &ldquo;{topic.trim()}&rdquo;
                        </p>
                        <p className="text-caption text-muted">
                          Conditioning via multi-turn few-shot exemplars · {elapsedSeconds}s elapsed
                        </p>
                      </div>
                    </div>
                    <Button tone="quiet" onClick={handleCancelGeneration}>
                      Cancel request
                    </Button>
                  </div>
                  <div className="space-y-3 px-5 py-5 sm:px-6">
                    <div className="h-4 w-2/5 animate-pulse rounded bg-border/25" />
                    <div className="h-3.5 w-4/5 animate-pulse rounded bg-border/20" />
                    <div className="h-3.5 w-3/4 animate-pulse rounded bg-border/20" />
                  </div>
                </Surface>
              )}

              {activeSection === 'workspace' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 pt-1">
                    <h2 className="font-serif text-title font-semibold text-foreground">
                      Active dossier: {activeStudy.topic}
                    </h2>
                    <span className="text-caption text-muted">
                      {activeStudy.hasProvidedMaterial
                        ? 'Grounded in supplied paper text'
                        : 'Topic synthesis'}
                    </span>
                  </div>

                  <StudyMetricsStrip study={activeStudy} />
                  <TopicOverviewSection study={activeStudy} />
                  <ResearchQuestionsSection study={activeStudy} />
                  <LiteratureReviewSection study={activeStudy} />
                  <ResearchGapsSection study={activeStudy} />
                  <FutureScopeSection
                    study={activeStudy}
                    onOpenFullReport={setActiveSection}
                  />
                  <ResearchReportView
                    study={activeStudy}
                    copied={copied}
                    onCopyReport={handleCopyReport}
                    onDownloadMarkdown={handleDownloadMarkdown}
                    onDownloadText={handleDownloadText}
                  />
                </div>
              )}

              {activeSection === 'topic-questions' && (
                <div className="space-y-6">
                  <StudyMetricsStrip study={activeStudy} />
                  <TopicOverviewSection study={activeStudy} />
                  <ResearchQuestionsSection study={activeStudy} />
                </div>
              )}

              {activeSection === 'literature-gaps' && (
                <div className="space-y-6">
                  <StudyMetricsStrip study={activeStudy} />
                  <LiteratureReviewSection study={activeStudy} />
                  <ResearchGapsSection study={activeStudy} />
                  <FutureScopeSection
                    study={activeStudy}
                    onOpenFullReport={setActiveSection}
                  />
                </div>
              )}

              {activeSection === 'full-report' && (
                <ResearchReportView
                  study={activeStudy}
                  copied={copied}
                  onCopyReport={handleCopyReport}
                  onDownloadMarkdown={handleDownloadMarkdown}
                  onDownloadText={handleDownloadText}
                />
              )}

              {activeSection === 'few-shot-prompting' && (
                <FewShotInspector
                  currentTopic={topic}
                  currentMaterial={sourceMaterial}
                  onLoadExampleIntoWorkspace={(exampleTopic) => {
                    setTopic(exampleTopic);
                    setSourceMaterial('');
                    setActiveSection('workspace');
                    showTransientStatus(
                      `Loaded few-shot exemplar topic "${exampleTopic}" into workspace.`
                    );
                  }}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </MotionConfig>
  );
}
