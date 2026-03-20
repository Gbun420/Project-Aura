import type { Sector } from '../types/nova';

export const SECTOR_CONFIG: Record<Sector, { color: string; icon: string; fastTrack: boolean }> = {
  Healthcare: { color: '#ef4444', icon: 'HeartPulse', fastTrack: true },
  Fintech: { color: '#f59e0b', icon: 'Cpu', fastTrack: true },
  GreenEnergy: { color: '#10b981', icon: 'Leaf', fastTrack: false },
  iGaming: { color: '#22d3ee', icon: 'Gamepad', fastTrack: true },
  Aviation: { color: '#6366f1', icon: 'Plane', fastTrack: true }
};
