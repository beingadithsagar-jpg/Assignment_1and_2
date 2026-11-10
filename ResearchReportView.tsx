import React from 'react';
import { Check, Copy, Download, Printer } from 'lucide-react';
import type { SavedResearchStudy } from '../types/research.ts';
import { computeStudyMetrics } from '../utils/reportFormatter.ts';
import { Button, Surface } from './ui.tsx';

interface ResearchReportViewProps {
  study: SavedResearchStudy;
  copied: boolean;
  onCopyReport: () => void;
  onDownloadMarkdown: () => void;
  onDownloadText: () => void;
}

const REPORT_CHAPTERS = [
  { id: 'report-abstract', label: '1. Abstract' },
  { id: 'report-introduction', label: '2. Introduction' },
  { id: 'report-objectives', label: '3. Objectives' },
  { id: 'report-questions', label: '4. Questions' },
  { id: 'report-literature', label: '5. Literature review' },
  { id: 'report-gaps', label: '6. Research gaps' },
  { id: 'report-conclusion', label: '7. Conclusion' },
  { id: 'report-future', label: '8. Future scope' },
];

export const ResearchReportView: React.FC<ResearchReportViewProps> = ({
  study,
  copied,
  onCopyReport,
  onDownloadMarkdown,
  onDownloadText,
}) => {
  const { report, verificationNotice } = study.result;
  const metrics = computeStudyMetrics(study);

  return (
    <Surface className="divide-y divide-border/35">
      <div className="no-print flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="text-caption font-semibold text-foreground">Jump to section:</span>
          {REPORT_CHAPTERS.map((ch) => (
            <a
              key={ch.id}
              href={`#${ch.id}`}
              className="whitespace-nowrap rounded-control px-2 py-1 text-caption font-medium text-muted transition-colors hover:bg-background hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
            >
              {ch.label}
            </a>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button tone="quiet" onClick={onCopyReport}>
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied report' : 'Copy Report'}</span>
          </Button>
          <Button tone="quiet" onClick={onDownloadText}>
            <Download className="h-4 w-4" />
            <span>Download (.txt)</span>
          </Button>
          <Button tone="primary" onClick={onDownloadMarkdown}>
            <Download className="h-4 w-4" />
            <span>Download Report (.md)</span>
          </Button>
          <Button
            tone="quiet"
            onClick={() => window.print()}
            aria-label="Print or save report as PDF"
          >
            <Printer className="h-4 w-4" />
            <span>Print / PDF</span>
          </Button>
        </div>
      </div>

      <article className="divide-y divide-border/35">
        <header className="px-5 py-7 sm:px-10 sm:py-9">
          <p className="text-caption font-medium text-muted">
            Structured Academic Research Report · {study.createdAtLabel} ·{' '}
            {metrics.reportWords.toLocaleString()} words (~{metrics.estimatedReadingMinutes} min read)
          </p>
          <h2 className="mt-2 max-w-[30ch] font-serif text-display font-semibold text-foreground">
            {study.topic}
          </h2>
          <p className="mt-4 max-w-[68ch] text-caption leading-relaxed text-muted">
            <span
              className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle ${
                study.hasProvidedMaterial ? 'bg-success' : 'bg-accent'
              }`}
            />
            <strong className="font-semibold text-foreground">Verification status:</strong>{' '}
            {verificationNotice}
          </p>
        </header>

        <section id="report-abstract" className="scroll-mt-6 px-5 py-6 sm:px-10 sm:py-7">
          <h3 className="text-section text-foreground">1. Abstract</h3>
          <p className="mt-3 max-w-[68ch] font-serif text-[1.0625rem] leading-[1.68] text-foreground">
            {report.abstract}
          </p>
        </section>

        <section id="report-introduction" className="scroll-mt-6 px-5 py-6 sm:px-10 sm:py-7">
          <h3 className="text-section text-foreground">2. Introduction</h3>
          <p className="mt-3 max-w-[68ch] font-serif text-[1.0625rem] leading-[1.68] text-foreground">
            {report.introduction}
          </p>
        </section>

        <section id="report-objectives" className="scroll-mt-6 px-5 py-6 sm:px-10 sm:py-7">
          <h3 className="text-section text-foreground">3. Research objectives</h3>
          <ol className="mt-3 max-w-[68ch] space-y-2.5">
            {report.researchObjectives.map((obj, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 font-serif text-[1.0625rem] leading-[1.65] text-foreground"
              >
                <span className="mt-0.5 shrink-0 font-sans text-label font-semibold text-primary tabular-nums">
                  {idx + 1}.
                </span>
                <span className="min-w-0">{obj}</span>
              </li>
            ))}
          </ol>
        </section>

        <section id="report-questions" className="scroll-mt-6 px-5 py-6 sm:px-10 sm:py-7">
          <h3 className="text-section text-foreground">4. Research questions</h3>
          <ol className="mt-3 max-w-[68ch] space-y-2.5">
            {report.researchQuestions.map((rq, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 font-serif text-[1.0625rem] leading-[1.65] text-foreground"
              >
                <span className="mt-0.5 shrink-0 font-sans text-label font-semibold text-primary tabular-nums">
                  RQ{idx + 1}.
                </span>
                <span className="min-w-0">{rq}</span>
              </li>
            ))}
          </ol>
        </section>

        <section id="report-literature" className="scroll-mt-6 px-5 py-6 sm:px-10 sm:py-7">
          <h3 className="text-section text-foreground">5. Literature review</h3>
          <p className="mt-3 max-w-[68ch] whitespace-pre-line font-serif text-[1.0625rem] leading-[1.68] text-foreground">
            {report.literatureReview}
          </p>
        </section>

        <section id="report-gaps" className="scroll-mt-6 px-5 py-6 sm:px-10 sm:py-7">
          <h3 className="text-section text-foreground">6. Research gaps</h3>
          <p className="mt-3 max-w-[68ch] whitespace-pre-line font-serif text-[1.0625rem] leading-[1.68] text-foreground">
            {report.researchGaps}
          </p>
        </section>

        <section id="report-conclusion" className="scroll-mt-6 px-5 py-6 sm:px-10 sm:py-7">
          <h3 className="text-section text-foreground">7. Conclusion</h3>
          <p className="mt-3 max-w-[68ch] whitespace-pre-line font-serif text-[1.0625rem] leading-[1.68] text-foreground">
            {report.conclusion}
          </p>
        </section>

        <section id="report-future" className="scroll-mt-6 px-5 py-6 sm:px-10 sm:py-7">
          <h3 className="text-section text-foreground">8. Future scope</h3>
          <p className="mt-3 max-w-[68ch] whitespace-pre-line font-serif text-[1.0625rem] leading-[1.68] text-foreground">
            {report.futureScope}
          </p>
        </section>
      </article>
    </Surface>
  );
};
