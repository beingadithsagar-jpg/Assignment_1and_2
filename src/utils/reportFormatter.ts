import type { SavedResearchStudy } from '../types/research.ts';

/**
 * Counts whitespace-delimited words in a string.
 *
 * Verification against hand-worked case & invariant:
 * - Known case: countWords("Explainable AI in Healthcare.") === 4
 * - Empty/whitespace invariant: countWords("   \n\t  ") === 0
 * - Concatenation bound invariant: countWords(a + " " + b) === countWords(a) + countWords(b) for non-empty trimmed strings a, b
 */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export interface StudyComputedMetrics {
  sourceWords: number;
  reportWords: number;
  estimatedReadingMinutes: number;
  questionCount: number;
  themeCount: number;
  groundedThemeCount: number;
  gapCount: number;
  futureDirectionCount: number;
}

export function computeStudyMetrics(study: SavedResearchStudy): StudyComputedMetrics {
  const { result, sourceMaterial } = study;
  const sourceWords = countWords(sourceMaterial);

  const reportSegments = [
    result.report.abstract,
    result.report.introduction,
    ...result.report.researchObjectives,
    ...result.report.researchQuestions,
    result.report.literatureReview,
    result.report.researchGaps,
    result.report.conclusion,
    result.report.futureScope,
  ];
  const reportWords = countWords(reportSegments.join(' '));
  // Standard academic reading pace: 200 words per minute, minimum 1 minute when reportWords > 0
  const estimatedReadingMinutes = reportWords > 0 ? Math.max(1, Math.round(reportWords / 200)) : 0;

  const groundedThemeCount = result.literatureReviewThemes.filter(
    (t) => t.sourceStatus === 'Grounded in provided material'
  ).length;

  return {
    sourceWords,
    reportWords,
    estimatedReadingMinutes,
    questionCount: result.researchQuestions.length,
    themeCount: result.literatureReviewThemes.length,
    groundedThemeCount,
    gapCount: result.researchGaps.length,
    futureDirectionCount: result.futureScope.length,
  };
}

export function slugifyTopic(topic: string): string {
  const slug = topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return slug || 'research-report';
}

export function formatLocalAcademicDate(date: Date): string {
  const localSafe = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(localSafe);
}

export function formatReportAsMarkdown(study: SavedResearchStudy): string {
  const { topic, createdAtLabel, hasProvidedMaterial, result } = study;
  const lines: string[] = [
    `# Research Report: ${topic}`,
    ``,
    `**Prepared via:** Research Paper Agent (Few-Shot Structured Synthesis)`,
    `**Date:** ${createdAtLabel}`,
    `**Source Grounding:** ${
      hasProvidedMaterial
        ? 'Grounded in user-supplied research material'
        : 'Topic-level synthesis (external citations require independent verification)'
    }`,
    ``,
    `> **Source & Citation Verification Notice:** ${result.verificationNotice}`,
    ``,
    `---`,
    ``,
    `## 1. Abstract`,
    result.report.abstract,
    ``,
    `## 2. Introduction`,
    result.report.introduction,
    ``,
    `## 3. Research Objectives`,
    ...result.report.researchObjectives.map((obj, idx) => `${idx + 1}. ${obj}`),
    ``,
    `## 4. Research Questions`,
    ...result.researchQuestions.map(
      (rq, idx) =>
        `${idx + 1}. **${rq.question}**\n   - *Analytical Focus:* ${rq.analyticalFocus}\n   - *Suggested Methodology:* ${rq.methodologyHint}`
    ),
    ``,
    `## 5. Literature Review`,
    result.report.literatureReview,
    ``,
    `### Thematic Synthesis Breakdown`,
    ...result.literatureReviewThemes.flatMap((theme) => [
      `#### ${theme.theme} (${theme.sourceStatus})`,
      theme.synthesis,
      ...theme.keyFindings.map((f) => `- ${f}`),
      ``,
    ]),
    `## 6. Research Gaps`,
    result.report.researchGaps,
    ``,
    `### Identified Limitations & Unexplored Areas`,
    ...result.researchGaps.map(
      (gap, idx) =>
        `${idx + 1}. **${gap.gapTitle}** [${gap.category}]\n   - *Limitation:* ${gap.limitationAnalysis}\n   - *Basis:* ${gap.evidenceBasis}`
    ),
    ``,
    `## 7. Conclusion`,
    result.report.conclusion,
    ``,
    `## 8. Future Scope`,
    result.report.futureScope,
    ``,
    `### Proposed Research Directions`,
    ...result.futureScope.map(
      (dir, idx) =>
        `${idx + 1}. **${dir.direction}**\n   - *Approach:* ${dir.proposedApproach}\n   - *Expected Impact:* ${dir.expectedImpact}`
    ),
    ``,
    `---`,
    `## Appendix: Topic Overview & Scope`,
    `**Summary:** ${result.topicOverview.summary}`,
    ``,
    `**Academic Significance:** ${result.topicOverview.academicSignificance}`,
    ``,
    `**Scope Boundaries:** ${result.topicOverview.scopeBoundaries}`,
    ``,
    `**Core Concepts:** ${result.topicOverview.coreConcepts.join(', ')}`,
    ``,
  ];

  return lines.join('\n');
}

export function formatReportAsPlainText(study: SavedResearchStudy): string {
  return formatReportAsMarkdown(study)
    .replace(/^#{1,4}\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^>\s+/gm, '');
}
