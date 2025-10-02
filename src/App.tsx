import { useState } from 'react';
import { MessageCircle, AlertCircle } from 'lucide-react';
import FileUpload from './components/FileUpload';
import ParticipantList from './components/ParticipantList';
import PersonalityProfileView from './components/PersonalityProfileView';
import LoadingSkeleton from './components/LoadingSkeleton';
import { parseCSV, generatePersonalityProfile } from './utils';
import type { Participant, PersonalityProfile, ParsedData } from './types';

type View = 'upload' | 'participants' | 'profile';

function App() {
  const [view, setView] = useState<View>('upload');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<PersonalityProfile | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setWarnings([]);

    try {
      const data = await parseCSV(file);

      if (data.messages.length === 0) {
        setError('No valid messages found in the CSV file. Please check the format and try again.');
        setIsLoading(false);
        return;
      }

      if (data.errors.length > 0) {
        setWarnings(data.errors);
      }

      setParsedData(data);
      setView('participants');
    } catch (err) {
      setError('An unexpected error occurred while processing the file. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectParticipant = (participant: Participant) => {
    const profile = generatePersonalityProfile(participant);
    setSelectedProfile(profile);
    setView('profile');
  };

  const handleBack = () => {
    setSelectedProfile(null);
    setView('participants');
  };

  const handleReset = () => {
    setView('upload');
    setParsedData(null);
    setSelectedProfile(null);
    setError(null);
    setWarnings([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">my.coco</h1>
                <p className="text-sm text-gray-600">Message Analytics & Personality Insights</p>
              </div>
            </div>
            {view !== 'upload' && (
              <button
                onClick={handleReset}
                className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
              >
                Upload New File
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Warnings */}
        {warnings.length > 0 && view === 'participants' && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-800">
                  {warnings.length} Warning{warnings.length !== 1 ? 's' : ''}
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Some rows had issues but were skipped. Data was still processed successfully.
                </p>
                <details className="mt-2">
                  <summary className="text-sm text-yellow-700 cursor-pointer hover:text-yellow-800 font-medium">
                    Show details
                  </summary>
                  <ul className="mt-2 text-sm text-yellow-700 space-y-1 ml-4">
                    {warnings.slice(0, 10).map((warning, idx) => (
                      <li key={idx}>• {warning}</li>
                    ))}
                    {warnings.length > 10 && (
                      <li className="italic">... and {warnings.length - 10} more</li>
                    )}
                  </ul>
                </details>
              </div>
            </div>
          </div>
        )}

        {/* Views */}
        {view === 'upload' && (
          <FileUpload 
            onFileSelect={handleFileSelect} 
            isLoading={isLoading} 
            error={error}
          />
        )}

        {view === 'participants' && (
          <>
            {isLoading ? (
              <LoadingSkeleton />
            ) : parsedData ? (
              <ParticipantList
                participants={Array.from(parsedData.participants.values())}
                onSelectParticipant={handleSelectParticipant}
              />
            ) : null}
          </>
        )}

        {view === 'profile' && selectedProfile && (
          <PersonalityProfileView
            profile={selectedProfile}
            onBack={handleBack}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            Upload your CSV message logs to analyze communication patterns and generate AI-powered personality insights.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

