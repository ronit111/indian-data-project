/**
 * WhatsApp share card generator — Canvas API, <100KB.
 * Creates a 1200x630 one-stat image with source attribution + deep link.
 */

import type { HeroStat } from './chartRegistry.ts';
import { DOMAIN_META } from './chartRegistry.ts';

export interface ShareCardOptions {
  domain: string;
  sectionId: string;
  stat: HeroStat;
}

/**
 * Generate a share card blob (1200x630, PNG, <100KB target).
 */
export async function generateShareCard(options: ShareCardOptions): Promise<Blob> {
  const { domain, sectionId, stat } = options;
  const meta = DOMAIN_META[domain];
  const accent = meta?.accent ?? '#FF6B35';
  const domainName = meta?.name ?? domain;

  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, 1200, 630);
  bgGrad.addColorStop(0, '#06080f');
  bgGrad.addColorStop(1, '#0e1420');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 630);

  // Top accent bar
  const accentGrad = ctx.createLinearGradient(0, 0, 1200, 0);
  accentGrad.addColorStop(0, accent);
  accentGrad.addColorStop(0.7, accent + '88');
  accentGrad.addColorStop(1, accent + '22');
  ctx.fillStyle = accentGrad;
  ctx.fillRect(0, 0, 1200, 4);

  // Domain label
  ctx.fillStyle = accent;
  ctx.font = '600 20px -apple-system, sans-serif';
  ctx.fillText(domainName.toUpperCase(), 80, 80);

  // Stat label
  ctx.fillStyle = '#b0b8c4';
  ctx.font = '500 28px -apple-system, sans-serif';
  ctx.fillText(stat.label, 80, 180);

  // Hero value
  ctx.fillStyle = '#f0ece6';
  ctx.font = 'bold 80px -apple-system, sans-serif';
  // Handle long values by reducing font size
  const valueWidth = ctx.measureText(stat.value).width;
  if (valueWidth > 900) {
    ctx.font = 'bold 56px -apple-system, sans-serif';
  }
  ctx.fillText(stat.value, 80, 280);

  // Context line
  ctx.fillStyle = '#5c6a7e';
  ctx.font = '24px -apple-system, sans-serif';
  wrapText(ctx, stat.context, 80, 340, 1040, 34);

  // Separator
  ctx.strokeStyle = '#1a2230';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, 540);
  ctx.lineTo(1120, 540);
  ctx.stroke();

  // Deep link
  const deepLink = `indiandataproject.org${meta?.basePath ?? ''}#${sectionId}`;
  ctx.fillStyle = '#5c6a7e';
  ctx.font = '18px -apple-system, sans-serif';
  ctx.fillText(deepLink, 80, 580);

  // Branding
  ctx.fillStyle = accent;
  ctx.font = 'bold 18px -apple-system, sans-serif';
  const brand = 'Indian Data Project';
  const brandW = ctx.measureText(brand).width;
  ctx.fillText(brand, 1120 - brandW, 580);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Share card blob failed'))),
      'image/png'
    );
  });
}

/** Simple text wrapping for Canvas. */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): void {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) ctx.fillText(line, x, currentY);
}

/**
 * Share via Web Share API or fallback to download.
 */
export async function shareCard(options: ShareCardOptions): Promise<'shared' | 'downloaded'> {
  const blob = await generateShareCard(options);
  const filename = `${options.domain}-${options.sectionId}.png`;

  try {
    const file = new File([blob], filename, { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: `${options.stat.label} — Indian Data Project`,
        text: `${options.stat.value} — ${options.stat.context}`,
      });
      return 'shared';
    }
  } catch (e) {
    // User cancelled the share sheet — don't force a download
    if (e instanceof Error && e.name === 'AbortError') return 'shared';
    // Any other share failure → fall through to download
  }

  // Fallback: download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  return 'downloaded';
}
