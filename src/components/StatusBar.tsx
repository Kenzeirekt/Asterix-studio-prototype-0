
import { useAppStore } from '../store/appStore';

function StatusBar() {
  const zoom = useAppStore((state) => state.zoom);
  const panX = useAppStore((state) => state.panX);
  const panY = useAppStore((state) => state.panY);
  const tool = useAppStore((state) => state.tool);
  const currentImage = useAppStore((state) => state.currentImage);
  const layers = useAppStore((state) => state.layers);

  // Calculate canvas position (center of view)
  const centerX = Math.round(-panX / zoom + 400);
  const centerY = Math.round(-panY / zoom + 300);

  return (
    <div className="h-8 bg-studio-panel border-t border-studio-border flex items-center px-4 text-xs">
      {/* Left section - Image info */}
      <div className="flex items-center gap-6">
        {currentImage ? (
          <>
            <span className="text-gray-300">
              Canvas: {Math.round(currentImage.width * zoom)} × {Math.round(currentImage.height * zoom)}px
            </span>
            <span className="text-gray-400">
              View: ({centerX}, {centerY})
            </span>
          </>
        ) : (
          <span className="text-gray-500 italic">No image loaded</span>
        )}

        {/* Layers count */}
        <div className="flex items-center gap-2 text-gray-400">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
          </svg>
          {layers.filter(l => l.visible).length} visible / {layers.length} total layers
        </div>
      </div>

      {/* Center section - Tool info */}
      <div className="flex items-center gap-3">
        <span className="text-gray-400">Tool:</span>
        <span className="text-white font-medium">{tool.charAt(0).toUpperCase() + tool.slice(1)}</span>
        
        {/* Tool shortcut hints */}
        <div className="flex items-center gap-2 text-gray-500 ml-2">
          <kbd className="px-1.5 py-0.5 bg-studio-bg rounded border border-studio-border text-[10px]">V</kbd>
          <span>Select</span>
          <kbd className="px-1.5 py-0.5 bg-studio-bg rounded border border-studio-border text-[10px]">H</kbd>
          <span>Pan</span>
          <kbd className="px-1.5 py-0.5 bg-studio-bg rounded border border-studio-border text-[10px]">I</kbd>
          <span>Picker</span>
        </div>
      </div>

      {/* Right section - Zoom and AI status */}
      <div className="flex items-center gap-4 ml-auto">
        <span className="text-gray-300">Zoom: {Math.round(zoom * 100)}%</span>
        
        {/* AI Status indicator */}
        <div className="flex items-center gap-2 px-2 py-0.5 bg-studio-bg rounded-full border border-studio-border">
          <div className={`w-2 h-2 rounded-full ${
            tool === 'select' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
          }`} />
          <span className="text-gray-400">AI: {tool === 'select' ? 'Ready' : 'Idle'}</span>
        </div>

        {/* Undo/Redo buttons */}
        <button
          onClick={() => useAppStore.getState().undo()}
          disabled={useAppStore.getState().historyIndex < 0 || useAppStore.getState().pastActions.length === 0}
          className="px-2 py-0.5 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 7v6h6" />
            <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
          </svg>
        </button>
        
        <button
          onClick={() => useAppStore.getState().redo()}
          disabled={useAppStore.getState().historyIndex >= useAppStore.getState().pastActions.length - 1}
          className="px-2 py-0.5 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
          title="Redo (Ctrl+Shift+Z)"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 7v6h-6" />
            <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
          </svg>
        </button>

        {/* Help */}
        <button
          onClick={() => alert('Keyboard Shortcuts:\n\nV - Select tool\nH - Pan tool\nI - Color picker\nG - Bucket fill\nB - Brush\nCtrl+Z - Undo\nCtrl+Shift+Z - Redo')}
          className="px-2 py-0.5 text-gray-400 hover:text-white transition-colors"
          title="Keyboard shortcuts"
        >
          ?
        </button>
      </div>
    </div>
  );
}

export default StatusBar;