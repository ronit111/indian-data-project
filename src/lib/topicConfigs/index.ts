/**
 * Central barrel for all topic configurations.
 * Exports TOPIC_CONFIGS map (id → TopicDef) and ALL_TOPICS array.
 */

import type { TopicDef } from '../topicConfig.ts';
import { womenInIndia } from './women-in-india.ts';
import { fiscalHealth } from './fiscal-health.ts';
import { inflationCost } from './inflation-cost.ts';
import { educationEmployment } from './education-employment.ts';
import { healthOutcomes } from './health-outcomes.ts';
import { regionalInequality } from './regional-inequality.ts';
import { climateEnergy } from './climate-energy.ts';
import { youthJobs } from './youth-jobs.ts';
import { democraticHealth } from './democratic-health.ts';
import { agricultureFood } from './agriculture-food.ts';
import { waterCrisis } from './water-crisis.ts';

// NOTE: 'urban-rural' has been merged into 'regional-inequality' (Beat 3: city-village access gap).

export const TOPIC_CONFIGS: Record<string, TopicDef> = {
  'women-in-india': womenInIndia,
  'fiscal-health': fiscalHealth,
  'inflation-cost': inflationCost,
  'education-employment': educationEmployment,
  'health-outcomes': healthOutcomes,
  'regional-inequality': regionalInequality,
  'climate-energy': climateEnergy,
  'youth-jobs': youthJobs,
  'democratic-health': democraticHealth,
  'agriculture-food': agricultureFood,
  'water-crisis': waterCrisis,
};

export const ALL_TOPICS: TopicDef[] = Object.values(TOPIC_CONFIGS);

/** Featured topics for the hub page (4 curated picks) */
export const FEATURED_TOPIC_IDS = [
  'women-in-india',
  'fiscal-health',
  'youth-jobs',
  'water-crisis',
];
