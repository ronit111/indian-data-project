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
          { value: '68 of 100', label: 'Indians are working-age — the dividend window peaks around 2035', sectionId: 'age' },
          { value: String(summary.sexRatio), label: 'Girls per 1,000 boys — 57 are "missing"', sectionId: 'health' },
          { value: '1 in 4', label: "Indians who can't read or write", sectionId: 'literacy' },
          { value: `${summary.populationGrowthRate}%`, label: 'Population growth — at a historic low', sectionId: 'population' },
        ]}
      />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="For every 100 Indians, 68 are of working age. That ratio peaks around 2035 — then it starts falling, permanently. What India does in the next decade decides the next century."
        highlights={{
          '2035': 'var(--violet)',
          'permanently': 'var(--saffron)',
          'decade': 'var(--violet)',
          'century': 'var(--violet)',
        }}
      />

      <div className="composition-divider" />

      {population && <PopulationSection data={population} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="The growth is slowing. But who are these 1.45 billion people? That's where the story gets interesting — and urgent."
        highlights={{
          'slowing': 'var(--saffron)',
          'interesting': 'var(--violet)',
          'urgent': 'var(--saffron)',
        }}
      />

      <div className="composition-divider" />

      {demographics && <AgeDemographicsSection data={demographics} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="The dividend only pays off if the population is healthy and educated. Families are getting smaller. People are living longer. India has already completed most of its demographic transition — and that is the mechanism behind the closing window."
        highlights={{
          'dividend': 'var(--violet)',
          'smaller': 'var(--violet)',
          'closing': 'var(--saffron)',
        }}
      />

      <div className="composition-divider" />

      {demographics && <VitalStatsSection data={demographics} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="But national averages mask a split so dramatic it's hard to believe these are the same country. A child born in Kerala has survival odds matching Western Europe. A child in some northern states faces odds comparable to sub-Saharan Africa."
        highlights={{
          'kerala': 'var(--violet)',
          'europe': 'var(--violet)',
          'africa': 'var(--saffron)',
          'dramatic': 'var(--saffron)',
        }}
      />

      <div className="composition-divider" />

      {health && <HealthSection data={health} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="Survival is step one. The next question: can these children read? Literacy is the gateway to every other opportunity — and the gender gap is still a canyon in some states."
        highlights={{
          'survival': 'var(--violet)',
          'read': 'var(--violet)',
          'gateway': 'var(--violet)',
          'canyon': 'var(--saffron)',
        }}
      />

      <div className="composition-divider" />

      {literacy && <LiteracySection data={literacy} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="And where these literate, healthy, working-age Indians live matters enormously. Urban areas create most formal-sector jobs. India is 35% urban — far below the global average of 56%."
        highlights={{
          'live': 'var(--violet)',
          'urban': 'var(--violet)',
          '35%': 'var(--saffron)',
        }}
      />

      <div className="composition-divider" />

      {demographics && <UrbanizationSection data={demographics} />}

      <div className="composition-divider" />

      <DomainCTA domain="census" />
    </motion.div>
  );
}
