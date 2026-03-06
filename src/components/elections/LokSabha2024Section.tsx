import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollTrigger } from '../../hooks/useScrollTrigger.ts';
import { SectionNumber } from '../ui/SectionNumber.tsx';
import { HorizontalBarChart, type BarItem } from '../viz/HorizontalBarChart.tsx';
import type { ResultsData } from '../../lib/data/schema.ts';
import { ChartActionsWrapper } from '../share/ChartActionsWrapper.tsx';

interface LokSabha2024SectionProps {
  data: ResultsData;
}

/**
 * Parliament hemicycle: 543 seats arranged in concentric semicircular arcs.
 * Each dot = 1 constituency, colored by winning party.
 * Hovering a dot/legend entry highlights that party.
 */
function ParliamentHemicycle({
  parties,
  isVisible,
}: {
  parties: { party: string; seats: number; color: string; alliance: string }[];
  isVisible: boolean;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  // Build seat array: each seat has a party + color
  const seats = useMemo(() => {
    const arr: { party: string; color: string; alliance: string }[] = [];
    for (const p of parties) {
      for (let i = 0; i < p.seats; i++) {
        arr.push({ party: p.party, color: p.color, alliance: p.alliance });
      }
    }
    return arr;
  }, [parties]);

  // Arrange seats in semicircular arcs
  // Use 7 rows, distribute 543 seats across concentric arcs
  const rows = 7;
  const baseRadius = 80;
  const radiusStep = 28;
  const dotSize = 5.5;
  const cx = 250;
  const cy = 240;

  // Distribute seats across rows — outer rows get more seats
  const seatsPerRow = useMemo(() => {
    const rowWeights = Array.from({ length: rows }, (_, i) => baseRadius + i * radiusStep);
    const totalWeight = rowWeights.reduce((a, b) => a + b, 0);
    const distribution = rowWeights.map((w) => Math.round((w / totalWeight) * 543));
    // Adjust to sum to 543
    let diff = 543 - distribution.reduce((a, b) => a + b, 0);
    for (let i = distribution.length - 1; diff !== 0 && i >= 0; i--) {
      distribution[i] += diff > 0 ? 1 : -1;
      diff += diff > 0 ? -1 : 1;
    }
    return distribution;
  }, []);

  const dots = useMemo(() => {
    const result: { x: number; y: number; party: string; color: string; alliance: string }[] = [];
    let seatIdx = 0;

    for (let row = 0; row < rows; row++) {
      const r = baseRadius + row * radiusStep;
      const count = seatsPerRow[row];
      const angleStart = Math.PI * 0.05;
      const angleEnd = Math.PI * 0.95;
      const angleStep = count > 1 ? (angleEnd - angleStart) / (count - 1) : 0;

      for (let i = 0; i < count && seatIdx < seats.length; i++) {
        const angle = angleStart + i * angleStep;
        const x = cx + r * Math.cos(Math.PI - angle);
        const y = cy - r * Math.sin(angle);
        result.push({ x, y, ...seats[seatIdx] });
        seatIdx++;
      }
    }

    return result;
  }, [seats, seatsPerRow]);

  // Legend: top parties by seats
  const legend = useMemo(() => {
    return parties.filter((p) => p.seats >= 3).slice(0, 12);
  }, [parties]);

  return (
    <div>
      <svg viewBox="0 0 500 280" className="w-full max-w-lg mx-auto" role="img" aria-label="Parliament hemicycle showing 543 Lok Sabha seats by party">
        {isVisible && dots.map((d, i) => (
          <motion.circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={dotSize}
            fill={d.color}
            initial={{ opacity: 0, r: 0 }}
            animate={{
              opacity: hovered ? (hovered === d.party ? 1 : 0.15) : 1,
              r: dotSize,
            }}
            transition={{
              opacity: { duration: 0.2 },
              r: { duration: 0.4, delay: (i / dots.length) * 1.2, ease: [0.16, 1, 0.3, 1] },
            }}
          />
        ))}
        {/* Majority mark */}
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          fill="var(--text-muted)"
          fontSize="11"
          fontFamily="JetBrains Mono, monospace"
        >
          272 = majority
        </text>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-2">
        {legend.map((p) => (
          <button
            key={p.party}
            className="inline-flex items-center gap-1.5 text-xs font-mono cursor-pointer bg-transparent border-none p-0"
            style={{ color: hovered === p.party ? p.color : 'var(--text-secondary)' }}
            onMouseEnter={() => setHovered(p.party)}
            onMouseLeave={() => setHovered(null)}
          >
            <span
              className="w-2.5 h-2.5 rounded-sm inline-block"
              style={{ backgroundColor: p.color }}
            />
            {p.party} ({p.seats})
          </button>
        ))}
      </div>
    </div>
  );
}

export function LokSabha2024Section({ data }: LokSabha2024SectionProps) {
  const [ref, isVisible] = useScrollTrigger({ threshold: 0.08 });

  // Top parties for bar chart
  const partyBarItems: BarItem[] = useMemo(() => {
    return data.parties2024
      .filter((p) => p.seats >= 3)
      .slice(0, 15)
      .map((p) => ({
        id: p.party,
        label: p.party,
        value: p.seats,
        color: p.color,
      }));
  }, [data]);

  const { NDA, INDIA: indiaAlliance, majorityMark } = data.allianceTotals2024;

  return (
    <section ref={ref} id="lok-sabha-2024" className="composition" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionNumber number={3} className="mb-6 block" isVisible={isVisible} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-composition mb-2"
        >
          Lok Sabha 2024 — the verdict
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-annotation mb-8 max-w-xl"
        >
          BJP won {data.parties2024[0]?.seats ?? 240} seats — {majorityMark - (data.parties2024[0]?.seats ?? 240)} short of the {majorityMark}-seat majority. The INDIA alliance won {indiaAlliance} seats, with Congress nearly doubling from 52 to 99.
          NDA governs with {NDA} seats, relying on TDP (Telugu Desam Party) and JD(U) (Janata Dal United).
        </motion.p>

        {/* Parliament Hemicycle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="mb-8"
        >
          <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            543 seats — each dot is one constituency
          </p>
          <ChartActionsWrapper registryKey="elections/lok-sabha-2024" data={data}>
            <ParliamentHemicycle
              parties={data.parties2024}
              isVisible={isVisible}
            />
          </ChartActionsWrapper>
        </motion.div>

        {/* Alliance comparison */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
        >
          <div
            className="flex-1 p-4 rounded-lg text-center"
            style={{ background: 'var(--bg-raised)', borderTop: '3px solid #FF6B35' }}
          >
            <p className="text-2xl font-mono font-bold" style={{ color: '#FF6B35' }}>{NDA}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>NDA (BJP + allies)</p>
          </div>
          <div
            className="flex-1 p-4 rounded-lg text-center"
            style={{ background: 'var(--bg-raised)', borderTop: '3px solid #00BFFF' }}
          >
            <p className="text-2xl font-mono font-bold" style={{ color: '#00BFFF' }}>{indiaAlliance}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>INDIA (INC + allies)</p>
          </div>
          <div
            className="flex-1 p-4 rounded-lg text-center"
            style={{ background: 'var(--bg-raised)', borderTop: '3px solid var(--text-muted)' }}
          >
            <p className="text-2xl font-mono font-bold" style={{ color: 'var(--text-secondary)' }}>{majorityMark}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Majority mark</p>
          </div>
        </motion.div>

        {/* Party-wise bar chart */}
        {partyBarItems.length > 0 && (
          <div className="mt-10">
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
              Seats won by party (parties with 3+ seats)
            </p>
            <ChartActionsWrapper registryKey="elections/lok-sabha-2024" data={data}>
              <HorizontalBarChart
                items={partyBarItems}
                isVisible={isVisible}
                formatValue={(v) => `${v}`}
                unit="seats"
                labelWidth={80}
                barHeight={22}
              />
            </ChartActionsWrapper>
          </div>
        )}

        <p className="source-attribution">
          Source: {data.source}
        </p>
      </div>
    </section>
  );
}
