import { User, MessageSquare, Calendar, TrendingUp } from 'lucide-react';
import type { Participant } from '../types';
import { formatDate, formatNumber } from '../utils';

interface ParticipantListProps {
  participants: Participant[];
  onSelectParticipant: (participant: Participant) => void;
}

export default function ParticipantList({ participants, onSelectParticipant }: ParticipantListProps) {
  const sortedParticipants = [...participants].sort((a, b) => b.messageCount - a.messageCount);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Participants</h2>
        <p className="text-gray-600">
          {participants.length} participant{participants.length !== 1 ? 's' : ''} found. Click on any to view their personality profile.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedParticipants.map((participant) => (
          <button
            key={participant.name}
            onClick={() => onSelectParticipant(participant)}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 p-6 text-left border border-gray-200 hover:border-primary-500 hover:scale-105 transform"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 truncate max-w-[150px]">
                    {participant.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    View Profile
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <MessageSquare className="w-4 h-4 text-primary-600" />
                <span className="text-gray-700">
                  <strong>{formatNumber(participant.messageCount)}</strong> messages
                </span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <TrendingUp className="w-4 h-4 text-accent-600" />
                <span className="text-gray-700">
                  Avg <strong>{Math.round(participant.avgMessageLength)}</strong> chars/msg
                </span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="w-4 h-4 text-secondary-600" />
                <span className="text-gray-700">
                  {formatDate(participant.firstMessage)} - {formatDate(participant.lastMessage)}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Most Active Hour</span>
                <span className="font-semibold text-gray-700">
                  {Object.entries(participant.hourlyActivity).reduce((max, entry) => 
                    entry[1] > max[1] ? entry : max, ['0', 0]
                  )[0].padStart(2, '0')}:00
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
