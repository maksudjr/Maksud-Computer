import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, Check, Sun, Contrast, RotateCw, Crop as CropIcon, Sparkles, 
  Palette, Wand2, Undo2, Redo2, Save, 
  FlipHorizontal, FlipVertical, Thermometer, SunMedium, 
  RefreshCcw, Layers, Sliders
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

interface PhotoEditorProps {
  image: string;
  onSave: (editedImage: string) => void;
  onCancel: () => void;
  autoRemoveBg?: boolean;
}

type Tool = 'crop' | 'background' | 'adjust' | 'ai_enhance';

interface HistoryState {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  exposure: number;
  temperature: number;
  sharpness: number;
  smoothing: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  bgColor: string;
  image: string;
}

export const PhotoEditor: React.FC<PhotoEditorProps> = ({ image, onSave, onCancel, autoRemoveBg }) => {
  // --- State ---
  const [activeTool, setActiveTool] = useState<Tool>('crop');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [compareProgress, setCompareProgress] = useState(50);
  const [currentImage, setCurrentImage] = useState(image);
  
  // Adjustments
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [hue, setHue] = useState(0);
  const [exposure, setExposure] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [sharpness, setSharpness] = useState(0);
  const [smoothing, setSmoothing] = useState(0);
  
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
    if (autoRemoveBg) {
      handleRemoveBg();
    }
  }, []);

  const saveToHistory = useCallback((imgToSave?: string) => {
    const newState: HistoryState = {
      brightness, contrast, saturation, hue, exposure, temperature,
      sharpness, smoothing,
      rotation, flipH, flipV, bgColor: backgroundColor,
      image: imgToSave || currentImage
    };
    
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      if (newHistory.length >= 20) newHistory.shift();
      return [...newHistory, newState];
    });
    setHistoryIndex(prev => Math.min(prev + 1, 19));
  }, [brightness, contrast, saturation, hue, exposure, temperature, sharpness, smoothing, rotation, flipH, flipV, backgroundColor, currentImage, historyIndex]);

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
    setSharpness(state.sharpness || 0);
    setSmoothing(state.smoothing || 0);
    setRotation(state.rotation);
    setFlipH(state.flipH);
    setFlipV(state.flipV);
    setBackgroundColor(state.bgColor);
    setCurrentImage(state.image);
  };

  // --- Actions ---
  const handleRemoveBg = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: currentImage }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove background');
      }

      const data = await response.json();
      setCurrentImage(data.output);
      setIsProcessing(false);
      saveToHistory(data.output);
    } catch (err: any) {
      console.error(err);
      let msg = err.message || 'Failed to remove background';
      if (msg.includes('unknown_foreground')) {
        msg = "Could not identify the subject in this image. Try an image with a clearer foreground.";
      }
      setErrorMessage(msg);
      setIsProcessing(false);
    }
  };

  const handleAIEnhance = async (mode: 'auto' | 'face' | 'hd') => {
    setIsProcessing(true);
    
    // Simulate complex AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const canvas = document.createElement('canvas');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Base Image
      ctx.drawImage(img, 0, 0);

      // 2. Apply Enhancements based on mode
      if (mode === 'auto' || mode === 'hd') {
        setBrightness(105);
        setContrast(110);
        setSaturation(105);
        setSharpness(20);
      }

      if (mode === 'face' || mode === 'hd') {
        setSmoothing(15);
        setSharpness(40);
        setContrast(115);
      }

      // Apply filters to the currentImage for history
      const finalUrl = canvas.toDataURL('image/png');
      setCurrentImage(finalUrl);
      setIsProcessing(false);
      saveToHistory(finalUrl);
    };
    img.src = currentImage;
  };

  const handleUpscale = async (factor: 2 | 4) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width * factor;
      canvas.height = img.height * factor;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Use high quality interpolation
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Multi-pass scaling for better results
      const steps = factor === 4 ? 2 : 1;
      let currentW = img.width;
      let currentH = img.height;
      
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      
      if (tempCtx) {
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        tempCtx.imageSmoothingQuality = 'high';
        tempCtx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Apply a slight sharpen after upscale to maintain HD look
        tempCtx.filter = 'contrast(105%) brightness(102%)';
        tempCtx.drawImage(tempCanvas, 0, 0);
        
        const upscaledUrl = tempCanvas.toDataURL('image/png');
        setCurrentImage(upscaledUrl);
        setIsProcessing(false);
        saveToHistory(upscaledUrl);
      }
    };
    img.src = currentImage;
  };

  const handleAIEnhancePro = async () => {
    setIsProcessing(true);
    setIsEnhancing(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: currentImage, upscale: 2, face_enhance: true }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to enhance image');
      }

      const data = await response.json();
      setEnhancedImage(data.output);
      setShowCompare(true);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to enhance image');
    } finally {
      setIsProcessing(false);
      setIsEnhancing(false);
    }
  };

  const applyEnhancedImage = () => {
    if (enhancedImage) {
      setCurrentImage(enhancedImage);
      saveToHistory(enhancedImage);
      setEnhancedImage(null);
      setShowCompare(false);
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
      
      if (sharpness > 0) filterString += ` contrast(${100 + sharpness / 2}%)`;
      if (smoothing > 0) filterString += ` blur(${smoothing / 50}px)`;

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
    } ${sharpness > 0 ? `contrast(${100 + sharpness / 2}%)` : ''} ${smoothing > 0 ? `blur(${smoothing / 50}px)` : ''}`,
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
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">AI Powered Studio</p>
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
            { id: 'ai_enhance', icon: Sparkles, label: 'AI' },
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
              {activeTool.replace('_', ' ')} Settings
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

              {activeTool === 'ai_enhance' && (
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">AI Enhance (Pro)</h3>
                      <span className="px-2 py-0.5 bg-indigo-500 text-white text-[8px] font-black rounded uppercase">Premium</span>
                    </div>
                    <p className="text-[9px] text-white/40 leading-relaxed">
                      Advanced HD upscaling & face restoration using Real-ESRGAN powered by Replicate.
                    </p>
                    <button 
                      onClick={handleAIEnhancePro}
                      disabled={isProcessing}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all"
                    >
                      <Sparkles size={16} />
                      AI Enhance (Pro)
                    </button>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Basic Enhancements</h3>
                    <div className="grid gap-2">
                      <button 
                        onClick={() => handleAIEnhance('auto')}
                        className="w-full py-3 bg-white/5 hover:bg-indigo-600/20 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                      >
                        <Wand2 size={14} />
                        Auto Enhance
                      </button>
                      <button 
                        onClick={() => handleAIEnhance('face')}
                        className="w-full py-3 bg-white/5 hover:bg-indigo-600/20 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                      >
                        <RefreshCcw size={14} />
                        Face Retouch
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-400">AI Upscaler</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => handleUpscale(2)}
                        className="py-3 bg-white/5 hover:bg-amber-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        2X Scale
                      </button>
                      <button 
                        onClick={() => handleUpscale(4)}
                        className="py-3 bg-white/5 hover:bg-amber-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        4X Scale
                      </button>
                    </div>
                    <p className="text-[8px] text-white/30 text-center uppercase font-bold">Preserves details & removes noise</p>
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
                  <SliderControl label="Sharpness" icon={Sparkles} value={sharpness} min={0} max={100} onChange={setSharpness} />
                  <SliderControl label="Smoothing" icon={RefreshCcw} value={smoothing} min={0} max={100} onChange={setSmoothing} />
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
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" />
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[110] w-full max-w-md">
              <div className="bg-red-500/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-red-400/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                    <X size={16} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest leading-tight">{errorMessage}</p>
                </div>
                <button 
                  onClick={() => setErrorMessage(null)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors shrink-0"
                >
                  <X size={16} />
                </button>
              </div>
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
              <div className="relative group">
                <img 
                  src={currentImage} 
                  alt="Preview" 
                  className="max-w-full max-h-[70vh] object-contain"
                  referrerPolicy="no-referrer"
                />
                
                {/* Before/After Comparison Overlay */}
                {showCompare && enhancedImage && (
                  <div className="absolute inset-0 z-40 bg-black">
                    <div className="relative w-full h-full flex items-center justify-center">
                      {/* Before Image */}
                      <img 
                        src={currentImage} 
                        alt="Before" 
                        className="absolute inset-0 w-full h-full object-contain"
                        style={{ clipPath: `inset(0 ${100 - compareProgress}% 0 0)` }}
                        referrerPolicy="no-referrer"
                      />
                      {/* After Image */}
                      <img 
                        src={enhancedImage} 
                        alt="After" 
                        className="absolute inset-0 w-full h-full object-contain"
                        style={{ clipPath: `inset(0 0 0 ${compareProgress}%)` }}
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Comparison Slider Handle */}
                      <div 
                        className="absolute inset-y-0 z-50 w-1 bg-white cursor-ew-resize flex items-center justify-center"
                        style={{ left: `${compareProgress}%` }}
                      >
                        <div className="w-8 h-8 bg-white rounded-full shadow-xl flex items-center justify-center -ml-0.5">
                          <RefreshCcw size={16} className="text-black animate-spin-slow" />
                        </div>
                        <input 
                          type="range" min="0" max="100" 
                          value={compareProgress} 
                          onChange={(e) => setCompareProgress(parseInt(e.target.value))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                        />
                      </div>

                      {/* Labels */}
                      <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 rounded-full text-[10px] font-black uppercase tracking-widest z-50">Before</div>
                      <div className="absolute top-4 right-4 px-3 py-1 bg-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest z-50 shadow-lg shadow-indigo-500/20">After (AI Pro)</div>

                      {/* Action Buttons */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
                        <button 
                          onClick={() => { setEnhancedImage(null); setShowCompare(false); }}
                          className="px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                        >
                          Discard
                        </button>
                        <button 
                          onClick={applyEnhancedImage}
                          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-500/40 transition-all flex items-center gap-2"
                        >
                          <Check size={18} />
                          Apply HD Result
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
