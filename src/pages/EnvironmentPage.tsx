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
          { value: `${summary?.renewablesPct?.toFixed(0) ?? '—'}%`, label: 'Energy from renewables', sectionId: 'energy-transition' },
          { value: `${summary?.co2PerCapita?.toFixed(1) ?? '—'}t`, label: 'CO₂ per capita (US: 14t)', sectionId: 'carbon-footprint' },
        ]}
      />

      <div className="composition-divider" />

      <NarrativeBridge
        text="India's environmental story is one of contradictions. The air is toxic, forests are shrinking, but the energy transition is accelerating faster than almost anywhere on earth."
        highlights={{
          'toxic': 'var(--negative)',
          'shrinking': 'var(--saffron)',
          'accelerating': 'var(--teal)',
          'energy': 'var(--teal)',
        }}
      />

      <div className="composition-divider" />

      {airQuality && <AirQualitySection data={airQuality} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="While the air gets worse, India's forests provide a vital shield. But the national average hides a troubling pattern: the northeast is losing natural forests even as plantations grow in the center."
        highlights={{
          'forests': 'var(--teal)',
          'shield': 'var(--teal)',
          'losing': 'var(--negative)',
          'northeast': 'var(--saffron)',
        }}
      />

      <div className="composition-divider" />

      {forest && <ForestCoverSection data={forest} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="Energy is where India's transformation is most visible. Solar capacity has grown 22× in 9 years. But coal isn't going away — demand is growing too fast for clean energy alone."
        highlights={{
          'Solar': 'var(--teal)',
          '22×': 'var(--teal)',
          'coal': 'var(--text-muted)',
          'growing': 'var(--saffron)',
        }}
      />

      <div className="composition-divider" />

      {energy && <EnergyTransitionSection data={energy} />}

      <div className="composition-divider" />

      {energy && <CarbonFootprintSection data={energy} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="Beneath the surface, the most existential crisis is underfoot. India is the world's largest groundwater user, and many states are pumping faster than nature can replenish."
        highlights={{
          'groundwater': 'var(--teal)',
          'existential': 'var(--negative)',
          'pumping': 'var(--saffron)',
          'replenish': 'var(--teal)',
        }}
      />

      <div className="composition-divider" />

      {water && <WaterStressSection data={water} />}

      <div className="composition-divider" />

      <DomainCTA domain="environment" />
    </motion.div>
  );
}
