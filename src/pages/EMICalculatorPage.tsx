import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useEMICalculatorStore } from '../store/emiCalculatorStore.ts';
import { loadMonetaryPolicy, loadLoanSpreads } from '../lib/dataLoader.ts';
import { calculateEMI, calculateRateImpact, getEffectiveRate } from '../lib/emiEngine.ts';
import type { MonetaryPolicyData, LoanSpreadsData } from '../lib/data/schema.ts';
import { SEOHead } from '../components/seo/SEOHead.tsx';
import { EMIInputPanel } from '../components/emi/EMIInputPanel.tsx';
import { EMIBreakdownDisplay } from '../components/emi/EMIBreakdownDisplay.tsx';
import { RateImpactViz } from '../components/emi/RateImpactViz.tsx';
import { EMIShareCard } from '../components/emi/EMIShareCard.tsx';
import { SkeletonChart, SkeletonText } from '../components/ui/Skeleton.tsx';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function EMICalculatorPage() {
  const { loanType, loanAmount, tenureYears, customRate } = useEMICalculatorStore();
  const [monetaryPolicy, setMonetaryPolicy] = useState<MonetaryPolicyData | null>(null);
  const [spreads, setSpreads] = useState<LoanSpreadsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([loadMonetaryPolicy('2025-26'), loadLoanSpreads()]).then(([mp, ls]) => {
      setMonetaryPolicy(mp);
      setSpreads(ls);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const repoRate = monetaryPolicy?.currentRate ?? 6.25;
  const spread = spreads ? spreads.spreads[loanType].typicalSpread : 2.75;
  const effectiveRate = spreads ? getEffectiveRate(repoRate, loanType, spreads) : repoRate + spread;
  const activeRate = customRate ?? effectiveRate;

  const breakdown = useMemo(
    () => calculateEMI(loanAmount, activeRate, tenureYears * 12),
    [loanAmount, activeRate, tenureYears]
  );

  const rateImpact = useMemo(
    () => calculateRateImpact(loanAmount, tenureYears * 12, activeRate),
    [loanAmount, tenureYears, activeRate]
  );

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto px-6 sm:px-8 py-10 md:py-14">
        <SkeletonChart height={200} />
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          <SkeletonText lines={6} />
          <SkeletonText lines={8} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <SEOHead
        title="EMI Impact Calculator — How RBI Rate Changes Affect Your Loan"
        description="See how repo rate changes affect your home, car, or personal loan EMI. Calculate monthly payments and understand the real cost of borrowing."
        path="/rbi/calculator"
        image="/og-emi-calculator.png"
      />

      {/* Page header */}
      <motion.div
        className="max-w-5xl mx-auto px-6 sm:px-8 pt-10 md:pt-14"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <div className="text-center mb-10">
          <motion.h1
            className="text-composition font-bold mb-3"
            style={{ color: 'var(--text-primary)' }}
            variants={fadeUp}
          >
            EMI Impact Calculator
          </motion.h1>
          <motion.p
            className="text-base max-w-xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
            variants={fadeUp}
          >
            See how RBI repo rate changes affect your monthly payment.
            Current repo rate: <span className="font-mono font-bold" style={{ color: 'var(--gold)' }}>{repoRate}%</span>
            {monetaryPolicy && (
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {' '}({monetaryPolicy.currentStance} stance)
              </span>
            )}
          </motion.p>
        </div>
      </motion.div>

      {/* Input panel */}
      <motion.div
        className="max-w-5xl mx-auto px-6 sm:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="rounded-xl p-6 md:p-8 mb-8"
          style={{ background: 'var(--bg-raised)', border: 'var(--border-subtle)' }}
        >
          <EMIInputPanel effectiveRate={effectiveRate} repoRate={repoRate} spread={spread} />
        </div>
      </motion.div>

      {/* Results grid */}
      <div className="max-w-5xl mx-auto px-6 sm:px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: EMI Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="rounded-xl p-6 md:p-8"
              style={{ background: 'var(--bg-raised)', border: 'var(--border-subtle)' }}
            >
              <h2
                className="text-sm font-semibold uppercase tracking-wider mb-5 flex items-center gap-2"
                style={{ color: 'var(--text-muted)' }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--gold)' }} />
                Your EMI Breakdown
              </h2>
              <EMIBreakdownDisplay breakdown={breakdown} loanAmount={loanAmount} />
            </div>
          </motion.div>

          {/* Right: Rate Impact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="rounded-xl p-6 md:p-8"
              style={{ background: 'var(--bg-raised)', border: 'var(--border-subtle)' }}
            >
              <h2
                className="text-sm font-semibold uppercase tracking-wider mb-5 flex items-center gap-2"
                style={{ color: 'var(--text-muted)' }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--cyan)' }} />
                If RBI Changes the Rate
              </h2>
              <RateImpactViz impact={rateImpact} />
            </div>
          </motion.div>
        </div>

        <div className="flex justify-center mt-8">
          <EMIShareCard
            breakdown={breakdown}
            loanType={loanType}
            loanAmount={loanAmount}
            tenureYears={tenureYears}
            repoRate={repoRate}
          />
        </div>

        <p className="text-xs text-center mt-12" style={{ color: 'var(--text-muted)' }}>
          Source: RBI repo rate ({repoRate}%), bank loan spreads from SBI/HDFC rate cards.
          EMI calculated using standard reducing-balance amortization.
        </p>
      </div>
    </motion.div>
  );
}
