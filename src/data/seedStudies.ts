import type { SavedResearchStudy } from '../types/research.ts';

export interface QuickResearchPreset {
  id: string;
  label: string;
  topic: string;
  sourceMaterial: string;
}

export const QUICK_RESEARCH_PRESETS: QuickResearchPreset[] = [
  {
    id: 'preset-federated-clinical',
    label: 'Federated clinical diagnostics (with excerpt)',
    topic: 'Federated Learning for Privacy-Preserving Clinical Diagnostics',
    sourceMaterial: `Abstract & Methods Excerpt (Working Manuscript Notes):
Multi-institutional medical imaging studies frequently face strict data-governance constraints that prohibit centralizing patient radiographs and pathology slides into a single cloud repository. Federated learning addresses this barrier by training local model weights within each participating hospital firewall and transmitting only parameter updates to a central aggregation server.

Observed Findings Across Evaluated Protocols:
First, non-identically distributed (non-IID) patient demographics and scanner calibration differences across urban tertiary centers and rural clinics cause local gradient divergence, degrading global model convergence compared with centralized baselines. Second, while local differential privacy noise injection reduces gradient inversion leakage risks, aggressive clipping thresholds disproportionately reduce sensitivity on rare pediatric and minority-subgroup pathologies. Third, asynchronous hospital network drop-offs during peak clinical hours introduce straggler bias toward high-bandwidth academic centers. Note: External benchmark citations and multi-site statistical confidence intervals must be verified prior to manuscript submission.`,
  },
  {
    id: 'preset-xai-healthcare',
    label: 'Explainable AI in Healthcare',
    topic: 'Explainable AI in Healthcare',
    sourceMaterial: '',
  },
  {
    id: 'preset-ml-agriculture',
    label: 'Machine Learning in Agriculture',
    topic: 'Machine Learning in Agriculture',
    sourceMaterial: '',
  },
  {
    id: 'preset-urban-heat-mitigation',
    label: 'Urban Microclimate & Cool-Roof Materials (with excerpt)',
    topic: 'Reflective Cool-Roof Coatings and Urban Heat Island Mitigation',
    sourceMaterial: `Field Observation Notes — Urban Canopy Thermal Monitoring:
High-albedo elastomeric roof membranes reflect solar shortwave irradiance and emit thermal longwave radiation, lowering rooftop surface temperatures in dense mid-rise neighborhoods. Across monitored summer heatwave intervals, weathered coatings exhibited measurable albedo degradation due to atmospheric soot deposition and biological fouling on flat roofs with poor drainage. Furthermore, while daytime cooling reduced top-floor air-conditioning electricity demand, wintertime solar heat-gain penalties emerged in heating-dominated temperate climates, and pedestrian-level thermal comfort showed modest sensitivity unless paired with street-canyon tree canopy shading. External meteorological station archives and material aging standards require bibliographic verification.`,
  },
];

