// Layer types for comic coloring workflow
export type LayerType = 
  | 'lineart'
  | 'background'
  | 'objects'
  | 'characters'
  | 'effects'
  | 'mask';

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  type: LayerType;
  color?: string; // Preview color for mask layers
}

// Color palette entry
export interface PaletteColor {
  id: string;
  name: string;
  hex: string;
  layerId: string;
}

// Selection state
export interface Selection {
  active: boolean;
  layerId: string | null;
  region?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Canvas view state
export interface ViewState {
  zoom: number;
  panX: number;
  panY: number;
}

// AI analysis result (future use)
export interface AnalysisResult {
  objects: Array<{
    id: string;
    type: string;
    name: string;
    mask?: string; // Base64 or path to mask image
  }>;
  status: 'analyzing' | 'complete' | 'error';
}
