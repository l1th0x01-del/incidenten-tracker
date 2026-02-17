import { Accident } from '../types';
import { SEED_ACCIDENTS } from '../constants';

const STORAGE_KEY = 'vlaanderen_verkeer_accidents_v1';

// Simulates an API call delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const dataService = {
  /**
   * Fetches accidents from "Database" (LocalStorage)
   * If empty, seeds with initial data.
   */
  getAccidents: async (): Promise<Accident[]> => {
    await delay(300); // Simulate network latency
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      
      // Seed initial data if storage is empty
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ACCIDENTS));
      return SEED_ACCIDENTS;
    } catch (e) {
      console.error("Storage error", e);
      return SEED_ACCIDENTS;
    }
  },

  /**
   * Saves a new accident to the "Database"
   */
  addAccident: async (accident: Accident): Promise<Accident[]> => {
    await delay(500); // Simulate network latency

    const currentData = await dataService.getAccidents();
    const updatedData = [...currentData, accident];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    
    // Dispatch a custom event so other components/tabs know data changed
    window.dispatchEvent(new Event('local-storage-update'));
    
    return updatedData;
  },

  /**
   * Subscribe to changes (simulates WebSockets/Realtime)
   */
  subscribe: (callback: () => void) => {
    // Listen for storage events (other tabs)
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        callback();
      }
    });

    // Listen for local events (same tab)
    window.addEventListener('local-storage-update', callback);

    return () => {
      window.removeEventListener('storage', callback);
      window.removeEventListener('local-storage-update', callback);
    };
  }
};