export const INITIAL_SAVED_STUDIES: SavedResearchStudy[] = [
  {
    id: 'study-federated-clinical-2026',
    topic: 'Federated Learning for Privacy-Preserving Clinical Diagnostics',
    sourceMaterial: QUICK_RESEARCH_PRESETS[0].sourceMaterial,
    createdAtLabel: 'Nov 9, 2026',
    hasProvidedMaterial: true,
    result: {
      topicOverview: {
        summary:
          'Federated learning for privacy-preserving clinical diagnostics enables collaborative model training across distributed healthcare institutions without transferring raw patient imaging or electronic health records outside local hospital firewalls. By exchanging encrypted or differentially private parameter updates rather than sensitive patient files, federated architectures aim to reconcile multi-site statistical generalization with healthcare data-protection mandates.',
        coreConcepts: [
          'Decentralized parameter aggregation without raw data sharing',
          'Cross-hospital non-IID scanner and demographic shift',
          'Differential privacy utility-fairness trade-offs',
          'Gradient inversion defense mechanisms',
          'Asynchronous client participation and straggler bias',
        ],
        academicSignificance:
          'Single-institution clinical datasets often lack sufficient sample diversity for rare conditions, yet centralizing patient records introduces severe regulatory and privacy liabilities; federated learning offers a viable pathway if heterogeneity and fairness trade-offs are resolved.',
        scopeBoundaries:
          'Examines decentralized training, privacy-utility trade-offs, and cross-site clinical generalization; excludes general hospital network cybersecurity unrelated to collaborative machine learning.',
      },
      researchQuestions: [
        {
          question:
            'How do scanner calibration differences and non-IID patient demographics across urban tertiary hospitals and rural clinics affect global federated convergence relative to personalized local layers?',
          analyticalFocus: 'Mitigating cross-institutional gradient divergence caused by heterogeneous imaging hardware and case mix.',
          methodologyHint: 'Controlled multi-silo federated simulation partitioning cohorts by acquisition protocol and institution tier.',
        },
        {
          question:
            'What adaptive gradient-clipping and differential privacy noise schedules preserve diagnostic sensitivity on rare pediatric and under-represented subgroup pathologies while bounding gradient-inversion risk?',
          analyticalFocus: 'Resolving the privacy-fairness tension observed under uniform differential privacy noise injection.',
          methodologyHint: 'Pareto frontier analysis measuring subgroup recall across varying privacy budgets and reconstruction attack evaluations.',
        },
        {
          question:
            'To what extent does asynchronous hospital drop-off during peak clinical hours bias aggregated diagnostic models toward high-bandwidth academic medical centers?',
          analyticalFocus: 'Quantifying and correcting participation-rate skew caused by clinical infrastructure stragglers.',
          methodologyHint: 'Availability-trace replay experiments comparing staleness-aware weighting against synchronous round barriers.',
        },
        {
          question:
            'How can lightweight domain-alignment statistics be shared safely without exposing patient-identifiable distributions during cross-hospital normalization?',
          analyticalFocus: 'Privacy-safe harmonization of scanner intensity distributions across federated clinical silos.',
          methodologyHint: 'Ablation of federated batch/instance normalization protocols audited under membership-inference tests.',
        },
        {
          question:
            'What clinical governance and local validation protocols allow smaller community clinics to verify that a global federated update improves rather than degrades local diagnostic calibration?',
          analyticalFocus: 'Site-level safety gating and continuous calibration auditing prior to deploying aggregated model weights.',
          methodologyHint: 'Local holdout gatekeeping framework tracking expected calibration error across sequential federated rounds.',
        },
      ],
      literatureReviewThemes: [
        {
          theme: 'Statistical heterogeneity and non-IID cross-hospital divergence',
          synthesis:
            'Analysis of the provided manuscript material highlights that distributed clinical silos violate identical-distribution assumptions due to differing patient demographics and scanner calibrations between urban tertiary centers and rural clinics. When local updates are averaged naively, conflicting gradient directions slow or degrade global model convergence relative to centralized baselines.',
          keyFindings: [
            'Non-IID demographic and acquisition shifts across participating clinics induce local gradient divergence during aggregation.',
            'Global parameter averaging without site-specific adaptation struggles to match centralized diagnostic baselines across diverse hardware.',
          ],
          sourceStatus: 'Grounded in provided material',
        },
        {
          theme: 'Differential privacy defenses versus subgroup diagnostic sensitivity',
          synthesis:
            'While federated training keeps raw radiographs and pathology slides inside hospital firewalls, parameter updates remain vulnerable to gradient inversion leakage unless protected by local differential privacy. However, the provided research notes identify an acute trade-off: aggressive gradient clipping and noise injection disproportionately penalize rare pediatric and minority-subgroup pathologies whose signal relies on tail gradients.',
          keyFindings: [
            'Local differential privacy reduces gradient inversion leakage risks during parameter transmission.',
            'Aggressive clipping thresholds selectively erode model sensitivity on rare pediatric and under-represented clinical subgroups.',
          ],
          sourceStatus: 'Grounded in provided material',
        },
        {
          theme: 'Infrastructure asymmetry and asynchronous straggler bias',
          synthesis:
            'Operational deployment across real hospital networks introduces systems-level heterogeneity alongside statistical shift. The provided excerpt documents that asynchronous network drop-offs during peak clinical hours create straggler effects, systematically tilting global model updates toward high-bandwidth academic medical centers.',
          keyFindings: [
            'Peak-hour hospital network constraints cause intermittent client drop-offs in federated training rounds.',
            'Uncompensated straggler dynamics introduce representation bias favoring well-resourced academic institutions.',
          ],
          sourceStatus: 'Grounded in provided material',
        },
      ],
      researchGaps: [
        {
          gapTitle: 'Subgroup sensitivity loss under uniform differential privacy clipping',
          category: 'Methodological',
          limitationAnalysis:
            'Standard uniform clipping bounds treat common and rare pathology gradients identically, causing disproportionate recall degradation on rare pediatric and minority clinical cases.',
          evidenceBasis: 'Directly identified in the provided manuscript excerpt on local differential privacy noise injection.',
        },
        {
          gapTitle: 'Institutional representation skew from clinical-hour network stragglers',
          category: 'Practical deployment',
          limitationAnalysis:
            'Aggregation protocols rarely account for non-random client drop-out correlated with rural or community clinic bandwidth constraints during active clinical hours.',
          evidenceBasis: 'Grounded in provided observations regarding asynchronous hospital drop-offs and academic-center bias.',
        },
        {
          gapTitle: 'Unverified multi-site confidence intervals and external benchmark baselines',
          category: 'Empirical',
          limitationAnalysis:
            'Quantitative bounds comparing personalized federated layers, privacy budgets, and straggler-compensated aggregation across standardized multi-site cohorts remain to be formally benchmarked.',
          evidenceBasis: 'Explicitly noted in the provided excerpt as requiring external statistical and bibliographic verification.',
        },
      ],
      futureScope: [
        {
          direction: 'Subgroup-aware adaptive differential privacy and personalized federated heads',
          proposedApproach:
            'Decouple shared representation backbones from locally calibrated diagnostic heads while exploring public-ontology-guided or adaptive clipping schedules that protect rare-disease sensitivity.',
          expectedImpact:
            'Preserves formal privacy guarantees against gradient reconstruction without erasing diagnostic performance on rare pediatric and minority cohorts.',
        },
        {
          direction: 'Fairness-weighted asynchronous aggregation for heterogeneous hospital networks',
          proposedApproach:
            'Design staleness-tolerant aggregation rules weighted by institutional cohort coverage rather than raw round completion frequency.',
          expectedImpact:
            'Prevents high-bandwidth tertiary hospitals from dominating global diagnostic weights when rural clinics experience daytime network latency.',
        },
        {
          direction: 'Local pre-deployment calibration gates for participating clinics',
          proposedApproach:
            'Implement automated local validation checks at each hospital firewall that verify subgroup sensitivity and calibration before accepting a new global checkpoint.',
          expectedImpact:
            'Guarantees non-regression of clinical safety for smaller community clinics participating in federated consortia.',
        },
      ],
      report: {
        abstract:
          'Collaborative medical imaging research is frequently constrained by privacy regulations and institutional governance policies that prohibit centralizing patient radiographs and pathology slides. Federated learning offers a decentralized paradigm in which hospitals train models behind local firewalls and exchange only parameter updates. Grounded in the provided manuscript material, this report examines three interlocking challenges impeding clinical translation: local gradient divergence driven by non-IID demographics and scanner calibration differences across urban and rural clinics, subgroup sensitivity loss on rare pediatric and minority pathologies under aggressive differential privacy clipping, and institutional bias caused by asynchronous network drop-offs during peak clinical hours. Five targeted research questions and a structured future scope are proposed to advance subgroup-preserving privacy mechanisms, straggler-fair asynchronous aggregation, and site-level clinical calibration auditing. External peer-reviewed citations and quantitative benchmarks must be verified independently prior to formal submission.',
        introduction:
          'Robust clinical diagnostic models require training cohorts that span diverse patient demographics, disease prevalences, and imaging hardware. However, strict healthcare data-governance mandates prevent hospitals from pooling sensitive patient radiographs and pathology slides into centralized cloud repositories. Federated learning addresses this impasse by keeping raw clinical records on local hospital servers and aggregating parameter updates centrally. Despite its architectural promise, real-world clinical networks exhibit pronounced statistical, demographic, and infrastructural asymmetries that challenge standard federated optimization.',
        researchObjectives: [
          'Characterize how non-IID patient demographics and scanner calibration shifts between urban tertiary centers and rural clinics impact global federated convergence.',
          'Analyze the privacy-fairness trade-off between local differential privacy gradient clipping and diagnostic sensitivity on rare pediatric and minority pathologies.',
          'Evaluate how peak-hour hospital network drop-offs induce straggler bias toward high-bandwidth academic centers.',
          'Formulate adaptive personalization, fair asynchronous aggregation, and local safety-gating strategies for equitable clinical deployment.',
        ],
        researchQuestions: [
          'How do scanner calibration differences and non-IID patient demographics across urban tertiary hospitals and rural clinics affect global federated convergence relative to personalized local layers?',
          'What adaptive gradient-clipping and differential privacy noise schedules preserve diagnostic sensitivity on rare pediatric and under-represented subgroup pathologies while bounding gradient-inversion risk?',
          'To what extent does asynchronous hospital drop-off during peak clinical hours bias aggregated diagnostic models toward high-bandwidth academic medical centers?',
          'How can lightweight domain-alignment statistics be shared safely without exposing patient-identifiable distributions during cross-hospital normalization?',
          'What clinical governance and local validation protocols allow smaller community clinics to verify that a global federated update improves rather than degrades local diagnostic calibration?',
        ],
        literatureReview:
          'Synthesis of the provided manuscript excerpt reveals three central themes governing federated clinical diagnostics. First, statistical heterogeneity arises because participating urban tertiary hospitals and rural clinics serve non-identically distributed populations and operate differently calibrated imaging scanners, causing local gradient divergence that degrades global convergence relative to centralized training. Second, privacy-utility tensions emerge when defending against gradient inversion leakage: while local differential privacy noise injection strengthens parameter security, aggressive clipping thresholds disproportionately diminish diagnostic recall for rare pediatric and minority-subgroup pathologies. Third, operational network heterogeneity compounds statistical skew, as asynchronous hospital drop-offs during busy clinical shifts bias aggregated updates toward high-bandwidth academic centers. Note: In strict adherence to verification standards, no unprovided author names, publication dates, or external statistics have been added; external literature references require independent scholarly verification.',
        researchGaps:
          'Based on the analyzed material, three critical gaps require investigation: (1) lack of privacy-accounting mechanisms that safeguard rare-pathology and minority-subgroup sensitivity under differential privacy clipping; (2) absence of straggler-fair aggregation protocols resilient to correlated clinical-hour network drop-offs at smaller clinics; and (3) need for verified multi-site empirical confidence intervals across standardized clinical benchmarks.',
        conclusion:
          'Federated learning resolves the immediate barrier of raw clinical data centralization, yet privacy-preserving clinical utility depends on jointly addressing cross-scanner statistical shift, differential-privacy subgroup equity, and infrastructural participation bias across diverse healthcare tiers.',
        futureScope:
          'Future research should combine shared federated backbones with locally calibrated clinical heads, develop staleness- and coverage-aware asynchronous aggregation rules, and enforce local firewall calibration gates alongside verified multi-institutional benchmarking.',
      },
      verificationNotice:
        'Grounded in user-provided excerpt: Findings on non-IID scanner divergence, differential privacy subgroup trade-offs, and peak-hour straggler bias are synthesized directly from the supplied text. External citations, author attributions, and quantitative confidence intervals were not fabricated and require verification in peer-reviewed databases.',
    },
  },
  {
    id: 'study-urban-heat-2026',
    topic: 'Reflective Cool-Roof Coatings and Urban Heat Island Mitigation',
    sourceMaterial: QUICK_RESEARCH_PRESETS[3].sourceMaterial,
    createdAtLabel: 'Nov 8, 2026',
    hasProvidedMaterial: true,
    result: {
      topicOverview: {
        summary:
          'Reflective cool-roof coatings mitigate urban heat island intensity and building cooling loads by increasing rooftop solar reflectance (albedo) and thermal emittance across dense mid-rise built environments. Evaluating their long-term net benefit requires accounting for environmental weathering, seasonal heating penalties in temperate zones, and coupling with street-level vegetative shading.',
        coreConcepts: [
          'Solar shortwave reflectance and thermal longwave emittance',
          'Atmospheric soot deposition and biological albedo aging',
          'Summer cooling savings vs. winter solar heat-gain penalty',
          'Rooftop surface cooling vs. pedestrian street-canyon comfort',
          'Combined cool-envelope and urban tree-canopy interventions',
        ],
        academicSignificance:
          'Urban heatwaves intensify peak electricity demand and heat-related morbidity; rigorous lifecycle and microclimatic assessment ensures cool-roof mandates deliver durable year-round energy and pedestrian comfort benefits.',
        scopeBoundaries:
          'Covers elastomeric reflective roof membranes, weathering dynamics, seasonal building energy balance, and street-canyon thermal coupling in mid-rise districts.',
      },
      researchQuestions: [
        {
          question:
            'At what rate do atmospheric soot deposition and biological fouling degrade solar reflectance on flat poorly drained mid-rise roofs across multi-year exposure intervals?',
          analyticalFocus: 'Longitudinal material aging and maintenance intervals for elastomeric roof membranes.',
          methodologyHint: 'Repeated pyranometer/reflectometer field campaigns paired with surface particulate characterization.',
        },
        {
          question:
            'How does the annual net building energy balance weigh summer air-conditioning electricity reductions against wintertime heating penalties in heating-dominated temperate climates?',
          analyticalFocus: 'Full-year hydrothermal energy trade-off across climate zones and roof insulation levels.',
          methodologyHint: 'Calibrated whole-building energy simulation validated against metered seasonal HVAC consumption.',
        },
        {
          question:
            'Why do rooftop albedo retrofits alone produce modest pedestrian-level thermal comfort gains in mid-rise street canyons unless paired with vegetative tree canopy shading?',
          analyticalFocus: 'Vertical turbulent mixing decoupling roof-level cooling from pedestrian mean radiant temperature.',
          methodologyHint: 'Coupled urban canopy microclimate modeling and paired street-level globe-thermometer transects.',
        },
        {
          question:
            'How do roof slope, drainage geometry, and hydrophobic topcoat formulations mitigate biological fouling and preserve long-term thermal performance?',
          analyticalFocus: 'Material engineering and architectural drainage factors governing albedo retention.',
          methodologyHint: 'Factorial outdoor exposure testing across sloped versus ponding-prone membrane specimens.',
        },
        {
          question:
            'What spatial prioritization criteria maximize neighborhood cooling equity when deploying combined cool-roof and street-tree interventions under municipal budget constraints?',
          analyticalFocus: 'Integrated urban planning optimization for heatwave vulnerability reduction.',
          methodologyHint: 'Scenario-based spatial microclimate modeling across varying building morphologies and canopy fractions.',
        },
      ],
      literatureReviewThemes: [
        {
          theme: 'Radiative cooling mechanisms and peak summer load reduction',
          synthesis:
            'Grounded in the provided field notes, high-albedo elastomeric membranes reflect incoming solar shortwave irradiance while emitting longwave thermal radiation, substantially lowering rooftop surface temperatures during summer heatwaves and reducing top-floor air-conditioning electricity demand.',
          keyFindings: [
            'High-albedo elastomeric coatings lower roof surface temperatures across dense mid-rise neighborhoods.',
            'Daytime radiative rejection directly reduces top-floor summer cooling electricity demand.',
          ],
          sourceStatus: 'Grounded in provided material',
        },
        {
          theme: 'Environmental weathering, soot fouling, and albedo decay',
          synthesis:
            'Field observations emphasize that initial laboratory reflectance values do not remain static outdoors: weathered coatings experience measurable albedo loss driven by atmospheric soot deposition and biological fouling, particularly on flat roofs with inadequate drainage.',
          keyFindings: [
            'Soot deposition and biological growth measurably degrade coating reflectance over summer intervals.',
            'Flat roofs with poor water drainage exhibit accelerated fouling and reflectance decay.',
          ],
          sourceStatus: 'Grounded in provided material',
        },
        {
          theme: 'Seasonal heating trade-offs and pedestrian-level canopy coupling',
          synthesis:
            'The supplied observations identify two critical system-level boundaries: cool roofs incur wintertime solar heat-gain penalties in heating-dominated temperate climates, and rooftop cooling translates only modestly to pedestrian-level thermal comfort unless combined with street-canyon tree canopy shading.',
          keyFindings: [
            'Heating-dominated temperate climates experience winter solar heat-gain penalties that partially offset summer savings.',
            'Pedestrian thermal comfort requires pairing rooftop reflectivity with street-level tree canopy shading.',
          ],
          sourceStatus: 'Grounded in provided material',
        },
      ],
      researchGaps: [
        {
          gapTitle: 'Reliance on unweathered albedo assumptions in municipal cooling projections',
          category: 'Empirical',
          limitationAnalysis:
            'Evaluations that omit soot deposition and ponding-induced biological fouling overstate multi-year cooling retention on flat mid-rise roofs.',
          evidenceBasis: 'Derived directly from provided field observation notes on weathered elastomeric membranes.',
        },
        {
          gapTitle: 'Seasonal net-energy ambiguity in mixed and heating-dominated climates',
          category: 'Methodological',
          limitationAnalysis:
            'Summer-only heatwave monitoring fails to capture annual HVAC trade-offs where winter heating penalties alter lifecycle energy and carbon outcomes.',
          evidenceBasis: 'Grounded in provided observations of wintertime solar heat-gain penalties.',
        },
        {
          gapTitle: 'Decoupling between roof-surface cooling and pedestrian thermal exposure',
          category: 'Practical deployment',
          limitationAnalysis:
            'Single-intervention cool-roof programs inadequately address street-level heat stress when deployed without coordinated street-canyon tree shading.',
          evidenceBasis: 'Directly noted in the supplied urban canopy thermal monitoring excerpt.',
        },
      ],
      futureScope: [
        {
          direction: 'Self-cleaning and thermochromic adaptive roof membranes',
          proposedApproach:
            'Evaluate hydrophobic anti-soiling topcoats and temperature-responsive thermochromic pigments that switch between high summer reflectance and higher winter solar absorptance.',
          expectedImpact:
            'Mitigates both fouling-driven albedo loss and wintertime heating penalties in temperate cities.',
        },
        {
          direction: 'Co-optimized cool-roof and street-canyon forestry deployment models',
          proposedApproach:
            'Couple building-envelope energy balance models with 3D street-canyon radiative transfer simulations to evaluate joint roof-and-canopy retrofits.',
          expectedImpact:
            'Simultaneously lowers indoor top-floor cooling demand and pedestrian heat stress during extreme heatwaves.',
        },
        {
          direction: 'Standardized multi-year field aging and drainage-stratified protocols',
          proposedApproach:
            'Track weathered reflectance across roof drainage classes alongside verified meteorological station baselines and material aging standards.',
          expectedImpact:
            'Provides realistic lifecycle parameters for municipal building codes and urban climate action plans.',
        },
      ],
      report: {
        abstract:
          'High-albedo elastomeric cool-roof coatings are widely deployed to lower rooftop temperatures and air-conditioning electricity demand during urban heatwaves. Grounded in provided urban canopy thermal monitoring notes, this report examines the radiative performance, environmental aging, seasonal energy trade-offs, and street-level comfort boundaries of reflective roof membranes in dense mid-rise neighborhoods. Synthesis of field observations reveals that while reflective membranes effectively reduce top-floor summer cooling loads, long-term efficacy is constrained by soot deposition and biological fouling on poorly drained flat roofs, wintertime solar heat-gain penalties in heating-dominated temperate zones, and limited pedestrian-level cooling when implemented without street-canyon tree canopy shading. Five research questions and future directions focusing on anti-soiling thermochromic materials and integrated roof-canopy planning are outlined. External meteorological archives and material aging citations require independent verification.',
        introduction:
          'Dense mid-rise urban districts amplify summer heatwave exposure through low-albedo impervious surfaces and reduced evapotranspiration. Reflective elastomeric roof coatings counter radiative heat buildup by reflecting shortwave solar irradiance and emitting longwave thermal energy. However, translating roof-surface temperature drops into durable, year-round energy savings and street-level human thermal comfort requires analyzing material aging, seasonal climate dynamics, and urban canyon morphology.',
        researchObjectives: [
          'Quantify albedo degradation trajectories caused by atmospheric soot and biological fouling on flat roofs with poor drainage.',
          'Assess full-year HVAC trade-offs balancing summer top-floor cooling savings against winter heating penalties in temperate climates.',
          'Analyze microclimatic coupling between mid-rise rooftop reflectance and pedestrian-level thermal comfort with and without street tree canopies.',
          'Propose durable material and integrated urban-planning strategies for municipal heat-mitigation programs.',
        ],
        researchQuestions: [
          'At what rate do atmospheric soot deposition and biological fouling degrade solar reflectance on flat poorly drained mid-rise roofs across multi-year exposure intervals?',
          'How does the annual net building energy balance weigh summer air-conditioning electricity reductions against wintertime heating penalties in heating-dominated temperate climates?',
          'Why do rooftop albedo retrofits alone produce modest pedestrian-level thermal comfort gains in mid-rise street canyons unless paired with vegetative tree canopy shading?',
          'How do roof slope, drainage geometry, and hydrophobic topcoat formulations mitigate biological fouling and preserve long-term thermal performance?',
          'What spatial prioritization criteria maximize neighborhood cooling equity when deploying combined cool-roof and street-tree interventions under municipal budget constraints?',
        ],
        literatureReview:
          'Analysis of the supplied field observation notes identifies three core themes. First, radiative cooling mechanics enable high-albedo elastomeric membranes to lower rooftop surface temperatures during summer heatwaves and curtail top-floor air-conditioning demand. Second, real-world exposure degrades optical performance: atmospheric soot accumulation and biological fouling measurably reduce reflectance on weathered roofs, especially flat assemblies suffering poor drainage. Third, system-level boundaries govern net urban benefit, with wintertime solar heat-gain penalties emerging in heating-dominated temperate climates and pedestrian-level comfort remaining modestly affected unless rooftop reflectivity is paired with street-canyon tree canopy shading. Note: Specific meteorological archives and material testing standards mentioned as needing lookup have not been fabricated and require bibliographic verification.',
        researchGaps:
          'Three primary gaps emerge from the field observations: projection errors stemming from unweathered reflectance assumptions on ponding-prone roofs, incomplete seasonal energy accounting in temperate climates, and isolated roof-only deployment strategies that overlook street-level pedestrian radiant load.',
        conclusion:
          'Reflective cool-roof coatings provide substantial summer rooftop and top-floor cooling, but durable municipal deployment must account for drainage-sensitive fouling, seasonal heating balances, and complementary street-canyon shading.',
        futureScope:
          'Future work should evaluate fouling-resistant and thermochromic roof coatings, establish multi-year weathered albedo benchmarks verified against meteorological station archives, and co-design roof-plus-canopy urban cooling corridors.',
      },
      verificationNotice:
        'Grounded in user-provided excerpt: Findings on elastomeric albedo aging, drainage-linked biological fouling, winter heating penalties, and street-canopy coupling are derived strictly from the supplied field notes. External meteorological station records and material standards require independent verification.',
    },
  },
];
