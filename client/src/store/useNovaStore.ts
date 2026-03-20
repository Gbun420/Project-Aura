import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { NOVA_CONFIG } from '../config/novaConfig';
import type { Sector, Job, PermitData } from '../types/nova';

// NOVA SOVEREIGN CORE - NEURAL STORE v1.7.1
// Hardened with centralized config

export type IdentityType = 'TCN' | 'CITIZEN';

interface NovaState {
  userId: string;
  identityType: IdentityType;
  isGhostMode: boolean;
  userSector: Sector | null;
  profileStatus: 'UNVERIFIED' | 'VERIFIED';
  isSynced: boolean;
  activeNodes: string[];
  stepProgress: number;
  currentStepId: number;
  documents: Record<string, boolean>;
  jobs: Job[];
  novaScore: number; // Renamed from auraScore
  activeManifests: { trackingId: string; jobId: string }[];
  permit: { status: 'IDLE' | 'GRANTED'; data: PermitData | null };
  isProductionReady: boolean;
  lastSync: string | null;
  
  // Actions
  setSector: (sector: Sector) => void;
  setIdentityType: (type: IdentityType) => void;
  setGhostMode: (enabled: boolean) => void;
  manifestIdentity: (nodes: string[]) => void;
  uploadDoc: (type: string) => void;
  setPermitStatus: (status: 'GRANTED', data: PermitData) => void;
  executeGoldenManifest: (jobId: string, trackingId: string) => void;
  completeInterview: (scoreIncrease: number) => void;
  calculateSyncScore: (jobId: string) => number;
  applyToJob: (jobId: string) => void;
}

const INITIAL_STATE: Omit<NovaState, 'setSector' | 'setIdentityType' | 'setGhostMode' | 'manifestIdentity' | 'uploadDoc' | 'setPermitStatus' | 'executeGoldenManifest' | 'completeInterview' | 'calculateSyncScore' | 'applyToJob'> = {
  userId: `NOVA-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  identityType: 'TCN',
  isGhostMode: NOVA_CONFIG.DYNAMICS.GHOST_MODE_DEFAULT,
  userSector: null,
  profileStatus: 'UNVERIFIED',
  isSynced: false,
  activeNodes: [],
  stepProgress: 15,
  currentStepId: 1,
  documents: { 'Passport': false, 'PDC_CERT': false, 'MGA_Compliance_CV': false },
  jobs: [],
  novaScore: 70,
  activeManifests: [],
  permit: { status: 'IDLE', data: null },
  isProductionReady: true,
  lastSync: new Date().toISOString(),
};

export const useNovaStore = create<NovaState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      setSector: (sector) => set({ userSector: sector }),
      setIdentityType: (type) => set({ identityType: type }),
      setGhostMode: (enabled) => set({ isGhostMode: enabled }),

      manifestIdentity: (nodes) => set({
        profileStatus: 'VERIFIED',
        isSynced: true,
        activeNodes: [...nodes, 'eng'],
        stepProgress: 25,
        currentStepId: 2,
        lastSync: new Date().toISOString()
      }),

      uploadDoc: (type) => set((state) => {
        const newDocs = { ...state.documents, [type]: true };
        let newStep = state.currentStepId;
        let newProgress = state.stepProgress;
        if (type === 'PDC_CERT' && NOVA_CONFIG.DYNAMICS.PDC_GATE_ENABLED) { newStep = 3; newProgress = 45; }
        return { documents: newDocs, currentStepId: newStep, stepProgress: newProgress, lastSync: new Date().toISOString() };
      }),

      setPermitStatus: (status, data) => set({
        permit: { status, data },
        currentStepId: 5,
        stepProgress: 100,
        lastSync: new Date().toISOString()
      }),

      executeGoldenManifest: (jobId, trackingId) => set((state) => ({
        activeManifests: [...state.activeManifests, { trackingId, jobId }],
        jobs: state.jobs.map(j => j.id === jobId ? { ...j, isApplied: true } : j),
        currentStepId: 4,
        stepProgress: 75,
        lastSync: new Date().toISOString()
      })),

      completeInterview: (scoreIncrease) => set((state) => {
        const newScore = Math.min(state.novaScore + scoreIncrease, 100);
        return { 
          novaScore: newScore,
          jobs: state.jobs.map(j => (newScore > 85 && j.sector === state.userSector) ? { ...j, isGoldenManifest: true } : j),
          lastSync: new Date().toISOString()
        };
      }),

      calculateSyncScore: (jobId) => {
        const job = get().jobs.find(j => j.id === jobId);
        if (!job) return 0;
        const matches = job.nova_req.filter(req => get().activeNodes.includes(req));
        return Math.round((matches.length / job.nova_req.length) * 100);
      },

      applyToJob: (jobId) => set((state) => ({
        jobs: state.jobs.map(j => j.id === jobId ? { ...j, isApplied: true } : j),
        lastSync: new Date().toISOString()
      })),
    }),
    {
      name: NOVA_CONFIG.STORAGE_KEYS.SOVEREIGN_CORE,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        userId: state.userId,
        identityType: state.identityType,
        isGhostMode: state.isGhostMode,
        userSector: state.userSector,
        profileStatus: state.profileStatus,
        isSynced: state.isSynced,
        activeNodes: state.activeNodes,
        stepProgress: state.stepProgress,
        currentStepId: state.currentStepId,
        documents: state.documents,
        novaScore: state.novaScore,
        permit: state.permit,
        activeManifests: state.activeManifests
      }),
    }
  )
);
