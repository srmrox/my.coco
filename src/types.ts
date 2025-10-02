export interface Message {
  id: string;
  timestamp: Date;
  sender: string;
  content: string;
  length: number;
}

export interface Participant {
  name: string;
  messageCount: number;
  totalCharacters: number;
  avgMessageLength: number;
  firstMessage: Date;
  lastMessage: Date;
  hourlyActivity: Record<number, number>;
  dailyActivity: Record<string, number>;
  messages: Message[];
}

export interface PersonalityProfile {
  participant: Participant;
  traits: {
    communicationStyle: string;
    responseTime: string;
    engagement: string;
    expressiveness: string;
  };
  patterns: {
    messageFrequency: {
      daily: number;
      weekly: number;
      monthly: number;
    };
    timing: {
      mostActiveHour: number;
      mostActiveDay: string;
      peakActivityPeriod: string;
    };
    lengthStats: {
      min: number;
      max: number;
      avg: number;
      median: number;
    };
    sentiment: {
      positive: number;
      neutral: number;
      negative: number;
      overall: string;
    };
  };
  visualData: {
    hourlyActivity: Array<{ hour: number; count: number }>;
    dailyActivity: Array<{ date: string; count: number }>;
    messageLengthDistribution: Array<{ range: string; count: number }>;
  };
}

export interface ParsedData {
  participants: Map<string, Participant>;
  messages: Message[];
  errors: string[];
}
