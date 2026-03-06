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
          { value: `${summary.repoRate}%`, label: 'The rate that decides your EMI and FD return', sectionId: 'monetary-policy' },
          { value: `${summary.cpiLatest ?? '—'}%`, label: 'Current inflation — within the 2–6% target?', sectionId: 'inflation-target' },
          { value: `$${summary.forexReservesUSD ? Math.round(summary.forexReservesUSD) : '—'}B`, label: "India's shield against global shocks", sectionId: 'forex' },
          { value: `${summary.slr}%`, label: 'Of every deposit, banks must hold in govt bonds (SLR)', sectionId: 'liquidity' },
        ]}
      />}

      {/* 01 The price of money — repo rate as personal number */}
      <div className="composition-divider" />
      <NarrativeBridge
        text="Six people on the Monetary Policy Committee set one number — the repo rate — the interest rate at which RBI lends to banks. When it moves, your home loan EMI moves. Your FD return moves. The entire economy reprices. One committee, two opposite effects on your life."
        highlights={{
          repo: 'var(--gold)',
          loan: 'var(--saffron)',
          return: 'var(--cyan)',
        }}
      />
      <div className="composition-divider" />

      {monetaryPolicy && <MonetaryPolicySection data={monetaryPolicy} />}

      {/* 02 The inflation target — what RBI answers to */}
      <div className="composition-divider" />
      <NarrativeBridge
        text="But the RBI doesn't set rates freely. Since 2016 it is legally required to keep CPI inflation between 2–6%, with 4% as the target. Miss it for three consecutive quarters and the Governor must write a letter to the government explaining why. The target band makes every rate decision an accountability moment."
        highlights={{
          inflation: 'var(--saffron)',
          target: 'var(--gold)',
          accountability: 'var(--cyan)',
        }}
      />
      <div className="composition-divider" />

      <InflationTargetSection monetaryPolicy={monetaryPolicy} />

      {/* 03 The money supply tap */}
      <div className="composition-divider" />
      <NarrativeBridge
        text="Rate decisions set the price of money. But the RBI also controls how much money exists. Through CRR, SLR, and open market operations, it decides how much of your deposit banks can actually lend versus how much stays locked up. Too much money chasing too few goods causes inflation. Too little starves the economy. The RBI walks this line."
        highlights={{
          crr: 'var(--gold)',
          slr: 'var(--gold)',
          inflation: 'var(--saffron)',
          locked: 'var(--cyan)',
        }}
      />
      <div className="composition-divider" />

      {liquidity && <LiquiditySection data={liquidity} />}

      {/* 04 Where the money lands — credit as real-economy consequence */}
      <div className="composition-divider" />
      <NarrativeBridge
        text="The money supply is the reservoir. Credit is where it flows — into home loans, business working capital, and farm financing. When the repo rate drops, banks lend more. The expansion of private credit as a share of GDP shows how many more Indians now have access to formal loans than a decade ago."
        highlights={{
          credit: 'var(--saffron)',
          loans: 'var(--gold)',
          formal: 'var(--cyan)',
        }}
      />
      <div className="composition-divider" />

      {credit && <CreditSection data={credit} />}

      {/* 05 The war chest — forex reserves as insurance */}
      <div className="composition-divider" />
      <NarrativeBridge
        text="Domestic credit runs on domestic policy. But India trades with the world and the world can turn hostile. In 1991, India ran out of foreign currency and had to pledge its gold to the Bank of England. That humiliation built the institutional reflex that now stockpiles over $600 billion in reserves as a shield."
        highlights={{
          reserves: 'var(--cyan)',
          '1991': 'var(--saffron)',
          shield: 'var(--gold)',
        }}
      />
      <div className="composition-divider" />

      {forex && <ForexSection data={forex} />}

      {/* 06 The rupee's tightrope — managed float */}
      <div className="composition-divider" />
      <NarrativeBridge
        text="Reserves are the shield. The rupee is the front line. The RBI doesn't fix it to the dollar, but it doesn't let it float freely either. A weaker rupee makes your imports expensive; a stronger one makes Indian exports uncompetitive. The RBI manages this trade-off daily."
        highlights={{
          rupee: 'var(--gold)',
          weaker: 'var(--saffron)',
          exports: 'var(--cyan)',
        }}
      />
      <div className="composition-divider" />

      {forex && <ExchangeRateSection data={forex} />}

      <div className="composition-divider" />

      <DomainCTA domain="rbi" />
    </motion.div>
  );
}
