import type { StoryKitDef } from '../multiplierTypes.ts';
import { BUDGET_BREAKDOWN } from './budget-breakdown.ts';
import { INFLATION_STORY } from './inflation-story.ts';
import { STATE_DIVIDE } from './state-divide.ts';
import { WOMEN_DATA } from './women-data.ts';
import { YOUTH_EMPLOYMENT } from './youth-employment.ts';
import { HEALTH_INFRASTRUCTURE } from './health-infrastructure.ts';
import { CRIME_SAFETY } from './crime-safety.ts';

export const STORY_KIT_CONFIGS: Record<string, StoryKitDef> = {
  'budget-breakdown': BUDGET_BREAKDOWN,
  'inflation-story': INFLATION_STORY,
  'state-divide': STATE_DIVIDE,
  'women-data': WOMEN_DATA,
  'youth-employment': YOUTH_EMPLOYMENT,
  'health-infrastructure': HEALTH_INFRASTRUCTURE,
  'crime-safety': CRIME_SAFETY,
};

export const ALL_STORY_KITS: StoryKitDef[] = Object.values(STORY_KIT_CONFIGS);
