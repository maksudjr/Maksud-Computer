import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, Sun, Contrast, RotateCw, Crop as CropIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface PhotoEditorProps {
  image: string;
  onSave: (editedImage: string) => void;
  onCancel: () => void;
  aspect?: number;
}

export const PhotoEditor: React.FC<PhotoEditorProps> = ({ image, onSave, onCancel, aspect = 1.5 / 2 }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [isFreeCrop, setIsFreeCrop] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

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

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: any,
    rotation = 0,
    brightness = 100,
    contrast = 100
  ): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

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

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(
      data,
      Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
      Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
    );

    // Apply brightness and contrast
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = canvas.width;
    finalCanvas.height = canvas.height;
    const finalCtx = finalCanvas.getContext('2d');
    
    if (finalCtx) {
      finalCtx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      finalCtx.drawImage(canvas, 0, 0);
      return finalCanvas.toDataURL('image/jpeg');
    }

    return canvas.toDataURL('image/jpeg');
  };

  const handleSave = async () => {
    try {
      const croppedImage = await getCroppedImg(
        image,
        croppedAreaPixels,
        rotation,
        brightness,
        contrast
      );
      onSave(croppedImage);
    } catch (e) {
      console.error(e);
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
          image={image}
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
              filter: `brightness(${brightness}%) contrast(${contrast}%)`
            }
          }}
        />
      </div>

      <div className="p-6 bg-gray-900 text-white space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
