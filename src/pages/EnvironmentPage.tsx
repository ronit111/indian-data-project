import { motion } from 'framer-motion';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { SkeletonChart } from '../components/ui/Skeleton.tsx';
import { KeyTakeaways } from '../components/ui/KeyTakeaways.tsx';
import { NarrativeBridge } from '../components/ui/NarrativeBridge.tsx';
import { useEnvironmentStore } from '../store/environmentStore.ts';
import { useEnvironmentData } from '../hooks/useEnvironmentData.ts';
import { EnvironmentHeroSection } from '../components/environment/EnvironmentHeroSection.tsx';
import { AirQualitySection } from '../components/environment/AirQualitySection.tsx';
import { ForestCoverSection } from '../components/environment/ForestCoverSection.tsx';
import { EnergyTransitionSection } from '../components/environment/EnergyTransitionSection.tsx';
import { CarbonFootprintSection } from '../components/environment/CarbonFootprintSection.tsx';
import { WaterStressSection } from '../components/environment/WaterStressSection.tsx';
import { DomainCTA } from '../components/ui/DomainCTA.tsx';

export default function EnvironmentPage() {
  const year = useEnvironmentStore((s) => s.selectedYear);
  const { summary, airQuality, forest, energy, water, loading, error } = useEnvironmentData(year);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-24 space-y-12">
        <SkeletonChart height={400} />
        <SkeletonChart height={300} />
        <SkeletonChart height={300} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-24 text-center">
        <p style={{ color: 'var(--text-secondary)' }}>Failed to load environment data.</p>
        <button
          className="mt-4 px-4 py-2 rounded-lg text-sm"
          style={{ background: 'var(--bg-raised)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <SEOHead
        title="Environment — 53 μg/m³ PM2.5 | Indian Data Project"
        description="India's air quality, forest cover, energy transition, carbon footprint, and water stress — visualized from World Bank, CPCB, FSI, CEA, and CGWB data."
        path="/environment"
        image="/og-environment.png"
      />

      <EnvironmentHeroSection summary={summary} />

      <KeyTakeaways
        accent="#14B8A6"
        pills={[
          { value: `${summary?.pm25?.toFixed(0) ?? '—'} μg/m³`, label: 'PM2.5 — 10× the WHO safe limit', sectionId: 'air-quality' },
          { value: `${summary?.forestPct?.toFixed(1) ?? '—'}%`, label: 'Forest cover (target: 33%)', sectionId: 'forest-cover' },
          { value: `${summary?.renewablesPct?.toFixed(0) ?? '—'}%`, label: 'Renewable installed capacity (coal generates 70%+ of electricity)', sectionId: 'energy-transition' },
          { value: `${summary?.co2PerCapita?.toFixed(1) ?? '—'}t`, label: 'CO₂ per capita (US: 14t)', sectionId: 'carbon-footprint' },
        ]}
      />

      <div className="composition-divider" />

      <NarrativeBridge
        text="Every breath a Delhi resident takes in winter contains 10× the safe limit. The invisible crisis is worse."
        highlights={{
          '10×': 'var(--negative)',
          'invisible': 'var(--saffron)',
          'worse': 'var(--saffron)',
        }}
      />

      <div className="composition-divider" />

      {airQuality && <AirQualitySection data={airQuality} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="But India's environmental story is not all deterioration. Beneath the smog, forests are neither a clear win nor a clear loss."
        highlights={{
          'deterioration': 'var(--negative)',
          'forests': 'var(--teal)',
        }}
      />

      <div className="composition-divider" />

      {forest && <ForestCoverSection data={forest} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="If forests are the ground-level balance sheet, energy is the industrial one. India's transformation is unmistakable — solar capacity 22× in a decade. But coal has not shrunk. India is adding clean on top of dirty."
        highlights={{
          'unmistakable': 'var(--teal)',
          '22×': 'var(--teal)',
          'shrunk': 'var(--saffron)',
          'dirty': 'var(--saffron)',
        }}
      />

      <div className="composition-divider" />

      {energy && <EnergyTransitionSection data={energy} />}

      <div className="composition-divider" />

      {energy && <CarbonFootprintSection data={energy} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="All this energy comes at a cost — India ranks 3rd globally in total emissions. But the most existential crisis is invisible. It is underfoot."
        highlights={{
          '3rd': 'var(--saffron)',
          'globally': 'var(--saffron)',
          'existential': 'var(--negative)',
          'invisible': 'var(--negative)',
          'underfoot': 'var(--negative)',
        }}
      />

      <div className="composition-divider" />

      {water && <WaterStressSection data={water} />}

      <div className="composition-divider" />

      <DomainCTA domain="environment" />
    </motion.div>
  );
}
