import { ArrowLeft, User, MessageSquare, Clock, TrendingUp, BarChart3, Activity, Sparkles } from 'lucide-react';
import type { PersonalityProfile } from '../types';
import { formatDate, formatNumber } from '../utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface PersonalityProfileViewProps {
  profile: PersonalityProfile;
  onBack: () => void;
}

export default function PersonalityProfileView({ profile, onBack }: PersonalityProfileViewProps) {
  const { participant, traits, patterns, visualData } = profile;

  const sentimentData = [
    { name: 'Positive', value: patterns.sentiment.positive, color: '#84cc16' },
    { name: 'Neutral', value: patterns.sentiment.neutral, color: '#94a3b8' },
    { name: 'Negative', value: patterns.sentiment.negative, color: '#ef4444' },
  ].filter(item => item.value > 0);

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Participants</span>
        </button>
        
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 text-white shadow-lg">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{participant.name}</h1>
              <p className="text-primary-100">Personality Profile & Communication Analysis</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <MessageSquare className="w-5 h-5" />
                <span className="text-sm opacity-90">Messages</span>
              </div>
              <p className="text-2xl font-bold">{formatNumber(participant.messageCount)}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm opacity-90">Avg Length</span>
              </div>
              <p className="text-2xl font-bold">{Math.round(participant.avgMessageLength)}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Clock className="w-5 h-5" />
                <span className="text-sm opacity-90">Active Days</span>
              </div>
              <p className="text-2xl font-bold">
                {Math.ceil((participant.lastMessage.getTime() - participant.firstMessage.getTime()) / (1000 * 60 * 60 * 24))}
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Activity className="w-5 h-5" />
                <span className="text-sm opacity-90">Per Day</span>
              </div>
              <p className="text-2xl font-bold">{formatNumber(patterns.messageFrequency.daily)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Personality Traits */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-6 h-6 text-accent-600" />
          <h2 className="text-2xl font-bold text-gray-900">Personality Traits</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Communication Style</h3>
            <p className="text-gray-700">{traits.communicationStyle}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Response Pattern</h3>
            <p className="text-gray-700">{traits.responseTime}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Engagement Level</h3>
            <p className="text-gray-700">{traits.engagement}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Expressiveness</h3>
            <p className="text-gray-700">{traits.expressiveness}</p>
          </div>
        </div>
      </div>

      {/* Communication Patterns */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">Communication Patterns</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Timing Patterns */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Timing Patterns</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Most Active Hour:</span>
                <span className="font-semibold">{patterns.timing.mostActiveHour.toString().padStart(2, '0')}:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Peak Period:</span>
                <span className="font-semibold">{patterns.timing.peakActivityPeriod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Most Active Day:</span>
                <span className="font-semibold">{formatDate(new Date(patterns.timing.mostActiveDay))}</span>
              </div>
            </div>
          </div>

          {/* Message Frequency */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Message Frequency</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Average:</span>
                <span className="font-semibold">{formatNumber(patterns.messageFrequency.daily)} messages</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weekly Average:</span>
                <span className="font-semibold">{formatNumber(patterns.messageFrequency.weekly)} messages</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Average:</span>
                <span className="font-semibold">{formatNumber(patterns.messageFrequency.monthly)} messages</span>
              </div>
            </div>
          </div>

          {/* Length Statistics */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Message Length Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Shortest:</span>
                <span className="font-semibold">{patterns.lengthStats.min} characters</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Longest:</span>
                <span className="font-semibold">{patterns.lengthStats.max} characters</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average:</span>
                <span className="font-semibold">{Math.round(patterns.lengthStats.avg)} characters</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Median:</span>
                <span className="font-semibold">{patterns.lengthStats.median} characters</span>
              </div>
            </div>
          </div>

          {/* Sentiment */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Sentiment Analysis</h3>
            <p className="text-sm text-gray-700 mb-3">{patterns.sentiment.overall}</p>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Positive</span>
                  <span className="font-semibold">{patterns.sentiment.positive}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-accent-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${patterns.sentiment.positive}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Neutral</span>
                  <span className="font-semibold">{patterns.sentiment.neutral}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gray-400 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${patterns.sentiment.neutral}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Negative</span>
                  <span className="font-semibold">{patterns.sentiment.negative}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-secondary-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${patterns.sentiment.negative}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Hourly Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Activity by Hour</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={visualData.hourlyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Message Length Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Message Length Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={visualData.messageLengthDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#84cc16" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Activity Trend */}
        {visualData.dailyActivity.length > 1 && (
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h3 className="font-semibold text-gray-900 mb-4">Activity Trend (Last 30 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={visualData.dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                />
                <Line type="monotone" dataKey="count" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Sentiment Pie Chart */}
        {sentimentData.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Sentiment Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
