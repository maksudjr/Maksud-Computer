import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Layout, ArrowLeft, Upload, Download, Maximize2, Scale, Crop as CropIcon } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { cn } from '../lib/utils';

interface PhotoResizerProps {
  onBack: () => void;
}

export const PhotoResizer: React.FC<PhotoResizerProps> = ({ onBack }) => {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [unit, setUnit] = useState<'px' | 'inch'>('px');
  const [targetWidth, setTargetWidth] = useState<number>(300);
  const [targetHeight, setTargetHeight] = useState<number>(300);
  const [quality, setQuality] = useState<number>(90);
  const [isResizing, setIsResizing] = useState(false);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setResizedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertToPx = (val: number, fromUnit: 'px' | 'inch') => {
    if (fromUnit === 'px') return val;
    if (fromUnit === 'inch') return Math.round(val * 96);
    return val;
  };

  const getCroppedImg = async () => {
    if (!image || !croppedAreaPixels) return;
    setIsResizing(true);

    const img = new Image();
    img.src = image;
    await new Promise((resolve) => (img.onload = resolve));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const finalWidth = convertToPx(targetWidth, unit);
    const finalHeight = convertToPx(targetHeight, unit);

    canvas.width = finalWidth;
    canvas.height = finalHeight;

    ctx.drawImage(
      img,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      finalWidth,
      finalHeight
    );

    const result = canvas.toDataURL('image/jpeg', quality / 100);
    setResizedImage(result);
    setIsResizing(false);
  };

  const downloadImage = () => {
    if (!resizedImage) return;
    const link = document.createElement('a');
    link.href = resizedImage;
    link.download = `cropped_${targetWidth}x${targetHeight}${unit}.jpg`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-8 transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="bg-purple-600 p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-2xl">
                <CropIcon size={32} />
              </div>
              <h1 className="text-3xl font-bold">Photo Resizer & Cropper</h1>
            </div>
            <p className="text-purple-100">Crop and resize your photos to exact dimensions (px or inch).</p>
          </div>

          <div className="p-8">
            {!image ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-4 border-dashed border-gray-100 rounded-3xl p-20 text-center cursor-pointer hover:border-purple-200 hover:bg-purple-50 transition-all group"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Upload size={40} className="text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Photo</h3>
                <p className="text-gray-500">Select an image to start cropping</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Cropper Area */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="relative h-[500px] bg-gray-900 rounded-2xl overflow-hidden">
                    {!resizedImage ? (
                      <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={targetWidth / targetHeight}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <img src={resizedImage} alt="Cropped" className="max-w-full max-h-full object-contain shadow-lg" />
                      </div>
                    )}
                  </div>
                  
                  {!resizedImage && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-gray-500">Zoom Level</span>
                        <span className="text-purple-600 font-bold">{zoom.toFixed(1)}x</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="3" 
                        step="0.1"
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="w-full accent-purple-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        setImage(null);
                        setResizedImage(null);
                      }}
                      className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                    >
                      Change Photo
                    </button>
                    {resizedImage && (
                      <button 
                        onClick={() => setResizedImage(null)}
                        className="px-6 py-3 bg-purple-100 text-purple-600 rounded-xl font-bold hover:bg-purple-200 transition-colors"
                      >
                        Back to Crop
                      </button>
                    )}
                  </div>
                </div>

                {/* Controls Area */}
                <div className="lg:col-span-4 space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Maximize2 size={20} className="text-purple-600" />
                      Target Dimensions
                    </h3>
                    
                    <div className="flex p-1 bg-gray-100 rounded-xl w-fit">
                      {(['px', 'inch'] as const).map((u) => (
                        <button
                          key={u}
                          onClick={() => setUnit(u)}
                          className={cn(
                            "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                            unit === u ? "bg-white text-purple-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                          )}
                        >
                          {u.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Width</label>
                        <input 
                          type="number" 
                          value={targetWidth}
                          onChange={(e) => setTargetWidth(parseFloat(e.target.value))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Height</label>
                        <input 
                          type="number" 
                          value={targetHeight}
                          onChange={(e) => setTargetHeight(parseFloat(e.target.value))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Scale size={20} className="text-purple-600" />
                      Output Quality
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-gray-500">JPEG Quality</span>
                        <span className="text-purple-600 font-bold">{quality}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="100" 
                        value={quality}
                        onChange={(e) => setQuality(parseInt(e.target.value))}
                        className="w-full accent-purple-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="pt-4 space-y-4">
                    {!resizedImage ? (
                      <button 
                        onClick={getCroppedImg}
                        disabled={isResizing}
                        className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-purple-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        {isResizing ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <>
                            <CropIcon size={20} />
                            Apply Crop & Resize
                          </>
                        )}
                      </button>
                    ) : (
                      <button 
                        onClick={downloadImage}
                        className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2"
                      >
                        <Download size={20} />
                        Download Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
