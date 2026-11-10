export interface TopicOverview {
  summary: string;
  coreConcepts: string[];
  academicSignificance: string;
  scopeBoundaries: string;
}

export interface ResearchQuestionItem {
  question: string;
  analyticalFocus: string;
  methodologyHint: string;
}

export interface LiteratureTheme {
  theme: string;
  synthesis: string;
  keyFindings: string[];
  sourceStatus: 'Grounded in provided material' | 'Domain synthesis — verify external citations';
}

export interface ResearchGap {
  gapTitle: string;
  category: 'Methodological' | 'Empirical' | 'Theoretical' | 'Practical deployment';
  limitationAnalysis: string;
  evidenceBasis: string;
}

export interface FutureDirection {
  direction: string;
  proposedApproach: string;
  expectedImpact: string;
}

export interface ResearchReport {
  abstract: string;
  introduction: string;
  researchObjectives: string[];
  researchQuestions: string[];
  literatureReview: string;
  researchGaps: string;
  conclusion: string;
  futureScope: string;
}

export interface ResearchAnalysisResult {
  topicOverview: TopicOverview;
  researchQuestions: ResearchQuestionItem[];
  literatureReviewThemes: LiteratureTheme[];
  researchGaps: ResearchGap[];
  futureScope: FutureDirection[];
  report: ResearchReport;
  verificationNotice: string;
}

export interface SavedResearchStudy {
  id: string;
  topic: string;
  sourceMaterial: string;
  createdAtLabel: string;
  hasProvidedMaterial: boolean;
  result: ResearchAnalysisResult;
}

export type NavigationSection =
  | 'workspace'
  | 'topic-questions'
  | 'literature-gaps'
  | 'full-report'
  | 'few-shot-prompting';
