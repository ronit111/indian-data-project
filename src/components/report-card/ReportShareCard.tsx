import { useCallback, useRef, useState } from 'react';
import type { StateReportCard } from '../../lib/stateReportEngine.ts';

interface ReportShareCardProps {
  report: StateReportCard;
}

const QUARTILE_COLORS: Record<number, string> = {
  1: '#4ADE80', // top 25%
  2: '#FFC857', // 26-50%
  3: '#F59E0B', // 51-75%
  4: '#F43F5E', // bottom 25%
};

export function ReportShareCard({ report }: ReportShareCardProps) {
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

    // Top accent line (emerald)
    const accentGrad = ctx.createLinearGradient(0, 0, 1200, 0);
    accentGrad.addColorStop(0, '#4ADE80');
    accentGrad.addColorStop(1, '#86EFAC');
    ctx.fillStyle = accentGrad;
    ctx.fillRect(0, 0, 1200, 3);

    // Header
    ctx.fillStyle = '#b0b8c4';
    ctx.font = '500 18px Inter, sans-serif';
    ctx.fillText('Indian Data Project', 60, 48);

    // State name hero
    ctx.fillStyle = '#4ADE80';
    ctx.font = 'bold 48px Inter, sans-serif';
    ctx.fillText(report.state.name, 60, 110);

    ctx.fillStyle = '#5c6a7e';
    ctx.font = '20px Inter, sans-serif';
    const availableDomains = report.panels.filter((p) => p.dataAvailable).length;
    ctx.fillText(`State Report Card · ${availableDomains} domains`, 60, 145);

    // Separator
    ctx.strokeStyle = '#1a2230';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 170);
    ctx.lineTo(1140, 170);
    ctx.stroke();

    // Metric grid — pick top metrics (one from each domain with data)
    const keyMetrics = report.panels
      .filter((p) => p.dataAvailable && p.metrics.length > 0)
      .map((panel) => {
        const best = panel.metrics.find((m) => m.value !== null) ?? panel.metrics[0];
        return { domain: panel.title, metric: best, accent: panel.accentColor };
      })
      .slice(0, 9); // max 3x3 grid

    const cols = 3;
    const cellW = 350;
    const cellH = 70;
    const startY = 195;

    keyMetrics.forEach((item, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = 60 + col * cellW;
      const y = startY + row * cellH;

      // Domain label
      ctx.fillStyle = item.accent;
      ctx.font = '600 12px Inter, sans-serif';
      ctx.fillText(item.domain.toUpperCase(), x, y + 16);

      // Metric label + value
      ctx.fillStyle = '#f0ece6';
      ctx.font = '600 18px Inter, sans-serif';
      const valueStr = item.metric.value !== null
        ? (item.metric.def.formatFn
          ? item.metric.def.formatFn(item.metric.value)
          : `${item.metric.value}${item.metric.def.unit ? ' ' + item.metric.def.unit : ''}`)
        : 'N/A';
      ctx.fillText(`${item.metric.def.label}: ${valueStr}`, x, y + 40);

      // Rank badge
      if (item.metric.value !== null) {
        const rankText = `#${item.metric.rank}/${item.metric.totalStates}`;
        const badgeColor = QUARTILE_COLORS[item.metric.quartile] ?? '#5c6a7e';
        const rankW = ctx.measureText(rankText).width;

        ctx.fillStyle = badgeColor + '22';
        if (ctx.roundRect) {
          ctx.beginPath();
          ctx.roundRect(x + 280 - rankW - 8, y + 25, rankW + 16, 22, 4);
          ctx.fill();
        }

        ctx.fillStyle = badgeColor;
        ctx.font = 'bold 13px JetBrains Mono, monospace';
        ctx.fillText(rankText, x + 280 - rankW, y + 41);
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
    ctx.fillText('indiandataproject.org/states/your-state', 60, 590);

    return canvas;
  }, [report]);

  const handleShare = useCallback(async () => {
    const canvas = generateCanvas();
    if (!canvas) return;

    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      );
      if (blob) {
        const file = new File([blob], `${report.state.id}-report-card.png`, { type: 'image/png' });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `${report.state.name} Report Card — Indian Data Project`,
            text: `${report.state.name} state report card across ${report.panels.filter((p) => p.dataAvailable).length} domains`,
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
    link.download = `${report.state.id}-report-card.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setStatus('downloaded');
    setTimeout(() => setStatus('idle'), 1500);
  }, [generateCanvas, report]);

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      <button
        onClick={handleShare}
        className="py-2 px-4 rounded-lg text-sm font-medium cursor-pointer transition-colors duration-150 whitespace-nowrap hover:border-[var(--positive)] hover:bg-[rgba(74,222,128,0.08)]"
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
