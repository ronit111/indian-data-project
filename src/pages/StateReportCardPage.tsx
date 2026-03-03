import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePersonalizationStore } from '../store/personalizationStore.ts';
import { buildReportCard } from '../lib/stateReportEngine.ts';
import type { AllDomainData } from '../lib/stateReportEngine.ts';
import {
  loadGSDP,
  loadStateRevenue,
  loadFiscalHealth,
  loadStatewise,
  loadPopulation,
  loadLiteracyData,
  loadHealthData,
  loadEnrollment,
  loadUnemployment,
  loadParticipation,
  loadInfrastructure,
  loadDisease,
  loadAirQuality,
  loadForest,
  loadWater,
  loadTurnout,
  loadCrimeIndicators,
} from '../lib/dataLoader.ts';
import { StateSelector } from '../components/personalization/StateSelector.tsx';
import { ReportCardGrid } from '../components/report-card/ReportCardGrid.tsx';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { ReportShareCard } from '../components/report-card/ReportShareCard.tsx';
import { SkeletonChart, SkeletonText } from '../components/ui/Skeleton.tsx';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function StateReportCardPage() {
  const { selectedStateId, setState } = usePersonalizationStore();
  const [allData, setAllData] = useState<AllDomainData>({});
  const [loading, setLoading] = useState(true);

  // Load all domain data using Promise.allSettled
  useEffect(() => {
    const year = '2025-26';
    const loaders = [
      { key: 'gsdp', fn: () => loadGSDP(year) },
      { key: 'revenue', fn: () => loadStateRevenue(year) },
      { key: 'fiscalHealth', fn: () => loadFiscalHealth(year) },
      { key: 'statewise', fn: () => loadStatewise(year) },
      { key: 'population', fn: () => loadPopulation(year) },
      { key: 'literacy', fn: () => loadLiteracyData(year) },
      { key: 'health', fn: () => loadHealthData(year) },
      { key: 'enrollment', fn: () => loadEnrollment(year) },
      { key: 'unemployment', fn: () => loadUnemployment(year) },
      { key: 'participation', fn: () => loadParticipation(year) },
      { key: 'infrastructure', fn: () => loadInfrastructure(year) },
      { key: 'disease', fn: () => loadDisease(year) },
      { key: 'airQuality', fn: () => loadAirQuality(year) },
      { key: 'forest', fn: () => loadForest(year) },
      { key: 'water', fn: () => loadWater(year) },
      { key: 'turnout', fn: () => loadTurnout(year) },
      { key: 'crimeIndicators', fn: () => loadCrimeIndicators(year) },
    ] as const;

    Promise.allSettled(loaders.map((l) => l.fn())).then((results) => {
      const data: AllDomainData = {};
      results.forEach((result, i) => {
        if (result.status === 'fulfilled') {
          (data as Record<string, unknown>)[loaders[i].key] = result.value;
        }
      });
      setAllData(data);
      setLoading(false);
    });
  }, []);

  // Default to Maharashtra if no state selected
  const stateId = selectedStateId ?? 'MH';

  const report = useMemo(
    () => buildReportCard(stateId, allData),
    [stateId, allData]
  );

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-6 sm:px-8 py-10 md:py-14">
        <SkeletonChart height={100} />
        <div className="space-y-4 mt-8">
          <SkeletonText lines={4} />
          <SkeletonText lines={4} />
          <SkeletonText lines={4} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <SEOHead
        title={`${report.state.name} — State Report Card`}
        description={`How does ${report.state.name} compare to other states? See rankings across economy, budget, education, healthcare, environment, elections, and more.`}
        path="/states/your-state"
        image="/og-state-report-card.png"
      />

      {/* Page header */}
      <motion.div
        className="max-w-4xl mx-auto px-6 sm:px-8 pt-10 md:pt-14"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <div className="text-center mb-8">
          <motion.h1
            className="text-composition font-bold mb-3"
            style={{ color: 'var(--text-primary)' }}
            variants={fadeUp}
          >
            Your State Report Card
          </motion.h1>
          <motion.p
            className="text-base max-w-xl mx-auto mb-6"
            style={{ color: 'var(--text-secondary)' }}
            variants={fadeUp}
          >
            How does your state rank across economy, education, health, and more?
          </motion.p>
        </div>

        {/* State selector */}
        <motion.div
          className="flex justify-center mb-10"
          variants={fadeUp}
        >
          <StateSelector
            value={stateId}
            onChange={(id) => setState(id)}
            size="lg"
            showLabel
          />
        </motion.div>
      </motion.div>

      {/* State name hero */}
      <motion.div
        key={stateId}
        className="max-w-4xl mx-auto px-6 sm:px-8 mb-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="rounded-xl p-6 text-center"
          style={{ background: 'var(--bg-raised)', border: 'var(--border-subtle)' }}
        >
          <h2
            className="text-2xl md:text-3xl font-bold font-mono"
            style={{ color: 'var(--text-primary)' }}
          >
            {report.state.name}
          </h2>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {report.state.id} · Data across {report.panels.filter((p) => p.dataAvailable).length} domains
          </p>
        </div>
      </motion.div>

      {/* Report card grid */}
      <div className="max-w-4xl mx-auto px-6 sm:px-8 pb-16">
        <ReportCardGrid report={report} />

        <div className="flex justify-center mt-8">
          <ReportShareCard report={report} />
        </div>

        <p className="text-xs text-center mt-12" style={{ color: 'var(--text-muted)' }}>
          Sources: RBI Handbook (GSDP, Revenue, Fiscal Health), Census 2011 + NPC 2026 (Demographics),
          UDISE+ 2023-24 (Education), PLFS 2023-24 (Employment), NHP 2022 + NFHS-5 (Healthcare),
          Union Budget 2025-26 (Budget Allocation), CPCB + FSI + CGWB (Environment), ECI (Elections).
        </p>
      </div>
    </motion.div>
  );
}
