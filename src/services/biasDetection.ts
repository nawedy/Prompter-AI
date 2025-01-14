interface BiasCheckResult {
  score: number;
  flags: string[];
  suggestions: string[];
}

export class BiasDetectionService {
  private static instance: BiasDetectionService;
  
  private constructor() {}

  static getInstance(): BiasDetectionService {
    if (!BiasDetectionService.instance) {
      BiasDetectionService.instance = new BiasDetectionService();
    }
    return BiasDetectionService.instance;
  }

  async checkBias(prompt: string): Promise<BiasCheckResult> {
    // Initialize with empty results
    const result: BiasCheckResult = {
      score: 0,
      flags: [],
      suggestions: [],
    };

    // Check for common bias patterns
    const biasPatterns = this.getBiasPatterns();
    let totalScore = 0;

    for (const pattern of biasPatterns) {
      if (pattern.regex.test(prompt.toLowerCase())) {
        result.flags.push(pattern.flag);
        result.suggestions.push(pattern.suggestion);
        totalScore += pattern.weight;
      }
    }

    // Normalize score between 0 and 1
    result.score = Math.min(totalScore / 10, 1);

    return result;
  }

  private getBiasPatterns() {
    return [
      {
        regex: /\b(he|him|his)\b/gi,
        flag: 'Gender Assumption',
        suggestion: 'Consider using gender-neutral pronouns (they/them)',
        weight: 0.2,
      },
      {
        regex: /\b(obviously|clearly|everyone knows)\b/gi,
        flag: 'Perspective Bias',
        suggestion: 'Avoid assuming universal knowledge or experience',
        weight: 0.3,
      },
      {
        regex: /\b(always|never|all|none)\b/gi,
        flag: 'Absolute Language',
        suggestion: 'Consider using more nuanced language',
        weight: 0.2,
      },
      {
        regex: /\b(old|young|elderly|aged)\b/gi,
        flag: 'Age Bias',
        suggestion: 'Be specific about age ranges when relevant',
        weight: 0.2,
      },
      {
        regex: /\b(crazy|insane|mental)\b/gi,
        flag: 'Ableist Language',
        suggestion: 'Use more precise and respectful terminology',
        weight: 0.4,
      },
      {
        regex: /\b(poor|rich|wealthy|destitute)\b/gi,
        flag: 'Socioeconomic Bias',
        suggestion: 'Consider economic diversity',
        weight: 0.3,
      },
    ];
  }
}

export const biasDetection = BiasDetectionService.getInstance();