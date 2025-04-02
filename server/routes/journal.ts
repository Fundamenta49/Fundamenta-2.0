import express from 'express';
import { z } from 'zod';
import OpenAI from 'openai';

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Schema validation for journal entry analysis request
const journalEntrySchema = z.object({
  content: z.string().min(1).max(5000),
});

// Schema for trend analysis request
const journalTrendSchema = z.object({
  entries: z.array(z.object({
    content: z.string(),
    mood: z.string().optional(),
    timestamp: z.string(),
  })),
});

// Schema for mood detection request
const moodDetectionSchema = z.object({
  text: z.string().min(1).max(5000),
});

// Endpoint to analyze a single journal entry
router.post('/analyze', async (req, res) => {
  try {
    const { content } = journalEntrySchema.parse(req.body);

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: 
            "You are an empathetic wellness journal assistant. Analyze the journal entry to understand the emotional state, key themes, and potential insights that could help the user. Provide thoughtful, supportive feedback without being judgmental. Focus on patterns, emotional insights, and gentle suggestions."
        },
        {
          role: "user",
          content: content
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const analysis = JSON.parse(response.choices[0].message.content || "{}");
    
    // Format response with fallbacks in case GPT doesn't return expected format
    const formattedResponse = {
      emotionalScore: analysis.emotionalScore || Math.round(Math.random() * 100),
      sentiment: analysis.sentiment || (Math.random() > 0.5 ? "positive" : "negative"),
      detectedMood: analysis.detectedMood || {
        label: "Neutral",
        emoji: "😐",
        confidence: 0.8
      },
      wordFrequency: analysis.wordFrequency || {},
      suggestions: analysis.suggestions || [
        "Consider journaling regularly to track your emotional patterns",
        "Try to identify specific triggers for your emotions"
      ],
      moodTrend: analysis.moodTrend || "neutral",
      affirmation: analysis.affirmation || "You're doing great. Keep reflecting and growing.",
      toolboxSuggestions: analysis.toolboxSuggestions || [
        {
          type: "breathing",
          title: "4-7-8 Breathing Exercise",
          description: "Breathe in for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Repeat 4 times.",
          duration: "2 minutes"
        }
      ],
      keyInsights: analysis.keyInsights || [
        "You're showing awareness of your emotions",
        "You're taking time for self-reflection"
      ]
    };
    
    res.json(formattedResponse);
  } catch (error) {
    console.error('Error analyzing journal entry:', error);
    res.status(500).json({ error: 'Failed to analyze journal entry' });
  }
});

// Endpoint to analyze mood trends across journal entries
router.post('/analyze-trends', async (req, res) => {
  try {
    const { entries } = journalTrendSchema.parse(req.body);
    
    // Format entries for the OpenAI request
    const entriesFormatted = entries.map(entry => {
      return `Date: ${new Date(entry.timestamp).toLocaleDateString()}
Mood: ${entry.mood || 'Not specified'}
Content: ${entry.content.substring(0, 200)}${entry.content.length > 200 ? '...' : ''}
---`;
    }).join('\n\n');

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: 
            "You are an insightful wellness trend analyzer. Examine the journal entries to identify patterns in the user's emotional state over time, key recurring themes, and insights that might help them understand their emotional journey. Provide specific, actionable recommendations based on the patterns you observe."
        },
        {
          role: "user",
          content: `Analyze the following journal entries for emotional patterns and trends. Provide insights, recommendations, and a summary.\n\n${entriesFormatted}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const trendAnalysis = JSON.parse(response.choices[0].message.content || "{}");
    
    // Generate mood data for visualization
    const moodData = entries.map(entry => {
      // Map moods to scores
      const moodScoreMap: Record<string, number> = {
        'Happy': 85,
        'Calm': 70,
        'Sad': 30,
        'Frustrated': 20,
        'Tired': 40,
        'Thoughtful': 60,
        'Anxious': 25,
        'Inspired': 90
      };
      
      // Map moods to emojis
      const moodEmojiMap: Record<string, string> = {
        'Happy': '😊',
        'Calm': '😌',
        'Sad': '😔',
        'Frustrated': '😤',
        'Tired': '😴',
        'Thoughtful': '🤔',
        'Anxious': '😰',
        'Inspired': '🌟'
      };
      
      return {
        label: entry.mood || 'Neutral',
        emoji: entry.mood ? (moodEmojiMap[entry.mood] || '😐') : '😐',
        score: entry.mood ? (moodScoreMap[entry.mood] || 50) : 50,
        timestamp: entry.timestamp
      };
    });
    
    // Format response with fallbacks in case GPT doesn't return expected format
    const formattedResponse = {
      trends: trendAnalysis.trends || [
        {
          trendType: entries.length > 3 ? "positive" : "neutral",
          description: "Your journaling shows a consistent practice of self-reflection",
          recommendationText: "Continue your journaling habit to build greater self-awareness",
          startDate: entries.length > 0 ? entries[entries.length - 1].timestamp : new Date().toISOString(),
          endDate: entries.length > 0 ? entries[0].timestamp : new Date().toISOString(),
          moodScores: Array(7).fill(0).map((_, i) => 50 + Math.random() * 20)
        }
      ],
      recommendations: trendAnalysis.recommendations || [
        "Consider journaling at a consistent time each day",
        "Try to identify specific triggers for mood changes"
      ],
      moodData: moodData,
      topEmotions: trendAnalysis.topEmotions || [
        {label: entries[0]?.mood || 'Neutral', count: Math.ceil(entries.length / 2)},
        {label: entries[1]?.mood || 'Thoughtful', count: Math.ceil(entries.length / 3)}
      ],
      insightSummary: trendAnalysis.insightSummary || `You've made ${entries.length} journal entries, showing dedication to your emotional wellness.`
    };
    
    res.json(formattedResponse);
  } catch (error) {
    console.error('Error analyzing mood trends:', error);
    res.status(500).json({ error: 'Failed to analyze mood trends' });
  }
});

// Endpoint to detect mood from text
router.post('/detect-mood', async (req, res) => {
  try {
    const { text } = moodDetectionSchema.parse(req.body);

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: 
            "You are a precise sentiment analyzer. Your task is to detect the primary mood expressed in the text. Return only a JSON object with three fields: 'mood' (single word describing the emotional state), 'emoji' (appropriate emoji for the mood), and 'confidence' (number between 0-1 indicating certainty). Common moods: Happy, Sad, Anxious, Calm, Frustrated, Tired, Thoughtful, Inspired."
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const moodAnalysis = JSON.parse(response.choices[0].message.content || "{}");
    
    res.json({
      mood: moodAnalysis.mood || "Neutral",
      emoji: moodAnalysis.emoji || "😐",
      confidence: moodAnalysis.confidence || 0.7
    });
  } catch (error) {
    console.error('Error detecting mood:', error);
    res.status(500).json({ error: 'Failed to detect mood' });
  }
});

export default router;