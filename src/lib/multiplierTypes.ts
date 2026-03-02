/**
 * Types for Phase 12 — Multiplier Infrastructure.
 * Shared by Open Data, For Journalists, For Teachers, and Contributor pages.
 */

import type { ChartType } from './chartRegistry.ts';

// ─── Data Endpoint Catalog ────────────────────────────────────────

export interface DataEndpoint {
  domain: string;
  file: string;
  /** Fetch path relative to origin, e.g. "/data/budget/2025-26/summary.json" */
  path: string;
  description: string;
  /** TypeScript interface name from schema.ts, e.g. "BudgetSummary" */
  schema: string;
  source: string;
  sourceUrl: string;
}

// ─── Chart Gallery ────────────────────────────────────────────────

export interface GalleryFilter {
  domains: string[];
  chartTypes: ChartType[];
  searchQuery: string;
}

// ─── Story Kit ────────────────────────────────────────────────────

export interface StoryKitChart {
  /** Registry key, e.g. "budget/revenue" */
  registryKey: string;
  /** Editorial context for this chart */
  caption: string;
  suggestedHeadline?: string;
}

export interface StoryKitDef {
  id: string;
  title: string;
  subtitle: string;
  accent: string;
  /** 2-3 paragraph editorial context for the story */
  narrativeContext: string;
  charts: StoryKitChart[];
  /** 3-5 angles a journalist could take */
  suggestedAngles: string[];
  dataSources: string[];
  lastUpdated: string;
}

// ─── Lesson Plan ──────────────────────────────────────────────────

export type NCERTSubject = 'economics' | 'political-science' | 'geography';
export type NCERTClass = 9 | 10 | 11 | 12;

export interface LessonPlanChart {
  registryKey: string;
  /** What to explain about this chart in class */
  teachingNote: string;
  /** 2-3 questions per chart */
  discussionQuestions: string[];
}

export interface LessonPlanDef {
  id: string;
  title: string;
  subtitle: string;
  accent: string;
  subject: NCERTSubject;
  class: NCERTClass;
  /** NCERT chapter reference */
  chapter: string;
  learningObjectives: string[];
  charts: LessonPlanChart[];
  wrapUpQuestions: string[];
  furtherReading: { label: string; url: string }[];
}

// ─── Citation ─────────────────────────────────────────────────────

export type CitationFormat = 'apa' | 'chicago' | 'plain';
