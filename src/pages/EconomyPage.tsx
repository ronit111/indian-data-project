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

      {/* 01 Growth — the GDP headline vs your headline */}
      <div className="composition-divider" />
      <NarrativeBridge
        text="India's GDP crossed ₹300 lakh crore. Your salary didn't notice. 7% growth is real — but per-capita income grows slower because population grows too, and gains concentrate in specific sectors and geographies."
        highlights={{ gdp: 'var(--cyan)', salary: 'var(--saffron)', 'per-capita': 'var(--gold)' }}
      />
      <div className="composition-divider" />

      <GrowthSection gdp={gdpGrowth} />

      {/* 02 Inflation — the invisible tax on growth */}
      <div className="composition-divider" />
      <NarrativeBridge
        text="If growth is real, why doesn't it feel real? Because prices eat into it. When GDP grows 7% and inflation runs at 5%, your real gain is only 2% — and food inflation hits the poorest hardest."
        highlights={{ prices: 'var(--saffron)', gain: 'var(--gold)', inflation: 'var(--cyan)' }}
      />
      <div className="composition-divider" />

      <InflationSection inflation={inflation} />

      {/* 03 Fiscal — the government's IOUs */}
      <div className="composition-divider" />
      <NarrativeBridge
        text="Inflation is one leak. The government's own borrowing is another — when it borrows heavily, it competes with businesses for bank funds, pushing up interest rates for everyone."
        highlights={{ borrowing: 'var(--saffron)', rates: 'var(--cyan)', businesses: 'var(--gold)' }}
      />
      <div className="composition-divider" />

      <FiscalSection fiscal={fiscal} />

      {/* 04 External — India and the world */}
      <div className="composition-divider" />
      <NarrativeBridge
        text="The domestic picture is one half. India's position in the world — what it buys, what it sells, what it holds in foreign currency — is the other half. A persistent trade deficit means your petrol price is set in Houston as much as New Delhi."
        highlights={{ deficit: 'var(--saffron)', petrol: 'var(--gold)', currency: 'var(--cyan)' }}
      />
      <div className="composition-divider" />

      <ExternalSection external={external} />

      {/* 05 Sectors — what India makes, sells, and grows */}
      <div className="composition-divider" />
      <NarrativeBridge
        text="So India imports more than it exports. But what does India actually produce? The composition of the economy tells you where the jobs and growth are really coming from — and why services-led growth employs fewer people than manufacturing would."
        highlights={{ services: 'var(--cyan)', manufacturing: 'var(--saffron)', jobs: 'var(--gold)' }}
      />
      <div className="composition-divider" />

      <SectorsSection sectors={sectors} />

      {/* 06 Outlook — the road ahead */}
      <div className="composition-divider" />
      <NarrativeBridge
        text="The macro is promising. The micro is the test. Growth is projected to stay fast by global standards — but whether it reaches the 60% of Indians in rural areas and the 1.2 crore young people entering the workforce each year is the real question."
        highlights={{ rural: 'var(--saffron)', workforce: 'var(--gold)', projected: 'var(--cyan)' }}
      />
      <div className="composition-divider" />

      <OutlookSection summary={summary} />

      {/* CTA — explore further */}
      <div className="composition-divider" />

      <DomainCTA domain="economy" />
    </motion.div>
  );
}
