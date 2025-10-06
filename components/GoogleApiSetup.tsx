import React from 'react';
import { KeyIcon } from './Icons';

interface GoogleApiSetupProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  clientId: string;
  onClientIdChange: (id: string) => void;
  onConnect: () => void;
  error: string | null;
}

const GoogleApiSetup: React.FC<GoogleApiSetupProps> = ({
  apiKey,
  onApiKeyChange,
  clientId,
  onClientIdChange,
  onConnect,
  error,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect();
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700 max-w-lg mx-auto">
      <div className="text-center">
        <KeyIcon className="mx-auto h-12 w-12 text-cyan-400" />
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
          Cấu hình Google Sheets
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          Vui lòng nhập API Key và Client ID của bạn để kết nối và xuất dữ liệu.
          Thông tin này sẽ được lưu trên trình duyệt của bạn.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="google-api-key" className="sr-only">
              Google API Key
            </label>
            <input
              id="google-api-key"
              name="apiKey"
              type="password"
              autoComplete="off"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-900 text-gray-100 placeholder-gray-500 rounded-t-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
              placeholder="Google API Key"
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="google-client-id" className="sr-only">
              Google Client ID
            </label>
            <input
              id="google-client-id"
              name="clientId"
              type="password"
              autoComplete="off"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-900 text-gray-100 placeholder-gray-500 rounded-b-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
              placeholder="Google Client ID"
              value={clientId}
              onChange={(e) => onClientIdChange(e.target.value)}
            />
          </div>
        </div>
        
        {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-3 py-2 rounded-md text-sm">
                {error}
            </div>
        )}

        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-colors"
          >
            Lưu & Kết nối
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoogleApiSetup;