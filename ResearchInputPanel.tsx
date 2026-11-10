import React from 'react';
import { Loader2, RotateCcw, Sparkles } from 'lucide-react';
import { QUICK_RESEARCH_PRESETS, type QuickResearchPreset } from '../data/seedStudies.ts';
import { countWords } from '../utils/reportFormatter.ts';
import { Button, Field, Surface } from './ui.tsx';

interface ResearchInputPanelProps {
  topic: string;
  sourceMaterial: string;
  onTopicChange: (value: string) => void;
  onSourceMaterialChange: (value: string) => void;
  onGenerate: (e: React.FormEvent) => void;
  onClearReset: () => void;
  onApplyPreset: (preset: QuickResearchPreset) => void;
  isGenerating: boolean;
  elapsedSeconds: number;
}

export const ResearchInputPanel: React.FC<ResearchInputPanelProps> = ({
  topic,
  sourceMaterial,
  onTopicChange,
  onSourceMaterialChange,
  onGenerate,
  onClearReset,
  onApplyPreset,
  isGenerating,
  elapsedSeconds,
}) => {
  const materialWordCount = countWords(sourceMaterial);
  const canGenerate = topic.trim().length > 0 && !isGenerating;

  return (
    <Surface className="no-print divide-y divide-border/35">
      <div className="px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-section text-foreground">Research query &amp; source corpus</h2>
          <span className="text-caption text-muted">
            {materialWordCount > 0
              ? `Grounding mode · ${materialWordCount.toLocaleString()} source words supplied`
              : 'Grounding mode · Topic synthesis (no excerpt pasted)'}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-caption font-medium text-muted">Load research preset:</span>
          {QUICK_RESEARCH_PRESETS.map((preset) => {
            const isMatchingTopic = topic.trim().toLowerCase() === preset.topic.toLowerCase();
            return (
              <button
                key={preset.id}
                type="button"
                disabled={isGenerating}
                onClick={() => onApplyPreset(preset)}
                className={`min-h-8 rounded-control border px-2.5 py-1 text-caption font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50 ${
                  isMatchingTopic
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border/45 bg-surface text-foreground hover:bg-background'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={onGenerate} className="space-y-5 px-5 py-5 sm:px-6">
        <Field
          id="research-topic-input"
          label="Research topic"
          hint="Enter a specific academic topic, thesis question, or interdisciplinary domain."
          meta={`${topic.trim().length}/400 chars`}
        >
          <input
            id="research-topic-input"
            type="text"
            maxLength={400}
            value={topic}
            disabled={isGenerating}
            onChange={(e) => onTopicChange(e.target.value)}
            placeholder="e.g., Explainable AI in Healthcare, Machine Learning in Agriculture, Solid-State Lithium Electrolytes"
            className="min-h-11 w-full rounded-control border border-border/50 bg-background px-3.5 py-2 text-body text-foreground placeholder:text-muted/70 focus:border-primary focus:outline-2 focus:outline-offset-0 focus:outline-primary disabled:opacity-60"
          />
        </Field>

        <Field
          id="research-paper-content"
          label="Research paper content or literature notes (optional)"
          hint="Paste an abstract, methodology, empirical findings, or multiple paper excerpts. Only facts present in your text will be attributed directly; unverified external references are flagged."
          meta={`${materialWordCount.toLocaleString()} words`}
        >
          <textarea
            id="research-paper-content"
            rows={6}
            value={sourceMaterial}
            disabled={isGenerating}
            onChange={(e) => onSourceMaterialChange(e.target.value)}
            placeholder="Paste research paper abstract, key sections, or literature excerpts here to summarize themes and extract grounded research gaps..."
            className="w-full resize-y rounded-control border border-border/50 bg-background px-3.5 py-3 text-body leading-relaxed text-foreground placeholder:text-muted/70 focus:border-primary focus:outline-2 focus:outline-offset-0 focus:outline-primary disabled:opacity-60"
          />
        </Field>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/35 pt-4">
          <div className="min-w-0 text-caption text-muted">
            {isGenerating ? (
              <span role="status" className="inline-flex items-center gap-2 font-medium text-primary">
                <Loader2 className="h-4 w-4 animate-spin" />
                Applying few-shot academic synthesis ({elapsedSeconds}s elapsed)…
              </span>
            ) : !topic.trim() ? (
              <span>Enter a research topic above to enable synthesis.</span>
            ) : (
              <span>
                Generates topic analysis, 5 research questions, thematic review, gaps, future scope, and 8-part report.
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              tone="quiet"
              type="button"
              onClick={onClearReset}
              disabled={isGenerating || (!topic && !sourceMaterial)}
            >
              <RotateCcw className="h-4 w-4" />
              <span>Clear / Reset</span>
            </Button>

            <Button tone="primary" type="submit" disabled={!canGenerate}>
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating research…</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Research</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Surface>
  );
};
