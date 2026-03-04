import { motion } from 'framer-motion';
import { useEconomyStore } from '../store/economyStore.ts';
import { useEconomyData } from '../hooks/useEconomyData.ts';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { EconomyHeroSection } from '../components/economy/EconomyHeroSection.tsx';
import { GrowthSection } from '../components/economy/GrowthSection.tsx';
import { InflationSection } from '../components/economy/InflationSection.tsx';
import { FiscalSection } from '../components/economy/FiscalSection.tsx';
import { ExternalSection } from '../components/economy/ExternalSection.tsx';
import { SectorsSection } from '../components/economy/SectorsSection.tsx';
import { OutlookSection } from '../components/economy/OutlookSection.tsx';
import { DomainCTA } from '../components/ui/DomainCTA.tsx';
import { NarrativeBridge } from '../components/ui/NarrativeBridge.tsx';
import { SkeletonChart } from '../components/ui/Skeleton.tsx';
import { KeyTakeaways } from '../components/ui/KeyTakeaways.tsx';
import { formatIndianNumber } from '../lib/format.ts';

export default function EconomyPage() {
  const year = useEconomyStore((s) => s.selectedYear);
  const { summary, gdpGrowth, inflation, fiscal, external, sectors, loading, error } =
    useEconomyData(year);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen px-4 pt-32"
      >
        <div className="max-w-4xl mx-auto space-y-24">
          <SkeletonChart height={200} />
          <SkeletonChart height={400} />
          <SkeletonChart height={400} />
        </div>
      </motion.div>
    );
  }

  if (error || !summary || !gdpGrowth || !inflation || !fiscal || !external || !sectors) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-composition mb-4" style={{ color: 'var(--text-primary)' }}>
            Failed to load economy data
          </p>
          <p className="text-annotation mb-6">
            {error || 'Try refreshing the page.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
            style={{
              background: 'var(--cyan)',
              color: '#06080f',
              border: 'none',
            }}
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SEOHead
        title="Economic Survey 2025-26 — India's Economic Report Card"
        description="Interactive visual breakdown of India's Economic Survey 2025-26. GDP growth, inflation trends, fiscal consolidation, trade balance, and sectoral analysis."
        path="/economy"
        image="/og-economy.png"
      />

      {/* Hero — the headline GDP growth number */}
      <EconomyHeroSection summary={summary} />

      {/* Key Takeaways — quick-scan stat pills */}
      <KeyTakeaways
        accent="#4AEADC"
        pills={[
          { value: `₹${formatIndianNumber(summary.perCapitaGDP)}`, label: 'Average income per Indian, per year', sectionId: 'sectors' },
          { value: `${summary.realGDPGrowth}%`, label: 'How fast the economy grew', sectionId: 'growth' },
          { value: `${summary.cpiInflation}%`, label: 'How much prices rose (inflation)', sectionId: 'inflation' },
          { value: `${summary.currentAccountDeficitPercentGDP}% of GDP`, label: 'We import more than we export', sectionId: 'external' },
        ]}
      />

      {/* 01 Growth — the GDP story */}
      <div className="composition-divider" />
      <NarrativeBridge
        text="How fast is India growing? A decade of GDP data tells the story of booms, a pandemic shock, and a resilient recovery."
        highlights={{ growing: 'var(--cyan)', pandemic: 'var(--saffron)', recovery: 'var(--gold)' }}
      />
      <div className="composition-divider" />

      <GrowthSection gdp={gdpGrowth} />

      {/* 02 Inflation — price stability */}
      <div className="composition-divider" />
      <NarrativeBridge
        text="Growth means little if prices run away. The RBI walks a tightrope between supporting growth and keeping inflation within its target band."
        highlights={{ prices: 'var(--saffron)', inflation: 'var(--gold)', target: 'var(--cyan)' }}
      />
      <div className="composition-divider" />

      <InflationSection inflation={inflation} />

      {/* 03 Fiscal — the deficit path */}
      <div className="composition-divider" />
      <NarrativeBridge
        text="The government borrows to invest. But how much is too much? The fiscal deficit tells us how far the gap has narrowed."
        highlights={{ borrows: 'var(--saffron)', deficit: 'var(--gold)', narrowed: 'var(--cyan)' }}
      />
      <div className="composition-divider" />

      <FiscalSection fiscal={fiscal} />

      {/* 04 External — trade and reserves */}
      <div className="composition-divider" />
      <NarrativeBridge
        text="India trades with the world but imports more than it exports. Forex reserves provide a buffer against external shocks."
        highlights={{ exports: 'var(--cyan)', imports: 'var(--saffron)', reserves: 'var(--gold)' }}
      />
      <div className="composition-divider" />

      <ExternalSection external={external} />

      {/* 05 Sectors — the economic mix */}
      <div className="composition-divider" />
      <NarrativeBridge
        text="Services power nearly half the economy. But manufacturing and construction are gaining ground, shifting the sectoral balance."
        highlights={{ services: 'var(--cyan)', manufacturing: 'var(--saffron)', construction: 'var(--gold)' }}
      />
      <div className="composition-divider" />

      <SectorsSection sectors={sectors} />

      {/* 06 Outlook — what lies ahead */}
      <div className="composition-divider" />
      <NarrativeBridge
        text="Where does the economy go from here? The Survey lays out projections for the year ahead."
        highlights={{ projections: 'var(--cyan)' }}
      />
      <div className="composition-divider" />

      <OutlookSection summary={summary} />

      {/* CTA — explore further */}
      <div className="composition-divider" />

      <DomainCTA domain="economy" />
    </motion.div>
  );
}
