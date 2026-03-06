import { motion } from 'framer-motion';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { SkeletonChart } from '../components/ui/Skeleton.tsx';
import { KeyTakeaways } from '../components/ui/KeyTakeaways.tsx';
import { NarrativeBridge } from '../components/ui/NarrativeBridge.tsx';
import { useHealthcareStore } from '../store/healthcareStore.ts';
import { useHealthcareData } from '../hooks/useHealthcareData.ts';
import { HealthcareHeroSection } from '../components/healthcare/HealthcareHeroSection.tsx';
import { InfrastructureSection } from '../components/healthcare/InfrastructureSection.tsx';
import { SpendingSection } from '../components/healthcare/SpendingSection.tsx';
import { OutOfPocketSection } from '../components/healthcare/OutOfPocketSection.tsx';
import { ImmunizationSection } from '../components/healthcare/ImmunizationSection.tsx';
import { DiseaseBurdenSection } from '../components/healthcare/DiseaseBurdenSection.tsx';
import { DoctorGapSection } from '../components/healthcare/DoctorGapSection.tsx';
import { DomainCTA } from '../components/ui/DomainCTA.tsx';

export default function HealthcarePage() {
  const year = useHealthcareStore((s) => s.selectedYear);
  const { summary, infrastructure, spending, disease, forex, loading, error } = useHealthcareData(year);

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
        <p style={{ color: 'var(--text-secondary)' }}>Failed to load healthcare data.</p>
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
        title="Healthcare — 0.7 Doctors per 1,000 | Indian Data Project"
        description="India's healthcare infrastructure, spending, immunization coverage, and disease burden — visualized from World Bank, NHP, and NFHS data across all states."
        path="/healthcare"
        image="/og-healthcare.png"
      />

      <HealthcareHeroSection summary={summary} />

      {summary && <KeyTakeaways
        accent="#F43F5E"
        pills={[
          { value: '₹19/day', label: 'Per-capita health spending — less than a cup of chai', sectionId: 'spending' },
          { value: `${summary.outOfPocketPct} paise`, label: 'Of every health rupee from your pocket — not the government', sectionId: 'oop' },
          { value: `${summary.hospitalBedsPer1000} beds`, label: 'Hospital beds per 1,000 people — WHO recommends 3.5', sectionId: 'infrastructure' },
          { value: `${summary.healthExpGDP}% GDP`, label: 'India spends on health — roughly half the global average', sectionId: 'spending' },
        ]}
      />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="7 doctors per 10,000 people. That's what stands between 1.4 billion Indians and illness. The WHO recommends 10. India is 30% short. In Bihar, it's closer to 1."
        highlights={{
          '7': 'var(--rose)',
          '30%': 'var(--saffron)',
          'bihar': 'var(--saffron)',
          'illness': 'var(--rose)',
        }}
      />

      <div className="composition-divider" />

      {infrastructure && <InfrastructureSection data={infrastructure} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="Why is the infrastructure so thin? Follow the money. India spends roughly 19 rupees per citizen per day on health. Less than a cup of chai. This is not an inevitability; it is a choice."
        highlights={{
          '19': 'var(--rose)',
          'chai': 'var(--saffron)',
          'choice': 'var(--saffron)',
        }}
      />

      <div className="composition-divider" />

      {spending && <SpendingSection data={spending} forex={forex} />}

      <div className="composition-divider" />

      {spending && <OutOfPocketSection data={spending} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="When the government doesn't pay, families do. 44 paise of every health rupee comes from patients' own pockets. One medical emergency can push a family into poverty. But the story is not all deficit. When India commits resources and political will, the results are extraordinary."
        highlights={{
          '44': 'var(--saffron)',
          'poverty': 'var(--saffron)',
          'extraordinary': 'var(--rose)',
        }}
      />

      <div className="composition-divider" />

      {disease && <ImmunizationSection data={disease} />}

      <div className="composition-divider" />

      {disease && <DiseaseBurdenSection data={disease} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="Immunization proves the system can deliver. But the national averages hide the sharpest inequality of all. The states with the fewest doctors have the most deaths. Geography is destiny in Indian healthcare."
        highlights={{
          'deliver': 'var(--rose)',
          'destiny': 'var(--saffron)',
          'fewest': 'var(--saffron)',
        }}
      />

      <div className="composition-divider" />

      {infrastructure && <DoctorGapSection data={infrastructure} />}

      <div className="composition-divider" />

      <DomainCTA domain="healthcare" />
    </motion.div>
  );
}
