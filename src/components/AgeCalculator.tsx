import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, Calendar, ArrowLeft, Clock, History } from 'lucide-react';
import { 
  differenceInYears, 
  differenceInMonths, 
  differenceInDays, 
  differenceInHours, 
  differenceInMinutes, 
  differenceInSeconds,
  addYears,
  addMonths
} from 'date-fns';

interface AgeCalculatorProps {
  onBack: () => void;
}

export const AgeCalculator: React.FC<AgeCalculatorProps> = ({ onBack }) => {
  const [birthDate, setBirthDate] = useState<string>('');
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<any>(null);

  const calculateAge = () => {
    if (!birthDate) return;

    const start = new Date(birthDate);
    const end = new Date(targetDate);

    if (start > end) {
      alert("Birth date cannot be in the future of the target date!");
      return;
    }

    const years = differenceInYears(end, start);
    const months = differenceInMonths(end, addYears(start, years));
    const days = differenceInDays(end, addMonths(addYears(start, years), months));

    const totalMonths = differenceInMonths(end, start);
    const totalWeeks = Math.floor(differenceInDays(end, start) / 7);
    const totalDays = differenceInDays(end, start);
    const totalHours = differenceInHours(end, start);
    const totalMinutes = differenceInMinutes(end, start);
    const totalSeconds = differenceInSeconds(end, start);

    // Next Birthday
    const nextBirthday = new Date(end.getFullYear(), start.getMonth(), start.getDate());
    if (nextBirthday < end) {
      nextBirthday.setFullYear(end.getFullYear() + 1);
    }
    const daysToNextBirthday = differenceInDays(nextBirthday, end);
    const monthsToNextBirthday = Math.floor(daysToNextBirthday / 30.44);
    const remainingDaysToNextBirthday = Math.floor(daysToNextBirthday % 30.44);

    setResult({
      age: { years, months, days },
      total: {
        months: totalMonths,
        weeks: totalWeeks,
        days: totalDays,
        hours: totalHours,
        minutes: totalMinutes,
        seconds: totalSeconds
      },
      nextBirthday: {
        months: monthsToNextBirthday,
        days: remainingDaysToNextBirthday
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
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
          <div className="bg-indigo-600 p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-2xl">
                <Calculator size={32} />
              </div>
              <h1 className="text-3xl font-bold">Age Calculator</h1>
            </div>
            <p className="text-indigo-100">Calculate your exact age and time until your next birthday.</p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Calendar size={16} className="text-indigo-600" />
                  Date of Birth
                </label>
                <input 
                  type="date" 
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                  <History size={16} className="text-indigo-600" />
                  Age at the Date of
                </label>
                <input 
                  type="date" 
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <button 
              onClick={calculateAge}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
            >
              Calculate Age
            </button>

            {result && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-12 space-y-8"
              >
                {/* Main Age Result */}
                <div className="bg-indigo-50 rounded-3xl p-8 text-center border border-indigo-100">
                  <h2 className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-4">Your Current Age</h2>
                  <div className="flex flex-wrap justify-center gap-8">
                    <div className="text-center">
                      <div className="text-5xl font-black text-indigo-600">{result.age.years}</div>
                      <div className="text-gray-600 font-medium">Years</div>
                    </div>
                    <div className="text-center">
                      <div className="text-5xl font-black text-indigo-600">{result.age.months}</div>
                      <div className="text-gray-600 font-medium">Months</div>
                    </div>
                    <div className="text-center">
                      <div className="text-5xl font-black text-indigo-600">{result.age.days}</div>
                      <div className="text-gray-600 font-medium">Days</div>
                    </div>
                  </div>
                </div>

                {/* Next Birthday */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                    <h3 className="text-amber-800 font-bold flex items-center gap-2 mb-4">
                      <Clock size={18} />
                      Next Birthday
                    </h3>
                    <div className="text-3xl font-bold text-amber-600">
                      {result.nextBirthday.months} Months, {result.nextBirthday.days} Days
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <h3 className="text-gray-800 font-bold flex items-center gap-2 mb-4">
                      Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Total Months</div>
                        <div className="font-bold">{result.total.months.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Total Weeks</div>
                        <div className="font-bold">{result.total.weeks.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Days', value: result.total.days },
                    { label: 'Hours', value: result.total.hours },
                    { label: 'Minutes', value: result.total.minutes },
                    { label: 'Seconds', value: result.total.seconds }
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
                      <div className="text-gray-400 text-xs font-bold uppercase mb-1">{stat.label}</div>
                      <div className="text-lg font-bold text-gray-800">{stat.value.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
