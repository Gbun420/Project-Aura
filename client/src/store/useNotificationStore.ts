import { create } from 'zustand';

export interface AuraPing {
  id: string;
  type: 'SYNC_MATCH' | 'PERMIT_MOVE' | 'OPERATOR_VIEW' | 'GALAXY_NODE_INTEL';
  message: string;
  timestamp: Date;
  severity: 'LOW' | 'HIGH' | 'CRITICAL';
}

interface NotificationState {
  pings: AuraPing[];
  addPing: (ping: Omit<AuraPing, 'id' | 'timestamp'>) => void;
  removePing: (id: string) => void;
  clearPings: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  pings: [],
  addPing: (ping) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({
      pings: [{
        ...ping,
        id,
        timestamp: new Date()
      }, ...state.pings].slice(0, 5) // Keep only latest 5
    }));
    
    // Auto-remove after 6 seconds
    setTimeout(() => {
      set((state) => ({
        pings: state.pings.filter(p => p.id !== id)
      }));
    }, 6000);
  },
  removePing: (id) => set((state) => ({
    pings: state.pings.filter(p => p.id !== id)
  })),
  clearPings: () => set({ pings: [] }),
}));
