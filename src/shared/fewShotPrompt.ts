import type { ResearchAnalysisResult } from '../types/research.ts';

export interface FewShotExemplar {
  id: string;
  label: string;
  inputTopic: string;
  inputMaterial: string;
  summaryExpectation: string;
  expectedOutput: ResearchAnalysisResult;
}

export const RESEARCH_SYSTEM_INSTRUCTION = `You are Research Paper Agent, a rigorous academic research methodology assistant designed for university students, graduate scholars, and faculty researchers.

ACADEMIC INTEGRITY & NON-FABRICATION MANDATE (STRICT):
1. NEVER fabricate, invent, or hallucinate research paper titles, author names, publication years, journal venues, DOIs, URLs, or empirical statistics.
2. When the user supplies pasted research paper content:
   - Ground your thematic literature review, research gaps, and report directly in the provided text.
   - Cite or mention ONLY authors, dates, methods, or metrics that explicitly appear verbatim in the user's provided material.
   - Mark themes derived directly from the user's text as "Grounded in provided material".
   - If you contextualize beyond the pasted excerpt, clearly label those themes as "Domain synthesis — verify external citations".
3. When the user provides ONLY a research topic (no pasted research material) or partial notes:
   - Synthesize conceptual paradigms, established methodological approaches, and known domain challenges accurately without inventing specific citations, author names, or numeric study results.
   - Label literature review themes as "Domain synthesis — verify external citations".
   - Explicitly state in verificationNotice and in the Literature Review that specific peer-reviewed citations, authors, publication dates, and quantitative benchmarks require verification in scholarly databases (such as Google Scholar, PubMed, IEEE Xplore, or ACM Digital Library) prior to submission.

STRUCTURAL REQUIREMENTS (FOLLOW THE FEW-SHOT EXAMPLES EXACTLY):
- Provide a comprehensive Research Topic Analysis (summary, 4-6 coreConcepts, academicSignificance, scopeBoundaries).
- Generate EXACTLY 5 substantive, investigable Research Questions, each with analyticalFocus and methodologyHint.
- Organize the Literature Review into 3-4 distinct thematic clusters (theme, synthesis, keyFindings, sourceStatus).
- Identify 3-4 concrete Research Gaps (gapTitle, category, limitationAnalysis, evidenceBasis).
- Propose 3-4 actionable Future Scope directions (direction, proposedApproach, expectedImpact).
- Generate a cohesive, formal academic Research Report with all 8 required sections:
  Abstract (150-220 words), Introduction, Research Objectives (4-5 bulleted objectives), Research Questions (matching the 5 questions), Literature Review (multi-paragraph thematic prose), Research Gaps, Conclusion, and Future Scope.`;

