import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  QrCode, 
  Barcode, 
  Scan, 
  Download, 
  Copy, 
  Trash2, 
  ArrowLeft, 
  Type, 
  Link as LinkIcon, 
  Info,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Camera,
  RefreshCw,
  MoreVertical,
  Check,
  Settings
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import bwipjs from 'bwip-js';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { cn } from '../lib/utils';

// Available barcode types
const BARCODE_TYPES = [
  { id: 'code128', name: 'Code 128', description: 'General purpose barcode' },
  { id: 'pdf417', name: 'PDF417', description: '2D stacked barcode' },
  { id: 'datamatrix', name: 'Data Matrix', description: '2D matrix barcode' },
  { id: 'ean13', name: 'EAN-13', description: 'International retail barcode' },
  { id: 'code39', name: 'Code 39', description: 'Classic alphanumeric barcode' },
  { id: 'upca', name: 'UPC-A', description: 'US retail barcode' },
];

interface ScannerToolProps {
  onBack: () => void;
  uiTheme?: 'light' | 'dark' | 'golden' | 'chameleon';
  language?: 'en' | 'bn';
}

export const ScannerTool: React.FC<ScannerToolProps> = ({ onBack, uiTheme = 'light', language = 'en' }) => {
  const [activeTab, setActiveTab] = useState<'generate-qr' | 'generate-barcode' | 'read'>('generate-qr');
  const [inputText, setInputText] = useState('');
  const [selectedBarcodeType, setSelectedBarcodeType] = useState('code128');
  const [barcodeOptions, setBarcodeOptions] = useState({
    scale: 3,
    height: 10,
    includetext: true,
  });
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const barcodeCanvasRef = useRef<HTMLCanvasElement>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const t = {
    en: {
      title: "Scanner & Generator",
      subtitle: "Professional QR & Barcode Tools",
      generateQr: "QR Code",
      generateBarcode: "Barcode",
      read: "Scanner",
      inputPlaceholder: "Enter text or URL here...",
      download: "Download PNG",
      copy: "Copy Code",
      copied: "Copied!",
      scanTitle: "Scan QR or Barcode",
      scanDesc: "Use your camera to read any code",
      startScan: "Start Camera",
      stopScan: "Stop Camera",
      scanSuccess: "Code Identified!",
      noText: "Please enter some text to generate a code.",
      barcodeType: "Barcode Type",
      options: "Options",
      scale: "Scale",
      height: "Height",
      showText: "Include Text",
    },
    bn: {
      title: "স্ক্যানার এবং জেনারেটর",
      subtitle: "প্রফেশনাল কিউআর এবং বারকোড টুলস",
      generateQr: "কিউআর কোড",
      generateBarcode: "বারকোড",
      read: "স্ক্যানার",
      inputPlaceholder: "এখানে টেক্সট বা URL লিখুন...",
      download: "PNG ডাউনলোড",
      copy: "কোড কপি করুন",
      copied: "কপি হয়েছে!",
      scanTitle: "কিউআর বা বারকোড স্ক্যান করুন",
      scanDesc: "কোড পড়ার জন্য ক্যামেরা ব্যবহার করুন",
      startScan: "ক্যামেরা শুরু করুন",
      stopScan: "ক্যামেরা বন্ধ করুন",
      scanSuccess: "কোড শনাক্ত হয়েছে!",
      noText: "কোড জেনারেট করার জন্য কিছু টেক্সট লিখুন।",
      barcodeType: "বারকোড ধরণ",
      options: "অপশন",
      scale: "স্কেল",
      height: "উচ্চতা",
      showText: "টেক্সট দেখান",
    }
  }[language];

  // Generate Barcode using bwip-js
  useEffect(() => {
    if (activeTab === 'generate-barcode' && inputText && barcodeCanvasRef.current) {
      try {
        bwipjs.toCanvas(barcodeCanvasRef.current, {
          bcid: selectedBarcodeType, // Barcode type
          text: inputText,           // Text to encode
          scale: barcodeOptions.scale, 
          height: barcodeOptions.height,
          includetext: barcodeOptions.includetext,
          textxalign: 'center',
        });
      } catch (e) {
        console.error("Barcode generation error:", e);
      }
    }
  }, [activeTab, inputText, selectedBarcodeType, barcodeOptions]);

  // Handle Scanner
  useEffect(() => {
    if (activeTab === 'read' && isScanning) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );
      
      scanner.render(
        (decodedText) => {
          setScanResult(decodedText);
          setIsScanning(false);
          scanner.clear();
        },
        (error) => {
          // console.warn(error);
        }
      );

      scannerRef.current = scanner;
    } else {
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    }
    
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [activeTab, isScanning]);

  const handleDownloadQR = () => {
    const svg = document.querySelector("#qr-code-svg") as SVGElement;
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = "maksud_qr_code.png";
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleDownloadBarcode = () => {
    if (!barcodeCanvasRef.current) return;
    const pngFile = barcodeCanvasRef.current.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.download = `maksud_barcode_${selectedBarcodeType}.png`;
    downloadLink.href = pngFile;
    downloadLink.click();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("min-h-screen flex flex-col", uiTheme === 'light' ? "bg-slate-50 text-slate-900" : "bg-slate-950 text-white")}>
      {/* Header */}
      <header className={cn(
        "px-6 py-4 flex items-center justify-between border-b sticky top-0 bg-white/80 backdrop-blur-xl z-50",
        uiTheme === 'dark' ? "bg-slate-900/80 border-slate-800" : (uiTheme === 'golden' ? "bg-amber-950/80 border-amber-500/20" : "")
      )}>
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <QrCode className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-black text-lg leading-tight uppercase tracking-tight">{t.title}</h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.subtitle}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl w-fit mx-auto">
          <button
            onClick={() => setActiveTab('generate-qr')}
            className={cn(
              "px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2",
              activeTab === 'generate-qr' ? "bg-white dark:bg-slate-800 shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <QrCode size={16} />
            {t.generateQr}
          </button>
          <button
            onClick={() => setActiveTab('generate-barcode')}
            className={cn(
              "px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2",
              activeTab === 'generate-barcode' ? "bg-white dark:bg-slate-800 shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Barcode size={16} />
            {t.generateBarcode}
          </button>
          <button
            onClick={() => setActiveTab('read')}
            className={cn(
              "px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2",
              activeTab === 'read' ? "bg-white dark:bg-slate-800 shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Scan size={16} />
            {t.read}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Workspace */}
          <div className="lg:col-span-12">
            <AnimatePresence mode="wait">
              {activeTab === 'read' ? (
                <motion.div
                  key="read"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50"
                >
                  <div className="max-w-xl mx-auto text-center space-y-8">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t.scanTitle}</h2>
                      <p className="text-slate-500 font-medium">{t.scanDesc}</p>
                    </div>

                    {!isScanning && !scanResult && (
                      <button
                        onClick={() => setIsScanning(true)}
                        className="w-full py-16 border-2 border-dashed border-indigo-200 dark:border-slate-700 rounded-[2rem] flex flex-col items-center justify-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                      >
                        <div className="w-20 h-20 bg-indigo-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                          <Camera size={40} />
                        </div>
                        <span className="font-black text-indigo-600 uppercase tracking-widest">{t.startScan}</span>
                      </button>
                    )}

                    {isScanning && (
                      <div className="relative overflow-hidden rounded-[2rem] border-4 border-indigo-600 min-h-[300px] bg-black">
                        <div id="reader" className="w-full"></div>
                        <button
                          onClick={() => setIsScanning(false)}
                          className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-red-600 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-lg"
                        >
                          {t.stopScan}
                        </button>
                      </div>
                    )}

                    {scanResult && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-8 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-500/20 rounded-[2rem] flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                            <Check size={32} />
                          </div>
                          <div>
                            <p className="text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest text-xs mb-1">{t.scanSuccess}</p>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white break-all">{scanResult}</h3>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <button
                            onClick={() => copyToClipboard(scanResult)}
                            className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                          >
                            {copied ? <Check size={20} /> : <Copy size={20} />}
                            {copied ? t.copied : t.copy}
                          </button>
                          <button
                            onClick={() => { setScanResult(null); setIsScanning(true); }}
                            className="px-6 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-black transition-all"
                          >
                            <RefreshCw size={20} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                  {/* Controls */}
                  <motion.div
                    key="controls"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 space-y-8"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Type className="text-indigo-600" size={18} />
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Content</h3>
                      </div>
                      <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={t.inputPlaceholder}
                        className="w-full h-40 px-6 py-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-3xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-lg resize-none"
                      />
                    </div>

                    {activeTab === 'generate-barcode' && (
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Barcode className="text-indigo-600" size={18} />
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">{t.barcodeType}</h3>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {BARCODE_TYPES.map((type) => (
                              <button
                                key={type.id}
                                onClick={() => setSelectedBarcodeType(type.id)}
                                className={cn(
                                  "p-4 rounded-2xl border text-left transition-all",
                                  selectedBarcodeType === type.id 
                                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200" 
                                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                                )}
                              >
                                <p className="text-xs font-black uppercase tracking-widest mb-1">{type.name}</p>
                                <p className={cn("text-[10px] font-medium opacity-60 line-clamp-1")}>{type.description}</p>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Settings className="text-indigo-600" size={18} />
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">{t.options}</h3>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.scale}</label>
                                <span className="text-[10px] font-black text-indigo-600">{barcodeOptions.scale}x</span>
                              </div>
                              <input 
                                type="range" 
                                min="1" max="10" 
                                value={barcodeOptions.scale}
                                onChange={(e) => setBarcodeOptions(prev => ({ ...prev, scale: parseInt(e.target.value) }))}
                                className="w-full accent-indigo-600" 
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t.height}</label>
                                <span className="text-[10px] font-black text-indigo-600">{barcodeOptions.height}mm</span>
                              </div>
                              <input 
                                type="range" 
                                min="5" max="100" 
                                value={barcodeOptions.height}
                                onChange={(e) => setBarcodeOptions(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                                className="w-full accent-indigo-600" 
                              />
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer group">
                              <div 
                                onClick={() => setBarcodeOptions(prev => ({ ...prev, includetext: !prev.includetext }))}
                                className={cn(
                                  "w-12 h-6 rounded-full transition-all relative",
                                  barcodeOptions.includetext ? "bg-indigo-600 shadow-md" : "bg-slate-200 dark:bg-slate-700"
                                )}
                              >
                                <div className={cn(
                                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                                  barcodeOptions.includetext ? "left-7" : "left-1"
                                )} />
                              </div>
                              <span className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 group-hover:text-indigo-600">{t.showText}</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Preview Area */}
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-6"
                  >
                    <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center relative overflow-hidden">
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-950/20 rounded-bl-full -mr-16 -mt-16 pointer-events-none" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-50 dark:bg-indigo-950/20 rounded-tr-full -ml-12 -mb-12 pointer-events-none" />
                      
                      {!inputText ? (
                        <div className="text-center space-y-4 max-w-xs animate-pulse">
                          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl mx-auto flex items-center justify-center text-slate-300">
                            {activeTab === 'generate-qr' ? <QrCode size={40} /> : <Barcode size={40} />}
                          </div>
                          <p className="text-slate-400 font-bold text-sm tracking-tight">{t.noText}</p>
                        </div>
                      ) : (
                        <div className="space-y-8 flex flex-col items-center w-full">
                          <div className="p-8 bg-white rounded-3xl shadow-2xl shadow-indigo-100 dark:shadow-none border border-slate-100 dark:border-slate-800 max-w-full overflow-auto custom-scrollbar">
                            {activeTab === 'generate-qr' ? (
                              <QRCodeSVG 
                                id="qr-code-svg"
                                value={inputText} 
                                size={256}
                                level="H"
                                marginSize={2}
                                includeMargin={true}
                              />
                            ) : (
                              <canvas ref={barcodeCanvasRef} className="max-w-full" />
                            )}
                          </div>
                          
                          <div className="flex gap-4 w-full max-w-sm">
                            <button
                              onClick={activeTab === 'generate-qr' ? handleDownloadQR : handleDownloadBarcode}
                              className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                            >
                              <Download size={20} />
                              {t.download}
                            </button>
                            <button
                              onClick={() => copyToClipboard(inputText)}
                              className="px-6 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-black transition-all flex items-center justify-center"
                            >
                              {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-6 bg-indigo-50 dark:bg-indigo-950/20 rounded-3xl border border-indigo-100 dark:border-indigo-500/10 flex items-start gap-4">
                      <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-indigo-500 shadow-sm shrink-0">
                        <Info size={20} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Digital Tip</h4>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">
                          "High scale values work best for printing on large banners, while smaller scales are perfect for business cards."
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="py-8 text-center">
        <p className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em]">
          Designed for Excellence by Maksud Computers © 2026
        </p>
      </footer>
    </div>
  );
};
