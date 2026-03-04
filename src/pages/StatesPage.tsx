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
          { value: `₹${formatIndianNumber(summary.averagePerCapita)}`, label: 'Average state income per person', sectionId: 'percapita' },
          { value: summary.growthRange, label: 'Growth gap: slowest to fastest state', sectionId: 'growth' },
          { value: `₹${summary.topGsdpValue}L Cr`, label: 'Maharashtra alone, bigger than many nations', sectionId: 'gsdp' },
          { value: '36', label: 'States and UTs — 36 different economies', sectionId: 'fiscal-health' },
        ]}
      />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="India's economy is not one story but many. Each state has its own growth trajectory, revenue base, and fiscal discipline. Together they form a mosaic of starkly different economic realities."
        highlights={{
          'mosaic': 'var(--emerald)',
          'growth': 'var(--emerald)',
          'revenue': 'var(--emerald)',
          'fiscal': 'var(--emerald)',
        }}
      />

      <div className="composition-divider" />

      {gsdp && <GSDPSection data={gsdp} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="Size is not destiny. Some of India's fastest-growing states are among the smallest. Growth rates reveal who is catching up and who is falling behind."
        highlights={{
          'fastest-growing': 'var(--emerald)',
          'catching': 'var(--emerald)',
        }}
      />

      <div className="composition-divider" />

      {gsdp && <GrowthSection data={gsdp} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="Where does the money come from? Some states raise most of their revenue from their own taxes. Others depend heavily on the Centre. This fiscal independence shapes what a state can do for its citizens."
        highlights={{
          'revenue': 'var(--emerald)',
          'taxes': 'var(--emerald)',
          'independence': 'var(--emerald)',
        }}
      />

      <div className="composition-divider" />

      {revenue && <RevenueSection data={revenue} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="Spending beyond your means leaves a debt trail. The FRBM Act says states should keep fiscal deficits below 3% of GSDP — but not all states listen."
        highlights={{
          'debt': 'var(--saffron)',
          'FRBM': 'var(--saffron)',
          '3%': 'var(--saffron)',
        }}
      />

      <div className="composition-divider" />

      {fiscalHealth && <FiscalHealthSection data={fiscalHealth} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="Total GDP can be misleading — a large population inflates the number. Per capita GSDP reveals which states actually produce more per person. The answers may surprise you."
        highlights={{
          'per capita': 'var(--emerald)',
          'Per capita': 'var(--emerald)',
          'per person': 'var(--emerald)',
        }}
      />

      <div className="composition-divider" />

      {gsdp && <PerCapitaSection data={gsdp} />}

      <div className="composition-divider" />

      <DomainCTA domain="states" />
    </motion.div>
  );
}
