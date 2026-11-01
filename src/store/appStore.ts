import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Types
export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  type: 'lineart' | 'background' | 'objects' | 'characters' | 'effects' | 'mask';
  color?: string; // For preview colors
}

export interface Color {
  id: string;
  name: string;
  hex: string;
  layerId: string; // Which layer this color belongs to
}

export interface Selection {
  active: boolean;
  layerId: string | null;
  region?: { x: number; y: number; width: number; height: number };
}

interface AppState {
  // Image state
  currentImage: HTMLImageElement | null;
  setImage: (image: HTMLImageElement) => void;
  clearImage: () => void;

  // Canvas state
  zoom: number;
  panX: number;
  panY: number;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  resetView: () => void;

  // Layers
  layers: Layer[];
  addLayer: (layer: Omit<Layer, 'id'>) => void;
  removeLayer: (id: string) => void;
  toggleLayerVisibility: (id: string) => void;
  updateLayerColor: (id: string, color: string) => void;

  // Selection
  selection: Selection;
  selectRegion: (region: { x: number; y: number; width: number; height: number }) => void;
  clearSelection: () => void;

  // Palette
  palette: Color[];
  addColor: (color: Omit<Color, 'id'>) => void;
  updateColor: (id: string, hex: string) => void;

  // History (basic undo/redo)
  historyIndex: number;
  pastActions: string[];
  futureActions: string[];
  undo: () => void;
  redo: () => void;
  addToHistory: (action: string) => void;

  // Tool state
  tool: 'select' | 'pan' | 'picker' | 'fill' | 'brush';
  setTool: (tool: 'select' | 'pan' | 'picker' | 'fill' | 'brush') => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, _get) => ({
        // Image state
        currentImage: null,
        setImage: (image) => set({ currentImage: image }),
        clearImage: () => set({ currentImage: null }),

        // Canvas state - defaults to 100% zoom at center
        zoom: 1,
        panX: 0,
        panY: 0,
        setZoom: (zoom) => set({ zoom }),
        setPan: (x, y) => set({ panX: x, panY: y }),
        resetView: () => set({ zoom: 1, panX: 0, panY: 0 }),

        // Layers - default comic layers
        layers: [
          { id: 'lineart', name: 'Lineart', visible: true, locked: false, type: 'lineart' },
          { id: 'background', name: 'Background', visible: true, locked: false, type: 'background' },
          { id: 'objects', name: 'Objects', visible: true, locked: false, type: 'objects' },
          { id: 'characters', name: 'Characters', visible: true, locked: false, type: 'characters' },
          { id: 'effects', name: 'Effects', visible: true, locked: false, type: 'effects' },
        ],
        addLayer: (layer) => set((state) => ({
          layers: [...state.layers, { ...layer, id: `layer_${Date.now()}` }]
        })),
        removeLayer: (id) => set((state) => ({
          layers: state.layers.filter(l => l.id !== id)
        })),
        toggleLayerVisibility: (id) => set((state) => ({
          layers: state.layers.map(l => 
            l.id === id ? { ...l, visible: !l.visible } : l
          )
        })),
        updateLayerColor: (id, color) => set((state) => ({
          layers: state.layers.map(l => 
            l.id === id ? { ...l, color } : l
          )
        })),

        // Selection - initially inactive
        selection: { active: false, layerId: null },
        selectRegion: (region) => set({ 
          selection: { active: true, layerId: region.width > 100 ? 'objects' : null, region }
        }),
        clearSelection: () => set({ selection: { active: false, layerId: null } }),

        // Palette - default comic colors
        palette: [
          { id: 'skin', name: 'Skin', hex: '#ffdbac', layerId: 'characters' },
          { id: 'hair-brown', name: 'Hair Brown', hex: '#6b4423', layerId: 'characters' },
          { id: 'hair-black', name: 'Hair Black', hex: '#1a1a1a', layerId: 'characters' },
          { id: 'sky-blue', name: 'Sky Blue', hex: '#87ceeb', layerId: 'background' },
          { id: 'ground-green', name: 'Ground Green', hex: '#4a6b3a', layerId: 'background' },
          { id: 'clothes-red', name: 'Clothes Red', hex: '#c91818', layerId: 'characters' },
        ],
        addColor: (color) => set((state) => ({
          palette: [...state.palette, { ...color, id: `color_${Date.now()}` }]
        })),
        updateColor: (id, hex) => set((state) => ({
          palette: state.palette.map(c => 
            c.id === id ? { ...c, hex } : c
          )
        })),

        // History for undo/redo
        historyIndex: -1,
        pastActions: [],
        futureActions: [],

        // Tool state - default to select
        tool: 'select',
        setTool: (tool) => set({ tool }),
        undo: () => set((state) => {
          if (state.historyIndex < 0 || state.pastActions.length === 0) return state;
          const newIndex = state.historyIndex - 1;
          return { historyIndex: newIndex };
        }),
        redo: () => set((state) => {
          if (state.historyIndex >= state.pastActions.length - 1 || state.futureActions.length === 0) return state;
          const newIndex = state.historyIndex + 1;
          return { historyIndex: newIndex };
        }),
        addToHistory: (action) => set((state) => ({
          pastActions: [...state.pastActions.slice(0, state.historyIndex + 1), action],
          futureActions: [],
          historyIndex: state.historyIndex + 1
        })),
      }),
      {
        name: 'comiccolor-storage',
        partialize: (state) => ({
          layers: state.layers,
          palette: state.palette,
        }),
      }
    )
  )
);
