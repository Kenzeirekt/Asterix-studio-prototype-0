import React from 'react';
import { useAppStore } from '../store/appStore';

interface LayerItemProps {
  layer: any;
}

function LayerItem({ layer }: LayerItemProps) {
  const toggleVisibility = useAppStore((state) => state.toggleLayerVisibility);
  const updateColor = useAppStore((state) => state.updateLayerColor);

  // Get appropriate icon based on layer type
  const getIcon = () => {
    switch (layer.type) {
      case 'lineart':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19l7-7 3 3-7 7-3-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="M2 2l7.586 7.586" />
            <circle cx="11" cy="11" r="2" />
          </svg>
        );
      case 'background':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        );
      case 'objects':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="15.5 8.5 8.5 15.5 15.5 22.5" />
          </svg>
        );
      case 'characters':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="5" />
            <path d="M3 21v-2a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7v2" />
          </svg>
        );
      case 'effects':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        );
      case 'mask':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Get color for layer preview based on type
  const getColorPreview = () => {
    switch (layer.type) {
      case 'lineart':
        return '#ffffff';
      case 'background':
        return '#0ea5e9';
      case 'objects':
        return '#f59e0b';
      case 'characters':
        return '#ec4899';
      case 'effects':
        return '#a855f7';
      case 'mask':
        return '#22c55e';
      default:
        return layer.color || '#6b7280';
    }
  };

  const [isEditingColor, setIsEditingColor] = React.useState(false);
  const colorInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isEditingColor && colorInputRef.current) {
      colorInputRef.current.focus();
    }
  }, [isEditingColor]);

  return (
    <div className="flex items-center gap-2 py-1.5 px-3 hover:bg-studio-panel rounded group">
      {/* Visibility toggle */}
      <button
        onClick={() => toggleVisibility(layer.id)}
        className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
          layer.visible ? 'text-gray-300 hover:text-white' : 'text-gray-500'
        }`}
        title={layer.visible ? 'Hide layer' : 'Show layer'}
      >
        {layer.visible ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        )}
      </button>

      {/* Layer icon */}
      <div className={`w-6 h-6 flex items-center justify-center rounded ${
        layer.visible ? 'text-gray-300' : 'text-gray-500'
      }`}>
        {getIcon()}
      </div>

      {/* Layer name */}
      <input
        type="text"
        value={layer.name}
        onChange={(e) => {
          const newName = e.target.value;
          useAppStore.setState((state) => ({
            layers: state.layers.map(l => 
              l.id === layer.id ? { ...l, name: newName } : l
            )
          }));
        }}
        className="flex-1 bg-transparent text-sm text-gray-300 border-none focus:outline-none focus:ring-0 px-1"
      />

      {/* Color preview */}
      <div 
        className="w-5 h-5 rounded cursor-pointer transition-transform hover:scale-110"
        style={{ backgroundColor: layer.color || getColorPreview() }}
        onClick={() => setIsEditingColor(true)}
        title="Click to change color"
      />

      {/* Color picker input (hidden by default) */}
      {isEditingColor && (
        <input
          ref={colorInputRef}
          type="color"
          value={layer.color || getColorPreview()}
          onChange={(e) => {
            updateColor(layer.id, e.target.value);
          }}
          onBlur={() => setIsEditingColor(false)}
          className="absolute z-10 w-8 h-8 p-0 border-0 cursor-pointer"
        />
      )}

      {/* Delete button (shown on hover) */}
      <button
        onClick={() => useAppStore.setState((state) => ({
          layers: state.layers.filter(l => l.id !== layer.id)
        }))}
        className="w-6 h-6 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-400"
        title="Remove layer"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Separator except for last layer */}
      {layer.id !== 'effects' && (
        <div className="h-px flex-1 bg-studio-border ml-2" />
      )}
    </div>
  );
}

function LayersPanel() {
  const layers = useAppStore((state) => state.layers);
  const addLayer = useAppStore((state) => state.addLayer);

  return (
    <div className="flex flex-col h-full">
      {/* Panel Header */}
      <div className="p-3 border-b border-studio-border">
        <h2 className="text-sm font-semibold text-gray-200">LAYERS</h2>
      </div>

      {/* Layers List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {layers.map((layer) => (
          <LayerItem key={layer.id} layer={layer} />
        ))}

        {/* Add new layer button */}
        <button
          onClick={() => addLayer({
            name: 'New Layer',
            visible: true,
            locked: false,
            type: 'mask'
          })}
          className="w-full flex items-center gap-2 py-1.5 px-3 text-sm text-gray-400 hover:text-white hover:bg-studio-panel rounded transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Layer
        </button>

        {/* Quick add layer buttons */}
        <div className="mt-2 pt-2 border-t border-studio-border">
          <p className="text-xs text-gray-500 px-3 mb-1.5">Quick Add:</p>
          <div className="grid grid-cols-3 gap-1 px-1">
            {[
              { type: 'mask' as const, name: 'Mask', color: '#22c55e' },
              { type: 'characters' as const, name: 'Char', color: '#ec4899' },
              { type: 'background' as const, name: 'BG', color: '#0ea5e9' },
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => addLayer({
                  name: item.name,
                  visible: true,
                  locked: false,
                  type: item.type
                })}
                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-300 hover:text-white hover:bg-studio-panel rounded transition-colors"
                style={{ borderLeft: `2px solid ${item.color}` }}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Panel Footer */}
      <div className="p-2 border-t border-studio-border">
        <div className="flex gap-1">
          <button
            onClick={() => {
              // Lock all except selected layer (placeholder)
              useAppStore.setState((state) => ({
                layers: state.layers.map(l => ({ ...l, locked: false }))
              }));
            }}
            className="flex-1 py-1 text-xs text-gray-400 hover:text-white hover:bg-studio-panel rounded transition-colors"
          >
            Unlock All
          </button>
          <button
            onClick={() => {
              // Toggle all visibility (placeholder)
              useAppStore.setState((state) => ({
                layers: state.layers.map(l => ({ 
                  ...l, 
                  visible: !state.layers.every(la => la.visible) 
                }))
              }));
            }}
            className="flex-1 py-1 text-xs text-gray-400 hover:text-white hover:bg-studio-panel rounded transition-colors"
          >
            Toggle All
          </button>
        </div>
      </div>
    </div>
  );
}

export default LayersPanel;