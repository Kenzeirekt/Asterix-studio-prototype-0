import React, { useRef, useEffect } from 'react';
// @ts-ignore - Konva module types
import * as K from 'konva';
const { Stage, Layer, Image: KonvaImage, Rect, Circle } = K as any;
import { useAppStore } from '../store/appStore';

interface CanvasAreaProps {
  onImageImport: (file: File) => void;
}

function CanvasArea({ onImageImport }: CanvasAreaProps) {
  const konvaStageRef = React.useRef<any>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  
  const currentImage = useAppStore((state) => state.currentImage);
  const zoom = useAppStore((state) => state.zoom);
  const panX = useAppStore((state) => state.panX);
  const panY = useAppStore((state) => state.panY);
  const tool = useAppStore((state) => state.tool);
  
  // Track selection start position for brush/fill tools
  const [selectStart, setSelectStart] = React.useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (konvaStageRef.current && stageRef.current) {
      konvaStageRef.current.container().style.width = `${stageRef.current.clientWidth}px`;
      konvaStageRef.current.container().style.height = `${stageRef.current.clientHeight}px`;
    }
  }, []);

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onImageImport(file);
      }
    };
    input.click();
  };

  const handleStageMouseDown = (e: any) => {
    if (tool === 'pan') return; // Pan handled separately
    
    const pos = e.target.getStage().getPointerPosition();
    
    if (!pos) return;
    
    setSelectStart({ x: pos.x, y: pos.y });

    if (tool === 'select') {
      // TODO: Implement region selection
      console.log('Selection started at:', pos);
    } else if (tool === 'picker') {
      // TODO: Implement color picker
      console.log('Picking color from:', pos);
    } else if (tool === 'fill' || tool === 'brush') {
      console.log(`${tool} started at:`, pos);
    }
  };

  const handleStageMouseMove = (e: any) => {
    if (!selectStart) return;
    
    if (tool !== 'fill' && tool !== 'brush') return;
    
    const pos = e.target.getStage().getPointerPosition();
    if (!pos) return;
    
    // TODO: Implement fill/brush drawing
    console.log(`${tool} moving to:`, pos);
  };

  const handleStageMouseUp = () => {
    setSelectStart(null);
  };

  const handleStageDblClick = (e: any) => {
    if (tool === 'select') {
      // Double-click to create a selection box
      const pos = e.target.getStage().getPointerPosition();
      if (!pos) return;
      
      // TODO: Create region selection from start to current position
      console.log('Double click at:', pos);
    }
  };

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    
    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = zoom;
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - panX) / oldScale,
      y: (pointer.y - panY) / oldScale,
    };

    let newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    newScale = Math.min(Math.max(newScale, 0.2), 5); // Clamp between 0.2x and 5x

    setPan(
      pointer.x - mousePointTo.x * newScale,
      pointer.y - mousePointTo.y * newScale
    );
    useAppStore.setState({ zoom: newScale });
  };

  const setPan = useAppStore((state) => state.setPan);

  const handleStageMouseDownPan = (e: any) => {
    if (tool !== 'pan') return;
    
    e.evt.preventDefault();
    
    const startPos = {
      x: e.target.getStage().getPointerPosition()?.x || 0,
      y: e.target.getStage().getPointerPosition()?.y || 0,
    };
    
    const handleMouseMove = (moveEvent: any) => {
      const newPos = moveEvent.target.getStage().getPointerPosition();
      if (!newPos) return;
      
      const dx = newPos.x - startPos.x;
      const dy = newPos.y - startPos.y;
      
      useAppStore.setState({
        panX: panX + dx,
        panY: panY + dy,
      });
      
      startPos.x = newPos.x;
      startPos.y = newPos.y;
    };
    
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="flex-1 bg-studio-canvas overflow-hidden relative">
      {/* Empty state */}
      {!currentImage && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div 
            onClick={handleImageUpload}
            className="pointer-events-auto text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p className="text-lg">Import a comic page to start</p>
          </div>
        </div>
      )}

      {/* Konva Stage */}
      <div 
        ref={stageRef}
        className={`w-full h-full ${!currentImage ? 'flex items-center justify-center' : ''}`}
      >
        {currentImage && (
          <Stage
            ref={konvaStageRef}
            width={window.innerWidth - 200} // Adjust for sidebar
            height={window.innerHeight - 140} // Adjust for header and status bar
            onMouseDown={handleStageMouseDown}
            onMouseMove={handleStageMouseMove}
            onMouseUp={handleStageMouseUp}
            onDblClick={handleStageDblClick}
            onWheel={handleWheel}
          >
            <Layer>
              {/* Image */}
              {currentImage && (
                <KonvaImage
                  image={currentImage}
                  x={panX}
                  y={panY}
                  scaleX={zoom}
                  scaleY={zoom}
                  draggable={tool === 'pan'}
                  onMouseDown={handleStageMouseDownPan}
                />
              )}

              {/* Selection rectangle (if active) */}
              {useAppStore((state) => state.selection.active && state.selection.region) && (
                <Rect
                  x={panX + useAppStore.getState().selection.region!.x * zoom}
                  y={panY + useAppStore.getState().selection.region!.y * zoom}
                  width={useAppStore.getState().selection.region!.width * zoom}
                  height={useAppStore.getState().selection.region!.height * zoom}
                  stroke="#0ea5e9"
                  strokeWidth={2 / zoom}
                  dash={[10 / zoom, 5 / zoom]}
                  listening={false}
                />
              )}

              {/* Selection preview */}
              {selectStart && (
                <Rect
                  x={panX + Math.min(selectStart.x, panX)}
                  y={panY + Math.min(selectStart.y, panY)}
                  width={Math.abs(selectStart.x - panX)}
                  height={Math.abs(selectStart.y - panY)}
                  stroke="#0ea5e9"
                  strokeWidth={2 / zoom}
                  dash={[10 / zoom, 5 / zoom]}
                  fill="rgba(14, 165, 233, 0.1)"
                  listening={false}
                />
              )}

              {/* Cursor preview for tools */}
              {tool === 'picker' && (
                <Circle
                  radius={8 / zoom}
                  stroke="#fbbf24"
                  strokeWidth={2 / zoom}
                  fill="rgba(251, 191, 36, 0.2)"
                  listening={false}
                />
              )}
            </Layer>
          </Stage>
        )}
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 left-4 bg-studio-panel px-3 py-1.5 rounded text-sm text-gray-300 border border-studio-border">
        Zoom: {Math.round(zoom * 100)}%
      </div>

      {/* Tool indicator */}
      <div className="absolute top-4 left-4 bg-studio-panel px-3 py-1.5 rounded text-sm text-gray-300 border border-studio-border">
        Tool: {tool.charAt(0).toUpperCase() + tool.slice(1)}
      </div>
    </div>
  );
}

export default CanvasArea;