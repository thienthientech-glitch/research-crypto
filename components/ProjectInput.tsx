
import React, { useState } from 'react';
import { SearchIcon } from './Icons';

interface ProjectInputProps {
  onAnalyze: (projectName: string, projectUrl: string) => void;
  isLoading: boolean;
}

const ProjectInput: React.FC<ProjectInputProps> = ({ onAnalyze, isLoading }) => {
  const [projectName, setProjectName] = useState('');
  const [projectUrl, setProjectUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(projectName, projectUrl);
    setProjectName('');
    setProjectUrl('');
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-300 mb-1">
            Tên dự án
          </label>
          <input
            type="text"
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Ví dụ: Ethereum"
            className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            required
          />
        </div>
        <div>
          <label htmlFor="projectUrl" className="block text-sm font-medium text-gray-300 mb-1">
            Link trang web chính thức
          </label>
          <input
            type="url"
            id="projectUrl"
            value={projectUrl}
            onChange={(e) => setProjectUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100"
        >
          {isLoading ? (
            'Đang phân tích...'
          ) : (
            <>
              <SearchIcon className="w-5 h-5 mr-2" />
              Phân tích dự án
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ProjectInput;