export const FEW_SHOT_EXEMPLARS: FewShotExemplar[] = [
  {
    id: 'exemplar-1-xai-healthcare',
    label: 'Few-Shot Example 1',
    inputTopic: 'Explainable AI in Healthcare',
    inputMaterial: '',
    summaryExpectation:
      'Overview of Explainable AI; research questions about interpretability; literature review themes; research gaps in explainability; future research directions.',
    expectedOutput: {
      topicOverview: {
        summary:
          'Explainable Artificial Intelligence (XAI) in healthcare encompasses computational methods and interface paradigms that make the internal reasoning, feature attributions, and uncertainty estimates of clinical machine learning models intelligible to clinicians, patients, and regulators. As deep neural networks and ensemble predictors are increasingly evaluated for diagnostic imaging, intensive care triage, and prognostic risk scoring, XAI bridges predictive performance and clinical accountability.',
        coreConcepts: [
          'Post-hoc attribution vs. intrinsically interpretable models',
          'Clinical decision support transparency',
          'Counterfactual and case-based explanations',
          'Explanation fidelity and stability',
          'Human-clinician calibration and automation bias',
        ],
        academicSignificance:
          'Opaque high-capacity models create accountability, safety, and medico-legal barriers in high-stakes clinical workflows where clinicians must justify diagnostic and therapeutic decisions rather than deferring blindly to algorithmic scores.',
        scopeBoundaries:
          'Focuses on interpretability methods, clinician-facing evaluation, and governance in diagnostic and prognostic healthcare models; excludes general hospital administrative automation unrelated to clinical inference.',
      },
      researchQuestions: [
        {
          question:
            'How do intrinsically interpretable clinical risk models compare against post-hoc feature attribution wrappers in preserving diagnostic accuracy while preventing clinician over-reliance?',
          analyticalFocus: 'Trade-off between model ante-hoc simplicity, explanation fidelity, and human diagnostic calibration.',
          methodologyHint: 'Controlled crossover reader study with clinicians evaluating paired cases under ante-hoc and post-hoc explanation interfaces.',
        },
        {
          question:
            'To what extent do saliency-based visual explanations in medical imaging remain invariant under minor acquisition noise and cross-scanner domain shifts?',
          analyticalFocus: 'Algorithmic stability and robustness of visual interpretability maps across heterogeneous clinical hardware.',
          methodologyHint: 'Perturbation sensitivity analysis and multi-site external validation across distinct imaging protocols.',
        },
        {
          question:
            'Which explanation modalities—feature importance rankings, counterfactual patient trajectories, or prototype case comparisons—align best with diagnostic reasoning across novice versus attending clinicians?',
          analyticalFocus: 'Cognitive alignment between computational explanation formats and clinical expertise levels.',
          methodologyHint: 'Mixed-methods task-completion study measuring decision time, diagnostic agreement, and cognitive load.',
        },
        {
          question:
            'How can explanation interfaces communicate epistemic uncertainty alongside feature attributions to mitigate automation bias in acute triage workflows?',
          analyticalFocus: 'Joint presentation of predictive confidence intervals and local feature explanations.',
          methodologyHint: 'Randomized vignette experiment testing concordant and intentionally perturbed AI recommendations.',
        },
        {
          question:
            'What standardized quantitative and clinical validation criteria are required to audit explanation faithfulness for regulatory review of clinical decision support software?',
          analyticalFocus: 'Translating technical interpretability metrics into auditable clinical governance standards.',
          methodologyHint: 'Systematic comparative framework mapping technical faithfulness tests to clinical risk-management requirements.',
        },
      ],
      literatureReviewThemes: [
        {
          theme: 'Intrinsic interpretability versus post-hoc approximation',
          synthesis:
            'Existing scholarship distinguishes intrinsically transparent architectures—such as generalized additive structures, sparse scoring systems, and rule lists—from post-hoc local approximations applied to deep neural networks and gradient-boosted ensembles. Literature highlights that post-hoc explanations approximate local decision boundaries rather than revealing exact causal mechanisms, raising fidelity concerns in high-risk clinical contexts.',
          keyFindings: [
            'Post-hoc feature attributions can produce divergent explanations for identical patient risk profiles depending on baseline reference selection.',
            'Intrinsically structured clinical models often match black-box performance on tabular electronic health record tasks when domain features are carefully engineered.',
          ],
          sourceStatus: 'Domain synthesis — verify external citations',
        },
        {
          theme: 'Visual saliency and concept-based explanations in medical imaging',
          synthesis:
            'In radiology, pathology, and ophthalmology workflows, gradient-based heatmaps and attention overlays are widely studied to localize regions of diagnostic interest. However, thematic reviews note that coarse spatial heatmaps identify where a network attends without explaining what morphological or pathological trait drove the classification.',
          keyFindings: [
            'Spatial saliency overlays may highlight anatomical landmarks or acquisition artifacts rather than true pathology if training cohorts contain confounding markers.',
            'Concept bottleneck and prototype-based approaches attempt to map latent representations directly onto clinically recognized morphological descriptors.',
          ],
          sourceStatus: 'Domain synthesis — verify external citations',
        },
        {
          theme: 'Human-factors evaluation and clinician trust calibration',
          synthesis:
            'Empirical human-AI interaction studies examine whether explanations genuinely improve joint clinician-model diagnostic accuracy. Findings across clinical decision support literature suggest that plausible-looking explanations can paradoxically increase clinician acceptance of erroneous model predictions unless paired with uncertainty cues and cognitive forcing structures.',
          keyFindings: [
            'Subjective clinician satisfaction with an explanation interface does not reliably correlate with objective ability to detect model errors.',
            'Workflow integration constraints in acute care limit the time available to inspect complex multi-variable attribution plots.',
          ],
          sourceStatus: 'Domain synthesis — verify external citations',
        },
      ],
      researchGaps: [
        {
          gapTitle: 'Disconnect between computational faithfulness metrics and clinical utility',
          category: 'Methodological',
          limitationAnalysis:
            'Most interpretability benchmarks evaluate explanations using synthetic pixel-deletion or feature-masking curves rather than prospective clinical decision tasks with practicing healthcare professionals.',
          evidenceBasis: 'Synthesized from domain methodology patterns; specific benchmark citations require bibliographic verification.',
        },
        {
          gapTitle: 'Vulnerability to confirmation and automation bias',
          category: 'Practical deployment',
          limitationAnalysis:
            'Current XAI interfaces rarely test whether explanations help clinicians reject confident but incorrect predictions during time-pressured clinical shifts.',
          evidenceBasis: 'Derived from human-AI clinical interaction challenges; verify specific empirical reader studies before citation.',
        },
        {
          gapTitle: 'Limited longitudinal and multimodal explanation coherence',
          category: 'Empirical',
          limitationAnalysis:
            'Existing methods predominantly explain isolated single-modality inputs (either a static scan or a tabular snapshot) rather than longitudinal patient trajectories combining clinical notes, waveforms, and imaging.',
          evidenceBasis: 'Conceptual gap across multimodal healthcare AI workflows; verify recent multimodal XAI literature.',
        },
      ],
      futureScope: [
        {
          direction: 'Concept-grounded multimodal clinical explanations',
          proposedApproach:
            'Develop architectures that align cross-modal clinical embeddings (imaging, physiological time series, and structured labs) with standardized clinical ontologies and verifiable diagnostic criteria.',
          expectedImpact:
            'Enables explanations phrased in actionable clinical concepts rather than raw pixel intensities or isolated feature weights.',
        },
        {
          direction: 'Prospective human-in-the-loop clinical trials for explanation interfaces',
          proposedApproach:
            'Conduct multi-institutional prospective silent-mode and interventional workflow studies measuring diagnostic error interception, calibration, and cognitive load.',
          expectedImpact:
            'Establishes empirical evidence of patient-safety benefit rather than relying solely on offline proxy metrics.',
        },
        {
          direction: 'Uncertainty-aware counterfactual clinical decision support',
          proposedApproach:
            'Combine conformal prediction intervals with physiologically plausible counterfactual explanations constrained by domain causal graphs.',
          expectedImpact:
            'Helps clinicians distinguish borderline uncertain cases from high-confidence classifications and prevents implausible recourse suggestions.',
        },
      ],
      report: {
        abstract:
          'Artificial intelligence models demonstrate substantial predictive capability across diagnostic imaging, clinical risk stratification, and patient monitoring, yet limited model transparency remains a central barrier to safe clinical adoption. This report analyzes Explainable Artificial Intelligence (XAI) in healthcare, examining how interpretability paradigms mediate predictive performance, explanation fidelity, and clinician trust calibration. Synthesizing thematic developments across intrinsic versus post-hoc interpretability, medical imaging saliency, and human-factors evaluation, the analysis identifies critical research gaps: reliance on computational proxy benchmarks over prospective clinical validation, susceptibility to automation bias, and fragmented explanations across multimodal longitudinal records. Five targeted research questions and a future research agenda are formulated to advance concept-grounded multimodal architectures, uncertainty-calibrated interfaces, and auditable clinical validation protocols. Note: Because no external source manuscripts were supplied in the input, no specific author citations or empirical statistics are fabricated; scholarly references must be verified independently.',
        introduction:
          'Modern clinical decision support systems increasingly incorporate high-dimensional machine learning architectures capable of modeling complex nonlinear patterns across medical images, physiological waveforms, and electronic health records. Despite strong offline predictive metrics, opaque inference pipelines complicate clinical verification, error detection, and medico-legal accountability. Explainable AI (XAI) in healthcare addresses this tension by designing either intrinsically transparent models or post-hoc interpretability mechanisms that expose underlying rationale. Understanding when explanations faithfully reflect model behavior—and when they genuinely improve clinician judgment—is essential for safe translational deployment.',
        researchObjectives: [
          'Analyze architectural trade-offs between intrinsically interpretable clinical models and post-hoc attribution techniques.',
          'Evaluate the stability and clinical validity of visual and concept-based explanations under cross-institutional distribution shifts.',
          'Investigate human-factors mechanisms linking explanation presentation, epistemic uncertainty, and clinician trust calibration.',
          'Formulate standardized validation frameworks aligning technical explanation fidelity with clinical governance requirements.',
        ],
        researchQuestions: [
          'How do intrinsically interpretable clinical risk models compare against post-hoc feature attribution wrappers in preserving diagnostic accuracy while preventing clinician over-reliance?',
          'To what extent do saliency-based visual explanations in medical imaging remain invariant under minor acquisition noise and cross-scanner domain shifts?',
          'Which explanation modalities—feature importance rankings, counterfactual patient trajectories, or prototype case comparisons—align best with diagnostic reasoning across novice versus attending clinicians?',
          'How can explanation interfaces communicate epistemic uncertainty alongside feature attributions to mitigate automation bias in acute triage workflows?',
          'What standardized quantitative and clinical validation criteria are required to audit explanation faithfulness for regulatory review of clinical decision support software?',
        ],
        literatureReview:
          'Scholarship on healthcare interpretability clusters into three primary themes. First, methodological comparisons contrast ante-hoc interpretable designs—such as sparse scoring rules and additive risk curves—with post-hoc local approximations applied to black-box ensembles and deep networks. While post-hoc wrappers preserve modeling flexibility, analytical critiques demonstrate that local approximations can be unstable and sensitive to hyperparameter perturbations. Second, in diagnostic imaging, spatial saliency and gradient-attribution maps remain prevalent for localizing suspicious regions, yet they frequently fail to distinguish causal pathological features from spurious acquisition artifacts, motivating newer concept-bottleneck and prototype paradigms. Third, human-computer interaction studies reveal that visually persuasive explanations do not automatically yield superior joint clinician-AI decisions; without explicit uncertainty signaling, explanations may reinforce confirmation or automation bias. (Note: As this synthesis is generated from topic-level analysis without user-supplied papers, specific bibliographic references require verification in peer-reviewed databases.)',
        researchGaps:
          'Three principal research gaps constrain current healthcare XAI deployment. Methodologically, evaluation remains dominated by automated perturbation proxies rather than prospective clinical reader studies measuring actual diagnostic error reduction. Practically, few interfaces explicitly safeguard against automation bias when models issue confident yet erroneous predictions under distribution shift. Empirically, existing interpretability methods largely operate on single-modality snapshots, leaving longitudinal multimodal reasoning across notes, labs, and imaging inadequately explained.',
        conclusion:
          'Explainable AI in healthcare cannot be treated merely as a visualization layer appended to opaque predictors. Achieving trustworthy clinical utility requires aligning mathematical faithfulness, robustness across heterogeneous patient cohorts, and human-centered cognitive design validated under realistic clinical constraints.',
        futureScope:
          'Future research should prioritize ontology-aligned multimodal explanation frameworks, prospective multi-site human-in-the-loop clinical trials, and joint uncertainty-counterfactual interfaces constrained by physiological feasibility, alongside auditable standards for regulatory evaluation.',
      },
      verificationNotice:
        'Topic-only synthesis: No source paper text was pasted. In accordance with academic integrity rules, no specific paper titles, authors, publication dates, or numeric statistics were fabricated. Please verify and attach peer-reviewed references from PubMed, IEEE Xplore, or Google Scholar before citing.',
    },
  },
  {
    id: 'exemplar-2-ml-agriculture',
    label: 'Few-Shot Example 2',
    inputTopic: 'Machine Learning in Agriculture',
    inputMaterial: '',
    summaryExpectation:
      'Overview of machine learning applications; research questions about crop prediction; literature review themes; research gaps in agricultural AI; future research directions.',
    expectedOutput: {
      topicOverview: {
        summary:
          'Machine learning in agriculture integrates remote sensing, proximal in-field IoT telemetry, meteorological modeling, and computer vision to optimize crop yield forecasting, precision irrigation, nutrient management, and early pest or phytopathology detection. By modeling non-linear interactions among soil properties, microclimates, and crop phenology, agricultural ML supports resource-efficient and climate-resilient agronomy.',
        coreConcepts: [
          'Multispectral and hyperspectral crop yield forecasting',
          'In-field computer vision for phytopathology and weed control',
          'Soil-moisture and evapotranspiration sensor fusion',
          'Spatiotemporal domain adaptation across agro-climatic zones',
          'Edge AI deployment in low-connectivity rural farms',
        ],
        academicSignificance:
          'Rising climatic volatility, freshwater scarcity, and soil degradation necessitate data-driven agronomic decision systems that generalize reliably across diverse cultivars, smallholder plots, and shifting seasonal regimes.',
        scopeBoundaries:
          'Covers pre-harvest crop modeling, precision field management, phytopathology vision systems, and agro-climatic forecasting; excludes downstream retail food marketing.',
      },
      researchQuestions: [
        {
          question:
            'How effectively does fusing satellite multispectral time series with ground-level soil telemetry improve county- and field-scale crop yield prediction under extreme drought anomalies?',
          analyticalFocus: 'Multi-modal spatiotemporal sensor fusion resilience during non-stationary climate events.',
          methodologyHint: 'Multi-season temporal cross-validation holding out anomalous drought years across distinct soil regimes.',
        },
        {
          question:
            'What domain-adaptation strategies minimize accuracy degradation when transferring foliar disease classification models from controlled laboratory imagery to variable field lighting and occlusion?',
          analyticalFocus: 'Covariate shift mitigation between curated plant-pathology datasets and real-world canopy conditions.',
          methodologyHint: 'Unsupervised domain adaptation and self-supervised pretraining evaluated on in-situ field imagery.',
        },
        {
          question:
            'How can hybrid physics-guided machine learning architectures incorporate mechanistic crop-growth constraints to prevent biologically implausible yield and nitrogen-uptake predictions?',
          analyticalFocus: 'Coupling biophysical agronomic simulation principles with data-driven neural or ensemble learners.',
          methodologyHint: 'Ablation comparison of purely data-driven regressors versus physics-regularized models under sparse training data.',
        },
        {
          question:
            'What model compression and quantization trade-offs enable real-time weed and pest localization on solar-powered or UAV-mounted edge hardware without sacrificing small-lesion recall?',
          analyticalFocus: 'Computational efficiency versus fine-grained detection sensitivity in bandwidth-constrained environments.',
          methodologyHint: 'Hardware-in-the-loop latency, energy consumption, and precision-recall benchmarking on embedded processors.',
        },
        {
          question:
            'Which decision-support designs and uncertainty representations foster actionable adoption of ML irrigation and fertilizer recommendations among smallholder farmers?',
          analyticalFocus: 'Socio-technical usability, economic risk communication, and agronomic interpretability.',
          methodologyHint: 'Participatory field trials comparing advisory compliance, water-use efficiency, and net plot margins.',
        },
      ],
      literatureReviewThemes: [
        {
          theme: 'Spatiotemporal crop yield forecasting and remote sensing fusion',
          synthesis:
            'Agricultural forecasting studies combine vegetation indices derived from orbital and UAV multispectral imagery with sequential weather and edaphic variables using temporal convolutional, recurrent, transformer, and tree-ensemble models. Thematic synthesis shows strong interpolation within historical climate norms but substantial error inflation when models encounter unseen heatwave or precipitation extremes.',
          keyFindings: [
            'Combining phenological stage alignment with multi-band canopy reflectance outperforms static single-date imagery for pre-harvest yield estimation.',
            'Spatial autocorrelation in random train-test splits frequently inflates reported forecasting accuracy compared to strict geographic or seasonal holdouts.',
          ],
          sourceStatus: 'Domain synthesis — verify external citations',
        },
        {
          theme: 'Computer vision for foliar disease, pest, and precision weed management',
          synthesis:
            'Convolutional and vision-transformer detectors are widely investigated for automated plant stress identification and targeted micro-dosing sprayers. However, literature reviews consistently highlight a generalization gap: models trained on uniform single-leaf backgrounds often degrade sharply when exposed to overlapping foliage, dew, dust, and co-occurring nutrient deficiencies in open fields.',
          keyFindings: [
            'Background bias in curated leaf datasets can cause classifiers to overfit capture conditions rather than lesion morphology.',
            'Fine-grained early-stage symptom detection requires high spatial resolution that tensions with lightweight edge inference budgets.',
          ],
          sourceStatus: 'Domain synthesis — verify external citations',
        },
        {
          theme: 'Closed-loop precision irrigation and soil-nutrient optimization',
          synthesis:
            'Sensor-driven advisory systems apply supervised and reinforcement learning to schedule Deficit Irrigation and variable-rate fertilization. Current research emphasizes integrating evapotranspiration estimates with root-zone moisture probes to reduce leaching and water waste while maintaining harvest quality.',
          keyFindings: [
            'Sensor drift, sparse probe coverage across heterogeneous soil textures, and missing telemetry streams challenge continuous field deployment.',
            'Hybrid approaches combining agronomic water-balance equations with residual ML correction demonstrate stronger sample efficiency.',
          ],
          sourceStatus: 'Domain synthesis — verify external citations',
        },
      ],
      researchGaps: [
        {
          gapTitle: 'Optimistic validation splits masking geographic and seasonal fragility',
          category: 'Methodological',
          limitationAnalysis:
            'Many crop-prediction studies rely on random sample splits rather than strict spatial block or out-of-season holdout validation, overstating cross-region transferability.',
          evidenceBasis: 'Synthesized from spatiotemporal ML evaluation principles; verify specific agronomic benchmark papers.',
        },
        {
          gapTitle: 'Scarcity of annotated multi-stress open-field datasets for smallholder crops',
          category: 'Empirical',
          limitationAnalysis:
            'Publicly studied vision corpora disproportionately represent major commodity monocultures and single-pathogen laboratory samples, under-serving intercropped smallholder systems and compound abiotic-biotic stresses.',
          evidenceBasis: 'Domain dataset coverage limitation; verify specific agricultural dataset inventories before citing.',
        },
        {
          gapTitle: 'Connectivity, energy, and socio-economic barriers in rural deployment',
          category: 'Practical deployment',
          limitationAnalysis:
            'Cloud-dependent inference pipelines and opaque agronomic recommendations struggle in rural regions with intermittent cellular connectivity and high financial sensitivity to input errors.',
          evidenceBasis: 'Derived from precision-agriculture deployment constraints; verify field-adoption studies.',
        },
      ],
      futureScope: [
        {
          direction: 'Physics-informed agro-climatic foundation and hybrid models',
          proposedApproach:
            'Embed mechanistic crop-physiology and soil-hydrology conservation laws directly into spatiotemporal neural architectures to constrain extrapolations under novel climate regimes.',
          expectedImpact:
            'Improves out-of-distribution yield and water-stress forecasting reliability in data-sparse regions.',
        },
        {
          direction: 'Offline-first quantized edge perception for multi-stress field diagnostics',
          proposedApproach:
            'Pair self-supervised canopy pretraining with hardware-aware neural quantization for handheld mobile devices and autonomous field implements.',
          expectedImpact:
            'Delivers low-latency, connectivity-independent pest and nutrient diagnostics in remote agricultural zones.',
        },
        {
          direction: 'Standardized spatial-temporal agronomic benchmarking protocols',
          proposedApproach:
            'Establish open multi-continent evaluation benchmarks enforcing strict leave-one-year-out and leave-one-ecoregion-out validation splits alongside economic risk metrics.',
          expectedImpact:
            'Provides realistic generalizability guarantees for agronomic researchers and extension services.',
        },
      ],
      report: {
        abstract:
          'Machine learning (ML) has emerged as a foundational methodology in precision agriculture, enabling data-driven crop yield forecasting, automated phytopathology detection, and targeted water and nutrient management. This report synthesizes core paradigms in agricultural machine learning, examining multimodal remote-sensing fusion, in-field computer vision, and closed-loop agronomic advisory systems. Thematic analysis reveals persistent limitations impeding reliable field translation: optimistic validation protocols that overlook spatial autocorrelation, severe domain shift between laboratory leaf imagery and complex field canopies, under-representation of smallholder polycultures, and rural edge-computing constraints. Five structured research questions and future directions—spanning physics-informed crop modeling, offline-first edge diagnostics, and rigorous spatiotemporal benchmarks—are proposed to advance resilient and equitable agricultural AI. Note: No external papers were supplied in the prompt; references and quantitative benchmarks require verification in peer-reviewed agronomic and computer-science databases.',
        introduction:
          'Global agricultural systems face converging pressures from shifting precipitation patterns, heat extremes, freshwater depletion, and evolving pest pressures. Machine learning offers powerful tools to assimilate heterogeneous data streams—ranging from orbital multispectral reflectance and UAV imagery to proximal soil-moisture probes—into localized agronomic decisions. However, biological ecosystems exhibit pronounced spatial heterogeneity and non-stationary seasonal dynamics, demanding careful methodological rigor to ensure predictive models translate from experimental plots to operational farms.',
        researchObjectives: [
          'Evaluate multi-sensor fusion architectures combining remote sensing and proximal soil telemetry for climate-resilient yield prediction.',
          'Analyze visual domain-adaptation techniques bridging curated plant-pathology datasets and occluded in-field canopy environments.',
          'Assess physics-guided learning frameworks that enforce biophysical crop-growth consistency under sparse field observations.',
          'Design resource-efficient, uncertainty-calibrated edge advisory workflows tailored to rural connectivity and smallholder adoption.',
        ],
        researchQuestions: [
          'How effectively does fusing satellite multispectral time series with ground-level soil telemetry improve county- and field-scale crop yield prediction under extreme drought anomalies?',
          'What domain-adaptation strategies minimize accuracy degradation when transferring foliar disease classification models from controlled laboratory imagery to variable field lighting and occlusion?',
          'How can hybrid physics-guided machine learning architectures incorporate mechanistic crop-growth constraints to prevent biologically implausible yield and nitrogen-uptake predictions?',
          'What model compression and quantization trade-offs enable real-time weed and pest localization on solar-powered or UAV-mounted edge hardware without sacrificing small-lesion recall?',
          'Which decision-support designs and uncertainty representations foster actionable adoption of ML irrigation and fertilizer recommendations among smallholder farmers?',
        ],
        literatureReview:
          'Research across agricultural machine learning organizes around three interconnected themes. First, spatiotemporal yield prediction leverages multispectral time series alongside meteorological and soil covariates; while temporal architectures capture phenological progression well under normal weather, random cross-validation splits often mask vulnerability to spatial shift and extreme drought years. Second, computer-vision pipelines for foliar disease and weed detection achieve high accuracy on uniform background imagery yet suffer marked performance drops under natural canopy illumination, overlapping leaves, and compound stress conditions. Third, precision irrigation and nutrient scheduling systems increasingly integrate root-zone telemetry with evapotranspiration models, demonstrating strong potential for input conservation when hybrid biophysical constraints compensate for sensor noise. (Note: Because no external manuscripts were pasted, specific citations and empirical figures require independent bibliographic verification.)',
        researchGaps:
          'Critical gaps persist across methodological validation, dataset diversity, and field deployment. Lack of strict geographic and temporal holdout testing inflates perceived yield-model generalizability; existing annotated imagery under-represents non-commodity smallholder crops and simultaneous biotic-abiotic stresses; and cloud-reliant architectures neglect intermittent rural connectivity and farmer risk tolerance.',
        conclusion:
          'Realizing the agronomic promise of machine learning requires moving beyond isolated accuracy metrics on curated datasets toward biophysical consistency, strict out-of-region validation, and practical edge deployability co-designed with agricultural practitioners.',
        futureScope:
          'Future investigations should advance physics-informed spatiotemporal crop models, self-supervised quantized vision models for offline mobile diagnostics, and open ecoregion-stratified benchmarks that evaluate both predictive skill and agronomic economic utility.',
      },
      verificationNotice:
        'Topic-only synthesis: No source paper text was pasted. In accordance with academic integrity rules, no specific paper titles, authors, publication dates, or numeric statistics were fabricated. Please verify and attach peer-reviewed references from agronomic and AI journals before citing.',
    },
  },
];

