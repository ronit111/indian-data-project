import { motion } from 'framer-motion';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { SkeletonChart } from '../components/ui/Skeleton.tsx';
import { KeyTakeaways } from '../components/ui/KeyTakeaways.tsx';
import { NarrativeBridge } from '../components/ui/NarrativeBridge.tsx';
import { useRBIStore } from '../store/rbiStore.ts';
import { useRBIData } from '../hooks/useRBIData.ts';
import { RBIHeroSection } from '../components/rbi/RBIHeroSection.tsx';
import { MonetaryPolicySection } from '../components/rbi/MonetaryPolicySection.tsx';
import { InflationTargetSection } from '../components/rbi/InflationTargetSection.tsx';
import { LiquiditySection } from '../components/rbi/LiquiditySection.tsx';
import { CreditSection } from '../components/rbi/CreditSection.tsx';
import { ForexSection } from '../components/rbi/ForexSection.tsx';
import { ExchangeRateSection } from '../components/rbi/ExchangeRateSection.tsx';
import { DomainCTA } from '../components/ui/DomainCTA.tsx';

export default function RBIPage() {
  const year = useRBIStore((s) => s.selectedYear);
  const { summary, monetaryPolicy, liquidity, credit, forex, loading, error } = useRBIData(year);

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
        <p style={{ color: 'var(--text-secondary)' }}>Failed to load RBI data.</p>
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
        title="RBI Data — India's Central Banker | Indian Data Project"
        description="Reserve Bank of India monetary policy, repo rate decisions, inflation targeting, money supply, credit growth, and forex reserves — visualized from primary sources."
        path="/rbi"
        image="/og-rbi.png"
      />

      <RBIHeroSection summary={summary} />

      {summary && <KeyTakeaways
        accent="#4AEADC"
        pills={[
          { value: `${summary.repoRate}%`, label: 'The rate that decides your EMI', sectionId: 'monetary-policy' },
          { value: `$${summary.forexReservesUSD ? Math.round(summary.forexReservesUSD) : '—'}B`, label: "India's forex safety net", sectionId: 'forex' },
          { value: `${summary.cpiLatest ?? '—'}%`, label: 'Current inflation — within target?', sectionId: 'inflation-target' },
          { value: `${summary.slr}%`, label: 'Of every bank deposit, locked by RBI', sectionId: 'liquidity' },
        ]}
      />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="The Reserve Bank of India sets the price of money. Every repo rate change cascades through loans, deposits, and EMIs. Here's a decade of central banking decisions."
        highlights={{
          'price': 'var(--gold)',
          'money': 'var(--gold)',
          'repo': 'var(--gold)',
          'rate': 'var(--gold)',
          'cascades': 'var(--cyan)',
        }}
      />

      <div className="composition-divider" />

      {monetaryPolicy && <MonetaryPolicySection data={monetaryPolicy} />}

      <div className="composition-divider" />

      <InflationTargetSection monetaryPolicy={monetaryPolicy} />

      <div className="composition-divider" />

      <NarrativeBridge
        text="When inflation stays in the target band, the RBI has room to focus on growth. But the tools it uses — CRR, SLR, open market operations — shape how much money flows through the system."
        highlights={{
          'inflation': 'var(--cyan)',
          'target': 'var(--cyan)',
          'crr': 'var(--gold)',
          'slr': 'var(--gold)',
          'money': 'var(--gold)',
        }}
      />

      <div className="composition-divider" />

      {liquidity && <LiquiditySection data={liquidity} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="Liquidity sets the supply. Credit is where it lands — in home loans, business working capital, and farm financing. The pace of credit growth tells you where the economy is heading."
        highlights={{
          'credit': 'var(--saffron)',
          'loans': 'var(--saffron)',
          'economy': 'var(--gold)',
        }}
      />

      <div className="composition-divider" />

      {credit && <CreditSection data={credit} />}

      <div className="composition-divider" />

      <NarrativeBridge
        text="India's foreign exchange reserves are its shield against global shocks — currency attacks, oil price spikes, and capital flight. The rupee's stability depends on this war chest."
        highlights={{
          'reserves': 'var(--cyan)',
          'shield': 'var(--cyan)',
          'rupee': 'var(--gold)',
        }}
      />

      <div className="composition-divider" />

      {forex && <ForexSection data={forex} />}

      <div className="composition-divider" />

      {forex && <ExchangeRateSection data={forex} />}

      <div className="composition-divider" />

      <DomainCTA domain="rbi" />
    </motion.div>
  );
}
