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
          { value: `${summary.selfEmployedPct}%`, label: 'Self-employed — most are subsistence, not enterprise', sectionId: 'informality' },
          { value: `${summary.youthUnemployment}%`, label: 'Youth unemployment — nearly 4× the national rate', sectionId: 'youth' },
          { value: `${summary.femaleLfpr}%`, label: 'Female LFPR — lower than Bangladesh and Sri Lanka', sectionId: 'gender-gap' },
          { value: `${summary.workforceTotal} Cr`, label: 'Workers — but most survive rather than thrive', sectionId: 'participation' },
        ]}
      />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="57 crore Indians work. The economy grows at 7% a year. Unemployment is only 3-4%. Sounds like a success story — until you ask what kind of work those 57 crore people actually do."
        highlights={{
          'success': 'var(--amber)',
          'kind': 'var(--saffron)',
          'actually': 'var(--saffron)',
        }}
      />

      <div className="composition-divider" />

      {participation && <ParticipationSection data={participation} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="The economy is transforming underneath people's feet. Agriculture is shrinking. Services are booming. But one line stays stubbornly flat: industry. India is skipping the manufacturing phase that powered China, South Korea, and Japan."
        highlights={{
          'transforming': 'var(--amber)',
          'flat': 'var(--saffron)',
          'skipping': 'var(--saffron)',
        }}
      />

      <div className="composition-divider" />

      {sectoral && <StructuralShiftSection data={sectoral} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="The young bear the heaviest cost. India adds over 1 crore people to the workforce each year. The economy does not create enough quality jobs to absorb them. Youth unemployment runs at nearly 4 times the overall rate. The demographic dividend becomes a demographic disaster without work."
        highlights={{
          'young': 'var(--amber)',
          'times': 'var(--saffron)',
          'disaster': 'var(--saffron)',
        }}
      />

      <div className="composition-divider" />

      {unemployment && <YouthUnemploymentSection data={unemployment} />}

      <div className="composition-divider" />

      {participation && <GenderGapSection data={participation} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="And for those who do work — men or women — the nature of that work is the problem. 58% are self-employed. Most of that is subsistence: a farmer on 2 acres, a street vendor, a gig worker without a contract."
        highlights={{
          '58%': 'var(--saffron)',
          'self-employed': 'var(--saffron)',
          'subsistence': 'var(--saffron)',
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
