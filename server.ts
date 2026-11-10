import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import {
  RESEARCH_SYSTEM_INSTRUCTION,
  buildFewShotContents,
} from './src/shared/fewShotPrompt.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

const RESEARCH_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    topicOverview: {
      type: Type.OBJECT,
      properties: {
        summary: {
          type: Type.STRING,
          description: 'Comprehensive academic overview of the research topic (3-5 sentences).',
        },
        coreConcepts: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '4 to 6 key technical or theoretical concepts defining the topic.',
        },
        academicSignificance: {
          type: Type.STRING,
          description: 'Why this research area matters academically and practically.',
        },
        scopeBoundaries: {
          type: Type.STRING,
          description: 'Analytical scope and boundaries of the investigation.',
        },
      },
      required: ['summary', 'coreConcepts', 'academicSignificance', 'scopeBoundaries'],
    },
    researchQuestions: {
      type: Type.ARRAY,
      description: 'Exactly 5 specific, investigable academic research questions.',
      items: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
            description: 'A clear, focused academic research question.',
          },
          analyticalFocus: {
            type: Type.STRING,
            description: 'The core variable relationship, mechanism, or tension examined.',
          },
          methodologyHint: {
            type: Type.STRING,
            description: 'Suggested empirical, computational, or qualitative research design.',
          },
        },
        required: ['question', 'analyticalFocus', 'methodologyHint'],
      },
    },
    literatureReviewThemes: {
      type: Type.ARRAY,
      description: '3 to 4 thematic clusters organizing existing research or user-provided material.',
      items: {
        type: Type.OBJECT,
        properties: {
          theme: {
            type: Type.STRING,
            description: 'Concise academic title of the literature theme.',
          },
          synthesis: {
            type: Type.STRING,
            description: 'Thematic synthesis of findings without fabricating citations or statistics.',
          },
          keyFindings: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '2 to 3 key analytical takeaways within this theme.',
          },
          sourceStatus: {
            type: Type.STRING,
            description:
              'Either "Grounded in provided material" (when directly derived from user text) or "Domain synthesis — verify external citations".',
          },
        },
        required: ['theme', 'synthesis', 'keyFindings', 'sourceStatus'],
      },
    },
    researchGaps: {
      type: Type.ARRAY,
      description: '3 to 4 research limitations and unexplored areas.',
      items: {
        type: Type.OBJECT,
        properties: {
          gapTitle: {
            type: Type.STRING,
            description: 'Concise statement of the research gap or limitation.',
          },
          category: {
            type: Type.STRING,
            description: 'One of: "Methodological", "Empirical", "Theoretical", or "Practical deployment".',
          },
          limitationAnalysis: {
            type: Type.STRING,
            description: 'Detailed explanation of what remains unresolved or limited.',
          },
          evidenceBasis: {
            type: Type.STRING,
            description: 'How this gap is supported by the provided text or domain landscape, noting verification needs.',
          },
        },
        required: ['gapTitle', 'category', 'limitationAnalysis', 'evidenceBasis'],
      },
    },
    futureScope: {
      type: Type.ARRAY,
      description: '3 to 4 actionable future research directions.',
      items: {
        type: Type.OBJECT,
        properties: {
          direction: {
            type: Type.STRING,
            description: 'Title of the proposed future research direction.',
          },
          proposedApproach: {
            type: Type.STRING,
            description: 'Concrete methodological or architectural strategy to pursue this direction.',
          },
          expectedImpact: {
            type: Type.STRING,
            description: 'Expected scholarly or practical contribution.',
          },
        },
        required: ['direction', 'proposedApproach', 'expectedImpact'],
      },
    },
    report: {
      type: Type.OBJECT,
      properties: {
        abstract: {
          type: Type.STRING,
          description: 'Structured academic abstract summarizing background, methods/themes, gaps, and future scope.',
        },
        introduction: {
          type: Type.STRING,
          description: 'Formal academic introduction framing context, problem statement, and rationale.',
        },
        researchObjectives: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '4 to 5 clear, action-oriented research objectives.',
        },
        researchQuestions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'The 5 core research questions listed cleanly for the formal report.',
        },
        literatureReview: {
          type: Type.STRING,
          description: 'Cohesive multi-paragraph literature review organized by themes, explicitly stating citation verification requirements if external sources are not supplied.',
        },
        researchGaps: {
          type: Type.STRING,
          description: 'Synthesized prose section detailing methodological, empirical, and practical research gaps.',
        },
        conclusion: {
          type: Type.STRING,
          description: 'Synthesizing conclusion tying together key insights and implications.',
        },
        futureScope: {
          type: Type.STRING,
          description: 'Cohesive prose section outlining future research pathways and validation priorities.',
        },
      },
      required: [
        'abstract',
        'introduction',
        'researchObjectives',
        'researchQuestions',
        'literatureReview',
        'researchGaps',
        'conclusion',
        'futureScope',
      ],
    },
    verificationNotice: {
      type: Type.STRING,
      description:
        'Explicit academic integrity statement clarifying whether findings are grounded in user-provided text or topic-level synthesis and reminding researchers to verify external bibliographic citations and statistics.',
    },
  },
  required: [
    'topicOverview',
    'researchQuestions',
    'literatureReviewThemes',
    'researchGaps',
    'futureScope',
    'report',
    'verificationNotice',
  ],
};

