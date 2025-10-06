// FIX: Add global declaration for gapi to avoid TypeScript errors.
declare global {
  interface Window {
    gapi: any;
  }
}

import React, { useState, useCallback, useEffect } from 'react';
import { CryptoProjectAnalysis } from './types';
import { analyzeCryptoProject } from './services/geminiService';

import Header from './components/Header';
import ProjectInput from './components/ProjectInput';
import ResultsTable from './components/ResultsTable';
import Loader from './components/Loader';
import GoogleApiSetup from './components/GoogleApiSetup';

const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

const App: React.FC = () => {
  const [analyses, setAnalyses] = useState<CryptoProjectAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // State for Google Sheets integration
  const [gapiReady, setGapiReady] = useState<boolean>(false);
  const [isGapiInitialized, setIsGapiInitialized] = useState<boolean>(false);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [sheetUrl, setSheetUrl] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportStatus, setExportStatus] = useState<string>('');
  
  // State for user-provided Google credentials
  const [googleApiKey, setGoogleApiKey] = useState<string>('');
  const [googleClientId, setGoogleClientId] = useState<string>('');


  useEffect(() => {
    // Load credentials from localStorage on initial load
    const storedApiKey = localStorage.getItem('googleApiKey');
    const storedClientId = localStorage.getItem('googleClientId');
    if (storedApiKey) setGoogleApiKey(storedApiKey);
    if (storedClientId) setGoogleClientId(storedClientId);

    if (window.gapi) {
        window.gapi.load('client:auth2', () => {
            setGapiReady(true);
        });
    } else {
        console.error("Google API script has not loaded yet.");
        setError("Không thể tải dịch vụ Google. Vui lòng làm mới trang.");
    }
  }, []);
  
  const handleInitializeGapi = () => {
    if (!googleApiKey || !googleClientId) {
      setError("Vui lòng nhập đầy đủ Google API Key và Client ID.");
      return;
    }
    setError(null);
    
    window.gapi.client.init({
      apiKey: googleApiKey,
      clientId: googleClientId,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    }).then(() => {
      // Persist credentials on successful initialization
      localStorage.setItem('googleApiKey', googleApiKey);
      localStorage.setItem('googleClientId', googleClientId);
      
      setIsGapiInitialized(true);
      const authInstance = window.gapi.auth2.getAuthInstance();
      authInstance.isSignedIn.listen(setIsSignedIn);
      setIsSignedIn(authInstance.isSignedIn.get());
    }).catch((err: any) => {
      console.error("Error initializing GAPI client", err);
      setError("Không thể kết nối. Vui lòng kiểm tra lại API Key và Client ID của bạn.");
      // Clear invalid keys from storage
      localStorage.removeItem('googleApiKey');
      localStorage.removeItem('googleClientId');
    });
  };


  const handleAuthClick = () => {
    if (window.gapi) {
      window.gapi.auth2.getAuthInstance().signIn();
    }
  };

  const handleSignoutClick = () => {
    if (window.gapi) {
      window.gapi.auth2.getAuthInstance().signOut();
    }
  };


  const handleAnalyzeProject = useCallback(async (projectName: string, projectUrl: string) => {
    if (!projectName.trim() || !projectUrl.trim()) {
      setError("Vui lòng nhập đầy đủ Tên và Link dự án.");
      return;
    }
    
    try {
      new URL(projectUrl);
    } catch (_) {
      setError("Link dự án không hợp lệ. Vui lòng kiểm tra lại.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeCryptoProject(projectName, projectUrl);
      setAnalyses(prev => [
        { ...result, id: prev.length + 1, originalName: projectName },
        ...prev
      ]);
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi khi phân tích dự án. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleExportToSheets = async () => {
    if (analyses.length === 0) {
      setExportStatus("Không có dữ liệu để xuất.");
      return;
    }

    const spreadsheetIdMatch = sheetUrl.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (!spreadsheetIdMatch) {
      setExportStatus("URL Google Sheet không hợp lệ.");
      return;
    }
    const spreadsheetId = spreadsheetIdMatch[1];

    setIsExporting(true);
    setExportStatus("Đang xuất dữ liệu...");

    try {
      const headers = [
        "STT", "Tên dự án", "Điểm mạnh", "Điểm yếu", 
        "Tiềm năng", "Rủi ro", "Nhà sáng lập và Đội ngũ", 
        "Tokenomics", "Công nghệ", "Cộng đồng"
      ];
      
      const dataToExport = analyses.map(item => [
        item.id, item.projectName, item.strengths, item.weaknesses,
        item.potential, item.risks, item.foundersAndTeam,
        item.tokenomics, item.technology, item.community
      ]).reverse(); // Export in the same order as displayed
      
      // Check if header exists
      const range = 'Sheet1!A1:J1';
      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      let valuesToAppend = dataToExport;
      // Prepend headers if the first row is empty
      if (!response.result.values || response.result.values.length === 0 || response.result.values[0].length === 0) {
        valuesToAppend.unshift(headers);
      }
      
      await window.gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Sheet1',
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: valuesToAppend
        },
      });

      setExportStatus(`Xuất thành công ${analyses.length} dự án!`);
      setAnalyses([]); // Clear analyses after successful export
    } catch (err: any) {
      console.error("Error exporting to Google Sheets:", err);
      setExportStatus(`Lỗi: ${err.result?.error?.message || 'Không thể ghi dữ liệu.'}`);
    } finally {
      setIsExporting(false);
    }
  };
  
  const renderContent = () => {
    if (!gapiReady) {
      return (
        <div className="text-center text-gray-400 py-10">
          Đang tải dịch vụ Google...
        </div>
      );
    }

    if (!isGapiInitialized) {
      return (
        <GoogleApiSetup 
          apiKey={googleApiKey}
          onApiKeyChange={setGoogleApiKey}
          clientId={googleClientId}
          onClientIdChange={setGoogleClientId}
          onConnect={handleInitializeGapi}
          error={error}
        />
      );
    }

    return (
      <>
        <p className="text-center text-lg text-gray-400 mb-8">
          Nhập thông tin dự án crypto để nhận phân tích chi tiết từ AI, giúp bạn đưa ra quyết định đầu tư sáng suốt.
        </p>
        <ProjectInput onAnalyze={handleAnalyzeProject} isLoading={isLoading} />

        {error && !isGapiInitialized && ( // Only show generic errors if gapi init fails
            <div className="mt-6 bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative" role="alert">
              <strong className="font-bold">Lỗi! </strong>
              <span className="block sm:inline">{error}</span>
            </div>
        )}

        {isLoading && <Loader />}
        
        <div className="mt-12">
          <ResultsTable 
            analyses={analyses}
            // Google Sheets props
            isSignedIn={isSignedIn}
            onAuthClick={handleAuthClick}
            onSignoutClick={handleSignoutClick}
            sheetUrl={sheetUrl}
            onSheetUrlChange={setSheetUrl}
            onExport={handleExportToSheets}
            isExporting={isExporting}
            exportStatus={exportStatus}
          />
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
           {renderContent()}
        </div>
      </main>
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Phân tích được cung cấp bởi AI và chỉ mang tính chất tham khảo.</p>
        <p>&copy; {new Date().getFullYear()} Crypto Project Analyzer. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;