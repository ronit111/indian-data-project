import { motion } from 'framer-motion';
import type { TaxBreakdown } from '../../lib/taxEngine.ts';
import { formatIndianNumber, formatPercent } from '../../lib/format.ts';

interface TaxBreakdownDisplayProps {
  breakdown: TaxBreakdown;
}

const rowFade = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0 },
};

export function TaxBreakdownDisplay({ breakdown }: TaxBreakdownDisplayProps) {
  return (
    <div className="space-y-5">
      {/* Metric cards with left accent borders */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className="rounded-lg p-4"
          style={{
            background: 'var(--bg-surface)',
            borderLeft: '3px solid var(--saffron)',
          }}
        >
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
            Total Tax
          </p>
          <p className="text-xl md:text-2xl font-bold font-mono" style={{ color: 'var(--saffron)' }}>
            ₹{formatIndianNumber(breakdown.totalTax)}
          </p>
        </div>
        <div
          className="rounded-lg p-4"
          style={{
            background: 'var(--bg-surface)',
            borderLeft: '3px solid var(--cyan)',
          }}
        >
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
            Effective Rate
          </p>
          <p className="text-xl md:text-2xl font-bold font-mono" style={{ color: 'var(--cyan)' }}>
            {formatPercent(breakdown.effectiveRate)}
          </p>
        </div>
      </div>

      {breakdown.rebateApplied && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-lg px-4 py-3"
          style={{
            background: 'var(--positive-dim)',
            border: '1px solid rgba(52, 211, 153, 0.2)',
          }}
        >
          <p className="text-sm" style={{ color: 'var(--positive)' }}>
            {breakdown.totalTax === 0
              ? 'Section 87A rebate applied. No tax payable.'
              : `Marginal relief applied. Tax capped at ₹${formatIndianNumber(breakdown.totalTax)} (income above rebate threshold).`}
          </p>
        </motion.div>
      )}

      {/* Slab breakdown — staggered entrance */}
      <div className="rounded-lg overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
        <div className="px-4 py-3" style={{ borderBottom: 'var(--border-divider)' }}>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Slab-by-slab Breakdown
          </p>
        </div>
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.04 } } }}
        >
          <motion.div variants={rowFade}>
            <SlabRow
              label="Standard Deduction"
              value={`− ₹${formatIndianNumber(breakdown.standardDeduction)}`}
              valueColor="var(--cyan)"
            />
          </motion.div>
          {breakdown.totalDeductions > 0 && (
            <motion.div variants={rowFade}>
              <SlabRow
                label="Deductions (80C, 80D, etc.)"
                value={`− ₹${formatIndianNumber(breakdown.totalDeductions)}`}
                valueColor="var(--gold)"
              />
            </motion.div>
          )}
          <motion.div variants={rowFade}>
            <SlabRow
              label="Taxable Income"
              value={`₹${formatIndianNumber(breakdown.taxableIncome)}`}
              highlight
            />
          </motion.div>
          {breakdown.slabwiseTax.map(({ slab, taxOnSlab }, i) => (
            <motion.div key={i} variants={rowFade}>
              <SlabRow
                label={
                  slab.to
                    ? `₹${formatIndianNumber(slab.from)} – ${formatIndianNumber(slab.to)} @ ${slab.rate}%`
                    : `Above ₹${formatIndianNumber(slab.from)} @ ${slab.rate}%`
                }
                value={`₹${formatIndianNumber(Math.round(taxOnSlab))}`}
              />
            </motion.div>
          ))}
          {breakdown.surcharge > 0 && (
            <motion.div variants={rowFade}>
              <SlabRow
                label="Surcharge"
                value={`₹${formatIndianNumber(Math.round(breakdown.surcharge))}`}
              />
            </motion.div>
          )}
          <motion.div variants={rowFade}>
            <SlabRow
              label="Health & Education Cess (4%)"
              value={`₹${formatIndianNumber(Math.round(breakdown.cess))}`}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function SlabRow({
  label,
  value,
  valueColor,
  highlight,
}: {
  label: string;
  value: string;
  valueColor?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="px-4 py-3 flex justify-between items-center text-sm"
      style={{ borderBottom: 'var(--border-divider)' }}
    >
      <span style={{ color: highlight ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
        {label}
      </span>
      <span
        className="font-mono font-medium"
        style={{ color: valueColor || 'var(--text-primary)' }}
      >
        {value}
      </span>
    </div>
  );
}
