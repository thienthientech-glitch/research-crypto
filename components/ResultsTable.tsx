import React from 'react';
import type { CryptoProjectAnalysis } from '../types';
import { DownloadIcon, GoogleIcon, SignOutIcon } from './Icons';

interface ResultsTableProps {
  analyses: CryptoProjectAnalysis[];
  // Google Sheets props
  isSignedIn: boolean;
  onAuthClick: () => void;
  onSignoutClick: () => void;
  sheetUrl: string;
  onSheetUrlChange: (url: string) => void;
  onExport: () => void;
  isExporting: boolean;
  exportStatus: string;
}

const ExportControls: React.FC<Omit<ResultsTableProps, 'analyses'>> = ({
  isSignedIn,
  onAuthClick,
  onSignoutClick,
  sheetUrl,
  onSheetUrlChange,
  onExport,
  isExporting,
  exportStatus,
}) => {

  if (!isSignedIn) {
    return (
      <div className="text-center">
        <p className="mb-4 text-gray-300">Kết nối với tài khoản Google để xuất dữ liệu vào Sheets.</p>
        <button
          onClick={onAuthClick}
          className="inline-flex items-center bg-white hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-md shadow-sm transition duration-300"
        >
          <GoogleIcon className="w-5 h-5 mr-3" />
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
       <div className="flex items-center justify-between">
        <p className="text-sm text-green-400">Đã kết nối với Google.</p>
        <button onClick={onSignoutClick} className="flex items-center text-xs text-gray-400 hover:text-white transition">
          <SignOutIcon className="w-4 h-4 mr-1" />
          Đăng xuất
        </button>
      </div>
      <div>
        <label htmlFor="sheetUrl" className="block text-sm font-medium text-gray-300 mb-1">
          URL của Google Sheet
        </label>
        <input
          type="url"
          id="sheetUrl"
          value={sheetUrl}
          onChange={(e) => onSheetUrlChange(e.target.value)}
          placeholder="Dán link trang tính của bạn vào đây"
          className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
          required
        />
      </div>
      <button
        onClick={onExport}
        disabled={isExporting || !sheetUrl}
        className="w-full flex justify-center items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        <DownloadIcon className="w-5 h-5 mr-2" />
        {isExporting ? 'Đang xuất...' : 'Export to Google Sheets'}
      </button>
      {exportStatus && (
        <p className={`text-center text-sm ${exportStatus.startsWith('Lỗi') ? 'text-red-400' : 'text-green-400'}`}>
          {exportStatus}
        </p>
      )}
    </div>
  );
};


const ResultsTable: React.FC<ResultsTableProps> = (props) => {
  const { analyses } = props;

  if (analyses.length === 0) {
    return (
      <div className="text-center py-10 px-6 bg-gray-800/50 border border-dashed border-gray-700 rounded-xl">
        <h3 className="text-xl font-semibold text-white">Chưa có phân tích nào</h3>
        <p className="mt-2 text-gray-400">Bắt đầu bằng cách nhập thông tin dự án ở trên.</p>
        <div className="mt-8 pt-8 border-t border-gray-700">
           <ExportControls {...props} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Kết quả phân tích</h2>
        <ExportControls {...props} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-cyan-300 uppercase bg-gray-700/50">
            <tr>
              <th scope="col" className="px-6 py-3">STT</th>
              <th scope="col" className="px-6 py-3">Tên dự án</th>
              <th scope="col" className="px-6 py-3">Điểm mạnh</th>
              <th scope="col" className="px-6 py-3">Điểm yếu</th>
              <th scope="col" className="px-6 py-3">Tiềm năng</th>
              <th scope="col" className="px-6 py-3">Rủi ro</th>
              <th scope="col" className="px-6 py-3">Đội ngũ</th>
              <th scope="col" className="px-6 py-3">Tokenomics</th>
              <th scope="col" className="px-6 py-3">Công nghệ</th>
              <th scope="col" className="px-6 py-3">Cộng đồng</th>
            </tr>
          </thead>
          <tbody>
            {analyses.map((item) => (
              <tr key={item.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/60 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{item.id}</td>
                <td className="px-6 py-4 font-semibold text-cyan-400">{item.projectName}</td>
                <td className="px-6 py-4">{item.strengths}</td>
                <td className="px-6 py-4">{item.weaknesses}</td>
                <td className="px-6 py-4">{item.potential}</td>
                <td className="px-6 py-4">{item.risks}</td>
                <td className="px-6 py-4">{item.foundersAndTeam}</td>
                <td className="px-6 py-4">{item.tokenomics}</td>
                <td className="px-6 py-4">{item.technology}</td>
                <td className="px-6 py-4">{item.community}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;