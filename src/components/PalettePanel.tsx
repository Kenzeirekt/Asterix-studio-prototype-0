import React from 'react';
import { useAppStore } from '../store/appStore';

interface ColorSwatchProps {
  color: any;
}

function ColorSwatch({ color }: ColorSwatchProps) {
  const updateColor = useAppStore((state) => state.updateColor);
  const [isEditing, setIsEditing] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Map layer colors to visual representation
  const getLayerIcon = () => {
    switch (color.layerId.toLowerCase()) {
      case 'characters':
        return (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="5" />
            <path d="M3 21v-2a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7v2" />
          </svg>
        );
      case 'background':
        return (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        );
      case 'objects':
        return (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
        );
      default:
        return null;
    }
  };

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleColorChange = (hex: string) => {
    updateColor(color.id, hex);
    setIsEditing(false);
  };

  return (
    <div className="relative group">
      {/* Color swatch */}
      <button
        onClick={() => setIsEditing(true)}
        className={`w-10 h-10 rounded-lg shadow-md transition-transform hover:scale-110 ${
          color.hex === '#ffffff' ? 'border border-gray-300' : 'border-2 border-transparent'
        }`}
        style={{ backgroundColor: color.hex }}
        title={`Click to edit ${color.name}`}
      >
        {/* Layer icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-70">
          {getLayerIcon()}
        </div>

        {/* Name label on hover */}
        <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-300 whitespace-nowrap bg-studio-panel px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {color.name}
        </span>
      </button>

      {/* Color picker input */}
      {isEditing && (
        <input
          ref={inputRef}
          type="color"
          value={color.hex}
          onChange={(e) => handleColorChange(e.target.value)}
          onBlur={() => setIsEditing(false)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
      )}

      {/* Delete button (shown on hover) */}
      <button
        onClick={() => {
          // Remove color from palette (placeholder - needs proper implementation)
          console.log('Delete color:', color.name);
        }}
        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs"
      >
        ×
      </button>
    </div>
  );
}

function PalettePanel() {
  const palette = useAppStore((state) => state.palette);
  const addColor = useAppStore((state) => state.addColor);

  // Group colors by layer type
  const groupedColors = React.useMemo(() => {
    const groups: Record<string, typeof palette> = {};
    
    palette.forEach(color => {
      if (!groups[color.layerId]) {
        groups[color.layerId] = [];
      }
      groups[color.layerId].push(color);
    });

    return groups;
  }, [palette]);

  const handleQuickAddColor = (layerId: string, name: string, hex: string) => {
    addColor({
      name,
      hex,
      layerId
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Panel Header */}
      <div className="p-3 border-b border-studio-border">
        <h2 className="text-sm font-semibold text-gray-200">PALETTE</h2>
        <p className="text-xs text-gray-500 mt-0.5">{palette.length} colors</p>
      </div>

      {/* Colors Grid */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {Object.entries(groupedColors).map(([layerId, colors]) => (
          <div key={layerId}>
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 px-1">
              {palette.find(c => c.id === layerId)?.name || layerId}
            </h3>
            <div className="grid grid-cols-6 gap-2">
              {colors.map(color => (
                <ColorSwatch key={color.id} color={color} />
              ))}
            </div>
          </div>
        ))}

        {/* Quick add colors */}
        <div className="pt-3 border-t border-studio-border">
          <p className="text-xs text-gray-500 px-1 mb-2.5">Quick Add:</p>
          <div className="space-y-2">
            {[
              { name: 'Skin', hex: '#ffdbac', layerId: 'characters' },
              { name: 'Hair Dark', hex: '#3d2914', layerId: 'characters' },
              { name: 'Clothes Blue', hex: '#1e5a8e', layerId: 'objects' },
              { name: 'Sky Light', hex: '#b8e0f7', layerId: 'background' },
            ].map(item => (
              <button
                key={item.name}
                onClick={() => handleQuickAddColor(item.layerId, item.name, item.hex)}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-studio-panel rounded transition-colors"
              >
                <div 
                  className="w-4 h-4 rounded border border-gray-500"
                  style={{ backgroundColor: item.hex }}
                />
                {item.name} ({item.layerId})
              </button>
            ))}
          </div>
        </div>

        {/* Custom color input */}
        <div className="pt-3 border-t border-studio-border">
          <p className="text-xs text-gray-500 px-1 mb-2.5">Custom Color:</p>
          <div className="flex gap-2 items-center px-1">
            <input
              type="color"
              id="custom-color-picker"
              defaultValue="#ff6b35"
              className="w-8 h-8 rounded cursor-pointer border-none p-0 bg-transparent"
            />
            <label htmlFor="custom-color-picker" className="text-xs text-gray-400 hover:text-white cursor-pointer">
              Add to palette
            </label>
          </div>
        </div>
      </div>

      {/* Panel Footer */}
      <div className="p-2 border-t border-studio-border space-y-1.5">
        <button
          onClick={() => {
            // Reset to default palette (placeholder)
            console.log('Reset palette');
          }}
          className="w-full py-1.5 text-xs text-gray-400 hover:text-white hover:bg-studio-panel rounded transition-colors"
        >
          Reset Palette
        </button>
        <div className="flex gap-1">
          <button
            onClick={() => {
              // Export palette (placeholder)
              console.log('Export palette');
            }}
            className="flex-1 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-studio-panel rounded transition-colors"
          >
            Export
          </button>
          <button
            onClick={() => {
              // Import palette (placeholder)
              console.log('Import palette');
            }}
            className="flex-1 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-studio-panel rounded transition-colors"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}

export default PalettePanel;