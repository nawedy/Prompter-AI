import { z } from 'zod';
import { ValidationError } from '../../utils/errors';
import { appLogger } from '../../utils/logger';

export class InputValidation {
  async validate(req: Request): Promise<void> {
    const contentType = req.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      await this.validateJson(req);
    } else if (contentType?.includes('multipart/form-data')) {
      await this.validateFormData(req);
    }
  }

  private async validateJson(req: Request): Promise<void> {
    try {
      const body = await req.json();
      
      // Basic sanitization
      this.sanitizeObject(body);

      // Validate against schema based on endpoint
      const url = new URL(req.url);
      const schema = this.getSchemaForEndpoint(url.pathname);
      if (schema) {
        await schema.parseAsync(body);
      }
    } catch (error) {
      appLogger.warn('Input validation failed', { error });
      throw new ValidationError('Invalid input data', error);
    }
  }

  private async validateFormData(req: Request): Promise<void> {
    try {
      const formData = await req.formData();
      
      // Validate file uploads
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          await this.validateFile(value);
        } else {
          this.sanitizeValue(value);
        }
      }
    } catch (error) {
      appLogger.warn('Form data validation failed', { error });
      throw new ValidationError('Invalid form data', error);
    }
  }

  private sanitizeObject(obj: any): void {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = this.sanitizeValue(obj[key]);
      } else if (typeof obj[key] === 'object') {
        this.sanitizeObject(obj[key]);
      }
    }
  }

  private sanitizeValue(value: string): string {
    return value
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove potential script injection
      .trim();
  }

  private async validateFile(file: File): Promise<void> {
    // Implement file validation (type, size, etc.)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new ValidationError('File too large', new Error('Max file size exceeded'));
    }
  }

  private getSchemaForEndpoint(pathname: string): z.Schema | null {
    // Implement schema mapping based on endpoint
    return null;
  }
}