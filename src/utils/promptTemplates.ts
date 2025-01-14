import { AIToolType } from '../types';

interface PromptTemplate {
  structure: string;
  tips: string[];
  examples: string[];
}

export const promptTemplates: Record<AIToolType, PromptTemplate> = {
  'text-to-image': {
    structure: 'Subject, Action/Pose, Setting, Lighting, Style, Camera Angle, Additional Details',
    tips: [
      'Be specific about the main subject',
      'Describe the atmosphere and mood',
      'Include lighting details',
      'Specify artistic style',
      'Add camera perspective'
    ],
    examples: [
      'A majestic red dragon perched on a crystal mountain peak, breathing fire into the sunset sky, painted in watercolor style, dramatic lighting, low-angle shot',
      'Cyberpunk city street at night, neon lights reflecting in puddles, dense fog, blade runner style, cinematic wide shot'
    ]
  },
  'image-enhancement': {
    structure: 'Enhancement Type, Style Reference, Specific Adjustments, Quality Parameters',
    tips: [
      'Specify the type of enhancement needed',
      'Reference specific styles or looks',
      'Include technical parameters',
      'Mention preservation requirements'
    ],
    examples: [
      'Enhance portrait photo with soft, natural skin tones, maintain detail in highlights, cinematic color grading',
      'Upscale and restore vintage photograph, preserve grain texture, enhance contrast, maintain period authenticity'
    ]
  },
  'text-to-video': {
    structure: 'Scene Description, Movement/Action, Duration, Style, Transitions',
    tips: [
      'Break down scene by scene',
      'Describe camera movements',
      'Specify timing and pacing',
      'Include audio suggestions'
    ],
    examples: [
      'Create a 15-second video of autumn leaves falling in slow motion, gentle camera pan upward, soft focus, peaceful ambient music',
      'Dynamic product showcase of a smartphone, 360-degree rotation, close-up of features, modern tech style'
    ]
  },
  'image-to-video': {
    structure: 'Source Image Description, Desired Motion, Duration, Style, Effects',
    tips: [
      'Describe the starting image clearly',
      'Specify desired movements',
      'Include transition effects',
      'Mention style consistency'
    ],
    examples: [
      'Animate portrait photo with subtle smile development, gentle head turn, maintain photorealistic quality',
      'Transform landscape photo into flowing timelapse, clouds moving, water rippling, cinematic grade'
    ]
  },
  'video-to-video': {
    structure: 'Source Video Description, Desired Changes, Style Transfer, Effects',
    tips: [
      'Describe source video content',
      'Specify style changes',
      'Include technical requirements',
      'Mention preservation needs'
    ],
    examples: [
      'Convert casual vlog to cinematic style, add film grain, adjust color grade to teal and orange, maintain audio clarity',
      'Transform daytime footage to night scene, add realistic lighting, maintain smooth motion'
    ]
  },
  'text-completion': {
    structure: 'Context, Tone, Length, Format, Specific Requirements',
    tips: [
      'Provide clear context',
      'Specify desired tone',
      'Include format requirements',
      'Mention key points to cover'
    ],
    examples: [
      'Write a professional email response declining a business proposal, maintain politeness, suggest future collaboration',
      'Create a product description for a luxury watch, emphasize craftsmanship, include technical specs'
    ]
  },
  'code-generation': {
    structure: 'Language, Framework, Functionality, Requirements, Constraints',
    tips: [
      'Specify programming language',
      'Include framework version',
      'Describe expected behavior',
      'Mention performance requirements'
    ],
    examples: [
      'Create a React custom hook for handling form validation, TypeScript support, error handling included',
      'Generate an API endpoint for user authentication, include rate limiting, security best practices'
    ]
  }
};