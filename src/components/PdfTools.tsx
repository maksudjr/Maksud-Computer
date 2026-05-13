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
import JSZip from 'jszip';

import { cn } from '../lib/utils';
import { Language, translations } from '../lib/translations';

// Set up pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

interface PdfToolsProps {
  type: 'pdf-to-img' | 'pdf-to-word' | 'pdf-compress' | 'pdf-merge' | 'img-to-pdf';
  onBack: () => void;
  uiTheme: 'light' | 'dark' | 'golden';
  language: Language;
}

export const PdfTools: React.FC<PdfToolsProps> = ({ type, onBack, uiTheme, language }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const t = translations[language];

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
      const zip = new JSZip();
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({ canvasContext: context!, viewport, canvas: canvas }).promise;
        const imgData = canvas.toDataURL('image/png').split(',')[1];
        zip.file(`${file.name.replace('.pdf', '')}_page_${i}.png`, imgData, { base64: true });
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${file.name.replace('.pdf', '')}_images.zip`);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage(t.dashboard.pdf.failedToConvert);
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
      setErrorMessage(t.dashboard.pdf.failedToWord);
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
      setErrorMessage(t.dashboard.pdf.failedToCompress);
    } finally {
      setIsProcessing(false);
    }
  };

  const processPdfMerge = async () => {
    if (files.length < 2) {
      setStatus('error');
      setErrorMessage(t.dashboard.pdf.mergeError);
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
      setErrorMessage(t.dashboard.pdf.failedToMerge);
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
      setErrorMessage(t.dashboard.pdf.failedToConvert);
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
      case 'pdf-to-img': return { title: t.dashboard.tools.pdfToImg, icon: <FileImage size={48} />, desc: t.dashboard.toolDescriptions.pdfToImg, accept: '.pdf', multiple: false };
      case 'pdf-to-word': return { title: t.dashboard.tools.pdfToWord, icon: <FileType size={48} />, desc: t.dashboard.toolDescriptions.pdfToWord, accept: '.pdf', multiple: false };
      case 'pdf-compress': return { title: t.dashboard.tools.pdfCompress, icon: <FileArchive size={48} />, desc: t.dashboard.toolDescriptions.pdfCompress, accept: '.pdf', multiple: false };
      case 'pdf-merge': return { title: t.dashboard.tools.pdfMerge, icon: <Files size={48} />, desc: t.dashboard.toolDescriptions.pdfMerge, accept: '.pdf', multiple: true };
      case 'img-to-pdf': return { title: t.dashboard.tools.imgToPdf, icon: <ImagePlus size={48} />, desc: t.dashboard.toolDescriptions.imgToPdf, accept: 'image/*', multiple: true };
    }
  };

  const info = getToolInfo();

  return (
    <div className={cn(
      "min-h-screen py-24 px-4 transition-all pb-32",
      uiTheme === 'light' ? "bg-slate-50" : uiTheme === 'dark' ? "bg-[#0c110f]" : "bg-[#004d35]"
    )}>
      <button 
        onClick={onBack}
        className={cn(
          "fixed top-8 left-8 z-50 w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-lg",
          uiTheme === 'light' ? "bg-white text-[#006747] border border-slate-200" : (uiTheme === 'dark' ? "bg-slate-900 text-white border border-slate-800" : "bg-[#f42a41] text-white border-none")
        )}
      >
        <ArrowLeft size={24} />
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-16">
          <div className={cn(
            "w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl mb-8 transition-transform hover:scale-110",
            uiTheme === 'golden' ? "bg-[#f42a41] text-white shadow-red-900/40" : "bg-[#006747] text-white shadow-emerald-900/20"
          )}>
            {React.cloneElement(info.icon as React.ReactElement, { size: 40 })}
          </div>
          <h1 className={cn(
            "text-4xl md:text-5xl font-black mb-4 tracking-tight",
            uiTheme === 'light' ? "text-slate-900" : (uiTheme === 'dark' ? "text-white" : "text-white")
          )}>
            {info.title}
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">{info.desc}</p>
        </div>

        <div className={cn(
          "standard-card p-8 md:p-12 overflow-hidden",
          uiTheme === 'light' ? "bg-white" : 
          uiTheme === 'dark' ? "bg-slate-900 border-slate-800" :
          "bg-[#005a3e] border-emerald-900/30"
        )}>
          <div className="space-y-10">
            <div className={cn(
              "relative border-2 border-dashed rounded-[2.5rem] p-12 md:p-20 text-center transition-all group overflow-hidden",
              uiTheme === 'light' ? "bg-slate-50 border-slate-200 hover:border-[#006747] hover:bg-slate-100" : 
              "border-[#f42a41]/30 bg-black/10 hover:border-[#f42a41] hover:bg-black/20"
            )}>
              <input
                type="file"
                accept={info.accept}
                multiple={info.multiple}
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              <div className="flex flex-col items-center relative z-10 pointer-events-none">
                <div className={cn(
                  "w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl transition-all group-hover:scale-110 group-hover:rotate-6",
                  uiTheme === 'golden' ? "bg-[#f42a41] text-white shadow-red-900/20" : "bg-white text-[#006747] shadow-emerald-100/50 dark:bg-[#002b1c] dark:shadow-none"
                )}>
                  <Upload size={32} />
                </div>
                <p className={cn(
                  "text-2xl font-bold tracking-tight mb-2",
                  uiTheme === 'light' ? "text-slate-900" : "text-white"
                )}>
                  {files.length > 0 ? `${files.length} ${language === 'en' ? 'Files Selected' : 'ফাইল সিলেক্ট করা হয়েছে'}` : t.dashboard.pdf.uploadTitle}
                </p>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                  {info.accept === '.pdf' ? "Supported format: PDF" : "Supported formats: Images"}
                </p>
              </div>

              {/* Decorative gradient */}
              <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-500",
                uiTheme === 'golden' ? "bg-gradient-to-tr from-[#f42a41] to-transparent" : "bg-gradient-to-tr from-[#006747] to-transparent"
              )} />
            </div>

            {files.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Ready to Process</h3>
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{files.length} Files</span>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {files.map((f, i) => (
                    <div key={i} className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border transition-all",
                      uiTheme === 'light' ? "bg-white border-slate-100 hover:border-slate-200 shadow-sm" : 
                      "bg-black/20 border-emerald-900/30 hover:border-emerald-800"
                    )}>
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-[10px] shadow-sm",
                          uiTheme === 'golden' ? "bg-[#f42a41] text-white" : "bg-[#006747] text-white"
                        )}>
                          {f.name.split('.').pop()?.toUpperCase()}
                        </div>
                        <span className={cn(
                          "text-sm font-bold truncate tracking-tight",
                          uiTheme === 'light' ? "text-slate-700" : "text-white"
                        )}>{f.name}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {status === 'success' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "p-6 rounded-[2rem] flex items-center gap-6 shadow-xl",
                  "bg-emerald-50 text-emerald-900 border border-emerald-100"
                )}
              >
                <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-200 animate-bounce">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <p className="text-xl font-black tracking-tight">Success!</p>
                  <p className="text-sm font-medium opacity-70">{t.dashboard.pdf.processingComplete}</p>
                </div>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-[2rem] bg-rose-50 border border-rose-100 flex items-center gap-6 text-rose-900 shadow-xl"
              >
                <div className="w-14 h-14 bg-rose-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-200">
                  <AlertCircle size={28} />
                </div>
                <div>
                  <p className="text-xl font-black tracking-tight">System Error</p>
                  <p className="text-sm font-medium opacity-70">{errorMessage}</p>
                </div>
              </motion.div>
            )}

            <button
              onClick={handleProcess}
              disabled={files.length === 0 || isProcessing}
              className={cn(
                "w-full py-6 rounded-[2rem] font-bold text-xl tracking-tight shadow-xl flex items-center justify-center gap-4 transition-all active:scale-95",
                files.length === 0 || isProcessing
                  ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                  : (uiTheme === 'golden' ? "bg-[#f42a41] text-white shadow-red-900/20 hover:bg-red-700" : "bg-[#006747] text-white shadow-emerald-900/20 hover:bg-emerald-800")
              )}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Processing...
                </>
              ) : (
                <>
                  <Download size={24} />
                  {t.dashboard.pdf.start}
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
