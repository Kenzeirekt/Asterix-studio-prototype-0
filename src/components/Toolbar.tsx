// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAppStore } from '../store/appStore';

const TOOL_TYPES = ['select', 'pan', 'picker', 'fill', 'brush'] as const;
type ToolType = typeof TOOL_TYPES[number];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ToolButtonProps {
  _type: ToolType;
  active: boolean;
  onClick: () => void;
  icon: any;
  label: string;
}

// @ts-ignore - intentionally renaming _type to type
function ToolButton({ _type: type, active, onClick, icon, label }: ToolButtonProps) {
  return (
    <button
      title={label}
      onClick={onClick}
      className={`w-10 h-10 flex items-center justify-center rounded transition-colors ${
        active
          ? 'bg-studio-accent text-white'
          : 'hover:bg-studio-panel text-gray-300 hover:text-white'
      }`}
    >
      {icon}
    </button>
  );
}

function Toolbar() {
  const tool = useAppStore((state) => state.tool);
  const setTool = useAppStore((state) => state.setTool);

  const tools: Array<{ type: ToolType; icon: any; label: string }> = [
    {
      type: 'select',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
        </svg>
      ),
      label: 'Select (V)',
    },
    {
      type: 'pan',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      ),
      label: 'Pan (H)',
    },
    {
      type: 'picker',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12l5-5-5-5M5 12l-5-5 5-5" />
        </svg>
      ),
      label: 'Color Picker (I)',
    },
    {
      type: 'fill',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 11l-8-8-8.6 8.6a2 2 0 000 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11zm-3 7l-5-5" />
        </svg>
      ),
      label: 'Bucket Fill (G)',
    },
    {
      type: 'brush',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 13l-5-5-10 10v3h3l10-10z" />
        </svg>
      ),
      label: 'Brush (B)',
    },
  ];

  return (
    <div className="w-14 bg-studio-panel border-r border-studio-border flex flex-col items-center py-2 gap-1">
      {tools.map((t) => (
        <ToolButton
          key={t.type}
          _type={t.type}
          active={tool === t.type}
          onClick={() => setTool(t.type)}
          icon={t.icon}
          label={t.label}
        />
      ))}

      <div className="h-px w-8 bg-studio-border my-1" />

      {/* Zoom controls */}
      <button
        title="Zoom In (Ctrl+)"
        onClick={() => useAppStore.setState((state) => ({ zoom: Math.min(state.zoom + 0.2, 5) }))}
        className="w-10 h-10 flex items-center justify-center hover:bg-studio-panel rounded transition-colors text-gray-300 hover:text-white"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </button>

      <button
        title="Zoom Out (Ctrl-)"
        onClick={() => useAppStore.setState((state) => ({ zoom: Math.max(state.zoom - 0.2, 0.2) }))}
        className="w-10 h-10 flex items-center justify-center hover:bg-studio-panel rounded transition-colors text-gray-300 hover:text-white"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </button>

      <button
        title="Reset Zoom (Ctrl+0)"
        onClick={() => useAppStore.setState({ zoom: 1, panX: 0, panY: 0 })}
        className="w-10 h-10 flex items-center justify-center hover:bg-studio-panel rounded transition-colors text-gray-300 hover:text-white"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>
    </div>
  );
}

export default Toolbar;