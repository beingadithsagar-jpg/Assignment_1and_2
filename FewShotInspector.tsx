import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
  FEW_SHOT_EXEMPLARS,
  RESEARCH_SYSTEM_INSTRUCTION,
  formatUserResearchPrompt,
} from '../shared/fewShotPrompt.ts';
import { Button, Surface } from './ui.tsx';

interface FewShotInspectorProps {
  currentTopic: string;
  currentMaterial: string;
  onLoadExampleIntoWorkspace: (topic: string) => void;
}

type InspectorTab = 'exemplar-1' | 'exemplar-2' | 'live-prompt';

export const FewShotInspector: React.FC<FewShotInspectorProps> = ({
  currentTopic,
  currentMaterial,
  onLoadExampleIntoWorkspace,
}) => {
  const [selectedTab, setSelectedTab] = useState<InspectorTab>('exemplar-1');

  const ex1 = FEW_SHOT_EXEMPLARS[0];
  const ex2 = FEW_SHOT_EXEMPLARS[1];

  const activeExemplar = selectedTab === 'exemplar-2' ? ex2 : ex1;

  const livePromptPreview = JSON.stringify(
    {
      systemInstruction: RESEARCH_SYSTEM_INSTRUCTION,
      fewShotTurns: [
        {
          turn: 1,
          role: 'user',
          inputTopic: ex1.inputTopic,
          expectedPattern: ex1.summaryExpectation,
        },
        {
          turn: 2,
          role: 'model',
          structuredJsonKeys: Object.keys(ex1.expectedOutput),
        },
        {
          turn: 3,
          role: 'user',
          inputTopic: ex2.inputTopic,
          expectedPattern: ex2.summaryExpectation,
        },
        {
          turn: 4,
          role: 'model',
          structuredJsonKeys: Object.keys(ex2.expectedOutput),
        },
        {
          turn: 5,
          role: 'user (Active Request)',
          prompt: formatUserResearchPrompt(
            currentTopic || 'Enter a research topic in the workspace',
            currentMaterial
          ),
        },
      ],
    },
    null,
    2
  );

  return (
    <div className="space-y-6">
      <Surface className="divide-y divide-border/35">
        <div className="px-5 py-5 sm:px-6">
          <h2 className="text-section text-foreground">
            Few-shot prompting architecture &amp; academic integrity rules
          </h2>
          <p className="mt-1.5 max-w-[70ch] text-body leading-relaxed text-muted">
            Every synthesis request conditions the model with two complete scholarly few-shot
            input-output pairs before evaluating your research topic and pasted paper text. This
            multi-turn exemplar design enforces consistent analytical depth, thematic grouping,
            five targeted research questions, an 8-part formal report, and strict non-fabrication
            of unverified citations.
          </p>
        </div>

        <div className="grid grid-cols-1 divide-y divide-border/35 md:grid-cols-2 md:divide-x md:divide-y-0">
          {[ex1, ex2].map((exemplar, index) => (
            <div key={exemplar.id} className="flex min-w-0 flex-col justify-between gap-4 px-5 py-5 sm:px-6">
              <div className="space-y-2">
                <p className="text-caption font-medium text-muted">
                  Exemplar {index + 1} · Multi-turn conditioning pair
                </p>
                <h3 className="font-serif text-[1.125rem] font-semibold text-foreground">
                  Input: {exemplar.inputTopic}
                </h3>
                <p className="text-label leading-relaxed text-muted">
                  <strong className="font-semibold text-foreground">Expected structure:</strong>{' '}
                  {exemplar.summaryExpectation}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Button
                  tone="quiet"
                  onClick={() => onLoadExampleIntoWorkspace(exemplar.inputTopic)}
                >
                  <span>Test topic in workspace</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Surface>

      <Surface className="divide-y divide-border/35">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6">
          <div>
            <h3 className="text-section text-foreground">Inspect few-shot prompt payload</h3>
            <p className="mt-0.5 text-caption text-muted">
              Examine the exact exemplar JSON responses and live multi-turn sequence sent to the server
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Few-shot payload views">
            <Button
              tone={selectedTab === 'exemplar-1' ? 'primary' : 'quiet'}
              role="tab"
              aria-selected={selectedTab === 'exemplar-1'}
              onClick={() => setSelectedTab('exemplar-1')}
            >
              Example 1: Healthcare XAI
            </Button>
            <Button
              tone={selectedTab === 'exemplar-2' ? 'primary' : 'quiet'}
              role="tab"
              aria-selected={selectedTab === 'exemplar-2'}
              onClick={() => setSelectedTab('exemplar-2')}
            >
              Example 2: Agricultural ML
            </Button>
            <Button
              tone={selectedTab === 'live-prompt' ? 'primary' : 'quiet'}
              role="tab"
              aria-selected={selectedTab === 'live-prompt'}
              onClick={() => setSelectedTab('live-prompt')}
            >
              Live 5-turn payload
            </Button>
          </div>
        </div>

        <div className="px-5 py-5 sm:px-6">
          {selectedTab !== 'live-prompt' ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-label font-semibold text-foreground">
                  User turn ({activeExemplar.label})
                </p>
                <p className="text-label text-muted">
                  Topic: <span className="font-medium text-foreground">{activeExemplar.inputTopic}</span> ·{' '}
                  {activeExemplar.summaryExpectation}
                </p>
              </div>

              <Surface inset className="overflow-x-auto p-4">
                <pre className="font-mono text-caption leading-relaxed text-foreground">
                  {JSON.stringify(activeExemplar.expectedOutput, null, 2)}
                </pre>
              </Surface>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-label text-muted">
                Complete multi-turn prompt sequence combining the academic system mandate, both
                few-shot exemplars, and your active workspace query:
              </p>
              <Surface inset className="overflow-x-auto p-4">
                <pre className="font-mono text-caption leading-relaxed text-foreground">
                  {livePromptPreview}
                </pre>
              </Surface>
            </div>
          )}
        </div>
      </Surface>
    </div>
  );
};
