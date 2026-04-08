import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { FileEdit, ArrowLeft, Upload, Download, Type, Image as ImageIcon, Plus, Trash2, Square, Move } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import Draggable from 'react-draggable';
import { cn } from '../lib/utils';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PdfEditorProps {
  onBack: () => void;
}

interface PdfElement {
  id: string;
  type: 'text' | 'image' | 'whiteout';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  page: number;
}

export const PdfEditor: React.FC<PdfEditorProps> = ({ onBack }) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [elements, setElements] = useState<PdfElement[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [scale, setScale] = useState(1.5);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setIsProcessing(true);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const pageImages: string[] = [];
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (context) {
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: context, viewport, canvas }).promise;
            pageImages.push(canvas.toDataURL());
          }
        }
        setPages(pageImages);
        setElements([]);
      } catch (error) {
        console.error('Error loading PDF:', error);
        alert('Failed to load PDF.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const addElement = (type: 'text' | 'image' | 'whiteout', content: string = '') => {
    const newElement: PdfElement = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: type === 'text' ? 'New Text' : content,
      x: 50,
      y: 50,
      width: type === 'text' ? 150 : 100,
      height: type === 'text' ? 30 : 100,
      fontSize: 14,
      page: currentPage
    };
    setElements([...elements, newElement]);
  };

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        addElement('image', event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateElement = (id: string, updates: Partial<PdfElement>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const removeElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
  };

  const handleSave = async () => {
    if (!pdfFile) return;
    setIsProcessing(true);

    try {
      const existingPdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const pdfPages = pdfDoc.getPages();

      for (const el of elements) {
        const page = pdfPages[el.page];
        const { height } = page.getSize();
        
        // Convert UI coordinates to PDF coordinates
        // UI uses top-left origin, PDF uses bottom-left origin
        // We need to scale based on the rendered image vs PDF page size
        const renderedImg = new Image();
        renderedImg.src = pages[el.page];
        await new Promise(r => renderedImg.onload = r);
        
        const scaleX = page.getWidth() / renderedImg.width;
        const scaleY = page.getHeight() / renderedImg.height;

        const pdfX = el.x * scaleX;
        const pdfY = height - (el.y * scaleY) - (el.height * scaleY);

        if (el.type === 'text') {
          page.drawText(el.content, {
            x: pdfX,
            y: pdfY + (el.height * scaleY * 0.2), // Adjust for baseline
            size: el.fontSize * scaleY,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });
        } else if (el.type === 'image') {
          const imageBytes = await fetch(el.content).then(res => res.arrayBuffer());
          let embeddedImage;
          if (el.content.includes('image/png')) {
            embeddedImage = await pdfDoc.embedPng(imageBytes);
          } else {
            embeddedImage = await pdfDoc.embedJpg(imageBytes);
          }
          page.drawImage(embeddedImage, {
            x: pdfX,
            y: pdfY,
            width: el.width * scaleX,
            height: el.height * scaleY,
          });
        } else if (el.type === 'whiteout') {
          page.drawRectangle({
            x: pdfX,
            y: pdfY,
            width: el.width * scaleX,
            height: el.height * scaleY,
            color: rgb(1, 1, 1),
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `edited_${pdfFile.name}`;
      link.click();
    } catch (error) {
      console.error('PDF editing failed:', error);
      alert('Failed to save PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-[1400px] mx-auto">
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
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col h-[85vh]"
        >
          {/* Header */}
          <div className="bg-red-600 p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/20 rounded-xl">
                <FileEdit size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold">Advanced PDF Editor</h1>
                <p className="text-red-100 text-xs">Edit text, images, and whiteout content</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {pdfFile && (
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
                  <button 
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="disabled:opacity-30"
                  >
                    Prev
                  </button>
                  <span className="text-sm font-bold">Page {currentPage + 1} of {pages.length}</span>
                  <button 
                    onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
                    disabled={currentPage === pages.length - 1}
                    className="disabled:opacity-30"
                  >
                    Next
                  </button>
                </div>
              )}
              <button 
                onClick={handleSave}
                disabled={!pdfFile || isProcessing}
                className="bg-white text-red-600 px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {isProcessing ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent" /> : <Download size={18} />}
                Save PDF
              </button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 bg-gray-50 border-r border-gray-200 p-6 space-y-8 overflow-y-auto">
              {!pdfFile ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-red-400 hover:bg-red-50 transition-all"
                >
                  <input type="file" ref={fileInputRef} onChange={handleUpload} accept="application/pdf" className="hidden" />
                  <Upload size={32} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-sm font-bold text-gray-600">Upload PDF to start</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tools</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => addElement('text')}
                        className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 rounded-2xl hover:border-red-300 hover:bg-red-50 transition-all"
                      >
                        <Type size={20} className="text-red-600" />
                        <span className="text-xs font-bold">Add Text</span>
                      </button>
                      <button 
                        onClick={() => imageInputRef.current?.click()}
                        className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 rounded-2xl hover:border-red-300 hover:bg-red-50 transition-all"
                      >
                        <input type="file" ref={imageInputRef} onChange={handleImageAdd} accept="image/*" className="hidden" />
                        <ImageIcon size={20} className="text-red-600" />
                        <span className="text-xs font-bold">Add Image</span>
                      </button>
                      <button 
                        onClick={() => addElement('whiteout')}
                        className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 rounded-2xl hover:border-red-300 hover:bg-red-50 transition-all"
                      >
                        <Square size={20} className="text-red-600" />
                        <span className="text-xs font-bold">Whiteout</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Elements on Page</h3>
                    <div className="space-y-3">
                      {elements.filter(el => el.page === currentPage).map(el => (
                        <div key={el.id} className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">{el.type}</span>
                            <button onClick={() => removeElement(el.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                              <Trash2 size={14} />
                            </button>
                          </div>
                          {el.type === 'text' && (
                            <input 
                              type="text" 
                              value={el.content}
                              onChange={(e) => updateElement(el.id, { content: e.target.value })}
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                            />
                          )}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-gray-400 uppercase">Width</label>
                              <input 
                                type="number" 
                                value={el.width}
                                onChange={(e) => updateElement(el.id, { width: parseInt(e.target.value) })}
                                className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-gray-400 uppercase">Height</label>
                              <input 
                                type="number" 
                                value={el.height}
                                onChange={(e) => updateElement(el.id, { height: parseInt(e.target.value) })}
                                className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Editor Area */}
            <div className="flex-1 bg-gray-200 overflow-auto p-12 flex justify-center items-start" ref={containerRef}>
              {pages.length > 0 && (
                <div className="relative shadow-2xl bg-white" style={{ width: 'fit-content' }}>
                  <img 
                    src={pages[currentPage]} 
                    alt={`Page ${currentPage + 1}`} 
                    className="max-w-none"
                    style={{ width: '800px' }} // Fixed width for consistent coordinate mapping
                  />
                  
                  {/* Overlay Elements */}
                  {elements.filter(el => el.page === currentPage).map(el => (
                    <Draggable
                      key={el.id}
                      bounds="parent"
                      position={{ x: el.x, y: el.y }}
                      onStop={(_e, data) => updateElement(el.id, { x: data.x, y: data.y })}
                      handle=".drag-handle"
                    >
                      <div 
                        className={cn(
                          "absolute group border-2 border-transparent hover:border-red-400 cursor-default",
                          el.type === 'whiteout' ? "bg-white" : ""
                        )}
                        style={{ width: el.width, height: el.height }}
                      >
                        <div className="drag-handle absolute -top-6 left-0 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 cursor-move transition-opacity">
                          <Move size={12} />
                        </div>
                        
                        {el.type === 'text' && (
                          <div 
                            className="w-full h-full flex items-center outline-none"
                            style={{ fontSize: el.fontSize }}
                          >
                            {el.content}
                          </div>
                        )}
                        
                        {el.type === 'image' && (
                          <img src={el.content} alt="Overlay" className="w-full h-full object-contain pointer-events-none" />
                        )}
                      </div>
                    </Draggable>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
