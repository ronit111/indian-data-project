import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ALL_STATE_CODES } from '../lib/stateMapping.ts';

interface PersonalizationState {
  selectedStateId: string | null;
  selectedStateName: string | null;
  householdSize: number;
  bannerDismissed: Record<string, boolean>; // keyed by pathname prefix
  classroomMode: boolean;
  setState: (stateId: string | null) => void;
  setHouseholdSize: (size: number) => void;
  dismissBanner: (domain: string) => void;
  resetBannerDismissals: () => void;
  setClassroomMode: (on: boolean) => void;
  clearState: () => void;
}

export const usePersonalizationStore = create<PersonalizationState>()(
  persist(
    (set) => ({
      selectedStateId: null,
      selectedStateName: null,
      householdSize: 4,
      bannerDismissed: {},
      classroomMode: false,
      setState: (stateId) =>
        set({
          selectedStateId: stateId,
          selectedStateName: stateId ? (ALL_STATE_CODES[stateId] ?? null) : null,
          bannerDismissed: {},
        }),
      setHouseholdSize: (size) => set({ householdSize: size }),
      dismissBanner: (domain) =>
        set((s) => ({
          bannerDismissed: { ...s.bannerDismissed, [domain]: true },
        })),
      resetBannerDismissals: () => set({ bannerDismissed: {} }),
      setClassroomMode: (on) => set({ classroomMode: on }),
      clearState: () =>
        set({
          selectedStateId: null,
          selectedStateName: null,
          bannerDismissed: {},
        }),
    }),
    { name: 'india-data-personalization' }
  )
);
