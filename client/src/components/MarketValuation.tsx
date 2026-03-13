import { motion } from 'framer-motion';

interface MarketValuationProps {
  valueData: {
    annual: number;
    monthly: number;
    percentile: number;
    trend: string;
  };
}

export const MarketValuation = ({ valueData }: MarketValuationProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 backdrop-blur-xl relative overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.1)]"
    >
      {/* Dynamic Background Pulse */}
      <motion.div 
        animate={{ opacity: [0.05, 0.1, 0.05] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute inset-0 bg-cyan-500/5"
      />

      <div className="flex justify-between items-start relative z-10">
        <h4 className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.3em] font-black">
          MARKET_VALUE_PULSE
        </h4>
        <span className="bg-cyan-500/20 text-cyan-400 text-[8px] font-black px-2 py-1 rounded-full animate-pulse tracking-widest">
          LIVE_DATA
        </span>
      </div>

      <div className="mt-6 relative z-10">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-light text-white tracking-tighter italic">€{valueData.monthly.toLocaleString()}</span>
          <span className="text-slate-500 font-mono text-xs ml-1 uppercase tracking-widest">/ Month</span>
        </div>
        <p className="text-[9px] text-cyan-400/60 font-mono mt-1 tracking-widest uppercase">Trend: {valueData.trend}_NODE_SCARCITY</p>
      </div>

      <div className="mt-8 space-y-3 relative z-10">
        <div className="flex justify-between text-[9px] font-mono text-slate-400 tracking-widest uppercase">
          <span>Market_Position</span>
          <span className="text-white font-black">TOP_{100 - valueData.percentile}%</span>
        </div>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${valueData.percentile}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_#22d3ee]"
          />
        </div>
      </div>

      <button className="w-full mt-8 py-3 bg-cyan-500/5 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-black rounded-xl text-[9px] font-black tracking-[0.2em] uppercase transition-all">
        Overclock Reputation
      </button>
    </motion.div>
  );
};
