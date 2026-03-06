import { useCallback, useRef, useState } from 'react';
import type { EMIBreakdown, LoanType } from '../../lib/emiEngine.ts';
import { formatIndianNumber } from '../../lib/format.ts';

interface EMIShareCardProps {
  breakdown: EMIBreakdown;
  loanType: LoanType;
  loanAmount: number;
  tenureYears: number;
  repoRate: number;
}

const LOAN_LABELS: Record<LoanType, string> = {
  home: 'Home Loan',
  car: 'Car Loan',
  personal: 'Personal Loan',
};

export function EMIShareCard({ breakdown, loanType, loanAmount, tenureYears, repoRate }: EMIShareCardProps) {
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

    // Top accent line (gold → saffron)
    const accentGrad = ctx.createLinearGradient(0, 0, 1200, 0);
    accentGrad.addColorStop(0, '#FFC857');
    accentGrad.addColorStop(1, '#FF6B35');
    ctx.fillStyle = accentGrad;
    ctx.fillRect(0, 0, 1200, 3);

    // Header
    ctx.fillStyle = '#b0b8c4';
    ctx.font = '500 18px Inter, sans-serif';
    ctx.fillText('Indian Data Project', 60, 48);

    // Loan info
    ctx.fillStyle = '#f0ece6';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillText(`${LOAN_LABELS[loanType]} · ₹${formatIndianNumber(loanAmount)} · ${tenureYears} years`, 60, 95);

    ctx.fillStyle = '#5c6a7e';
    ctx.font = '18px Inter, sans-serif';
    ctx.fillText(`Repo rate: ${repoRate}%  ·  Effective rate: ${breakdown.effectiveRate.toFixed(2)}%`, 60, 130);

    // Monthly EMI — hero stat
    ctx.fillStyle = '#FFC857';
    ctx.font = 'bold 64px JetBrains Mono, monospace';
    ctx.fillText(`₹${formatIndianNumber(breakdown.monthlyEMI)}/mo`, 60, 220);

    // Separator
    ctx.strokeStyle = '#1a2230';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 260);
    ctx.lineTo(1140, 260);
    ctx.stroke();

    // Stats grid (3 columns)
    const stats = [
      { label: 'Total Payment', value: `₹${formatIndianNumber(breakdown.totalPayment)}` },
      { label: 'Total Interest', value: `₹${formatIndianNumber(breakdown.totalInterest)}` },
      { label: 'Interest Ratio', value: `₹${breakdown.interestRatio.toFixed(2)} per ₹1` },
    ];

    stats.forEach((stat, i) => {
      const x = 60 + i * 370;
      ctx.fillStyle = '#5c6a7e';
      ctx.font = '500 16px Inter, sans-serif';
      ctx.fillText(stat.label.toUpperCase(), x, 310);

      ctx.fillStyle = '#f0ece6';
      ctx.font = 'bold 28px JetBrains Mono, monospace';
      ctx.fillText(stat.value, x, 350);
    });

    // What if section
    ctx.fillStyle = '#5c6a7e';
    ctx.font = '500 16px Inter, sans-serif';
    ctx.fillText('IF RBI CHANGES RATE', 60, 430);

    const bpsOffsets = [-50, -25, 25, 50];
    const bpsLabels = ['-50 bps', '-25 bps', '+25 bps', '+50 bps'];
    bpsOffsets.forEach((bps, i) => {
      const x = 60 + i * 270;
      const rate = Math.max(0, breakdown.effectiveRate + bps / 100);
      const r = rate / 12 / 100;
      const n = tenureYears * 12;
      const power = Math.pow(1 + r, n);
      const emi = r > 0 ? Math.round((loanAmount * r * power) / (power - 1)) : Math.round(loanAmount / n);
      const diff = emi - breakdown.monthlyEMI;

      ctx.fillStyle = '#b0b8c4';
      ctx.font = '16px Inter, sans-serif';
      ctx.fillText(bpsLabels[i], x, 465);

      ctx.fillStyle = diff > 0 ? '#F43F5E' : '#4ADE80';
      ctx.font = 'bold 22px JetBrains Mono, monospace';
      ctx.fillText(`${diff > 0 ? '+' : ''}Rs ${formatIndianNumber(Math.abs(diff))}/mo`, x, 500);
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
    ctx.fillText('indiandataproject.org/rbi/calculator', 60, 590);

    return canvas;
  }, [breakdown, loanType, loanAmount, tenureYears, repoRate]);

  const handleShare = useCallback(async () => {
    const canvas = generateCanvas();
    if (!canvas) return;

    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      );
      if (blob) {
        const file = new File([blob], 'emi-impact.png', { type: 'image/png' });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'EMI Impact Calculator — Indian Data Project',
            text: `My ${LOAN_LABELS[loanType]} EMI: ₹${formatIndianNumber(breakdown.monthlyEMI)}/month`,
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
    link.download = 'emi-impact.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    setStatus('downloaded');
    setTimeout(() => setStatus('idle'), 1500);
  }, [generateCanvas, breakdown.monthlyEMI, loanType]);

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      <button
        onClick={handleShare}
        className="py-2 px-4 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 whitespace-nowrap hover:border-[var(--gold)] hover:bg-[rgba(255,200,87,0.08)]"
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
