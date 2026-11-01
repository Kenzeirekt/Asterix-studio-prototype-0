import { useEffect } from 'react';
import { useAppStore } from './store/appStore';
import Toolbar from './components/Toolbar';
import CanvasArea from './components/CanvasArea';
import LayersPanel from './components/LayersPanel';
import PalettePanel from './components/PalettePanel';
import StatusBar from './components/StatusBar';

function App() {
  const setTool = useAppStore((state) => state.setTool);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input field
      if ((e.target as HTMLElement).tagName === 'INPUT' || 
          (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'v':
          setTool('select');
          e.preventDefault();
          break;
        case 'h':
          setTool('pan');
          e.preventDefault();
          break;
        case 'i':
          setTool('picker');
          e.preventDefault();
          break;
        case 'g':
          setTool('fill');
          e.preventDefault();
          break;
        case 'b':
          setTool('brush');
          e.preventDefault();
          break;
        case '+':
        case '=':
          if (e.ctrlKey) {
            useAppStore.setState((state) => ({ 
              zoom: Math.min(state.zoom + 0.2, 5) 
            }));
            e.preventDefault();
          }
          break;
        case '-':
          if (e.ctrlKey) {
            useAppStore.setState((state) => ({ 
              zoom: Math.max(state.zoom - 0.2, 0.2) 
            }));
            e.preventDefault();
          }
          break;
        case '0':
          if (e.ctrlKey) {
            useAppStore.setState({ zoom: 1, panX: 0, panY: 0 });
            e.preventDefault();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setTool]);

  const handleImageImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => useAppStore.setState({ currentImage: img });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Menu Bar */}
      <MenuBar />

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <Toolbar />

        {/* Canvas Area (center) */}
        <CanvasArea onImageImport={handleImageImport} />

        {/* Right Panels */}
        <div className="w-64 bg-studio-panel border-l border-studio-border flex flex-col">
          <LayersPanel />
          <PalettePanel />
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar />
    </div>
  );
}

// Menu bar component
function MenuBar() {
  const setImage = useAppStore((state) => state.setImage);
  const clearImage = useAppStore((state) => state.clearImage);

  return (
    <div className="h-10 bg-studio-bg border-b border-studio-border flex items-center px-2">
      {/* File menu */}
      <div className="flex gap-4 text-sm">
        <select
          onChange={(e) => {
            if (e.target.value === 'new') {
              clearImage();
            } else if (e.target.value === 'open') {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (ev) => {
                const file = (ev.target as HTMLInputElement).files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (evt) => {
                    const img = new Image();
                    img.src = evt.target?.result as string;
                    img.onload = () => setImage(img);
                  };
                  reader.readAsDataURL(file);
                }
              };
              input.click();
            }
            e.target.value = '';
          }}
          className="px-2 py-1 hover:bg-studio-panel rounded transition-colors cursor-pointer bg-transparent text-gray-300"
        >
          <option value="">File</option>
          <option value="new">New Project</option>
          <option value="open">Open Image...</option>
        </select>

        <div className="px-2 py-1 hover:bg-studio-panel rounded transition-colors text-gray-400 cursor-not-allowed">
          Edit
        </div>

        <div className="px-2 py-1 hover:bg-studio-panel rounded transition-colors text-gray-400 cursor-not-allowed">
          View
        </div>

        <button className="px-2 py-1 hover:bg-studio-panel rounded transition-colors text-studio-accent cursor-not-allowed">
          AI
        </button>
      </div>
    </div>
  );
}

export default App;