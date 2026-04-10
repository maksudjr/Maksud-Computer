import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, Check, Sun, Contrast, RotateCw, Crop as CropIcon, Sparkles, 
  Palette, Wand2, Undo2, Redo2, Save, 
  FlipHorizontal, FlipVertical, Thermometer, SunMedium, 
  RefreshCcw, Layers, Sliders
} from 'lucide-react';
import { cn } from '../lib/utils';
import { removeBackground } from '@imgly/background-removal';
import { motion, AnimatePresence } from 'motion/react';
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

interface PhotoEditorProps {
  image: string;
  onSave: (editedImage: string) => void;
  onCancel: () => void;
}

type Tool = 'crop' | 'background' | 'adjust';

interface HistoryState {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  exposure: number;
  temperature: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  bgColor: string;
  image: string;
}

export const PhotoEditor: React.FC<PhotoEditorProps> = ({ image, onSave, onCancel }) => {
  // --- State ---
  const [activeTool, setActiveTool] = useState<Tool>('crop');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImage, setCurrentImage] = useState(image);
  
  // Adjustments
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [hue, setHue] = useState(0);
  const [exposure, setExposure] = useState(0);
  const [temperature, setTemperature] = useState(0);
  
  // Transform
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  
  // Background
  const [backgroundColor, setBackgroundColor] = useState('transparent');
  
  // History
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // --- Refs ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cropperRef = useRef<ReactCropperElement>(null);

  // --- Initialization ---
  useEffect(() => {
    saveToHistory(image);
  }, []);

  const saveToHistory = useCallback((imgToSave?: string) => {
    const newState: HistoryState = {
      brightness, contrast, saturation, hue, exposure, temperature,
      rotation, flipH, flipV, bgColor: backgroundColor,
      image: imgToSave || currentImage
    };
    
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      if (newHistory.length >= 20) newHistory.shift();
      return [...newHistory, newState];
    });
    setHistoryIndex(prev => Math.min(prev + 1, 19));
  }, [brightness, contrast, saturation, hue, exposure, temperature, rotation, flipH, flipV, backgroundColor, currentImage, historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      applyState(prevState);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      applyState(nextState);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const applyState = (state: HistoryState) => {
    setBrightness(state.brightness);
    setContrast(state.contrast);
    setSaturation(state.saturation);
    setHue(state.hue);
    setExposure(state.exposure);
    setTemperature(state.temperature);
    setRotation(state.rotation);
    setFlipH(state.flipH);
    setFlipV(state.flipV);
    setBackgroundColor(state.bgColor);
    setCurrentImage(state.image);
  };

  // --- Actions ---
  const handleRemoveBg = async () => {
    setIsProcessing(true);
    try {
      const blob = await removeBackground(currentImage);
      const url = URL.createObjectURL(blob);
      setCurrentImage(url);
      setIsProcessing(false);
      saveToHistory(url);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  const applyCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    
    const croppedCanvas = cropper.getCroppedCanvas();
    if (!croppedCanvas) return;

    const croppedImage = croppedCanvas.toDataURL();
    setCurrentImage(croppedImage);
    saveToHistory(croppedImage);
    setActiveTool('adjust'); // Switch to adjust after crop
  };

  const handleSave = () => {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw background
      if (backgroundColor !== 'transparent') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Apply filters
      let filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hue}deg)`;
      if (exposure !== 0) filterString += ` brightness(${100 + exposure}%)`;
      if (temperature > 0) filterString += ` sepia(${temperature}%) hue-rotate(-10deg)`;
      else if (temperature < 0) filterString += ` hue-rotate(${Math.abs(temperature)}deg) saturate(${100 + Math.abs(temperature)}%)`;

      ctx.filter = filterString;
      ctx.drawImage(img, 0, 0);
      
      onSave(canvas.toDataURL('image/png', 1.0));
    };
    img.src = currentImage;
  };

  // --- UI Components ---
  const SliderControl = ({ label, icon: Icon, value, min, max, step = 1, onChange }: any) => (
    <div className="space-y-2 px-4 py-3 border-b border-white/5">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest">
          <Icon size={12} />
          {label}
        </div>
        <span className="text-[10px] font-mono text-indigo-400">{value}</span>
      </div>
      <input 
        type="range" 
        min={min} max={max} step={step} 
        value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value))}
        onMouseUp={() => saveToHistory()}
        className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500"
      />
    </div>
  );

  const filterStyle = {
    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hue}deg) ${
      exposure !== 0 ? `brightness(${100 + exposure}%)` : ''
    } ${
      temperature > 0 ? `sepia(${temperature}%) hue-rotate(-10deg)` : 
      temperature < 0 ? `hue-rotate(${Math.abs(temperature)}deg) saturate(${100 + Math.abs(temperature)}%)` : ''
    }`,
    backgroundColor: backgroundColor !== 'transparent' ? backgroundColor : 'transparent'
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col font-sans text-white overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0a0a0a]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Wand2 size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-tighter">Photo Editor</h1>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Simple & Fast</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-white/5 rounded-xl p-1">
            <button onClick={undo} disabled={historyIndex <= 0} className="p-2 hover:bg-white/10 rounded-lg disabled:opacity-20 transition-all">
              <Undo2 size={18} />
            </button>
            <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-2 hover:bg-white/10 rounded-lg disabled:opacity-20 transition-all">
              <Redo2 size={18} />
            </button>
          </div>
          
          <button onClick={onCancel} className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-all">
            <X size={20} />
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm font-black shadow-lg shadow-indigo-500/20 transition-all"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Tools */}
        <aside className="w-20 border-r border-white/10 flex flex-col items-center py-6 gap-6 bg-[#0a0a0a]">
          {[
            { id: 'crop', icon: CropIcon, label: 'Crop' },
            { id: 'background', icon: Layers, label: 'BG' },
            { id: 'adjust', icon: Sliders, label: 'Adjust' },
          ].map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id as Tool)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all group",
                activeTool === tool.id ? "text-indigo-500" : "text-white/40 hover:text-white/80"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                activeTool === tool.id ? "bg-indigo-500/10 shadow-inner" : "group-hover:bg-white/5"
              )}>
                <tool.icon size={22} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest">{tool.label}</span>
            </button>
          ))}
        </aside>

        {/* Controls Panel */}
        <aside className="w-72 border-r border-white/10 bg-[#080808] overflow-y-auto custom-scrollbar">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              {activeTool} Settings
            </h2>
            <button onClick={() => applyState(history[0])} className="text-white/20 hover:text-indigo-400 transition-colors">
              <RefreshCcw size={14} />
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTool}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="p-4"
            >
              {activeTool === 'crop' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Free', ratio: NaN },
                      { label: '1:1', ratio: 1 },
                      { label: '4:3', ratio: 4/3 },
                      { label: '16:9', ratio: 16/9 },
                      { label: '3:4', ratio: 3/4 },
                      { label: '2:3', ratio: 2/3 },
                    ].map((r) => (
                      <button 
                        key={r.label}
                        onClick={() => cropperRef.current?.cropper.setAspectRatio(r.ratio)}
                        className="py-2 bg-white/5 hover:bg-indigo-600/20 rounded-lg text-[9px] font-bold uppercase border border-white/5"
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => cropperRef.current?.cropper.rotate(-90)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl flex flex-col items-center gap-2">
                      <RotateCw size={16} className="scale-x-[-1]" />
                      <span className="text-[8px] font-black uppercase">Rotate L</span>
                    </button>
                    <button onClick={() => cropperRef.current?.cropper.rotate(90)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl flex flex-col items-center gap-2">
                      <RotateCw size={16} />
                      <span className="text-[8px] font-black uppercase">Rotate R</span>
                    </button>
                  </div>
                  <button 
                    onClick={applyCrop}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                  >
                    <Check size={18} />
                    Apply Crop
                  </button>
                </div>
              )}

              {activeTool === 'background' && (
                <div className="space-y-6">
                  <button 
                    onClick={handleRemoveBg}
                    disabled={isProcessing}
                    className="w-full p-4 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 rounded-2xl flex items-center gap-4 transition-all group disabled:opacity-50"
                  >
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Sparkles size={20} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-[10px] font-black uppercase tracking-widest">Remove BG</h3>
                      <p className="text-[8px] text-white/40">AI Background Removal</p>
                    </div>
                  </button>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Background Color</p>
                    <div className="flex flex-wrap gap-2">
                      {['transparent', '#ffffff', '#f3f4f6', '#3b82f6', '#ef4444', '#22c55e', '#000000'].map(c => (
                        <button 
                          key={c} 
                          onClick={() => { setBackgroundColor(c); saveToHistory(); }}
                          className={cn(
                            "w-8 h-8 rounded-lg border-2 transition-all", 
                            backgroundColor === c ? "border-indigo-500 scale-110" : "border-white/10"
                          )}
                          style={{ backgroundColor: c === 'transparent' ? 'transparent' : c }}
                        >
                          {c === 'transparent' && <X size={12} className="text-white/40 m-auto" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTool === 'adjust' && (
                <div className="space-y-1">
                  <SliderControl label="Brightness" icon={Sun} value={brightness} min={0} max={200} onChange={setBrightness} />
                  <SliderControl label="Contrast" icon={Contrast} value={contrast} min={0} max={200} onChange={setContrast} />
                  <SliderControl label="Saturation" icon={Palette} value={saturation} min={0} max={200} onChange={setSaturation} />
                  <SliderControl label="Exposure" icon={SunMedium} value={exposure} min={-100} max={100} onChange={setExposure} />
                  <SliderControl label="Temperature" icon={Thermometer} value={temperature} min={-100} max={100} onChange={setTemperature} />
                  <SliderControl label="Hue" icon={Palette} value={hue} min={0} max={360} onChange={setHue} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 relative bg-[#050505] flex items-center justify-center p-8 overflow-hidden">
          {isProcessing && (
            <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-black uppercase tracking-[0.3em] animate-pulse">Processing AI...</p>
            </div>
          )}

          <div className="relative max-w-full max-h-full shadow-2xl rounded-lg overflow-hidden" style={activeTool !== 'crop' ? filterStyle : {}}>
            {activeTool === 'crop' ? (
              <Cropper
                src={currentImage}
                style={{ height: '70vh', width: '100%' }}
                initialAspectRatio={NaN}
                guides={true}
                ref={cropperRef}
                viewMode={1}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
              />
            ) : (
              <img 
                src={currentImage} 
                alt="Preview" 
                className="max-w-full max-h-[70vh] object-contain"
                referrerPolicy="no-referrer"
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
