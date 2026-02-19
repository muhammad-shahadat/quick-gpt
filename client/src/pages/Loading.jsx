import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#ededed] dark:bg-[#1a1a1a] z-[9999]">
      {/*glass morphism*/}
      <div className="relative flex flex-col items-center p-10 rounded-3xl bg-white/5 dark:bg-white/5 backdrop-blur-sm shadow-2xl border border-white/10">
        
        <div className="relative">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          {/*glow effect*/}
          <div className="absolute inset-0 w-12 h-12 text-indigo-500 blur-xl opacity-50 animate-pulse">
             <Loader2 />
          </div>
        </div>

        
        <div className="mt-6 flex flex-col items-center gap-2">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
            Setting up your workspace
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
            Please wait a moment
          </p>
        </div>

        
        <div className="flex gap-1.5 mt-4">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;