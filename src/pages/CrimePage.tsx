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
          { value: '13 out of 100', label: 'crimes that end in conviction — the pipeline leaks at every stage', sectionId: 'justice-pipeline' },
          { value: `${(summary.totalCrimes / 100000).toFixed(1)}L`, label: `crimes reported in 2022 — one every 5 seconds`, sectionId: 'crime-overview' },
          { value: `${(summary.womenCrimes / 1000).toFixed(0)}K`, label: 'crimes against women — one case every 71 seconds', sectionId: 'women-safety' },
          { value: `${Math.round(summary.roadDeaths / 365)}`, label: 'road deaths per day — more than all violent crime combined', sectionId: 'road-accidents' },
        ]}
      />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="58 lakh crimes. One every 5 seconds. And those are only the ones that were reported. Follow one crime from the moment it happens to conviction — on average, that journey takes 3.5 years. For 31 lakh families, it hasn't started."
        highlights={{
          '58': 'var(--crimson)',
          'reported': 'var(--crimson-light)',
          '3.5': 'var(--crimson)',
          '31': 'var(--crimson)',
        }}
      />

      <div className="composition-divider" />

      {overview && <CrimeOverviewSection data={overview} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="Within that ocean of crime, one category demands separate attention. Not because the numbers are the largest — but because the victims are targeted for who they are. 4.45 lakh times in 2022, the crime was being a woman."
        highlights={{
          'woman': 'var(--crimson)',
          'targeted': 'var(--crimson)',
          '4.45': 'var(--crimson)',
          'separate': 'var(--crimson-light)',
        }}
      />

      <div className="composition-divider" />

      {womenSafety && <WomenSafetySection data={womenSafety} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="Crime is not only about people harming people. India's roads killed 1.68 lakh in 2022 — more than all violent crime combined. India has 1% of the world's vehicles but 11% of global road deaths. This is not fate. It is preventable death at industrial scale."
        highlights={{
          '1.68': 'var(--crimson)',
          'preventable': 'var(--crimson)',
          '11%': 'var(--crimson)',
          'industrial': 'var(--crimson-light)',
        }}
      />

      <div className="composition-divider" />

      {roadAccidents && <RoadAccidentsSection data={roadAccidents} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="While roads kill in the physical world, a new frontier of crime is exploding in the digital one. Cybercrime FIRs tripled in 5 years. But of 22.68 lakh complaints filed online, barely 3% became FIRs. The digital economy grew faster than digital policing."
        highlights={{
          'tripled': 'var(--crimson)',
          '3%': 'var(--crimson)',
          'grew': 'var(--crimson-light)',
          'faster': 'var(--crimson-light)',
        }}
      />

      <div className="composition-divider" />

      {cybercrime && <CybercrimeSection data={cybercrime} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="Four categories of crime. Four systems stretched thin. Who handles all of this? India has 155 police per lakh people — against a UN recommendation of 222. 22% of sanctioned posts sit vacant. Bihar has 77 police per lakh. Delhi has 492. Same country, different reality."
        highlights={{
          '155': 'var(--crimson)',
          '22%': 'var(--crimson)',
          'vacant': 'var(--crimson)',
          'reality': 'var(--crimson-light)',
        }}
      />

      <div className="composition-divider" />

      {police && <PoliceSection data={police} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="Understaffed police feed an understaffed court system. Of every 100 crimes reported, 13 end in conviction. The funnel narrows at every stage. 31 lakh cases are waiting. 21 judges per million citizens. The system does not need efficiency tweaks — it needs fundamental expansion."
        highlights={{
          '13': 'var(--crimson)',
          'narrows': 'var(--crimson)',
          '31': 'var(--crimson)',
          'fundamental': 'var(--crimson-light)',
        }}
      />

      <div className="composition-divider" />

      {justice && <JusticeSection data={justice} />}

      <div className="composition-divider" />

      <DomainCTA domain="crime" />
    </motion.div>
  );
}