function mapGeminiErrorMessage(err: unknown): { status: number; message: string } {
  const raw = err instanceof Error ? err.message : String(err);
  const upper = raw.toUpperCase();

  if (
    upper.includes('PERMISSION_DENIED') ||
    upper.includes('API_KEY_INVALID') ||
    upper.includes('403') ||
    upper.includes('INVALID API KEY')
  ) {
    return {
      status: 403,
      message:
        'Gemini API key authentication failed. Please check or select a valid API key in the Settings > Secrets panel and try again.',
    };
  }

  if (upper.includes('RESOURCE_EXHAUSTED') || upper.includes('429')) {
    return {
      status: 429,
      message:
        'Gemini API rate or quota limit reached (429). Wait a moment before retrying, or select a billing-enabled API key in Settings > Secrets for higher quota.',
    };
  }

  if (upper.includes('NOT_FOUND') || upper.includes('404')) {
    return {
      status: 502,
      message:
        'The configured Gemini model endpoint returned 404 Not Found. Please retry momentarily.',
    };
  }

  return {
    status: 500,
    message: `Research synthesis failed: ${raw.slice(0, 280)}`,
  };
}

async function generateWithRetry(topic: string, sourceMaterial: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    const missingErr = new Error(
      'API_KEY_INVALID: GEMINI_API_KEY is not configured in environment.'
    );
    throw missingErr;
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const contents = buildFewShotContents(topic, sourceMaterial);

  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: RESEARCH_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: RESEARCH_RESPONSE_SCHEMA,
        },
      });

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        throw new Error('Model returned an empty response body.');
      }

      return JSON.parse(rawText);
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      const isTransient =
        msg.includes('503') ||
        msg.includes('UNAVAILABLE') ||
        msg.includes('DEADLINE_EXCEEDED') ||
        msg.includes('fetch failed');
      if (attempt === 0 && isTransient) {
        await new Promise((resolve) => setTimeout(resolve, 900));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  app.post('/api/research/generate', async (req: Request, res: Response) => {
    try {
      const topic = typeof req.body?.topic === 'string' ? req.body.topic.trim() : '';
      const sourceMaterial =
        typeof req.body?.sourceMaterial === 'string' ? req.body.sourceMaterial.trim() : '';

      if (!topic) {
        res.status(400).json({
          error: 'Please enter a research topic before generating a research report.',
        });
        return;
      }

      if (topic.length > 400) {
        res.status(400).json({
          error: 'Research topic must be 400 characters or fewer. Paste longer text into the research paper content field.',
        });
        return;
      }

      if (sourceMaterial.length > 60000) {
        res.status(400).json({
          error: 'Pasted research paper content exceeds 60,000 characters. Please paste the abstract, findings, and discussion sections.',
        });
        return;
      }

      const parsed = await generateWithRetry(topic, sourceMaterial);

      // Normalize sourceStatus and gap categories cleanly
      if (Array.isArray(parsed.literatureReviewThemes)) {
        parsed.literatureReviewThemes = parsed.literatureReviewThemes.map(
          (item: Record<string, unknown>) => ({
            theme: String(item.theme ?? 'Thematic cluster'),
            synthesis: String(item.synthesis ?? ''),
            keyFindings: Array.isArray(item.keyFindings)
              ? item.keyFindings.map((f) => String(f))
              : [],
            sourceStatus:
              item.sourceStatus === 'Grounded in provided material' && sourceMaterial.length > 0
                ? 'Grounded in provided material'
                : 'Domain synthesis — verify external citations',
          })
        );
      }

      if (Array.isArray(parsed.researchQuestions)) {
        parsed.researchQuestions = parsed.researchQuestions.slice(0, 5);
      }

      res.json({ result: parsed });
    } catch (err) {
      console.error('Error in /api/research/generate:', err);
      const { status, message } = mapGeminiErrorMessage(err);
      res.status(status).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Research Paper Agent server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
