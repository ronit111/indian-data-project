/**
 * SVG → Canvas → PNG capture pipeline.
 *
 * 1. Clone target SVG from the DOM
 * 2. Resolve CSS custom properties (var(--saffron) → #FF6B35)
 * 3. Embed fonts as base64 @font-face
 * 4. Force opacity: 1 on all animated elements
 * 5. Serialize to data URI → draw on offscreen Canvas
 * 6. Composite: dark background → title → chart → source → watermark
 * 7. Return blob or trigger download
 */

// ─── CSS Variable Resolution ─────────────────────────────────────────

const VAR_REGEX = /var\(--([^)]+)\)/g;

function resolveVar(varName: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--${varName}`)
    .trim();
}

function resolveAllVars(value: string): string {
  return value.replace(VAR_REGEX, (_, name) => resolveVar(name) || _);
}

// ─── SVG Clone & Preparation ─────────────────────────────────────────

const STYLE_PROPS_TO_RESOLVE = [
  'fill',
  'stroke',
  'color',
  'stop-color',
  'flood-color',
  'lighting-color',
] as const;

const ATTR_PROPS_TO_RESOLVE = ['fill', 'stroke'] as const;

function prepareSvgClone(svg: SVGSVGElement): SVGSVGElement {
  const clone = svg.cloneNode(true) as SVGSVGElement;

  // Walk every element, resolve CSS vars and force full opacity
  const allElements = clone.querySelectorAll('*');
  for (const el of allElements) {
    const htmlEl = el as SVGElement;

    // Force opacity to 1 (animations may have left elements partially visible)
    htmlEl.style.opacity = '1';

    // Remove transitions (they cause rendering issues in serialized SVG)
    htmlEl.style.transition = 'none';

    // Resolve CSS vars in inline styles
    for (const prop of STYLE_PROPS_TO_RESOLVE) {
      const val = htmlEl.style.getPropertyValue(prop);
      if (val && val.includes('var(')) {
        htmlEl.style.setProperty(prop, resolveAllVars(val));
      }
    }

    // Resolve CSS vars in SVG attributes
    for (const prop of ATTR_PROPS_TO_RESOLVE) {
      const attr = htmlEl.getAttribute(prop);
      if (attr && attr.includes('var(')) {
        htmlEl.setAttribute(prop, resolveAllVars(attr));
      }
    }

    // Also resolve computed fill/stroke for elements that inherit from CSS classes
    const computed = getComputedStyle(el as Element);
    if (!htmlEl.getAttribute('fill') && computed.fill !== 'none' && computed.fill !== 'rgb(0, 0, 0)') {
      htmlEl.setAttribute('fill', computed.fill);
    }

    // Reset stroke-dashoffset for animated line charts (show full path)
    if (htmlEl.hasAttribute('stroke-dashoffset') || htmlEl.style.strokeDashoffset) {
      htmlEl.style.strokeDashoffset = '0';
      htmlEl.setAttribute('stroke-dashoffset', '0');
    }
  }

  // Resolve CSS vars in the SVG's own style
  for (const prop of STYLE_PROPS_TO_RESOLVE) {
    const val = clone.style.getPropertyValue(prop);
    if (val && val.includes('var(')) {
      clone.style.setProperty(prop, resolveAllVars(val));
    }
  }

  return clone;
}

// ─── Font Embedding ──────────────────────────────────────────────────

function createFontStyleElement(): string {
  // Use web-safe fallback fonts. The exported image won't have Inter/JetBrains Mono
  // loaded unless the user's browser has them. For a clean export, we map to
  // system fonts that are reliably available on Canvas.
  return `
    <style>
      text { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
      [font-family*="mono"], [style*="font-mono"] { font-family: 'SF Mono', 'Consolas', 'Liberation Mono', monospace; }
    </style>
  `;
}

// ─── Serialization & Rendering ───────────────────────────────────────

function serializeSvgToDataUri(svg: SVGSVGElement): string {
  const fontStyle = createFontStyleElement();

  // Inject font style as first child of the SVG
  const parser = new DOMParser();
  const styleDoc = parser.parseFromString(
    `<svg xmlns="http://www.w3.org/2000/svg">${fontStyle}</svg>`,
    'image/svg+xml'
  );
  const styleEl = styleDoc.querySelector('style');
  if (styleEl) {
    svg.insertBefore(svg.ownerDocument.importNode(styleEl, true), svg.firstChild);
  }

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// ─── Public API ──────────────────────────────────────────────────────

export interface CaptureOptions {
  title: string;
  source: string;
  accentColor: string;
  /** Output width (default 1200) */
  width?: number;
  /** Output height (default 630 for OG-compatible) */
  height?: number;
}

/**
 * Capture an SVG element as a PNG blob.
 * Composites: dark background → accent bar → title → chart → source → watermark
 */
export async function captureSvgToPng(
  svgElement: SVGSVGElement,
  options: CaptureOptions
): Promise<Blob> {
  const { title, source, accentColor, width = 1200, height = 630 } = options;

  // 1. Prepare SVG clone
  const clone = prepareSvgClone(svgElement);

  // 2. Get SVG dimensions from viewBox
  const viewBox = svgElement.getAttribute('viewBox');
  let svgW = 700;
  let svgH = 360;
  if (viewBox) {
    const parts = viewBox.split(/[\s,]+/).map(Number);
    if (parts.length >= 4 && parts.every(n => isFinite(n))) {
      svgW = parts[2] || 700;
      svgH = parts[3] || 360;
    }
  }

  // 3. Serialize to data URI and load as image
  const dataUri = serializeSvgToDataUri(clone);
  const img = await loadImage(dataUri);

  // 4. Create offscreen canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  // 5. Dark background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#06080f');
  bgGrad.addColorStop(1, '#0e1420');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 6. Top accent bar
  const accentGrad = ctx.createLinearGradient(0, 0, width, 0);
  accentGrad.addColorStop(0, accentColor);
  accentGrad.addColorStop(1, accentColor + '66'); // fade out
  ctx.fillStyle = accentGrad;
  ctx.fillRect(0, 0, width, 3);

  // 7. Title
  ctx.fillStyle = '#f0ece6';
  ctx.font = 'bold 24px -apple-system, sans-serif';
  ctx.fillText(title, 40, 48);

  // 8. Draw chart SVG (scaled to fit, preserving aspect ratio)
  const chartArea = { x: 40, y: 70, w: width - 80, h: height - 140 };
  const scale = Math.min(chartArea.w / svgW, chartArea.h / svgH);
  const drawW = svgW * scale;
  const drawH = svgH * scale;
  const drawX = chartArea.x + (chartArea.w - drawW) / 2;
  const drawY = chartArea.y + (chartArea.h - drawH) / 2;
  ctx.drawImage(img, drawX, drawY, drawW, drawH);

  // 9. Source attribution
  ctx.fillStyle = '#5c6a7e';
  ctx.font = '14px -apple-system, sans-serif';
  ctx.fillText(`Source: ${source}`, 40, height - 40);

  // 10. Watermark / branding
  ctx.fillStyle = '#5c6a7e';
  ctx.font = '14px -apple-system, sans-serif';
  const brand = 'indiandataproject.org';
  const brandW = ctx.measureText(brand).width;
  ctx.fillText(brand, width - 40 - brandW, height - 40);

  // 11. Separator line
  ctx.strokeStyle = '#1a2230';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, height - 60);
  ctx.lineTo(width - 40, height - 60);
  ctx.stroke();

  // 12. Export to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Canvas toBlob failed'))),
      'image/png'
    );
  });
}

/**
 * Download a captured PNG.
 */
export async function downloadChartPng(
  svgElement: SVGSVGElement,
  options: CaptureOptions & { filename?: string }
): Promise<void> {
  const blob = await captureSvgToPng(svgElement, options);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = options.filename || `${options.title.toLowerCase().replace(/\s+/g, '-')}.png`;
  link.click();
  URL.revokeObjectURL(url);
}
