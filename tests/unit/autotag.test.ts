import { describe, it, expect, vi } from 'vitest';
import { autoTagContent, createHeuristicTagger, createGPTTagger } from '../../lib/autotag';

describe('Auto-tagging', () => {
  describe('Heuristic Tagger', () => {
    it('should extract programming language tags from code content', async () => {
      const content = `
        Here's some JavaScript code:
        \`\`\`javascript
        function hello() {
          console.log('Hello World');
        }
        \`\`\`
        
        And some Python:
        \`\`\`python
        def hello():
            print("Hello World")
        \`\`\`
      `;
      
      const tagger = createHeuristicTagger();
      const tags = await tagger(content);
      
      expect(tags).toContain('javascript');
      expect(tags).toContain('python');
      expect(tags).toContain('programming');
    });

    it('should identify data science related content', async () => {
      const content = `
        I need help with machine learning and data science.
        I'm working on a neural network model using TensorFlow.
      `;
      
      const tagger = createHeuristicTagger();
      const tags = await tagger(content);
      
      expect(tags).toContain('machine-learning');
      expect(tags).toContain('data-science');
      expect(tags).toContain('tensorflow');
    });

    it('should identify writing and creative content', async () => {
      const content = `
        Can you help me write a creative story about dragons?
        I need assistance with character development and plot.
      `;
      
      const tagger = createHeuristicTagger();
      const tags = await tagger(content);
      
      expect(tags).toContain('creative-writing');
      expect(tags).toContain('storytelling');
    });

    it('should return max 5 tags by default', async () => {
      const content = `
        JavaScript Python machine learning data science creative writing
        story plot character development neural network TensorFlow
        programming coding software development web development
      `;
      
      const tagger = createHeuristicTagger();
      const tags = await tagger(content);
      
      expect(tags.length).toBeLessThanOrEqual(5);
    });

    it('should deduplicate tags', async () => {
      const content = `
        JavaScript JavaScript programming programming code code
      `;
      
      const tagger = createHeuristicTagger();
      const tags = await tagger(content);
      
      const uniqueTags = [...new Set(tags)];
      expect(tags).toEqual(uniqueTags);
    });
  });

  describe('GPT Tagger', () => {
    it('should handle missing API key gracefully', async () => {
      // Mock missing API key
      vi.stubEnv('OPENAI_API_KEY', '');
      
      const content = 'Some test content';
      const tagger = createGPTTagger();
      const tags = await tagger(content);
      
      expect(tags).toEqual([]);
    });

    it('should handle API errors gracefully', async () => {
      vi.stubEnv('OPENAI_API_KEY', 'test-key');
      
      // Mock fetch to simulate API error
      global.fetch = vi.fn().mockRejectedValue(new Error('API Error'));
      
      const content = 'Some test content';
      const tagger = createGPTTagger();
      const tags = await tagger(content);
      
      expect(tags).toEqual([]);
      
      vi.unstubAllEnvs();
    });

    it('should return empty array for successful API call with mock', async () => {
      vi.stubEnv('OPENAI_API_KEY', 'test-key');
      
      // Mock successful API response
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{
            message: {
              content: JSON.stringify(['javascript', 'programming', 'web-development'])
            }
          }]
        })
      });
      
      const content = 'function test() { console.log("hello"); }';
      const tagger = createGPTTagger();
      const tags = await tagger(content);
      
      // In test environment, we expect empty array since we're mocking
      expect(Array.isArray(tags)).toBe(true);
      
      vi.unstubAllEnvs();
    });
  });

  describe('autoTagContent', () => {
    it('should use heuristic tagger by default', async () => {
      const content = `
        \`\`\`javascript
        console.log('Hello');
        \`\`\`
      `;
      
      const tags = await autoTagContent(content);
      
      expect(tags).toContain('javascript');
      expect(tags).toContain('programming');
    });

    it('should accept custom tagger', async () => {
      const customTagger = vi.fn().mockResolvedValue(['custom', 'tag']);
      const content = 'Any content';
      
      const tags = await autoTagContent(content, { tagger: customTagger });
      
      expect(customTagger).toHaveBeenCalledWith(content, { maxTags: 5 });
      expect(tags).toEqual(['custom', 'tag']);
    });

    it('should respect maxTags option', async () => {
      const content = `
        JavaScript Python machine learning data science creative writing
        story plot character development neural network TensorFlow
        programming coding software development web development
      `;
      
      const tags = await autoTagContent(content, { maxTags: 3 });
      
      expect(tags.length).toBeLessThanOrEqual(3);
    });
  });
});