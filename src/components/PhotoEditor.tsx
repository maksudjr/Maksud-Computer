import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, Sun, Contrast, RotateCw, Crop as CropIcon, Sparkles, Palette, Wand2, Zap, Maximize } from 'lucide-react';
import { cn } from '../lib/utils';
import { removeBackground } from '@imgly/background-removal';

interface PhotoEditorProps {
  image: string;
  onSave: (editedImage: string) => void;
  onCancel: () => void;
  aspect?: number;
  autoRemoveBg?: boolean;
}

export const PhotoEditor: React.FC<PhotoEditorProps> = ({ image, onSave, onCancel, aspect = 1.5 / 2, autoRemoveBg = false }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [hue, setHue] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [isFreeCrop, setIsFreeCrop] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState<string>('transparent');
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [sharpness, setSharpness] = useState(0);
  const [smoothing, setSmoothing] = useState(0);
  const [upscaleFactor, setUpscaleFactor] = useState(1);

  // Auto remove background if requested
  React.useEffect(() => {
    if (autoRemoveBg && !processedImage && !isRemovingBackground) {
      handleRemoveBackground();
    }
  }, [autoRemoveBg]);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const handleRemoveBackground = async () => {
    if (!removeBackground) {
      console.error('Background removal library not loaded');
      return;
    }
    setIsRemovingBackground(true);
    try {
      const blob = await removeBackground(processedImage || image);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProcessedImage(reader.result as string);
        setIsRemovingBackground(false);
      };
      reader.onerror = () => {
        console.error('FileReader failed');
        setIsRemovingBackground(false);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Background removal failed:', error);
      setIsRemovingBackground(false);
    }
  };

  const handleAutoEnhance = () => {
    setBrightness(105);
    setContrast(115);
    setSaturation(110);
    setSharpness(25);
    setSmoothing(15);
  };

  const applyConvolution = (ctx: CanvasRenderingContext2D, width: number, height: number, weights: number[]) => {
    const side = Math.round(Math.sqrt(weights.length));
    const halfSide = Math.floor(side / 2);
    const src = ctx.getImageData(0, 0, width, height);
    const sw = src.width;
    const sh = src.height;
    const w = sw;
    const h = sh;
    const output = ctx.createImageData(w, h);
    const dst = output.data;
    const srcData = src.data;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const sy = y;
        const sx = x;
        const dstOff = (y * w + x) * 4;
        let r = 0, g = 0, b = 0;
        for (let cy = 0; cy < side; cy++) {
          for (let cx = 0; cx < side; cx++) {
            const scy = sy + cy - halfSide;
            const scx = sx + cx - halfSide;
            if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
              const srcOff = (scy * sw + scx) * 4;
              const wt = weights[cy * side + cx];
              r += srcData[srcOff] * wt;
              g += srcData[srcOff + 1] * wt;
              b += srcData[srcOff + 2] * wt;
            }
          }
        }
        dst[dstOff] = r;
        dst[dstOff + 1] = g;
        dst[dstOff + 2] = b;
        dst[dstOff + 3] = srcData[dstOff + 3];
      }
    }
    ctx.putImageData(output, 0, 0);
  };

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: any,
    rotation = 0,
    brightness = 100,
    contrast = 100,
    saturation = 100,
    hue = 0,
    sepia = 0,
    grayscale = 0,
    bgColor = 'transparent',
    bgImage = null,
    sharpnessVal = 0,
    smoothingVal = 0,
    scale = 1
  ): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (!ctx) return '';

    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    canvas.width = safeArea;
    canvas.height = safeArea;

    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-safeArea / 2, -safeArea / 2);

    ctx.drawImage(
      image,
      safeArea / 2 - image.width * 0.5,
      safeArea / 2 - image.height * 0.5
    );

    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    canvas.width = pixelCrop.width * scale;
    canvas.height = pixelCrop.height * scale;

    // Fill background color or image
    if (bgImage) {
      const bgImg = await createImage(bgImage);
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    } else if (bgColor !== 'transparent') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Create a temporary canvas to hold the rotated image
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = safeArea;
    tempCanvas.height = safeArea;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return '';
    tempCtx.putImageData(data, 0, 0);

    // Resize main canvas to the crop size * scale
    canvas.width = pixelCrop.width * scale;
    canvas.height = pixelCrop.height * scale;

    // Fill background color or image again for the final canvas
    if (bgImage) {
      const bgImg = await createImage(bgImage);
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    } else if (bgColor !== 'transparent') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const sourceX = safeArea / 2 - image.width * 0.5 + pixelCrop.x;
    const sourceY = safeArea / 2 - image.height * 0.5 + pixelCrop.y;

    ctx.drawImage(
      tempCanvas,
      sourceX,
      sourceY,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Apply filters
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = canvas.width;
    finalCanvas.height = canvas.height;
    const finalCtx = finalCanvas.getContext('2d', { willReadFrequently: true });
    
    if (finalCtx) {
      if (bgImage) {
        const bgImg = await createImage(bgImage);
        finalCtx.drawImage(bgImg, 0, 0, finalCanvas.width, finalCanvas.height);
      } else if (bgColor !== 'transparent') {
        finalCtx.fillStyle = bgColor;
        finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
      }
      
      let filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hue}deg) sepia(${sepia}%) grayscale(${grayscale}%)`;
      if (smoothingVal > 0) {
        filter += ` blur(${smoothingVal / 15}px)`;
      }
      finalCtx.filter = filter;
      finalCtx.drawImage(canvas, 0, 0);

      // Apply Sharpening if needed
      if (sharpnessVal > 0) {
        const amount = (sharpnessVal / 100) * (scale > 1 ? scale * 0.5 : 1);
        const weights = [
          0, -amount, 0,
          -amount, 1 + (4 * amount), -amount,
          0, -amount, 0
        ];
        applyConvolution(finalCtx, finalCanvas.width, finalCanvas.height, weights);
      }

      return finalCanvas.toDataURL('image/png');
    }

    return canvas.toDataURL('image/png');
  };

  const handleSave = async () => {
    if (!croppedAreaPixels) {
      console.error('No crop area defined');
      return;
    }
    try {
      const croppedImage = await getCroppedImg(
        processedImage || image,
        croppedAreaPixels,
        rotation,
        brightness,
        contrast,
        saturation,
        hue,
        sepia,
        grayscale,
        backgroundColor,
        backgroundImageUrl,
        sharpness,
        smoothing,
        upscaleFactor
      );
      if (croppedImage) {
        onSave(croppedImage);
      }
    } catch (e) {
      console.error('Save failed:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col">
      <div className="flex justify-between items-center p-4 bg-gray-900 text-white">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <CropIcon size={20} />
          Maksud Computer Photo Editor
        </h3>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleAutoEnhance}
            className="flex items-center gap-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-sm font-medium transition-colors"
            title="Auto Enhance Colors & Clarity"
          >
            <Wand2 size={16} />
            Auto Enhance
          </button>
          <button 
            onClick={handleRemoveBackground}
            disabled={isRemovingBackground}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              isRemovingBackground ? "bg-gray-700 text-gray-400" : "bg-indigo-600 text-white hover:bg-indigo-700"
            )}
          >
            <Sparkles size={16} className={cn(isRemovingBackground && "animate-spin")} />
            {isRemovingBackground ? 'Removing...' : 'Remove BG'}
          </button>
          <button 
            onClick={() => setIsFreeCrop(!isFreeCrop)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              isFreeCrop ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            )}
          >
            <CropIcon size={16} />
            {isFreeCrop ? 'Free Crop: ON' : 'Lock Aspect'}
          </button>
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-full font-bold transition-colors"
          >
            <Check size={20} />
            Apply
          </button>
        </div>
      </div>

      <div className="flex-1 relative bg-gray-800">
        <Cropper
          image={processedImage || image}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={isFreeCrop ? undefined : aspect}
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          style={{
            containerStyle: {
              filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hue}deg) sepia(${sepia}%) grayscale(${grayscale}%) blur(${smoothing / 15}px)`,
              backgroundColor: backgroundColor,
              backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }
          }}
        />
      </div>

      <div className="p-6 bg-gray-900 text-white space-y-6 overflow-y-auto max-h-[40vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Maximize size={20} className="text-gray-400" />
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs font-medium text-gray-400">
                  <span>Upscale Factor</span>
                  <span className="text-indigo-400 font-bold">{upscaleFactor}x</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  step="1"
                  value={upscaleFactor}
                  onChange={(e) => setUpscaleFactor(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Zap size={20} className="text-gray-400" />
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs font-medium text-gray-400">
                  <span>Sharpness (Enhance)</span>
                  <span>{sharpness}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={sharpness}
                  onChange={(e) => setSharpness(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Sparkles size={20} className="text-gray-400" />
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs font-medium text-gray-400">
                  <span>Smoothing (Retouch)</span>
                  <span>{smoothing}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={smoothing}
                  onChange={(e) => setSmoothing(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Sun size={20} className="text-gray-400" />
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs font-medium text-gray-400">
                  <span>Brightness</span>
                  <span>{brightness}%</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="150" 
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Contrast size={20} className="text-gray-400" />
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs font-medium text-gray-400">
                  <span>Contrast</span>
                  <span>{contrast}%</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="150" 
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500" />
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs font-medium text-gray-400">
                  <span>Saturation</span>
                  <span>{saturation}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="200" 
                  value={saturation}
                  onChange={(e) => setSaturation(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 rounded-full bg-indigo-500" />
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs font-medium text-gray-400">
                  <span>Hue</span>
                  <span>{hue}°</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="360" 
                  value={hue}
                  onChange={(e) => setHue(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 rounded-full bg-amber-600" />
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs font-medium text-gray-400">
                  <span>Sepia</span>
                  <span>{sepia}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={sepia}
                  onChange={(e) => setSepia(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 rounded-full bg-gray-400" />
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs font-medium text-gray-400">
                  <span>Grayscale</span>
                  <span>{grayscale}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={grayscale}
                  onChange={(e) => setGrayscale(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Sparkles size={20} className="text-indigo-400" />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-xs font-medium text-gray-400">
                  <span>Smart AI Backgrounds</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setBackgroundImageUrl(null)}
                    className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold border transition-all",
                      !backgroundImageUrl ? "bg-indigo-600 border-indigo-500 text-white" : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700"
                    )}
                  >
                    None
                  </button>
                  {[
                    { name: 'Office', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80' },
                    { name: 'Studio', url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80' },
                    { name: 'Nature', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80' },
                    { name: 'Abstract', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80' },
                    { name: 'Luxury', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' }
                  ].map((bg) => (
                    <button
                      key={bg.name}
                      onClick={() => {
                        setBackgroundImageUrl(bg.url);
                        setBackgroundColor('transparent');
                      }}
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold border transition-all",
                        backgroundImageUrl === bg.url ? "bg-indigo-600 border-indigo-500 text-white" : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700"
                      )}
                    >
                      {bg.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Palette size={20} className="text-gray-400" />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-xs font-medium text-gray-400">
                  <span>Background Color</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['transparent', '#ffffff', '#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#000000'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setBackgroundColor(color)}
                      className={cn(
                        "w-6 h-6 rounded-full border-2 transition-all",
                        backgroundColor === color ? "border-white scale-110" : "border-gray-700"
                      )}
                      style={{ 
                        backgroundColor: color === 'transparent' ? 'transparent' : color,
                        backgroundImage: color === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)' : 'none',
                        backgroundSize: color === 'transparent' ? '8px 8px' : 'auto',
                        backgroundPosition: color === 'transparent' ? '0 0, 4px 4px' : '0 0'
                      }}
                      title={color === 'transparent' ? 'Transparent' : color}
                    />
                  ))}
                  <input 
                    type="color" 
                    className="w-6 h-6 rounded-full border-2 border-gray-700 p-0.5 cursor-pointer overflow-hidden"
                    value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    title="Custom Color"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <RotateCw size={20} className="text-gray-400" />
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs font-medium text-gray-400">
                  <span>Rotation</span>
                  <span>{rotation}°</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="360" 
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <CropIcon size={20} className="text-gray-400" />
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs font-medium text-gray-400">
                  <span>Zoom</span>
                  <span>{zoom.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="3" 
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
