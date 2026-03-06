import { useCallback, useRef, useState } from 'react';
import type { TaxBreakdown } from '../../lib/taxEngine.ts';
import type { ExpenditureSharesData } from '../../lib/data/schema.ts';
import { formatIndianNumber, formatPercent, formatLPA } from '../../lib/format.ts';

interface ShareCardProps {
  breakdown: TaxBreakdown;
  regime: 'new' | 'old';
  shares?: ExpenditureSharesData;
}

export function ShareCard({ breakdown, regime, shares }: ShareCardProps) {
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

    // Top accent line
    const accentGrad = ctx.createLinearGradient(0, 0, 1200, 0);
    accentGrad.addColorStop(0, '#FF6B35');
    accentGrad.addColorStop(1, '#FFC857');
    ctx.fillStyle = accentGrad;
    ctx.fillRect(0, 0, 1200, 3);

    // Left column — tax info
    ctx.fillStyle = '#b0b8c4';
    ctx.font = '500 18px Inter, sans-serif';
    ctx.fillText('Indian Data Project', 60, 48);

    ctx.fillStyle = '#f0ece6';
    ctx.font = 'bold 28px Inter, sans-serif';
    ctx.fillText(`On ₹${formatIndianNumber(breakdown.grossIncome)} (${formatLPA(breakdown.grossIncome)})`, 60, 100);

    ctx.fillStyle = '#FFC857';
    ctx.font = 'bold 56px JetBrains Mono, monospace';
    ctx.fillText(`₹${formatIndianNumber(breakdown.totalTax)}`, 60, 175);

    ctx.fillStyle = '#5c6a7e';
    ctx.font = '22px Inter, sans-serif';
    ctx.fillText(
      `${regime === 'new' ? 'New' : 'Old'} Regime  ·  ${formatPercent(breakdown.effectiveRate)} effective`,
      60, 215
    );

    if (breakdown.totalDeductions > 0) {
      ctx.fillStyle = '#FFC857';
      ctx.font = '20px Inter, sans-serif';
      ctx.fillText(`₹${formatIndianNumber(breakdown.totalDeductions)} in deductions`, 60, 250);
    }

    // Right column — top spending categories
    if (shares && breakdown.totalTax > 0) {
      const topShares = shares.shares.slice(0, 6);
      const startX = 660;
      const startY = 48;

      ctx.fillStyle = '#5c6a7e';
      ctx.font = '500 16px Inter, sans-serif';
      ctx.fillText('WHERE YOUR TAX GOES', startX, startY);

      // Divider line
      ctx.strokeStyle = '#1a2230';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(startX, startY + 12);
      ctx.lineTo(1140, startY + 12);
      ctx.stroke();

      const barColors = ['#4AEADC', '#4AEADC', '#FF6B35', '#6BA8A0', '#ff8c5a', '#FFC857'];

      topShares.forEach((share, i) => {
        const y = startY + 40 + i * 52;
        const amount = Math.round(breakdown.totalTax * (share.percentOfExpenditure / 100));
        const barWidth = (share.percentOfExpenditure / topShares[0].percentOfExpenditure) * 420;

        // Bar
        ctx.fillStyle = barColors[i] || '#5c6a7e';
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(startX, y, barWidth, 24, 4);
        } else {
          ctx.rect(startX, y, barWidth, 24);
        }
        ctx.fill();
        ctx.globalAlpha = 1;

        // Percent inside bar
        ctx.fillStyle = barColors[i] || '#5c6a7e';
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.fillText(`${share.percentOfExpenditure}%`, startX + 8, y + 17);

        // Name and amount
        ctx.fillStyle = '#f0ece6';
        ctx.font = '600 15px Inter, sans-serif';
        ctx.fillText(share.name, startX, y + 44);

        ctx.fillStyle = '#5c6a7e';
        ctx.font = '14px JetBrains Mono, monospace';
        const amountText = `₹${formatIndianNumber(amount)}`;
        const amountWidth = ctx.measureText(amountText).width;
        ctx.fillText(amountText, 1140 - amountWidth, y + 44);
      });
    }

    // Footer
    ctx.fillStyle = '#5c6a7e';
    ctx.font = '18px Inter, sans-serif';
    ctx.fillText('indiandataproject.org/calculator', 60, 590);

    // Separator before footer
    ctx.strokeStyle = '#1a2230';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 560);
    ctx.lineTo(1140, 560);
    ctx.stroke();

    return canvas;
  }, [breakdown, regime, shares]);

  const handleShare = useCallback(async () => {
    const canvas = generateCanvas();
    if (!canvas) return;

    // Try Web Share API first (works on mobile + some desktop browsers)
    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      );
      if (blob) {
        const file = new File([blob], 'my-tax-share.png', { type: 'image/png' });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'My Tax Share — Indian Data Project',
            text: `I pay ₹${formatIndianNumber(breakdown.totalTax)} in taxes. See where your money goes:`,
          });
          setStatus('shared');
          setTimeout(() => setStatus('idle'), 1500);
          return;
        }
      }
    } catch (e) {
      // User cancelled or share failed — fall through to download
      if ((e as Error).name === 'AbortError') return;
    }

    // Fallback: download
    const link = document.createElement('a');
    link.download = 'my-tax-share.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    setStatus('downloaded');
    setTimeout(() => setStatus('idle'), 1500);
  }, [generateCanvas, breakdown.totalTax]);

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
          {status === 'shared' ? (
            <>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8.5l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Shared
            </>
          ) : status === 'downloaded' ? (
            <>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8.5l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Downloaded
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M4 8h8M8 4v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Share
            </>
          )}
        </span>
      </button>
    </>
  );
}
