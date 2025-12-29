
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PsychologicalDataPoint {
  time: string;
  stress: number;
  anxiety: number;
  energy: number;
}

interface PsychologicalChartProps {
  data: PsychologicalDataPoint[];
}

type Metric = 'stress' | 'anxiety' | 'energy';

const PsychologicalChart: React.FC<PsychologicalChartProps> = ({ data }) => {
  const [selectedMetric, setSelectedMetric] = useState<Metric>('stress');

  const metrics: { id: Metric; label: string; color: string }[] = [
    { id: 'stress', label: 'تنش', color: '#ef4444' },
    { id: 'anxiety', label: 'اضطراب', color: '#8b5cf6' },
    { id: 'energy', label: 'انرژی', color: '#10b981' },
  ];

  const currentMetric = metrics.find(m => m.id === selectedMetric)!;

  return (
    <div className="w-full bg-background-dark/50 rounded-2xl p-3 border border-slate-800 transition-all">
      <div className="flex justify-between items-center mb-4 px-1">
        <div className="flex gap-1.5">
          {metrics.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMetric(m.id)}
              className={`px-3 py-1 rounded-full text-[9px] font-bold transition-all active:scale-90 border ${
                selectedMetric === m.id
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <span className="text-[10px] text-slate-500 font-medium">پایش لحظه‌ای</span>
      </div>
      
      <div className="h-28 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: -40, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #334155', 
                borderRadius: '12px', 
                fontSize: '10px',
                textAlign: 'right'
              }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
              cursor={{ stroke: '#334155', strokeWidth: 1 }}
            />
            <Area 
              type="monotone" 
              dataKey={selectedMetric} 
              stroke={currentMetric.color} 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#colorMetric)" 
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PsychologicalChart;
