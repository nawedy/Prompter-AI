import { AIToolType } from '../types';
import { promptTemplates } from './promptTemplates';

export function generatePrompt(toolType: AIToolType, description: string): string {
  const template = promptTemplates[toolType];
  
  switch (toolType) {
    case 'text-to-image':
      return generateImagePrompt(description);
    case 'text-to-video':
      return generateVideoPrompt(description);
    case 'code-generation':
      return generateCodePrompt(description);
    case 'text-completion':
      return generateTextPrompt(description);
    default:
      return generateGenericPrompt(description, toolType);
  }
}

function generateImagePrompt(description: string): string {
  const aspects = {
    subject: extractKeyPhrase(description, ['a', 'the', 'of', 'in', 'on'], 3),
    style: extractArtStyle(description),
    mood: extractMood(description),
    lighting: extractLighting(description),
    composition: extractComposition(description),
    details: extractDetails(description)
  };

  return `Create an image of ${aspects.subject}${aspects.style ? `, in ${aspects.style} style` : ''}${
    aspects.mood ? `, with ${aspects.mood} mood` : ''}${
    aspects.lighting ? `, ${aspects.lighting} lighting` : ''}${
    aspects.composition ? `, ${aspects.composition}` : ''}${
    aspects.details ? `. Additional details: ${aspects.details}` : ''}.`;
}

function generateVideoPrompt(description: string): string {
  const aspects = {
    scene: extractKeyPhrase(description, ['a', 'the', 'of', 'in', 'on'], 4),
    movement: extractMovement(description),
    duration: extractDuration(description),
    transition: extractTransition(description),
    atmosphere: extractMood(description)
  };

  return `Create a video sequence showing ${aspects.scene}${
    aspects.movement ? ` with ${aspects.movement}` : ''}${
    aspects.duration ? `, lasting ${aspects.duration}` : ', lasting 15 seconds'}${
    aspects.transition ? `, using ${aspects.transition} transitions` : ''}${
    aspects.atmosphere ? `, capturing a ${aspects.atmosphere} atmosphere` : ''}.`;
}

function generateCodePrompt(description: string): string {
  const aspects = {
    language: extractProgrammingLanguage(description),
    framework: extractFramework(description),
    functionality: extractKeyPhrase(description, ['create', 'make', 'build', 'develop'], 5),
    requirements: extractRequirements(description)
  };

  return `Create a ${aspects.language}${aspects.framework ? ` ${aspects.framework}` : ''} implementation that ${aspects.functionality}${
    aspects.requirements ? `. Requirements: ${aspects.requirements}` : ''}.
Include error handling, type safety, and follow best practices.`;
}

function generateTextPrompt(description: string): string {
  const aspects = {
    type: extractTextType(description),
    tone: extractTone(description),
    content: extractKeyPhrase(description, ['about', 'regarding', 'concerning', 'on'], 4),
    length: extractLength(description)
  };

  return `Write a ${aspects.type || 'text'} ${aspects.tone ? `in a ${aspects.tone} tone ` : ''}about ${aspects.content}${
    aspects.length ? `. Length: ${aspects.length}` : ''}.`;
}

function generateGenericPrompt(description: string, toolType: AIToolType): string {
  const template = promptTemplates[toolType];
  const structurePoints = template.structure.split(', ');
  
  return `Using ${toolType.split('-').join(' ')}, create: ${description}
Following this structure:
${structurePoints.map(point => `- ${point}`).join('\n')}`;
}

// Helper functions
function extractKeyPhrase(text: string, stopWords: string[], wordCount: number): string {
  const words = text.toLowerCase().split(' ')
    .filter(word => !stopWords.includes(word));
  return words.slice(0, wordCount).join(' ');
}

function extractArtStyle(text: string): string {
  const styles = ['watercolor', 'oil painting', 'digital art', 'photorealistic', 'sketch', 'anime', 'cartoon', 'abstract'];
  return findMatch(text, styles);
}

function extractMood(text: string): string {
  const moods = ['peaceful', 'dramatic', 'mysterious', 'energetic', 'melancholic', 'joyful', 'serene'];
  return findMatch(text, moods);
}

function extractLighting(text: string): string {
  const lighting = ['natural', 'dramatic', 'soft', 'harsh', 'backlit', 'ambient', 'studio'];
  return findMatch(text, lighting);
}

function extractComposition(text: string): string {
  const compositions = ['close-up', 'wide shot', 'aerial view', 'portrait', 'landscape', 'macro'];
  return findMatch(text, compositions);
}

function extractMovement(text: string): string {
  const movements = ['pan', 'zoom', 'tracking shot', 'dolly', 'crane shot', 'steady cam'];
  return findMatch(text, movements);
}

function extractTransition(text: string): string {
  const transitions = ['fade', 'dissolve', 'cut', 'wipe', 'morph', 'cross fade'];
  return findMatch(text, transitions);
}

function extractProgrammingLanguage(text: string): string {
  const languages = ['JavaScript', 'Python', 'TypeScript', 'Java', 'C++', 'Ruby', 'Go'];
  return findMatch(text, languages) || 'JavaScript';
}

function extractFramework(text: string): string {
  const frameworks = ['React', 'Vue', 'Angular', 'Next.js', 'Express', 'Django', 'Spring'];
  return findMatch(text, frameworks);
}

function extractRequirements(text: string): string {
  const requirements = text.toLowerCase().includes('requirements') 
    ? text.split('requirements:')[1]?.trim() 
    : '';
  return requirements || '';
}

function extractTextType(text: string): string {
  const types = ['article', 'blog post', 'email', 'report', 'story', 'description'];
  return findMatch(text, types);
}

function extractTone(text: string): string {
  const tones = ['professional', 'casual', 'formal', 'friendly', 'technical', 'persuasive'];
  return findMatch(text, tones);
}

function extractLength(text: string): string {
  const lengthMatch = text.match(/(\d+)\s*(words?|sentences?|paragraphs?)/i);
  return lengthMatch ? lengthMatch[0] : '';
}

function extractDetails(text: string): string {
  const detailsMatch = text.match(/(?:with|including|featuring)\s+([^.]+)/i);
  return detailsMatch ? detailsMatch[1] : '';
}

function findMatch(text: string, possibilities: string[]): string {
  const lowerText = text.toLowerCase();
  return possibilities.find(item => lowerText.includes(item.toLowerCase())) || '';
}