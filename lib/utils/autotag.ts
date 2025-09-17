/**
 * Auto-tagging library with pluggable backends
 * Supports both heuristic-based and GPT-based tagging
 */

export interface TaggingOptions {
  maxTags?: number;
}

export interface TaggerFunction {
  (content: string, options?: TaggingOptions): Promise<string[]>;
}

export interface AutoTagOptions extends TaggingOptions {
  tagger?: TaggerFunction;
}

/**
 * Main auto-tagging function with default heuristic backend
 */
export async function autoTagContent(
  content: string,
  options: AutoTagOptions = {}
): Promise<string[]> {
  const { tagger = createHeuristicTagger(), maxTags = 5 } = options;
  return tagger(content, { maxTags });
}

/**
 * Creates a heuristic-based tagger that uses keyword matching and patterns
 */
export function createHeuristicTagger(): TaggerFunction {
  return async (content: string, options: TaggingOptions = {}) => {
    const { maxTags = 5 } = options;
    const tags = new Set<string>();
    const normalizedContent = content.toLowerCase();

    // Programming language detection from code blocks
    const codeBlockRegex = /```(\w+)/g;
    let match;
    while ((match = codeBlockRegex.exec(content)) !== null) {
      const lang = match[1].toLowerCase();
      tags.add(lang);
      if (['javascript', 'js', 'typescript', 'ts'].includes(lang)) {
        tags.add('javascript');
        tags.add('programming');
      } else if (['python', 'py'].includes(lang)) {
        tags.add('python');
        tags.add('programming');
      } else if (['java', 'c', 'cpp', 'c++', 'go', 'rust', 'swift'].includes(lang)) {
        tags.add('programming');
      }
    }

    // Data science keywords
    const dataSciencePatterns = [
      /machine learning/i,
      /data science/i,
      /neural network/i,
      /deep learning/i,
      /tensorflow/i,
      /pytorch/i,
      /pandas/i,
      /numpy/i,
      /scikit-learn/i,
      /data analysis/i,
      /artificial intelligence/i,
      /ai model/i,
    ];

    dataSciencePatterns.forEach(pattern => {
      if (pattern.test(content)) {
        if (/machine learning/i.test(content)) tags.add('machine-learning');
        if (/data science/i.test(content)) tags.add('data-science');
        if (/tensorflow/i.test(content)) tags.add('tensorflow');
        if (/neural network/i.test(content)) tags.add('neural-networks');
        if (/deep learning/i.test(content)) tags.add('deep-learning');
        if (/data analysis/i.test(content)) tags.add('data-analysis');
      }
    });

    // Creative writing patterns
    const writingPatterns = [
      /creative writing/i,
      /story/i,
      /character development/i,
      /plot/i,
      /narrative/i,
      /fiction/i,
      /novel/i,
      /screenplay/i,
      /dialogue/i,
    ];

    writingPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        tags.add('creative-writing');
        if (pattern.source.includes('story')) tags.add('storytelling');
        if (pattern.source.includes('character')) tags.add('character-development');
        if (pattern.source.includes('plot')) tags.add('plot-development');
      }
    });

    // Web development patterns
    const webDevPatterns = [
      /web development/i,
      /frontend/i,
      /backend/i,
      /react/i,
      /vue/i,
      /angular/i,
      /node\.?js/i,
      /express/i,
      /html/i,
      /css/i,
    ];

    webDevPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        tags.add('web-development');
        if (pattern.source.includes('react')) tags.add('react');
        if (pattern.source.includes('frontend')) tags.add('frontend');
        if (pattern.source.includes('backend')) tags.add('backend');
      }
    });

    // General programming keywords
    if (normalizedContent.includes('code') || 
        normalizedContent.includes('function') || 
        normalizedContent.includes('programming') ||
        normalizedContent.includes('software')) {
      tags.add('programming');
    }

    // Business and productivity
    const businessPatterns = [
      /business/i,
      /marketing/i,
      /strategy/i,
      /project management/i,
      /productivity/i,
      /automation/i,
    ];

    businessPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        if (pattern.source.includes('business')) tags.add('business');
        if (pattern.source.includes('marketing')) tags.add('marketing');
        if (pattern.source.includes('strategy')) tags.add('strategy');
        if (pattern.source.includes('project management')) tags.add('project-management');
        if (pattern.source.includes('productivity')) tags.add('productivity');
      }
    });

    // Education and learning
    if (normalizedContent.includes('learn') || 
        normalizedContent.includes('tutorial') || 
        normalizedContent.includes('explain')) {
      tags.add('learning');
    }

    // Convert to array, limit results, and return
    const tagArray = Array.from(tags).slice(0, maxTags);
    return tagArray;
  };
}

/**
 * Creates a GPT-based tagger that uses OpenAI API for intelligent tagging
 */
export function createGPTTagger(): TaggerFunction {
  return async (content: string, options: TaggingOptions = {}) => {
    const { maxTags = 5 } = options;
    
    // Check if API key is available
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn('OpenAI API key not found, falling back to empty tags');
      return [];
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a helpful assistant that generates tags for content. Return only a JSON array of ${maxTags} relevant tags (strings) based on the content. Tags should be lowercase, kebab-case, and represent the main topics, technologies, or themes discussed.`
            },
            {
              role: 'user',
              content: `Generate tags for this content:\n\n${content.substring(0, 2000)}`
            }
          ],
          max_tokens: 200,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const tagsText = data.choices?.[0]?.message?.content;
      
      if (!tagsText) {
        return [];
      }

      // Try to parse JSON response
      try {
        const tags = JSON.parse(tagsText);
        if (Array.isArray(tags)) {
          return tags.slice(0, maxTags).filter(tag => typeof tag === 'string');
        }
      } catch {
        // If JSON parsing fails, extract tags from text
        const extractedTags = tagsText
          .split(/[,\n]/)
          .map((tag: string) => tag.trim().toLowerCase().replace(/[^a-z0-9-]/g, ''))
          .filter((tag: string) => tag.length > 0)
          .slice(0, maxTags);
        
        return extractedTags;
      }

      return [];
    } catch (error) {
      console.error('Error calling OpenAI API for tagging:', error);
      return [];
    }
  };
}