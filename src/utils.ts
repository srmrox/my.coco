import Papa from 'papaparse';
import type { Message, Participant, ParsedData, PersonalityProfile } from './types';

export function parseCSV(file: File): Promise<ParsedData> {
  return new Promise((resolve) => {
    const errors: string[] = [];
    const messages: Message[] = [];
    const seenIds = new Set<string>();

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (!results.data || results.data.length === 0) {
          errors.push('CSV file is empty or has no valid data');
          resolve({ participants: new Map(), messages: [], errors });
          return;
        }

        // Check for required fields
        const firstRow = results.data[0] as any;
        const requiredFields = ['timestamp', 'sender', 'message'];
        const missingFields = requiredFields.filter(field => !(field in firstRow));
        
        if (missingFields.length > 0) {
          errors.push(`Missing required fields: ${missingFields.join(', ')}`);
        }

        results.data.forEach((row: any, index: number) => {
          try {
            // Handle missing or invalid fields
            if (!row.sender || !row.message || !row.timestamp) {
              if (row.sender || row.message || row.timestamp) {
                errors.push(`Row ${index + 1}: Missing required fields`);
              }
              return;
            }

            // Parse timestamp
            let timestamp: Date;
            try {
              timestamp = new Date(row.timestamp);
              if (isNaN(timestamp.getTime())) {
                throw new Error('Invalid date');
              }
            } catch {
              errors.push(`Row ${index + 1}: Invalid timestamp format`);
              return;
            }

            // Create unique ID
            const id = `${row.sender}-${timestamp.getTime()}-${row.message.substring(0, 20)}`;
            
            // Check for duplicates
            if (seenIds.has(id)) {
              errors.push(`Row ${index + 1}: Duplicate message detected`);
              return;
            }
            seenIds.add(id);

            const message: Message = {
              id,
              timestamp,
              sender: row.sender.trim(),
              content: row.message.trim(),
              length: row.message.trim().length,
            };

            messages.push(message);
          } catch (error) {
            errors.push(`Row ${index + 1}: Error processing row - ${error}`);
          }
        });

        const participants = aggregateParticipants(messages);
        resolve({ participants, messages, errors });
      },
      error: (error) => {
        errors.push(`Failed to parse CSV: ${error.message}`);
        resolve({ participants: new Map(), messages: [], errors });
      },
    });
  });
}

function aggregateParticipants(messages: Message[]): Map<string, Participant> {
  const participantMap = new Map<string, Participant>();

  messages.forEach((message) => {
    if (!participantMap.has(message.sender)) {
      participantMap.set(message.sender, {
        name: message.sender,
        messageCount: 0,
        totalCharacters: 0,
        avgMessageLength: 0,
        firstMessage: message.timestamp,
        lastMessage: message.timestamp,
        hourlyActivity: {},
        dailyActivity: {},
        messages: [],
      });
    }

    const participant = participantMap.get(message.sender)!;
    participant.messageCount++;
    participant.totalCharacters += message.length;
    participant.messages.push(message);

    if (message.timestamp < participant.firstMessage) {
      participant.firstMessage = message.timestamp;
    }
    if (message.timestamp > participant.lastMessage) {
      participant.lastMessage = message.timestamp;
    }

    // Track hourly activity
    const hour = message.timestamp.getHours();
    participant.hourlyActivity[hour] = (participant.hourlyActivity[hour] || 0) + 1;

    // Track daily activity
    const dateKey = message.timestamp.toISOString().split('T')[0];
    participant.dailyActivity[dateKey] = (participant.dailyActivity[dateKey] || 0) + 1;
  });

  // Calculate averages
  participantMap.forEach((participant) => {
    participant.avgMessageLength = participant.totalCharacters / participant.messageCount;
  });

  return participantMap;
}

