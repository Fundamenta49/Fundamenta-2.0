export interface MoodData {
  emoji: string;
  score: number;
  label: string;
  timestamp: string;
}

export interface JournalAnalysis {
  emotionalScore: number;
  sentiment: string;
  detectedMood: {
    label: string;
    emoji: string;
    confidence: number;
  };
  wordFrequency: Record<string, number>;
  suggestions: string[];
  moodTrend: string;
  affirmation?: string;
  toolboxSuggestions?: ToolboxSuggestion[];
  keyInsights?: string[];
}

export interface ToolboxSuggestion {
  type: 'breathing' | 'meditation' | 'exercise' | 'gratitude' | 'checklist' | 'distraction';
  title: string;
  description: string;
  duration?: string;
}

export interface WellnessTrend {
  trendType: 'positive' | 'negative' | 'neutral';
  description: string;
  recommendationText: string;
  startDate: string;
  endDate: string;
  moodScores: number[];
}

// Function to detect mood from journal text using AI
export async function analyzeJournalEntry(content: string): Promise<JournalAnalysis> {
  try {
    const response = await fetch('/api/journal/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content })
    });

    if (!response.ok) {
      throw new Error('Failed to analyze journal entry');
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing journal entry:', error);
    
    // Fallback analysis when API is not available (for development)
    const emotionalScore = Math.random() * 100;
    const sentiment = emotionalScore > 70 ? 'positive' : emotionalScore > 40 ? 'neutral' : 'negative';
    
    return {
      emotionalScore,
      sentiment,
      detectedMood: {
        label: sentiment === 'positive' ? 'Happy' : sentiment === 'neutral' ? 'Calm' : 'Sad',
        emoji: sentiment === 'positive' ? '😊' : sentiment === 'neutral' ? '😌' : '😔',
        confidence: 0.7
      },
      wordFrequency: {},
      suggestions: [
        'Remember to take care of your mental health',
        'Consider journaling regularly to track your emotions'
      ],
      moodTrend: 'neutral',
      affirmation: 'You are doing your best, and that is enough.',
      toolboxSuggestions: [{
        type: 'breathing',
        title: '4-7-8 Breathing Exercise',
        description: 'Breathe in for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Repeat 4 times.',
        duration: '2 minutes'
      }],
      keyInsights: ['Your journal shows self-reflection', 'You recognize your own emotions well']
    };
  }
}

// Function to analyze mood trends over time
export async function analyzeMoodTrends(entries: Array<{ content: string, mood?: string, timestamp: string }>): Promise<{
  trends: WellnessTrend[];
  recommendations: string[];
  moodData: MoodData[];
  topEmotions: {label: string, count: number}[];
  insightSummary: string;
}> {
  try {
    const response = await fetch('/api/journal/analyze-trends', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entries })
    });

    if (!response.ok) {
      throw new Error('Failed to analyze mood trends');
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing mood trends:', error);
    
    // Create fallback data for development
    const moodMap: Record<string, {emoji: string, score: number}> = {
      'Happy': {emoji: '😊', score: 85},
      'Calm': {emoji: '😌', score: 70},
      'Sad': {emoji: '😔', score: 30},
      'Frustrated': {emoji: '😤', score: 20},
      'Tired': {emoji: '😴', score: 40},
      'Thoughtful': {emoji: '🤔', score: 60},
      'Anxious': {emoji: '😰', score: 25},
      'Inspired': {emoji: '🌟', score: 90}
    };
    
    // Generate mood data
    const moodData = entries.map((entry) => {
      let mood = entry.mood || 'Neutral';
      if (!moodMap[mood]) {
        const moods = Object.keys(moodMap);
        mood = moods[Math.floor(Math.random() * moods.length)];
      }
      
      return {
        emoji: moodMap[mood]?.emoji || '😐',
        score: moodMap[mood]?.score || Math.floor(Math.random() * 100),
        label: mood,
        timestamp: entry.timestamp
      };
    });
    
    // Generate fallback trend data
    const fallbackData = {
      trends: [
        {
          trendType: 'positive' as const,
          description: 'Your mood appears to be improving over the past week',
          recommendationText: 'Continue your current wellness practices',
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString(),
          moodScores: [60, 65, 70, 68, 75, 80, 82]
        }
      ],
      recommendations: [
        'Regular journaling is helping track your emotional patterns',
        'Consider adding a short meditation practice to your routine',
        'Your sleep patterns may be affecting your mood'
      ],
      moodData: moodData,
      topEmotions: [
        {label: 'Happy', count: Math.floor(Math.random() * 10) + 1},
        {label: 'Calm', count: Math.floor(Math.random() * 8) + 1},
        {label: 'Anxious', count: Math.floor(Math.random() * 5) + 1}
      ],
      insightSummary: 'Your journal entries show a pattern of reflection and growth. You have had 4 positive entries this week!'
    };
    
    return fallbackData;
  }
}

// Function to detect mood from text during entry (before submission)
export async function detectMoodFromText(text: string): Promise<{
  mood: string;
  emoji: string;
  confidence: number;
}> {
  try {
    const response = await fetch('/api/journal/detect-mood', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error('Failed to detect mood from text');
    }

    return await response.json();
  } catch (error) {
    console.error('Error detecting mood:', error);
    
    // Fallback mood detection (for development)
    const moods = [
      {mood: 'Happy', emoji: '😊'},
      {mood: 'Calm', emoji: '😌'},
      {mood: 'Sad', emoji: '😔'},
      {mood: 'Anxious', emoji: '😰'},
      {mood: 'Thoughtful', emoji: '🤔'}
    ];
    
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    
    return {
      mood: randomMood.mood,
      emoji: randomMood.emoji,
      confidence: 0.65 + Math.random() * 0.2
    };
  }
}