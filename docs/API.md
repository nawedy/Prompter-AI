# API Documentation

## Authentication
All API endpoints require authentication unless specified otherwise.

### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
x-csrf-token: <token>
```

### Rate Limits
- 100 requests per 15 minutes
- 10 concurrent requests
- Endpoints return 429 status when limit exceeded

### Error Responses
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {} // Optional additional information
  }
}
```

## Security Headers
All responses include:
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

## Input Validation
All request bodies are validated against Zod schemas:
- Required fields must be present
- Strings are trimmed and sanitized
- Numbers are range checked
- Dates must be valid ISO 8601