# Developer Guide

## Project Structure
```
src/
  ├── components/     # Reusable UI components
  ├── db/            # Database operations with libSQL
  ├── hooks/         # Custom React hooks
  ├── pages/         # Page components
  ├── services/      # Business logic
  ├── store/         # State management
  ├── utils/         # Utility functions
  └── types/         # TypeScript definitions
```

## Setup
1. Clone repository
2. Install dependencies
3. Configure environment variables
4. Initialize libSQL database
5. Run migrations
6. Start development server

## Database Setup
```bash
# Initialize database
npm run db:migrate

# Validate schema
npm run db:validate
```

## Development Guidelines
- Use TypeScript for type safety
- Follow React best practices
- Write unit tests for new features
- Use Tailwind for styling
- Document API changes

## Testing
- Unit tests with Vitest
- Integration tests for critical paths
- End-to-end testing with Playwright
- Performance testing benchmarks

## Deployment
- Automated CI/CD pipeline
- Environment-specific configurations
- Monitoring and logging setup