export function formatUserResearchPrompt(topic: string, sourceMaterial: string): string {
  const trimmedTopic = topic.trim();
  const trimmedMaterial = sourceMaterial.trim();

  if (!trimmedMaterial) {
    return [
      `RESEARCH TOPIC: ${trimmedTopic}`,
      `PROVIDED RESEARCH MATERIAL: [None provided — perform rigorous topic-level synthesis. Do NOT fabricate paper titles, authors, publication years, citations, or statistics. Explicitly state where references require verification.]`,
      `TASK: Analyze this research topic and generate the complete structured JSON output following the exact structure, academic depth, and verification discipline demonstrated in the preceding few-shot examples.`,
    ].join('\n\n');
  }

  return [
    `RESEARCH TOPIC: ${trimmedTopic}`,
    `PROVIDED RESEARCH MATERIAL (PRIMARY SOURCE TEXT TO ANALYZE):\n"""\n${trimmedMaterial}\n"""`,
    `TASK: Analyze the research topic AND synthesize the user-provided research material above. Organize Literature Review findings by themes grounded in the provided text, identify limitations and Research Gaps directly from the provided material, suggest Future Scope, and generate the complete 8-part Research Report. Cite ONLY names, dates, or figures explicitly present in the provided text; never fabricate external citations or statistics, and note any broader claims that require external verification.`,
  ].join('\n\n');
}

export function buildFewShotContents(topic: string, sourceMaterial: string) {
  const turns: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

  for (const exemplar of FEW_SHOT_EXEMPLARS) {
    turns.push({
      role: 'user',
      parts: [
        {
          text: formatUserResearchPrompt(exemplar.inputTopic, exemplar.inputMaterial),
        },
      ],
    });
    turns.push({
      role: 'model',
      parts: [
        {
          text: JSON.stringify(exemplar.expectedOutput, null, 2),
        },
      ],
    });
  }

  turns.push({
    role: 'user',
    parts: [
      {
        text: formatUserResearchPrompt(topic, sourceMaterial),
      },
    ],
  });

  return turns;
}
