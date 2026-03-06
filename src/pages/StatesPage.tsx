import { motion } from 'framer-motion';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { SkeletonChart } from '../components/ui/Skeleton.tsx';
import { KeyTakeaways } from '../components/ui/KeyTakeaways.tsx';
import { NarrativeBridge } from '../components/ui/NarrativeBridge.tsx';
import { useStatesStore } from '../store/statesStore.ts';
import { useStatesData } from '../hooks/useStatesData.ts';
import { StatesHeroSection } from '../components/states/StatesHeroSection.tsx';
import { GSDPSection } from '../components/states/GSDPSection.tsx';
import { GrowthSection } from '../components/states/GrowthSection.tsx';
import { RevenueSection } from '../components/states/RevenueSection.tsx';
import { FiscalHealthSection } from '../components/states/FiscalHealthSection.tsx';
import { PerCapitaSection } from '../components/states/PerCapitaSection.tsx';
import { DomainCTA } from '../components/ui/DomainCTA.tsx';
import { formatIndianNumber } from '../lib/format.ts';

export default function StatesPage() {
  const year = useStatesStore((s) => s.selectedYear);
  const { summary, gsdp, revenue, fiscalHealth, loading, error } = useStatesData(year);

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
        <p style={{ color: 'var(--text-secondary)' }}>Failed to load state finances data.</p>
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
        title="State Finances — India's Federal Mosaic | Indian Data Project"
        description="State-wise GDP, growth rates, revenue self-sufficiency, fiscal health, and per capita income across 28 states and 8 union territories — visualized from RBI Handbook data."
        path="/states"
        image="/og-states.png"
      />

      <StatesHeroSection summary={summary} />

      {summary && <KeyTakeaways
        accent="#4ADE80"
        pills={[
          { value: `₹${formatIndianNumber(summary.averagePerCapita)}`, label: 'Average income per person — but the gap between states is 8-9x', sectionId: 'percapita' },
          { value: summary.growthRange, label: 'Growth gap: slowest to fastest state', sectionId: 'growth' },
          { value: `₹${summary.topGsdpValue}L Cr`, label: 'Maharashtra alone — more than most nations', sectionId: 'gsdp' },
          { value: '36', label: 'Economies sharing one Constitution', sectionId: 'fiscal-health' },
        ]}
      />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="A child born in Goa today inherits a different country than a child born in Bihar. Same Constitution. Same anthem. Same central government. But the same country, two radically different economic realities."
        highlights={{
          'goa': 'var(--emerald)',
          'bihar': 'var(--saffron)',
          'different': 'var(--emerald)',
          'realities': 'var(--emerald)',
        }}
      />

      <div className="composition-divider" />

      {gsdp && <GSDPSection data={gsdp} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="Maybe large economies just need large populations. If poorer states were growing faster, they'd close the gap. They aren't. The mosaic is hardening, not blurring. Bihar and UP — home to 40 crore people — grow at middling rates."
        highlights={{
          'aren\'t': 'var(--saffron)',
          'hardening': 'var(--saffron)',
          'blurring': 'var(--emerald)',
          'mosaic': 'var(--emerald)',
        }}
      />

      <div className="composition-divider" />

      {gsdp && <GrowthSection data={gsdp} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="Growth depends on agency. States that raise their own revenue can invest where they choose — schools, roads, hospitals. States dependent on Delhi must wait for a cheque before they can set their own priorities. This is the fairness question at the heart of Indian federalism."
        highlights={{
          'agency': 'var(--emerald)',
          'fairness': 'var(--emerald)',
          'dependent': 'var(--saffron)',
          'wait': 'var(--saffron)',
        }}
      />

      <div className="composition-divider" />

      {revenue && <RevenueSection data={revenue} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="Dependence is one thing. Debt is another. High debt leads to high interest payments, which crowd out schools and hospitals, which keeps a state poor, which keeps it borrowing. Some states are caught in this loop."
        highlights={{
          'debt': 'var(--saffron)',
          'interest': 'var(--saffron)',
          'poor': 'var(--saffron)',
          'borrowing': 'var(--saffron)',
        }}
      />

      <div className="composition-divider" />

      {fiscalHealth && <FiscalHealthSection data={fiscalHealth} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="Output, growth, revenue, debt — all matter to economists. For a citizen, only one number matters: how much reaches me? Per capita income strips away every abstraction. A worker in Goa produces in one month what a worker in Bihar produces in eight."
        highlights={{
          'citizen': 'var(--emerald)',
          'goa': 'var(--emerald)',
          'bihar': 'var(--saffron)',
          'eight': 'var(--saffron)',
        }}
      />

      <div className="composition-divider" />

      {gsdp && <PerCapitaSection data={gsdp} />}

      <div className="composition-divider" />

      <DomainCTA domain="states" />
    </motion.div>
  );
}
