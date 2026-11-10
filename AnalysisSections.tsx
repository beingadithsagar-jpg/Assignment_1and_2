import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { NavigationSection, SavedResearchStudy } from '../types/research.ts';
import { computeStudyMetrics } from '../utils/reportFormatter.ts';
import { Button, Surface } from './ui.tsx';

export const StudyMetricsStrip: React.FC<{ study: SavedResearchStudy }> = ({ study }) => {
  const metrics = computeStudyMetrics(study);

  return (
    <Surface className="divide-y divide-border/35">
      <div className="grid grid-cols-1 divide-y divide-border/35 lg:grid-cols-12 lg:divide-x lg:divide-y-0">
        <div className="min-w-0 px-5 py-5 sm:px-6 lg:col-span-5">
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-display font-semibold tracking-tight text-foreground tabular-nums">
              {metrics.reportWords.toLocaleString()} words
            </span>
            <span className="text-label text-muted tabular-nums">
              · ~{metrics.estimatedReadingMinutes} min read
            </span>
          </div>
          <p className="mt-1.5 text-caption text-muted">
            Synthesized report length across 8 formal sections · {study.createdAtLabel}
          </p>
        </div>

        <div className="grid min-w-0 grid-cols-2 divide-x divide-y divide-border/35 sm:grid-cols-4 sm:divide-y-0 lg:col-span-7">
          <div className="min-w-0 px-4 py-4 sm:px-5">
            <span className="block text-title font-semibold text-foreground tabular-nums">
              {metrics.questionCount}
            </span>
            <span className="mt-1 block text-caption text-muted">
              Research questions formulated
            </span>
          </div>

          <div className="min-w-0 px-4 py-4 sm:px-5">
            <span className="block text-title font-semibold text-foreground tabular-nums">
              {metrics.themeCount}
            </span>
            <span className="mt-1 block text-caption text-muted">
              Literature themes ({metrics.groundedThemeCount} grounded)
            </span>
          </div>

          <div className="min-w-0 px-4 py-4 sm:px-5">
            <span className="block text-title font-semibold text-foreground tabular-nums">
              {metrics.gapCount}
            </span>
            <span className="mt-1 block text-caption text-muted">
              Research gaps identified
            </span>
          </div>

          <div className="min-w-0 px-4 py-4 sm:px-5">
            <span className="block text-title font-semibold text-foreground tabular-nums">
              {metrics.sourceWords > 0 ? metrics.sourceWords.toLocaleString() : 'No data'}
            </span>
            <span className="mt-1 block text-caption text-muted">
              Pasted source words analyzed
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2.5 px-5 py-3.5 sm:px-6">
        <span
          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
            study.hasProvidedMaterial ? 'bg-success' : 'bg-accent'
          }`}
          aria-hidden="true"
        />
        <p className="min-w-0 text-caption leading-relaxed text-muted">
          <strong className="font-semibold text-foreground">
            Source &amp; citation verification:
          </strong>{' '}
          {study.result.verificationNotice}
        </p>
      </div>
    </Surface>
  );
};

export const TopicOverviewSection: React.FC<{ study: SavedResearchStudy }> = ({ study }) => {
  const { topicOverview } = study.result;

  return (
    <Surface className="divide-y divide-border/35">
      <div className="px-5 py-4 sm:px-6">
        <h2 className="text-section text-foreground">Research topic analysis</h2>
        <p className="mt-0.5 text-caption text-muted">
          Conceptual scope, academic significance, and foundational terminology
        </p>
      </div>

      <div className="px-5 py-5 sm:px-6">
        <p className="max-w-[68ch] font-serif text-[1.0625rem] leading-relaxed text-foreground">
          {topicOverview.summary}
        </p>
      </div>

      <div className="grid grid-cols-1 divide-y divide-border/35 md:grid-cols-2 md:divide-x md:divide-y-0">
        <div className="min-w-0 px-5 py-4 sm:px-6">
          <h3 className="text-label font-semibold text-foreground">Academic significance</h3>
          <p className="mt-1.5 text-body leading-relaxed text-muted">
            {topicOverview.academicSignificance}
          </p>
        </div>

        <div className="min-w-0 px-5 py-4 sm:px-6">
          <h3 className="text-label font-semibold text-foreground">Scope &amp; analytical boundaries</h3>
          <p className="mt-1.5 text-body leading-relaxed text-muted">
            {topicOverview.scopeBoundaries}
          </p>
        </div>
      </div>

      <div className="px-5 py-4 sm:px-6">
        <h3 className="text-label font-semibold text-foreground">Core domain concepts</h3>
        <p className="mt-1.5 text-label leading-relaxed text-muted">
          {topicOverview.coreConcepts.join(' · ')}
        </p>
      </div>
    </Surface>
  );
};

export const ResearchQuestionsSection: React.FC<{ study: SavedResearchStudy }> = ({ study }) => {
  const { researchQuestions } = study.result;

  return (
    <Surface className="divide-y divide-border/35">
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-section text-foreground">Research questions</h2>
          <p className="mt-0.5 text-caption text-muted">
            Five investigable academic questions with analytical focus and study design hints
          </p>
        </div>
        <span className="text-caption text-muted tabular-nums">
          {researchQuestions.length} questions
        </span>
      </div>

      <ol className="divide-y divide-border/35">
        {researchQuestions.map((item, idx) => (
          <li key={idx} className="px-5 py-5 sm:px-6">
            <div className="flex items-start gap-4">
              <span className="mt-0.5 shrink-0 text-label font-semibold text-primary tabular-nums">
                RQ{idx + 1}
              </span>
              <div className="min-w-0 flex-1 space-y-2.5">
                <p className="max-w-[68ch] font-serif text-[1.0625rem] font-medium leading-snug text-foreground">
                  {item.question}
                </p>
                <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
                  <div className="min-w-0">
                    <span className="block text-caption font-semibold text-foreground">
                      Analytical focus
                    </span>
                    <span className="mt-0.5 block text-label text-muted">
                      {item.analyticalFocus}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <span className="block text-caption font-semibold text-foreground">
                      Suggested methodology
                    </span>
                    <span className="mt-0.5 block text-label text-muted">
                      {item.methodologyHint}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Surface>
  );
};

export const LiteratureReviewSection: React.FC<{ study: SavedResearchStudy }> = ({ study }) => {
  const { literatureReviewThemes } = study.result;

  return (
    <Surface className="divide-y divide-border/35">
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-section text-foreground">Thematic literature review</h2>
          <p className="mt-0.5 text-caption text-muted">
            Findings organized into analytical themes with explicit source-grounding status
          </p>
        </div>
        <span className="text-caption text-muted tabular-nums">
          {literatureReviewThemes.length} themes
        </span>
      </div>

      <div className="divide-y divide-border/35">
        {literatureReviewThemes.map((themeItem, idx) => {
          const isGrounded = themeItem.sourceStatus === 'Grounded in provided material';
          return (
            <article key={idx} className="space-y-3 px-5 py-5 sm:px-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-serif text-[1.0625rem] font-semibold text-foreground">
                  {idx + 1}. {themeItem.theme}
                </h3>
                <span className="text-caption text-muted">
                  <span
                    className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle ${
                      isGrounded ? 'bg-success' : 'bg-accent'
                    }`}
                  />
                  {themeItem.sourceStatus}
                </span>
              </div>

              <p className="max-w-[68ch] text-body leading-relaxed text-foreground">
                {themeItem.synthesis}
              </p>

              {themeItem.keyFindings.length > 0 && (
                <ul className="space-y-1.5 pt-1">
                  {themeItem.keyFindings.map((finding, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-label text-muted">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted" />
                      <span className="min-w-0 max-w-[68ch] leading-relaxed">{finding}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </div>
    </Surface>
  );
};

export const ResearchGapsSection: React.FC<{ study: SavedResearchStudy }> = ({ study }) => {
  const { researchGaps } = study.result;

  return (
    <Surface className="divide-y divide-border/35">
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-section text-foreground">Research gap identification</h2>
          <p className="mt-0.5 text-caption text-muted">
            Methodological, empirical, and deployment limitations identified in current research
          </p>
        </div>
        <span className="text-caption text-muted tabular-nums">
          {researchGaps.length} gaps
        </span>
      </div>

      <div className="divide-y divide-border/35">
        {researchGaps.map((gap, idx) => (
          <article key={idx} className="space-y-2.5 px-5 py-5 sm:px-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-serif text-[1.0625rem] font-semibold text-foreground">
                {gap.gapTitle}
              </h3>
              <span className="text-caption text-muted">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
                {gap.category}
              </span>
            </div>

            <p className="max-w-[68ch] text-body leading-relaxed text-foreground">
              {gap.limitationAnalysis}
            </p>

            <p className="text-caption text-muted">
              <strong className="font-semibold text-foreground">Evidence basis:</strong>{' '}
              {gap.evidenceBasis}
            </p>
          </article>
        ))}
      </div>
    </Surface>
  );
};

export const FutureScopeSection: React.FC<{
  study: SavedResearchStudy;
  onOpenFullReport?: (section: NavigationSection) => void;
}> = ({ study, onOpenFullReport }) => {
  const { futureScope } = study.result;

  return (
    <Surface className="divide-y divide-border/35">
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-section text-foreground">Future research scope</h2>
          <p className="mt-0.5 text-caption text-muted">
            Recommended research directions, methodological strategies, and scholarly impact
          </p>
        </div>
        <span className="text-caption text-muted tabular-nums">
          {futureScope.length} directions
        </span>
      </div>

      <div className="divide-y divide-border/35">
        {futureScope.map((item, idx) => (
          <article key={idx} className="space-y-2.5 px-5 py-5 sm:px-6">
            <h3 className="font-serif text-[1.0625rem] font-semibold text-foreground">
              {idx + 1}. {item.direction}
            </h3>
            <div className="grid grid-cols-1 gap-4 pt-1 md:grid-cols-2">
              <div className="min-w-0">
                <span className="block text-caption font-semibold text-foreground">
                  Proposed methodological approach
                </span>
                <p className="mt-1 text-label leading-relaxed text-muted">
                  {item.proposedApproach}
                </p>
              </div>
              <div className="min-w-0">
                <span className="block text-caption font-semibold text-foreground">
                  Expected scholarly &amp; practical impact
                </span>
                <p className="mt-1 text-label leading-relaxed text-muted">
                  {item.expectedImpact}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {onOpenFullReport && (
        <div className="no-print flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6">
          <span className="text-caption text-muted">
            Ready to review or export the cohesive 8-section academic manuscript?
          </span>
          <Button tone="quiet" onClick={() => onOpenFullReport('full-report')}>
            <span>Open structured research report</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Surface>
  );
};
