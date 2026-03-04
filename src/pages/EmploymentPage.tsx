import { motion } from 'framer-motion';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { SkeletonChart } from '../components/ui/Skeleton.tsx';
import { KeyTakeaways } from '../components/ui/KeyTakeaways.tsx';
import { NarrativeBridge } from '../components/ui/NarrativeBridge.tsx';
import { useEmploymentStore } from '../store/employmentStore.ts';
import { useEmploymentData } from '../hooks/useEmploymentData.ts';
import { EmploymentHeroSection } from '../components/employment/EmploymentHeroSection.tsx';
import { ParticipationSection } from '../components/employment/ParticipationSection.tsx';
import { StructuralShiftSection } from '../components/employment/StructuralShiftSection.tsx';
import { YouthUnemploymentSection } from '../components/employment/YouthUnemploymentSection.tsx';
import { GenderGapSection } from '../components/employment/GenderGapSection.tsx';
import { InformalitySection } from '../components/employment/InformalitySection.tsx';
import { RuralUrbanSection } from '../components/employment/RuralUrbanSection.tsx';
import { DomainCTA } from '../components/ui/DomainCTA.tsx';

export default function EmploymentPage() {
  const year = useEmploymentStore((s) => s.selectedYear);
  const { summary, unemployment, participation, sectoral, loading, error } = useEmploymentData(year);

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
        <p style={{ color: 'var(--text-secondary)' }}>Failed to load employment data.</p>
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
        title="Employment — 57 Crore Workers | Indian Data Project"
        description="Labour force participation, unemployment, sectoral shifts, gender gaps, and informality across India's 57-crore workforce — visualized from PLFS, World Bank, and RBI KLEMS data."
        path="/employment"
        image="/og-employment.png"
      />

      <EmploymentHeroSection summary={summary} />

      {summary && <KeyTakeaways
        accent="#F59E0B"
        pills={[
          { value: `${summary.youthUnemployment}%`, label: 'Youth unemployment — 3× the national rate', sectionId: 'youth' },
          { value: `${summary.selfEmployedPct}%`, label: 'Self-employed — most Indians are their own boss', sectionId: 'informality' },
          { value: `${summary.femaleLfpr}%`, label: 'Only 1 in 3 women in the workforce', sectionId: 'gender-gap' },
          { value: `${summary.workforceTotal} Cr`, label: "India's total workforce", sectionId: 'participation' },
        ]}
      />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="India has one of the largest workforces on Earth. But how many are actually working — and in what?"
        highlights={{
          'largest': 'var(--amber)',
          'working': 'var(--amber)',
          'what?': 'var(--amber)',
        }}
      />

      <div className="composition-divider" />

      {participation && <ParticipationSection data={participation} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="The economy is transforming underneath people's feet. Agriculture is shrinking, services are booming. For millions, the question is: can they make the jump?"
        highlights={{
          'transforming': 'var(--amber)',
          'shrinking,': 'var(--amber)',
          'booming.': 'var(--amber)',
          'jump?': 'var(--saffron)',
        }}
      />

      <div className="composition-divider" />

      {sectoral && <StructuralShiftSection data={sectoral} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="The young bear the heaviest burden. India's demographic dividend becomes a demographic disaster without jobs."
        highlights={{
          'young': 'var(--amber)',
          'dividend': 'var(--amber)',
          'disaster': 'var(--saffron)',
          'jobs.': 'var(--saffron)',
        }}
      />

      <div className="composition-divider" />

      {unemployment && <YouthUnemploymentSection data={unemployment} />}

      <div className="composition-divider" />

      {participation && <GenderGapSection data={participation} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="Most Indian workers have no contract, no benefits, no safety net. The informal economy is the real economy."
        highlights={{
          'contract,': 'var(--amber)',
          'benefits,': 'var(--amber)',
          'informal': 'var(--saffron)',
          'real': 'var(--saffron)',
        }}
      />

      <div className="composition-divider" />

      {sectoral && <InformalitySection data={sectoral} />}

      <div className="composition-divider" />

      {unemployment && <RuralUrbanSection data={unemployment} />}

      <div className="composition-divider" />

      <DomainCTA domain="employment" />
    </motion.div>
  );
}
