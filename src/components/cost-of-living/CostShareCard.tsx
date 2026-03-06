import { useCallback, useRef, useState } from 'react';
import type { CostOfLivingResult } from '../../lib/costOfLivingEngine.ts';
import { formatIndianNumber } from '../../lib/format.ts';

interface CostShareCardProps {
  result: CostOfLivingResult;
  fromYear: string;
  toYear: string;
}

export function CostShareCard({ result, fromYear, toYear }: CostShareCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<'idle' | 'shared' | 'downloaded'>('idle');

  const generateCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    canvas.width = 1200;
    canvas.height = 630;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, '#06080f');
    gradient.addColorStop(1, '#0e1420');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Top accent line (cyan → gold)
    const accentGrad = ctx.createLinearGradient(0, 0, 1200, 0);
    accentGrad.addColorStop(0, '#4AEADC');
    accentGrad.addColorStop(1, '#FFC857');
    ctx.fillStyle = accentGrad;
    ctx.fillRect(0, 0, 1200, 3);

    // Header
    ctx.fillStyle = '#b0b8c4';
    ctx.font = '500 18px Inter, sans-serif';
    ctx.fillText('Indian Data Project', 60, 48);

    // Title
    ctx.fillStyle = '#f0ece6';
    ctx.font = 'bold 28px Inter, sans-serif';
    ctx.fillText(`Your ₹${formatIndianNumber(result.currentTotal)}/month in ${toYear}`, 60, 100);

    // "Then vs Now" hero
    ctx.fillStyle = '#4AEADC';
    ctx.font = 'bold 56px JetBrains Mono, monospace';
    ctx.fillText(`was ₹${formatIndianNumber(Math.round(result.adjustedTotal))} in ${fromYear}`, 60, 180);

    // Separator
    ctx.strokeStyle = '#1a2230';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 220);
    ctx.lineTo(1140, 220);
    ctx.stroke();

    // Stats row
    const stats = [
      { label: 'Cumulative Inflation', value: `${result.cumulativeInflation.toFixed(1)}%`, color: '#F43F5E' },
      { label: 'Annualized Rate', value: `${result.annualizedRate.toFixed(1)}%/yr`, color: '#FFC857' },
      { label: 'Purchasing Power Lost', value: `₹${formatIndianNumber(Math.round(result.purchasingPowerLoss))}/mo`, color: '#F43F5E' },
    ];

    stats.forEach((stat, i) => {
      const x = 60 + i * 370;
      ctx.fillStyle = '#5c6a7e';
      ctx.font = '500 16px Inter, sans-serif';
      ctx.fillText(stat.label.toUpperCase(), x, 270);

      ctx.fillStyle = stat.color;
      ctx.font = 'bold 28px JetBrains Mono, monospace';
      ctx.fillText(stat.value, x, 310);
    });

    // Category breakdown (top categories with most inflation)
    ctx.fillStyle = '#5c6a7e';
    ctx.font = '500 16px Inter, sans-serif';
    ctx.fillText('CATEGORY INFLATION', 60, 390);

    const sorted = [...result.byCategory]
      .filter((c) => c.currentAmount > 0)
      .sort((a, b) => b.categoryInflation - a.categoryInflation);
    const topCategories = sorted.slice(0, 4);

    const CATEGORY_LABELS: Record<string, string> = {
      housing: 'Housing', food: 'Groceries', transport: 'Transport',
      education: 'Education', healthcare: 'Healthcare', utilities: 'Utilities', other: 'Other',
    };

    topCategories.forEach((cat, i) => {
      const x = 60 + i * 270;
      ctx.fillStyle = '#f0ece6';
      ctx.font = '600 18px Inter, sans-serif';
      ctx.fillText(CATEGORY_LABELS[cat.id] ?? cat.id, x, 430);

      ctx.fillStyle = cat.categoryInflation > 30 ? '#F43F5E' : '#FFC857';
      ctx.font = 'bold 22px JetBrains Mono, monospace';
      ctx.fillText(`+${cat.categoryInflation.toFixed(1)}%`, x, 465);

      if (cat.usedFallback) {
        ctx.fillStyle = '#3a4555';
        ctx.font = '12px Inter, sans-serif';
        ctx.fillText('(headline CPI)', x, 485);
      }
    });

    // Footer
    ctx.strokeStyle = '#1a2230';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 560);
    ctx.lineTo(1140, 560);
    ctx.stroke();

    ctx.fillStyle = '#5c6a7e';
    ctx.font = '18px Inter, sans-serif';
    ctx.fillText('indiandataproject.org/economy/calculator', 60, 590);

    return canvas;
  }, [result, fromYear, toYear]);

  const handleShare = useCallback(async () => {
    const canvas = generateCanvas();
    if (!canvas) return;

    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      );
      if (blob) {
        const file = new File([blob], 'cost-of-living.png', { type: 'image/png' });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Cost of Living — Indian Data Project',
            text: `My ₹${formatIndianNumber(result.currentTotal)}/month would have cost ₹${formatIndianNumber(Math.round(result.adjustedTotal))} in ${fromYear}`,
          });
          setStatus('shared');
          setTimeout(() => setStatus('idle'), 1500);
          return;
        }
      }
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
    }

    const link = document.createElement('a');
    link.download = 'cost-of-living.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    setStatus('downloaded');
    setTimeout(() => setStatus('idle'), 1500);
  }, [generateCanvas, result, fromYear]);

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      <button
        onClick={handleShare}
        className="py-2 px-4 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 whitespace-nowrap hover:border-[var(--cyan)] hover:bg-[var(--cyan-dim)]"
        style={{
          background: status !== 'idle' ? 'var(--positive-dim)' : 'transparent',
          color: status !== 'idle' ? 'var(--positive)' : 'var(--text-secondary)',
          border: status !== 'idle' ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid rgba(255, 255, 255, 0.10)',
        }}
      >
        <span className="flex items-center gap-2">
          {status === 'idle' ? (
            <>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M4 8h8M8 4v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Share
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8.5l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {status === 'shared' ? 'Shared' : 'Downloaded'}
            </>
          )}
        </span>
      </button>
    </>
  );
}
