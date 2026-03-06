import { motion } from 'framer-motion';
import { useBudgetStore } from '../store/budgetStore.ts';
import { useBudgetData } from '../hooks/useBudgetData.ts';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { HeroSection } from '../components/home/HeroSection.tsx';
import { RevenueSection } from '../components/home/RevenueSection.tsx';
import { DeficitSection } from '../components/budget/DeficitSection.tsx';
import { TrendsSection } from '../components/budget/TrendsSection.tsx';
import { BudgetVsActualSection } from '../components/budget/BudgetVsActualSection.tsx';
import { ExpenditureSection } from '../components/home/ExpenditureSection.tsx';
import { FlowSection } from '../components/home/FlowSection.tsx';
import { MapSection } from '../components/home/MapSection.tsx';
import { PerCapitaSection } from '../components/budget/PerCapitaSection.tsx';
import { CTASection } from '../components/home/CTASection.tsx';
import { NarrativeBridge } from '../components/ui/NarrativeBridge.tsx';
import { SkeletonChart } from '../components/ui/Skeleton.tsx';
import { KeyTakeaways } from '../components/ui/KeyTakeaways.tsx';
import type { TakeawayPill } from '../components/ui/KeyTakeaways.tsx';
import { formatIndianNumber } from '../lib/format.ts';

export default function BudgetPage() {
  const year = useBudgetStore((s) => s.selectedYear);
  const { summary, receipts, expenditure, treemap, sankey, statewise, trends, budgetVsActual, loading, error } =
    useBudgetData(year);

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

  if (error || !summary || !receipts || !expenditure || !treemap || !sankey || !statewise) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-composition mb-4" style={{ color: 'var(--text-primary)' }}>
            Failed to load budget data
          </p>
          <p className="text-annotation mb-6">
            {error || 'Try refreshing the page.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
            style={{
              background: 'var(--saffron)',
              color: 'white',
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
        title="Union Budget 2025-26 — Where Your Tax Money Goes"
        description="Interactive visual breakdown of India's Union Budget 2025-26. Revenue sources, ministry-wise spending, state transfers, and your personal tax share."
        path="/budget"
        image="/og-budget.png"
      />

      {/* Hero — the headline number */}
      <HeroSection summary={summary} />

      {/* Key Takeaways — quick-scan stat pills */}
      <KeyTakeaways
        accent="#FF6B35"
        pills={(() => {
          const paisaBorrowed = 100 - Math.round((summary.totalReceipts / summary.totalExpenditure) * 100);
          const perCapitaTax = Math.round((summary.totalReceipts * 10000000) / summary.population);
          const lakhCr = (summary.totalExpenditure / 100000).toFixed(2);
          return [
            { value: `₹${Math.round(summary.perCapitaDailyExpenditure)}/day`, label: 'What govt. spends on you, daily', sectionId: 'percapita' },
            { value: `${paisaBorrowed} paise`, label: 'Of every rupee spent, borrowed', sectionId: 'deficit' },
            { value: `₹${lakhCr}L Cr`, label: 'The whole budget, in one number', sectionId: 'flow' },
            { value: `₹${formatIndianNumber(perCapitaTax)}/yr`, label: 'Your average tax contribution', sectionId: 'revenue' },
          ] as TakeawayPill[];
        })()}
      />

      {/* 01 Per Capita — open with the personal hook */}
      <div className="composition-divider" />
      <NarrativeBridge
        text={`The government spends ₹${Math.round(summary.perCapitaDailyExpenditure)} on every Indian, every single day. That's more than the daily wage of a rural labourer. This is your money story.`}
        highlights={{ [`₹${Math.round(summary.perCapitaDailyExpenditure)}`]: 'var(--saffron)', wage: 'var(--gold)', money: 'var(--cyan)' }}
      />
      <div className="composition-divider" />

      <PerCapitaSection summary={summary} expenditure={expenditure} />

      {/* 02 Revenue — where money comes from */}
      <div className="composition-divider" />
      <NarrativeBridge
        text="But where does this money come from? Trace the rupee backward — from your pocket to the treasury."
        highlights={{ rupee: 'var(--gold)', pocket: 'var(--saffron)', treasury: 'var(--cyan)' }}
      />
      <div className="composition-divider" />

      <RevenueSection receipts={receipts} />

      {/* 03 Deficit — the borrowing gap */}
      <div className="composition-divider" />
      <NarrativeBridge
        text="Taxes and non-tax income cover most of it. But for every rupee spent, the government still has to borrow the rest."
        highlights={{ borrow: 'var(--cyan)', rupee: 'var(--saffron)' }}
      />
      <div className="composition-divider" />

      <DeficitSection summary={summary} />

      {/* 04 Trends — 20-year perspective */}
      {trends && (
        <>
          <div className="composition-divider" />
          <NarrativeBridge
            text="This borrowing gap isn't new — and it isn't random. Zoom out two decades and you see it's been a feature, not a bug. Except when it explodes."
            highlights={{ decades: 'var(--saffron)', explodes: 'var(--cyan)' }}
          />
          <div className="composition-divider" />

          <TrendsSection trends={trends} />
        </>
      )}

      {/* 05 Budget vs Actual — execution accountability */}
      {budgetVsActual && (
        <>
          <div className="composition-divider" />
          <NarrativeBridge
            text="So the government plans to borrow. But does it stick to the plan? Ministries are notorious for over- or under-spending. The gap between estimate and actual is where political will meets bureaucratic capacity."
            highlights={{ plan: 'var(--gold)', over: 'var(--saffron)', under: 'var(--cyan)' }}
          />
          <div className="composition-divider" />

          <BudgetVsActualSection data={budgetVsActual} />
        </>
      )}

      {/* 06 Expenditure — where money goes */}
      <div className="composition-divider" />
      <NarrativeBridge
        text="Now we know where it comes from and whether plans hold. Follow the money out — every crore, every ministry, every scheme."
        highlights={{ crore: 'var(--saffron)', ministry: 'var(--gold)' }}
      />
      <div className="composition-divider" />

      <ExpenditureSection treemap={treemap} />

      {/* 07 Flow — the complete picture */}
      <div className="composition-divider" />
      <NarrativeBridge
        text="The treemap shows categories. But money doesn't sit in categories — it flows. Here's the full river from source to destination."
        highlights={{ flows: 'var(--cyan)', river: 'var(--gold)', source: 'var(--saffron)' }}
      />
      <div className="composition-divider" />

      <FlowSection sankey={sankey} />

      {/* 08 Map — where it lands geographically */}
      <div className="composition-divider" />
      <NarrativeBridge
        text="Finally, this money doesn't stay in Delhi. Nearly one in four rupees flows directly to states — and where it lands is far from uniform."
        highlights={{ delhi: 'var(--saffron)', states: 'var(--cyan)', uniform: 'var(--gold)' }}
      />
      <div className="composition-divider" />

      <MapSection statewise={statewise} />

      {/* 09 CTA — go deeper */}
      <div className="composition-divider" />

      <CTASection />
    </motion.div>
  );
}
