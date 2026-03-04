import { motion } from 'framer-motion';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { SkeletonChart } from '../components/ui/Skeleton.tsx';
import { KeyTakeaways } from '../components/ui/KeyTakeaways.tsx';
import { NarrativeBridge } from '../components/ui/NarrativeBridge.tsx';
import { useCensusStore } from '../store/censusStore.ts';
import { useCensusData } from '../hooks/useCensusData.ts';
import { CensusHeroSection } from '../components/census/CensusHeroSection.tsx';
import { PopulationSection } from '../components/census/PopulationSection.tsx';
import { AgeDemographicsSection } from '../components/census/AgeDemographicsSection.tsx';
import { VitalStatsSection } from '../components/census/VitalStatsSection.tsx';
import { HealthSection } from '../components/census/HealthSection.tsx';
import { LiteracySection } from '../components/census/LiteracySection.tsx';
import { UrbanizationSection } from '../components/census/UrbanizationSection.tsx';
import { DomainCTA } from '../components/ui/DomainCTA.tsx';

export default function CensusPage() {
  const year = useCensusStore((s) => s.selectedYear);
  const { summary, population, demographics, literacy, health, loading, error } = useCensusData(year);

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
        <p style={{ color: 'var(--text-secondary)' }}>Failed to load census data.</p>
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
        title="Census & Demographics — India's 1.45 Billion Story | Indian Data Project"
        description="Population trends, age structure, vital statistics, health outcomes, literacy, and urbanization across India's 36 states and union territories — visualized from Census, NFHS, SRS, and World Bank data."
        path="/census"
        image="/og-census.png"
      />

      <CensusHeroSection summary={summary} />

      {summary && <KeyTakeaways
        accent="#8B5CF6"
        pills={[
          { value: String(summary.sexRatio), label: 'Girls per 1,000 boys — 57 are "missing"', sectionId: 'health' },
          { value: '1 in 4', label: "Indians who can't read or write", sectionId: 'literacy' },
          { value: `${summary.populationGrowthRate}%`, label: 'Population growth — at a historic low', sectionId: 'population' },
          { value: `${Math.round(summary.urbanizationRate)}%`, label: 'Only 1 in 3 Indians lives in a city', sectionId: 'urbanization' },
        ]}
      />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="India's population story is not just about size. It's about structure — who is young, who is working, who needs care. The numbers reveal a nation at a demographic crossroads."
        highlights={{
          'structure': 'var(--violet)',
          'young': 'var(--violet)',
          'working': 'var(--violet)',
          'crossroads': 'var(--violet)',
        }}
      />

      <div className="composition-divider" />

      {population && <PopulationSection data={population} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="India has the largest working-age population on Earth. For every dependent — child or elderly — there are nearly three workers. This demographic dividend is a one-time window."
        highlights={{
          'working-age': 'var(--violet)',
          'dividend': 'var(--violet)',
          'window': 'var(--violet)',
        }}
      />

      <div className="composition-divider" />

      {demographics && <AgeDemographicsSection data={demographics} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="Families are getting smaller. Indians are living longer. Both trends are accelerating — but they're not happening evenly across states."
        highlights={{
          'smaller': 'var(--violet)',
          'longer': 'var(--violet)',
          'evenly': 'var(--saffron)',
        }}
      />

      <div className="composition-divider" />

      {demographics && <VitalStatsSection data={demographics} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="A child born in Kerala today has nearly the same survival odds as one born in Western Europe. A child born in some northern states faces odds comparable to sub-Saharan Africa. Same country, two realities."
        highlights={{
          'Kerala': 'var(--violet)',
          'Western Europe': 'var(--violet)',
          'sub-Saharan Africa': 'var(--saffron)',
          'realities': 'var(--saffron)',
        }}
      />

      <div className="composition-divider" />

      {health && <HealthSection data={health} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="Literacy defines opportunity. The gender gap in literacy has narrowed over decades, but in some states it remains a canyon — 20 percentage points or more between men and women."
        highlights={{
          'Literacy': 'var(--violet)',
          'gender gap': 'var(--violet)',
          'canyon': 'var(--saffron)',
        }}
      />

      <div className="composition-divider" />

      {literacy && <LiteracySection data={literacy} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="India is urbanizing — but slowly compared to China or Brazil. Rural India is still home to two in three Indians. The urban story is really a story of a dozen mega-cities growing while thousands of small towns stand still."
        highlights={{
          'urbanizing': 'var(--violet)',
          'Rural': 'var(--violet)',
          'mega-cities': 'var(--violet)',
        }}
      />

      <div className="composition-divider" />

      {demographics && <UrbanizationSection data={demographics} />}

      <div className="composition-divider" />

      <DomainCTA domain="census" />
    </motion.div>
  );
}
