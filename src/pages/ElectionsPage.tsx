import { motion } from 'framer-motion';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { SkeletonChart } from '../components/ui/Skeleton.tsx';
import { KeyTakeaways } from '../components/ui/KeyTakeaways.tsx';
import { NarrativeBridge } from '../components/ui/NarrativeBridge.tsx';
import { useElectionsStore } from '../store/electionsStore.ts';
import { useElectionsData } from '../hooks/useElectionsData.ts';
import { ElectionsHeroSection } from '../components/elections/ElectionsHeroSection.tsx';
import { TurnoutSection } from '../components/elections/TurnoutSection.tsx';
import { PartyLandscapeSection } from '../components/elections/PartyLandscapeSection.tsx';
import { LokSabha2024Section } from '../components/elections/LokSabha2024Section.tsx';
import { MoneyMuscleSection } from '../components/elections/MoneyMuscleSection.tsx';
import { GenderGapSection } from '../components/elections/GenderGapSection.tsx';
import { DomainCTA } from '../components/ui/DomainCTA.tsx';

export default function ElectionsPage() {
  const year = useElectionsStore((s) => s.selectedYear);
  const { summary, turnout, results, candidates, representation, loading, error } = useElectionsData(year);

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
        <p style={{ color: 'var(--text-secondary)' }}>Failed to load elections data.</p>
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
        title="Elections — 96.88 Crore Voters | Indian Data Project"
        description="India's Lok Sabha elections from 1957 to 2024 — turnout trends, party landscape shifts, candidate wealth and criminal records, and women's representation. Data from ECI, TCPD, and ADR."
        path="/elections"
        image="/og-elections.png"
      />

      <ElectionsHeroSection summary={summary} />

      {summary && <KeyTakeaways
        accent="#6366F1"
        pills={[
          { value: `${summary.turnout2024}%`, label: 'Turnout in 2024 — 64 crore voted', sectionId: 'turnout' },
          { value: `${summary.bjpSeats2024}`, label: 'BJP seats — 32 short of majority', sectionId: 'lok-sabha-2024' },
          { value: `${summary.criminalPct}%`, label: 'MPs with criminal cases — from their own sworn affidavits', sectionId: 'money-muscle' },
          { value: `${summary.womenMPsPct2024}%`, label: 'Women in Parliament — half the global average', sectionId: 'gender-gap' },
        ]}
      />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="96.88 crore eligible voters. More people than Europe's entire population. In 2024, nearly two-thirds walked to a polling booth, waited in line, and pressed a button. This is the most staggering act of collective civic faith on the planet. But faith in what?"
        highlights={{
          'civic': 'var(--indigo)',
          'faith': 'var(--indigo)',
          'planet': 'var(--indigo-light)',
          'what': 'var(--gold)',
        }}
      />

      <div className="composition-divider" />

      {turnout && <TurnoutSection data={turnout} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="Those 64 crore people chose. India's political map has been redrawn three times in 67 years — Congress dominance, coalition fragmentation, then BJP's ascent. 2024 was the first turn: BJP fell below majority for the first time in a decade."
        highlights={{
          'congress': 'var(--indigo)',
          'majority': 'var(--gold)',
          'turn': 'var(--indigo-light)',
        }}
      />

      <div className="composition-divider" />

      {results && <PartyLandscapeSection data={results} />}

      <div className="composition-divider" />

      {results && <LokSabha2024Section data={results} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="The ballot box delivered 543 representatives. Not what they promise on the campaign trail matters here. What their own sworn affidavits — filed under oath with the Election Commission — actually reveal."
        highlights={{
          '543': 'var(--indigo)',
          'sworn': 'var(--negative)',
          'oath': 'var(--negative)',
          'reveal': 'var(--gold)',
        }}
      />

      <div className="composition-divider" />

      {candidates && <MoneyMuscleSection data={candidates} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="It gets worse. Not only are many representatives wealthy and facing criminal charges — half the population is systematically excluded from the room where laws are made."
        highlights={{
          'worse': 'var(--negative)',
          'excluded': 'var(--negative)',
          'systematically': 'var(--negative)',
          'laws': 'var(--indigo)',
        }}
      />

      <div className="composition-divider" />

      {representation && <GenderGapSection data={representation} />}

      <div className="composition-divider" />

      <DomainCTA domain="elections" />
    </motion.div>
  );
}
