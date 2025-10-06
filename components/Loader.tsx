
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500"></div>
      <p className="ml-4 text-lg text-cyan-400">AI đang thực hiện phân tích...</p>
    </div>
  );
};

export default Loader;
