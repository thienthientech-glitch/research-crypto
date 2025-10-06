import React, { useState } from 'react';
import { KeyIcon } from './Icons';

interface GoogleApiSetupProps {
  geminiApiKey: string;
  onGeminiApiKeyChange: (key: string) => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  clientId: string;
  onClientIdChange: (id: string) => void;
  onConnect: () => void;
  error: string | null;
}

const GoogleApiSetup: React.FC<GoogleApiSetupProps> = ({
  geminiApiKey,
  onGeminiApiKeyChange,
  apiKey,
  onApiKeyChange,
  clientId,
  onClientIdChange,
  onConnect,
  error,
}) => {
  const [copied, setCopied] = useState(false);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const handleCopyOrigin = () => {
    if (origin) {
      navigator.clipboard.writeText(origin).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      }).catch(err => {
        console.error('Failed to copy origin', err);
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect();
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700 max-w-lg mx-auto">
      <div className="text-center">
        <KeyIcon className="mx-auto h-12 w-12 text-cyan-400" />
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
          Cấu hình API
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          Vui lòng nhập các khóa API để phân tích dự án và xuất dữ liệu.
          Thông tin này sẽ được lưu trên trình duyệt của bạn.
        </p>
      </div>

      <div className="mt-6 p-4 bg-gray-900/50 border border-gray-700 rounded-md">
        <h3 className="text-base font-semibold text-white mb-2">Bước cấu hình quan trọng (cho Google Sheets)</h3>
        <p className="text-sm text-gray-400 mb-3">
          Sao chép URL dưới đây và dán vào mục <strong className="text-cyan-400">'Authorized JavaScript origins'</strong> trong trang cấu hình Google Cloud OAuth 2.0 Client ID của bạn.
        </p>
        <div className="flex items-center space-x-2 bg-gray-900 p-2 rounded-md border border-gray-600">
            <input 
                type="text"
                readOnly
                value={origin}
                className="flex-grow bg-transparent text-gray-200 text-sm focus:outline-none"
                aria-label="Application Origin URL"
                onFocus={(e) => e.target.select()}
            />
            <button
                type="button"
                onClick={handleCopyOrigin}
                className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 text-xs font-semibold rounded-md transition-colors w-20 text-center"
                title="Copy to clipboard"
            >
                {copied ? 'Đã chép!' : 'Sao chép'}
            </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
            Nếu không thực hiện bước này, bạn sẽ gặp lỗi khi kết nối Google Sheets.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="gemini-api-key" className="sr-only">
              Gemini API Key
            </label>
            <input
              id="gemini-api-key"
              name="geminiApiKey"
              type="password"
              autoComplete="off"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-900 text-gray-100 placeholder-gray-500 rounded-t-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
              placeholder="Gemini API Key (dùng để phân tích)"
              value={geminiApiKey}
              onChange={(e) => onGeminiApiKeyChange(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="google-api-key" className="sr-only">
              Google Sheets API Key
            </label>
            <input
              id="google-api-key"
              name="apiKey"
              type="password"
              autoComplete="off"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-900 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
              placeholder="Google Sheets API Key"
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