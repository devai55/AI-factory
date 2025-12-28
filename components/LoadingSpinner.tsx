
import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center p-8">
    <div className="w-12 h-12 border-4 border-slate-300 dark:border-slate-600 border-t-slate-600 dark:border-t-slate-300 rounded-full animate-spin"></div>
  </div>
);

export default LoadingSpinner;
