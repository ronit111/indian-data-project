/**
 * Citation generator for chart data.
 * Produces APA, Chicago, and plain-text citations from chart registry entries.
 */

import type { ChartRegistryEntry } from './chartRegistry.ts';
import { getPermalink } from './chartRegistry.ts';
import type { CitationFormat } from './multiplierTypes.ts';

const BASE_URL = 'https://indiandataproject.org';

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

function formatAPA(entry: ChartRegistryEntry): string {
  const year = new Date().getFullYear();
  const url = `${BASE_URL}${getPermalink(entry.domain, entry.sectionId)}`;
  return `Indian Data Project. (${year}). ${entry.title}. Retrieved ${todayISO()}, from ${url}`;
}

function formatChicago(entry: ChartRegistryEntry): string {
  const url = `${BASE_URL}${getPermalink(entry.domain, entry.sectionId)}`;
  return `"${entry.title}." Indian Data Project. Accessed ${todayISO()}. ${url}.`;
}

function formatPlain(entry: ChartRegistryEntry): string {
  const url = `${BASE_URL}${getPermalink(entry.domain, entry.sectionId)}`;
  return `${entry.title} — Indian Data Project. Source: ${entry.source}. ${url}`;
}

export function generateCitation(
  entry: ChartRegistryEntry,
  format: CitationFormat,
): string {
  switch (format) {
    case 'apa':
      return formatAPA(entry);
    case 'chicago':
      return formatChicago(entry);
    case 'plain':
      return formatPlain(entry);
  }
}
