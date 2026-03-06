import { motion } from 'framer-motion';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { SkeletonChart } from '../components/ui/Skeleton.tsx';
import { KeyTakeaways } from '../components/ui/KeyTakeaways.tsx';
import { NarrativeBridge } from '../components/ui/NarrativeBridge.tsx';
import { useCrimeStore } from '../store/crimeStore.ts';
import { useCrimeData } from '../hooks/useCrimeData.ts';
import { CrimeHeroSection } from '../components/crime/CrimeHeroSection.tsx';
import { CrimeOverviewSection } from '../components/crime/CrimeOverviewSection.tsx';
import { WomenSafetySection } from '../components/crime/WomenSafetySection.tsx';
import { RoadAccidentsSection } from '../components/crime/RoadAccidentsSection.tsx';
import { CybercrimeSection } from '../components/crime/CybercrimeSection.tsx';
import { PoliceSection } from '../components/crime/PoliceSection.tsx';
import { JusticeSection } from '../components/crime/JusticeSection.tsx';
import { DomainCTA } from '../components/ui/DomainCTA.tsx';

export default function CrimePage() {
  const year = useCrimeStore((s) => s.selectedYear);
  const { summary, overview, womenSafety, roadAccidents, cybercrime, police, justice, loading, error } = useCrimeData(year);

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
        <p style={{ color: 'var(--text-secondary)' }}>Failed to load crime data.</p>
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
        title="Crime & Safety — 58.2 Lakh Crimes in 2022 | Indian Data Project"
        description="India's crime landscape from NCRB data — crime trends, crimes against women, road accidents, cybercrime, police infrastructure, and the justice pipeline. Data from NCRB, MoRTH, BPRD."
        path="/crime"
        image="/og-crime.png"
      />

      <CrimeHeroSection summary={summary} />

      {summary && <KeyTakeaways
        accent="#DC2626"
        pills={[
          { value: `${(summary.totalCrimes / 100000).toFixed(1)}L`, label: `crimes — rate ${summary.crimeRate} per lakh`, sectionId: 'crime-overview' },
          { value: `${(summary.womenCrimes / 1000).toFixed(0)}K`, label: 'crimes against women — rate 66.4 per lakh', sectionId: 'women-safety' },
          { value: `${Math.round(summary.roadDeaths / 365)}`, label: 'road deaths every day — 1.68 lakh in 2022', sectionId: 'road-accidents' },
          { value: `${summary.convictionRatePct}%`, label: `conviction rate — ${(3.5).toFixed(1)} yr avg trial`, sectionId: 'justice-pipeline' },
        ]}
      />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="India recorded 58 lakh crimes in 2022. One every 5 seconds. The real number is far higher — most crimes go unreported."
        highlights={{
          '58': 'var(--crimson)',
          'lakh': 'var(--crimson)',
          '5 seconds': 'var(--crimson-light)',
          'unreported': 'var(--crimson-light)',
        }}
      />

      <div className="composition-divider" />

      {overview && <CrimeOverviewSection data={overview} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="4.45 lakh crimes against women in 2022 — only what's reported. One case every 71 seconds. Cruelty by husbands tops the list."
        highlights={{
          '4.45': 'var(--crimson)',
          'lakh': 'var(--crimson)',
          '71 seconds': 'var(--crimson-light)',
          'Cruelty': 'var(--crimson-light)',
        }}
      />

      <div className="composition-divider" />

      {womenSafety && <WomenSafetySection data={womenSafety} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="Roads kill more Indians than all violent crime combined. 461 deaths every day. Over-speeding causes 7 in 10 fatal crashes."
        highlights={{
          'Roads': 'var(--crimson)',
          '461': 'var(--crimson)',
          'Over-speeding': 'var(--crimson-light)',
          '7 in 10': 'var(--crimson-light)',
        }}
      />

      <div className="composition-divider" />

      {roadAccidents && <RoadAccidentsSection data={roadAccidents} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="Cybercrime grew 3x in 5 years. 22.68 lakh complaints filed online — barely 3% became FIRs. The digital economy outpaced digital policing."
        highlights={{
          '3x': 'var(--crimson)',
          '22.68': 'var(--crimson)',
          '3%': 'var(--crimson-light)',
          'digital policing': 'var(--crimson-light)',
        }}
      />

      <div className="composition-divider" />

      {cybercrime && <CybercrimeSection data={cybercrime} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="Who fights this? India's police force is 22% understaffed. Bihar has 77 police per lakh — Delhi has 492. Women are 11.7% of the force."
        highlights={{
          '18%': 'var(--crimson)',
          'Bihar': 'var(--crimson-light)',
          'Delhi': 'var(--crimson-light)',
          '11.7%': 'var(--crimson)',
        }}
      />

      <div className="composition-divider" />

      {police && <PoliceSection data={police} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="Even when crime is reported, the justice system moves at geological pace. Average trial: 3.5 years. Only 39% end in conviction. 31 lakh cases are just... waiting."
        highlights={{
          '3.5 years': 'var(--crimson)',
          '39%': 'var(--crimson)',
          '31 lakh': 'var(--crimson-light)',
          'waiting': 'var(--crimson-light)',
        }}
      />

      <div className="composition-divider" />

      {justice && <JusticeSection data={justice} />}

      <div className="composition-divider" />

      <DomainCTA domain="crime" />
    </motion.div>
  );
}
