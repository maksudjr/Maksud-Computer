import React from 'react';
import { CVData } from '../types';
import { FileText, Clock, Trash2, Eye, Printer, FileDown, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface CVHistoryProps {
  history: CVData[];
  onView: (cv: CVData) => void;
  onDelete: (id: string) => void;
  onPrint: (cv: CVData) => void;
  onDownload: (cv: CVData) => void;
}

export const CVHistory: React.FC<CVHistoryProps> = ({ history, onView, onDelete, onPrint, onDownload }) => {
  if (history.length === 0) return null;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="mt-16 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Clock className="text-indigo-600" />
          Recent CV History
        </h2>
        <span className="text-sm text-gray-500 font-medium">Last 5 CVs saved locally</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((cv) => (
          <div 
            key={cv.id}
            className="group bg-white rounded-2xl border border-gray-200 p-5 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <FileText size={120} />
            </div>

            <div className="relative">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <FileText size={20} />
                </div>
                <button 
                  onClick={() => onDelete(cv.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove from history"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <h3 className="font-bold text-gray-900 truncate mb-1">
                {cv.personalInfo.name || 'Untitled CV'}
              </h3>
              <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-6">
                <Clock size={12} />
                {formatDate(cv.lastUpdated)}
              </p>

              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => onView(cv)}
                  className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all group/btn"
                >
                  <Eye size={16} className="group-hover/btn:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase">View</span>
                </button>
                <button 
                  onClick={() => onPrint(cv)}
                  className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all group/btn"
                >
                  <Printer size={16} className="group-hover/btn:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase">Print</span>
                </button>
                <button 
                  onClick={() => onDownload(cv)}
                  className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all group/btn"
                >
                  <FileDown size={16} className="group-hover/btn:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase">Save</span>
                </button>
              </div>

              <button 
                onClick={() => onView(cv)}
                className="w-full mt-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-lg shadow-indigo-200"
              >
                Edit This CV
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
