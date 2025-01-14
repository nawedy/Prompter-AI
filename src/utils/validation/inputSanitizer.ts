export const sanitizeInput = {
  text: (input: string): string => {
    return input
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove potential script injection
      .replace(/data:/gi, '') // Remove data URLs
      .replace(/\bon\w+\s*=/gi, '') // Remove event handlers
      .trim();
  },

  email: (email: string): string => {
    return email.toLowerCase().trim();
  },

  filename: (filename: string): string => {
    return filename
      .replace(/[^a-zA-Z0-9-_\.]/g, '-')
      .replace(/\.{2,}/g, '.')
      .toLowerCase();
  }
};