export function generatePersonalityProfile(participant: Participant): PersonalityProfile {
  // Analyze communication style
  const avgLength = participant.avgMessageLength;
  let communicationStyle = 'Balanced';
  if (avgLength < 30) {
    communicationStyle = 'Concise - Prefers brief, to-the-point messages';
  } else if (avgLength > 100) {
    communicationStyle = 'Detailed - Tends to write longer, elaborate messages';
  } else {
    communicationStyle = 'Balanced - Uses medium-length messages';
  }

  // Analyze timing patterns
  const hourlyEntries = Object.entries(participant.hourlyActivity);
  const mostActiveHour = hourlyEntries.reduce((max, entry) => 
    entry[1] > max[1] ? entry : max, ['0', 0]
  );

  const dailyEntries = Object.entries(participant.dailyActivity);
  const mostActiveDay = dailyEntries.reduce((max, entry) => 
    entry[1] > max[1] ? entry : max, ['', 0]
  )[0];

  let peakActivityPeriod = 'Morning';
  const hour = parseInt(mostActiveHour[0]);
  if (hour >= 12 && hour < 17) {
    peakActivityPeriod = 'Afternoon';
  } else if (hour >= 17 && hour < 21) {
    peakActivityPeriod = 'Evening';
  } else if (hour >= 21 || hour < 6) {
    peakActivityPeriod = 'Night';
  }

  // Calculate response time (simplified)
  let responseTime = 'Regular';
  const totalDays = (participant.lastMessage.getTime() - participant.firstMessage.getTime()) / (1000 * 60 * 60 * 24);
  const messagesPerDay = participant.messageCount / Math.max(totalDays, 1);
  if (messagesPerDay > 50) {
    responseTime = 'Very Active - Responds frequently throughout the day';
  } else if (messagesPerDay > 20) {
    responseTime = 'Active - Regular responder';
  } else if (messagesPerDay > 5) {
    responseTime = 'Moderate - Responds periodically';
  } else {
    responseTime = 'Occasional - Less frequent responder';
  }

  // Analyze engagement
  let engagement = 'Moderate';
  if (participant.messageCount > 1000) {
    engagement = 'High - Very engaged participant';
  } else if (participant.messageCount > 500) {
    engagement = 'Above Average - Actively engaged';
  } else if (participant.messageCount > 100) {
    engagement = 'Moderate - Regular participant';
  } else {
    engagement = 'Low - Occasional participant';
  }

  // Analyze expressiveness (based on punctuation and special characters)
  const expressiveChars = participant.messages.filter(m => 
    /[!?😀😂😊😍🎉]/.test(m.content)
  ).length;
  const expressivenessRatio = expressiveChars / participant.messageCount;
  
  let expressiveness = 'Neutral';
  if (expressivenessRatio > 0.3) {
    expressiveness = 'Expressive - Uses emojis and punctuation frequently';
  } else if (expressivenessRatio > 0.1) {
    expressiveness = 'Moderately Expressive - Occasional use of emojis';
  } else {
    expressiveness = 'Reserved - Straightforward communication style';
  }

  // Simple sentiment analysis
  const positiveWords = ['good', 'great', 'awesome', 'love', 'happy', 'thanks', 'thank', 'yes', 'nice', 'perfect'];
  const negativeWords = ['bad', 'hate', 'no', 'not', 'never', 'problem', 'issue', 'wrong', 'error', 'fail'];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  participant.messages.forEach(msg => {
    const lower = msg.content.toLowerCase();
    positiveWords.forEach(word => {
      if (lower.includes(word)) positiveCount++;
    });
    negativeWords.forEach(word => {
      if (lower.includes(word)) negativeCount++;
    });
  });

  const totalSentiment = positiveCount + negativeCount;
  const positivePercent = totalSentiment > 0 ? (positiveCount / totalSentiment) * 100 : 50;
  const negativePercent = totalSentiment > 0 ? (negativeCount / totalSentiment) * 100 : 50;
  const neutralPercent = 100 - positivePercent - negativePercent;

  let overallSentiment = 'Neutral';
  if (positivePercent > 60) {
    overallSentiment = 'Positive - Generally upbeat tone';
  } else if (negativePercent > 40) {
    overallSentiment = 'Critical - More analytical or problem-focused';
  } else {
    overallSentiment = 'Neutral - Balanced tone';
  }

  // Calculate length statistics
  const lengths = participant.messages.map(m => m.length).sort((a, b) => a - b);
  const median = lengths[Math.floor(lengths.length / 2)];

  // Prepare visual data
  const hourlyActivity = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    count: participant.hourlyActivity[i] || 0,
  }));

  const dailyActivity = Object.entries(participant.dailyActivity)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30); // Last 30 days

  // Message length distribution
  const lengthRanges = [
    { range: '0-20', min: 0, max: 20 },
    { range: '21-50', min: 21, max: 50 },
    { range: '51-100', min: 51, max: 100 },
    { range: '101-200', min: 101, max: 200 },
    { range: '200+', min: 201, max: Infinity },
  ];

  const messageLengthDistribution = lengthRanges.map(({ range, min, max }) => ({
    range,
    count: lengths.filter(l => l >= min && l <= max).length,
  }));

  return {
    participant,
    traits: {
      communicationStyle,
      responseTime,
      engagement,
      expressiveness,
    },
    patterns: {
      messageFrequency: {
        daily: messagesPerDay,
        weekly: messagesPerDay * 7,
        monthly: messagesPerDay * 30,
      },
      timing: {
        mostActiveHour: parseInt(mostActiveHour[0]),
        mostActiveDay,
        peakActivityPeriod,
      },
      lengthStats: {
        min: Math.min(...lengths),
        max: Math.max(...lengths),
        avg: avgLength,
        median,
      },
      sentiment: {
        positive: Math.round(positivePercent),
        neutral: Math.round(neutralPercent),
        negative: Math.round(negativePercent),
        overall: overallSentiment,
      },
    },
    visualData: {
      hourlyActivity,
      dailyActivity,
      messageLengthDistribution,
    },
  };
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(num));
}
