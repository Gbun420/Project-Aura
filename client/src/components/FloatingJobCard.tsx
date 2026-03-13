import { motion } from 'framer-motion';
import { MapPin, Briefcase, Clock, ArrowUpRight } from 'lucide-react';

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  sector: string;
  salary: string;
}

export const FloatingJobCard = ({ title, company, location, sector, salary }: JobCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="aura-glass p-6 group cursor-pointer hover:border-purple-500/50 transition-colors duration-300 shadow-[0_0_20px_rgba(123,44,191,0.05)] hover:shadow-[0_0_30px_rgba(123,44,191,0.2)]"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-purple-400 font-medium">{company}</p>
        </div>
        <div className="bg-white/5 p-2 rounded-lg group-hover:bg-purple-500/10 transition-colors duration-300">
          <ArrowUpRight className="text-gray-400 group-hover:text-purple-400 w-5 h-5" />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6">
        <div className="flex items-center gap-1.5">
          <MapPin size={16} className="text-cyan-400/70" />
          {location}
        </div>
        <div className="flex items-center gap-1.5">
          <Briefcase size={16} className="text-purple-400/70" />
          {sector}
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={16} className="text-gray-500" />
          Full-time
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-white/5">
        <span className="text-lg font-mono text-cyan-400">{salary}</span>
        <button className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 rounded-lg text-sm font-semibold transition-all duration-300 border border-purple-600/30">
          Quick Apply
        </button>
      </div>
    </motion.div>
  );
};
