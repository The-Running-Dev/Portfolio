Create a modular Express.js API server with the following requirements:

1. Data Structure:
- Place JSON data files in a dedicated `/data` directory
- Follow a consistent naming convention: `<resource>.json`
- Each JSON file represents an API resource/endpoint

2. Core Features:
- Auto-generate RESTful routes based on JSON files in /data
- Implement CRUD operations for each resource
- Support filtering, pagination, and sorting
- Handle nested JSON structures
- Validate request payloads against JSON schema

3. Security:
- Implement API key authentication middleware
- Store API keys securely in environment variables
- Rate limiting per API key
- Basic request validation and sanitization

4. Architecture:
- Use dependency injection with a container (e.g., awilix)
- Implement repository pattern for data access
- Separate concerns: routing, middleware, services, config
- Follow SOLID principles
- Include error handling middleware
- Add request logging

5. Documentation:
- Generate OpenAPI/Swagger documentation
- Include example requests/responses
- Document authentication requirements
- Add rate limiting details

6. Deployment:
- Multi-stage Dockerfile optimized for production
- Docker Compose for local development
- Health check endpoints
- Proper logging configuration
- Environment variable management

7. Testing:
- Unit tests for services
- Integration tests for endpoints
- API key authentication tests
- Load testing configuration

Provide all source code with TypeScript and follow REST best practices. Include README with setup and deployment instructions.