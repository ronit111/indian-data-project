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
          { value: `${summary.outOfPocketPct}%`, label: 'Of every medical bill comes from your pocket', sectionId: 'oop' },
          { value: `${summary.hospitalBedsPer1000} beds`, label: 'Hospital beds per 1,000 (WHO says 3.5)', sectionId: 'infrastructure' },
          { value: `${summary.healthExpGDP}% of GDP`, label: 'What India spends on your health', sectionId: 'spending' },
          { value: `${summary.tbIncidence}/lakh`, label: 'TB cases — highest burden in the world', sectionId: 'disease' },
        ]}
      />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="India's healthcare system serves 1.4 billion people with a fraction of the resources that most countries take for granted. The numbers tell a stark story."
        highlights={{
          'healthcare': 'var(--rose)',
          '1.4': 'var(--rose)',
          'billion': 'var(--rose)',
          'fraction': 'var(--saffron)',
          'stark': 'var(--saffron)',
        }}
      />

      <div className="composition-divider" />

      {infrastructure && <InfrastructureSection data={infrastructure} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="The spending gap explains the infrastructure gap. India's health budget is among the lowest in the world as a share of GDP."
        highlights={{
          'spending': 'var(--rose)',
          'infrastructure': 'var(--rose)',
          'lowest': 'var(--saffron)',
          'gdp': 'var(--rose)',
        }}
      />

      <div className="composition-divider" />

      {spending && <SpendingSection data={spending} forex={forex} />}

      <div className="composition-divider" />

      {spending && <OutOfPocketSection data={spending} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="Despite the challenges, India has made remarkable progress in public health. Immunization coverage has reached historic highs."
        highlights={{
          'progress': 'var(--rose)',
          'immunization': 'var(--rose)',
          'historic': 'var(--rose)',
        }}
      />

      <div className="composition-divider" />

      {disease && <ImmunizationSection data={disease} />}

      <div className="composition-divider" />

      {disease && <DiseaseBurdenSection data={disease} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="The variation between states is staggering. Some states match European health outcomes. Others lag decades behind."
        highlights={{
          'variation': 'var(--rose)',
          'staggering': 'var(--saffron)',
          'european': 'var(--rose)',
          'decades': 'var(--saffron)',
        }}
      />

      <div className="composition-divider" />

      {infrastructure && <DoctorGapSection data={infrastructure} />}

      <div className="composition-divider" />

      <DomainCTA domain="healthcare" />
    </motion.div>
  );
}
