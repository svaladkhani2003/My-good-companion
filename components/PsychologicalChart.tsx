
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PsychologicalChartProps {
  data: { time: string; value: number }[];
  label: string;
}

const PsychologicalChart: React.FC<PsychologicalChartProps> = ({ data, label }) => {
  return (
    <div className="w-full h-32 bg-background-dark/50 rounded-xl p-2 border border-slate-800">
      <div className="flex justify-between items-center mb-1 px-2">
         <span className="text-[10px] text-slate-400 font-bold">{label}</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
          <defs>
            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#135bec" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#135bec" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '10px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#135bec" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorVal)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PsychologicalChart;
