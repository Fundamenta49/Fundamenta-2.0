import express from 'express';
import axios from 'axios';

const router = express.Router();

/**
 * Function to format search query based on category and content
 * @param q Original search query
 * @param category Content category
 * @returns Formatted query string
 */
function formatSearchQuery(q: string, category?: string): string {
  if (category === 'vehicle') {
    return `${q} vehicle maintenance tutorial step by step`;
  } else if (category === 'cooking') {
    return `${q} cooking recipe tutorial step by step homemade`;
  } else if (category === 'home-repair') {
    return `${q} home repair DIY guide tutorial step by step`;
  } else if (category === 'finance') {
    return `${q} personal finance education tutorial`;
  } else if (category === 'wellness') {
    return `${q} wellness health guide tutorial`;
  } else {
    // Default enhancement for search query
    return `${q} tutorial guide how-to step by step`;
  }
}

// Get YouTube videos with enhanced formatting for relevance
router.get('/search', async (req, res) => {
  try {
    const { q, category } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'YouTube API key is not configured' });
    }
    
    // Format the query based on category for improved relevance
    const formattedQuery = formatSearchQuery(q, category as string | undefined);
    
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        maxResults: 8, // Increased from 5 to provide more options
        q: formattedQuery,
        type: 'video',
        key: apiKey,
        relevanceLanguage: 'en',
        videoEmbeddable: true,
        videoDuration: 'medium', // Filter for medium length videos (4-20 minutes)
        videoDefinition: 'high', // Prefer high definition videos
      }
    });
    
    // Extract the most relevant information
    const videos = response.data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: `https://img.youtube.com/vi/${item.id.videoId}/maxresdefault.jpg`,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt
    }));
    
    res.json({ videos });
  } catch (error) {
    console.error('YouTube API error:', error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json({ 
        error: `YouTube API error: ${error.response.data.error?.message || 'Unknown error'}` 
      });
    } else {
      res.status(500).json({ error: 'Failed to fetch videos from YouTube' });
    }
  }
});

// General YouTube search endpoint (without /api/youtube prefix)
export const youtubeSearchHandler = async (req: express.Request, res: express.Response) => {
  try {
    const { q, category } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'YouTube API key is not configured' });
    }
    
    // Format the query based on category for improved relevance
    const formattedQuery = formatSearchQuery(q, category as string | undefined);
    
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        maxResults: 8, // Increased from 5 to provide more options
        q: formattedQuery,
        type: 'video',
        key: apiKey,
        relevanceLanguage: 'en',
        videoEmbeddable: true,
        videoDuration: 'medium', // Filter for medium length videos (4-20 minutes)
        videoDefinition: 'high', // Prefer high definition videos
      }
    });
    
    // Return the raw items to maintain compatibility with existing components
    res.json({ items: response.data.items });
  } catch (error) {
    console.error('YouTube API error:', error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json({ 
        error: `YouTube API error: ${error.response.data.error?.message || 'Unknown error'}` 
      });
    } else {
      res.status(500).json({ error: 'Failed to fetch videos from YouTube' });
    }
  }
};

export default router;