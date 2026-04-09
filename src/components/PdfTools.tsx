import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Upload, 
  FileImage, 
  FileType, 
  FileArchive, 
  Files, 
  ImagePlus,
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

import { cn } from '../lib/utils';

// Set up pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

interface PdfToolsProps {
  type: 'pdf-to-img' | 'pdf-to-word' | 'pdf-compress' | 'pdf-merge' | 'img-to-pdf';
  onBack: () => void;
}

export const PdfTools: React.FC<PdfToolsProps> = ({ type, onBack }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setStatus('idle');
    }
  };

  const processPdfToImg = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setStatus('processing');
    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({ canvasContext: context!, viewport, canvas: canvas }).promise;
        const imgData = canvas.toDataURL('image/png');
        saveAs(imgData, `${file.name.replace('.pdf', '')}_page_${i}.png`);
      }
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage('Failed to convert PDF to Image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const processPdfToWord = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setStatus('processing');
    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      
      const paragraphs: Paragraph[] = [];
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const text = textContent.items.map((item: any) => item.str).join(' ');
        
        paragraphs.push(
          new Paragraph({
            children: [new TextRun(text)],
          })
        );
      }
      
      const doc = new Document({
        sections: [{ children: paragraphs }],
      });
      
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${file.name.replace('.pdf', '')}.docx`);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage('Failed to convert PDF to Word.');
    } finally {
      setIsProcessing(false);
    }
  };

  const processPdfCompress = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setStatus('processing');
    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Basic compression by re-saving with pdf-lib (often reduces size slightly)
      const compressedPdfBytes = await pdfDoc.save({ useObjectStreams: true });
      const blob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
      saveAs(blob, `${file.name.replace('.pdf', '')}_compressed.pdf`);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage('Failed to compress PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const processPdfMerge = async () => {
    if (files.length < 2) {
      setStatus('error');
      setErrorMessage('Please select at least 2 PDF files to merge.');
      return;
    }
    setIsProcessing(true);
    setStatus('processing');
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      
      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      saveAs(blob, 'merged_document.pdf');
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage('Failed to merge PDF files.');
    } finally {
      setIsProcessing(false);
    }
  };

  const processImgToPdf = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setStatus('processing');
    try {
      const pdf = new jsPDF();
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imgData = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
        
        if (i > 0) pdf.addPage();
        
        const img = new Image();
        img.src = imgData;
        await new Promise((resolve) => (img.onload = resolve));
        
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (img.height * imgWidth) / img.width;
        
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      }
      
      pdf.save('converted_document.pdf');
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage('Failed to convert Image to PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcess = () => {
    switch (type) {
      case 'pdf-to-img': processPdfToImg(); break;
      case 'pdf-to-word': processPdfToWord(); break;
      case 'pdf-compress': processPdfCompress(); break;
      case 'pdf-merge': processPdfMerge(); break;
      case 'img-to-pdf': processImgToPdf(); break;
    }
  };

  const getToolInfo = () => {
    switch (type) {
      case 'pdf-to-img': return { title: 'PDF to Image', icon: <FileImage size={48} />, desc: 'Convert each page of your PDF into a high-quality PNG image.', accept: '.pdf', multiple: false };
      case 'pdf-to-word': return { title: 'PDF to Word', icon: <FileType size={48} />, desc: 'Extract text from your PDF and save it as a Word (.docx) document.', accept: '.pdf', multiple: false };
      case 'pdf-compress': return { title: 'PDF Compressor', icon: <FileArchive size={48} />, desc: 'Optimize your PDF file size for easier sharing and storage.', accept: '.pdf', multiple: false };
      case 'pdf-merge': return { title: 'PDF Merger', icon: <Files size={48} />, desc: 'Combine multiple PDF files into a single document in your preferred order.', accept: '.pdf', multiple: true };
      case 'img-to-pdf': return { title: 'Image to PDF', icon: <ImagePlus size={48} />, desc: 'Convert your photos and images into a professional PDF document.', accept: 'image/*', multiple: true };
    }
  };

  const info = getToolInfo();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <button 
        onClick={onBack}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md text-gray-600 hover:text-indigo-600 transition-all font-medium"
      >
        <ArrowLeft size={18} />
        Dashboard
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/20 mb-6 text-white">
            {info.icon}
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4">{info.title}</h1>
          <p className="text-lg text-slate-500 font-medium">{info.desc}</p>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm">
          <div className="space-y-8">
            <div className="relative border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center hover:border-indigo-300 transition-colors group">
              <input
                type="file"
                accept={info.accept}
                multiple={info.multiple}
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="text-slate-400 group-hover:text-indigo-600" />
                </div>
                <p className="text-slate-900 font-bold mb-1">
                  {files.length > 0 ? `${files.length} file(s) selected` : 'Click or drag to upload'}
                </p>
                <p className="text-slate-400 text-sm font-medium">
                  {info.accept === '.pdf' ? 'PDF files only' : 'Images (JPG, PNG, etc.)'}
                </p>
              </div>
            </div>

            {files.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Selected Files</p>
                <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-sm font-bold text-slate-700 truncate max-w-[80%]">{f.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {status === 'success' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-700"
              >
                <CheckCircle2 size={20} />
                <p className="text-sm font-bold text-emerald-700">Processing complete! Your files have been downloaded.</p>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700"
              >
                <AlertCircle size={20} />
                <p className="text-sm font-bold text-red-700">{errorMessage}</p>
              </motion.div>
            )}

            <button
              onClick={handleProcess}
              disabled={files.length === 0 || isProcessing}
              className={cn(
                "w-full py-4 rounded-2xl font-black text-lg shadow-xl transition-all flex items-center justify-center gap-3",
                files.length === 0 || isProcessing
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
              )}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processing...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Start Processing
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
