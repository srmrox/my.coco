import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  error: string | null;
}

export default function FileUpload({ onFileSelect, isLoading, error }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFileName(file.name);
        onFileSelect(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFileName(file.name);
      onFileSelect(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-12 text-center
          transition-all duration-200 ease-in-out
          ${isDragging 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-primary-400 bg-white'
          }
          ${isLoading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        `}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          disabled={isLoading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id="file-upload"
        />
        
        <div className="flex flex-col items-center space-y-4">
          {selectedFileName ? (
            <FileText className="w-16 h-16 text-primary-500" />
          ) : (
            <Upload className="w-16 h-16 text-gray-400" />
          )}
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-700">
              {selectedFileName ? selectedFileName : 'Upload CSV File'}
            </h3>
            <p className="text-sm text-gray-500">
              {isLoading 
                ? 'Processing your file...' 
                : 'Drag and drop your message log CSV here, or click to browse'
              }
            </p>
          </div>

          {!isLoading && (
            <button
              type="button"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Select File
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-secondary-50 border border-secondary-200 rounded-lg flex items-start space-x-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-secondary-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-secondary-800">Error</h4>
            <p className="text-sm text-secondary-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Required CSV Format:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Headers: <code className="bg-blue-100 px-2 py-1 rounded">timestamp</code>, <code className="bg-blue-100 px-2 py-1 rounded">sender</code>, <code className="bg-blue-100 px-2 py-1 rounded">message</code></li>
          <li>• Timestamp format: ISO 8601 (e.g., 2024-01-15T14:30:00)</li>
          <li>• Each row represents one message</li>
        </ul>
      </div>
    </div>
  );
}
