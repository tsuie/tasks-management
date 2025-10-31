# Task Management System

A full-stack task management application with advanced filtering, search, pagination, and CRUD operations.

## Project Description

This is a modern task management system that allows users to create, read, update, and delete tasks with rich metadata including priority levels, due dates, and status tracking. The application features real-time search, advanced filtering, sorting capabilities, and pagination to handle large datasets efficiently.

### Key Features

- ✨ **Full CRUD Operations** - Create, read, update, and delete tasks
- 🔍 **Search Functionality** - Real-time search across task titles and descriptions
- 🎯 **Advanced Filtering** - Filter by status (pending, in_progress, done) and priority (low, medium, high)
- 📊 **Flexible Sorting** - Sort by created date, due date, or priority in ascending/descending order
- 📄 **Pagination** - Efficiently browse through large task lists with configurable page sizes
- ⏰ **Due Date Tracking** - Set and track task due dates with visual indicators
- 🎨 **Priority Management** - Visual priority badges (high, medium, low)
- 🏗️ **Type-Safe** - Full TypeScript implementation across frontend and backend
- ✅ **Validation** - Input validation using class-validator on the backend

## Tech Stack

### Backend

| Technology | Version | Reasoning |
|-----------|---------|-----------|
| **NestJS** | 11.x | Enterprise-grade Node.js framework with excellent TypeScript support, built-in dependency injection, and modular architecture. Provides excellent structure for scalable applications. |
| **TypeORM** | 0.3.27 | Mature ORM with strong TypeScript support, migration management, and query builder. Simplifies database operations and provides type safety. |
| **PostgreSQL** | Latest | Robust relational database with excellent support for complex queries, indexing, and ACID compliance. Perfect for structured data like tasks. |
| **class-validator** | 0.14.2 | Decorator-based validation that integrates seamlessly with NestJS DTOs, ensuring data integrity at the API level. |
| **class-transformer** | 0.5.1 | Works with class-validator to transform and validate incoming requests, providing type-safe data handling. |

### Frontend

| Technology | Version | Reasoning |
|-----------|---------|-----------|
| **Next.js** | 16.x | Modern React framework with App Router, server-side rendering capabilities, and excellent developer experience. Built-in routing and optimization. |
| **React** | 19.x | Latest version with improved performance and the experimental React Compiler for automatic optimization. |
| **TypeScript** | 5.x | Type safety across the entire application, reducing runtime errors and improving developer experience. |
| **Tailwind CSS** | 4.x | Utility-first CSS framework enabling rapid UI development with consistent design and minimal custom CSS. |

### Development Tools

- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **Jest** - Unit testing framework
- **ts-node** - TypeScript execution for development

## Architecture Decisions

### Why NestJS over Express?

- **Structure**: NestJS provides a well-defined architecture out of the box (controllers, services, modules)
- **TypeScript**: First-class TypeScript support with decorators
- **Scalability**: Built for enterprise applications with dependency injection and modular design
- **Validation**: Seamless integration with validation pipes and DTOs
- **Testability**: Built-in testing utilities and dependency injection make testing easier

### Why PostgreSQL over MongoDB?

- **Relational Data**: Tasks have well-defined relationships and structure
- **ACID Compliance**: Ensures data consistency for critical operations
- **Query Performance**: Complex filtering and sorting benefit from relational database indexing
- **Type Safety**: Strong typing aligns with TypeScript philosophy

### Why TypeORM?

- **TypeScript Integration**: Native TypeScript support with decorators
- **Migrations**: Built-in migration system for database schema changes
- **Query Builder**: Type-safe query building for complex queries
- **Active Record/Repository Patterns**: Flexibility in data access patterns

## Project Structure

```
task-management/
├── backend/                    # NestJS backend application
│   ├── src/
│   │   ├── database/          # Database configuration and migrations
│   │   │   ├── data-source.ts
│   │   │   └── seed-data-source.ts
│   │   ├── migrations/        # TypeORM migrations
│   │   ├── seeds/             # Database seed files
│   │   └── tasks/             # Task module
│   │       ├── controller/    # REST API controllers
│   │       ├── service/       # Business logic
│   │       ├── entities/      # TypeORM entities
│   │       └── dto/           # Data Transfer Objects
│   └── package.json
│
├── frontend/                   # Next.js frontend application
│   ├── src/
│   │   ├── app/               # Next.js App Router pages
│   │   ├── components/        # React components
│   │   ├── lib/               # Utility functions and API client
│   │   └── types/             # TypeScript type definitions
│   └── package.json
│
└── README.md
```

## Setup Instructions

### Prerequisites

- **Node.js** 20+ installed
- **PostgreSQL** 14+ installed and running
- **npm** or **yarn** package manager

### 1. Database Setup

```bash
# Create a PostgreSQL database
createdb task_management

# Or using psql
psql -U postgres
CREATE DATABASE task_management;
\q
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (if not exists)
cat > .env << EOF
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=task_management
PORT=3000
EOF

# Run migrations
npm run migration:run

# Seed the database with sample data (1000 tasks)
npm run seed:run

# Start the development server
npm run start:dev
```

The backend will be available at `http://localhost:3000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env.local file (optional - defaults to localhost:3000)
cat > .env.local << EOF
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
EOF

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3001`

### 4. Verify Installation

- Open `http://localhost:3001` in your browser
- You should see the task management interface with 1000 seeded tasks
- Try searching, filtering, and pagination features

## API Endpoint Documentation

Base URL: `http://localhost:3000`

### Tasks Endpoints

#### 1. Get All Tasks (with pagination, filtering, sorting)

```
GET /tasks
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page (max: 100) |
| `search` | string | - | Search in title and description |
| `status` | enum | - | Filter by status: `pending`, `in_progress`, `done` |
| `priority` | enum | - | Filter by priority: `low`, `medium`, `high` |
| `sortBy` | enum | `createdAt` | Sort by: `createdAt`, `dueDate`, `priority` |
| `sortOrder` | enum | `desc` | Sort order: `asc`, `desc` |

**Example Request:**

```bash
curl "http://localhost:3000/tasks?page=1&limit=10&status=pending&priority=high&sortBy=dueDate&sortOrder=asc"
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "title": "Write documentation",
      "description": "Complete API documentation",
      "status": "pending",
      "priority": "high",
      "dueDate": "2025-11-15T00:00:00.000Z",
      "createdAt": "2025-10-31T00:00:00.000Z",
      "updatedAt": "2025-10-31T00:00:00.000Z"
    }
  ],
  "total": 250,
  "page": 1,
  "limit": 10,
  "totalPages": 25
}
```

#### 2. Get Single Task

```
GET /tasks/:id
```

**Example Request:**

```bash
curl http://localhost:3000/tasks/1
```

**Response:**

```json
{
  "id": 1,
  "title": "Write documentation",
  "description": "Complete API documentation",
  "status": "pending",
  "priority": "high",
  "dueDate": "2025-11-15T00:00:00.000Z",
  "createdAt": "2025-10-31T00:00:00.000Z",
  "updatedAt": "2025-10-31T00:00:00.000Z"
}
```

#### 3. Create Task

```
POST /tasks
```

**Request Body:**

```json
{
  "title": "New Task",
  "description": "Task description (optional)",
  "status": "pending",
  "priority": "medium",
  "dueDate": "2025-12-01T00:00:00.000Z"
}
```

**Validation Rules:**

- `title`: Required, max 200 characters
- `description`: Optional, text
- `status`: Optional, enum (`pending`, `in_progress`, `done`), default: `pending`
- `priority`: Optional, enum (`low`, `medium`, `high`), default: `medium`
- `dueDate`: Optional, valid date

**Example Request:**

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Task",
    "description": "Description",
    "status": "pending",
    "priority": "high",
    "dueDate": "2025-12-01T00:00:00.000Z"
  }'
```

#### 4. Update Task

```
PATCH /tasks/:id
```

**Request Body:** (all fields optional)

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "in_progress",
  "priority": "high",
  "dueDate": "2025-12-15T00:00:00.000Z"
}
```

**Example Request:**

```bash
curl -X PATCH http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "done"}'
```

#### 5. Delete Task

```
DELETE /tasks/:id
```

**Example Request:**

```bash
curl -X DELETE http://localhost:3000/tasks/1
```

**Response:**

```json
{
  "id": 1,
  "title": "Deleted Task",
  "description": "...",
  "status": "pending",
  "priority": "medium",
  "dueDate": null,
  "createdAt": "2025-10-31T00:00:00.000Z",
  "updatedAt": "2025-10-31T00:00:00.000Z"
}
```

### Error Responses

All endpoints return standard HTTP status codes:

- `200 OK` - Successful GET request
- `201 Created` - Successful POST request
- `400 Bad Request` - Validation error
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

**Error Response Format:**

```json
{
  "statusCode": 400,
  "message": ["title should not be empty"],
  "error": "Bad Request"
}
```

## Available Scripts

### Backend

```bash
npm run start:dev      # Start development server with hot-reload
npm run start:prod     # Start production server
npm run build          # Build for production
npm run lint           # Run ESLint
npm run test           # Run unit tests
npm run test:e2e       # Run end-to-end tests
npm run migration:run  # Run database migrations
npm run seed:run       # Seed database with sample data
npm run seed:revert    # Remove seed data
```

### Frontend

```bash
npm run dev            # Start development server
npm run build          # Build for production
npm run start          # Start production server
npm run lint           # Run ESLint
```

## Known Limitations and Trade-offs

### 1. Authentication & Authorization

**Limitation:** No user authentication or authorization implemented.

**Reason:** To focus on core CRUD functionality, filtering, and pagination within the time constraint.

**Future Enhancement:** Implement JWT-based authentication with role-based access control (RBAC).

### 2. Real-time Updates

**Limitation:** No WebSocket or real-time synchronization between clients.

**Reason:** REST API is simpler and sufficient for the current scope.

**Future Enhancement:** Implement WebSocket using Socket.io or Server-Sent Events for real-time task updates.

### 3. File Attachments

**Limitation:** No support for file uploads or attachments to tasks.

**Reason:** Requires additional infrastructure (file storage service, S3, etc.) and increases complexity.

**Future Enhancement:** Add file upload capability with cloud storage integration.

### 4. Task Categories/Tags

**Limitation:** No support for custom categories, tags, or labels.

**Reason:** Focused on essential task properties (status, priority, due date).

**Future Enhancement:** Add many-to-many relationship for task tags/categories.

### 5. Advanced Search

**Limitation:** Basic text search only (ILIKE query), no fuzzy matching or advanced search operators.

**Reason:** Simple implementation sufficient for demonstration purposes.

**Future Enhancement:** Implement full-text search using PostgreSQL's `tsvector` or integrate Elasticsearch.

### 6. Audit Trail

**Limitation:** No history tracking of task changes.

**Reason:** Simplifies data model and reduces storage requirements.

**Future Enhancement:** Implement audit log table to track all task modifications.

### 7. Bulk Operations

**Limitation:** No bulk update or delete operations.

**Reason:** Single-operation endpoints are simpler and cover most use cases.

**Future Enhancement:** Add endpoints for bulk status updates or deletions.

### 8. Task Dependencies

**Limitation:** No support for task dependencies or subtasks.

**Reason:** Increases complexity significantly with potential for circular dependencies.

**Future Enhancement:** Implement hierarchical task structure with parent-child relationships.

### 9. Performance Optimization

**Trade-off:** Using synchronous TypeORM calls instead of raw SQL for complex queries.

**Reason:** TypeORM provides better type safety and maintainability at a slight performance cost.

**Future Improvement:** Add database indexes on frequently queried fields (status, priority, dueDate) and implement query result caching for read-heavy operations.

### 10. Error Handling

**Limitation:** Basic error handling without detailed error codes or recovery strategies.

**Reason:** Simple error responses are easier to implement and understand.

**Future Enhancement:** Implement comprehensive error codes, retry mechanisms, and detailed error logging.

## Testing

### Backend Tests

```bash
cd backend
npm run test           # Unit tests
npm run test:e2e       # End-to-end tests
npm run test:cov       # Test coverage report
```

### Manual Testing

Use the provided Postman collection or cURL commands documented above to test API endpoints.

## Deployment Considerations

### Backend

- Set `NODE_ENV=production`
- Use environment variables for sensitive configuration
- Enable CORS for specific frontend origins only
- Implement rate limiting to prevent abuse
- Use a process manager (PM2, Docker) for reliability
- Set up database connection pooling
- Enable HTTPS in production

### Frontend

- Build optimized production bundle: `npm run build`
- Deploy to Vercel, Netlify, or similar platform
- Configure `NEXT_PUBLIC_API_BASE_URL` to point to production API
- Enable caching headers for static assets
- Implement error boundaries for better UX

### Database

- Set up automated backups
- Configure connection pooling
- Add database indexes on frequently queried columns
- Monitor query performance
- Set up read replicas for high-traffic scenarios

## Time Breakdown

Estimated time spent on different parts of the project:

| Task | Time | Notes |
|------|------|-------|
| **Backend Setup** | 1.5 hours | NestJS setup, TypeORM configuration, database setup |
| **Database Design** | 0.5 hours | Entity design, migrations, seed data |
| **Backend CRUD API** | 2 hours | Controllers, services, DTOs, validation |
| **Filtering & Pagination** | 1.5 hours | Query builder implementation, sorting logic |
| **Frontend Setup** | 1 hour | Next.js setup, Tailwind configuration |
| **Frontend UI Components** | 2.5 hours | Task list, form, filters, pagination UI |
| **API Integration** | 1 hour | Fetch calls, error handling, state management |
| **Testing & Debugging** | 1.5 hours | Manual testing, bug fixes, refinements |
| **Documentation** | 1.5 hours | README, code comments, API documentation |
| **Total** | **~13 hours** | Full-stack implementation |

## Future Enhancements

1. **User Authentication** - JWT-based auth with protected routes
2. **Task Collaboration** - Multiple users, assignments, comments
3. **Notifications** - Email/push notifications for due dates
4. **Calendar View** - Visual calendar with drag-and-drop
5. **Mobile App** - React Native mobile application
6. **Analytics Dashboard** - Task completion metrics, productivity insights
7. **Export/Import** - CSV/JSON data export/import
8. **Dark Mode** - Theme switcher for better UX
9. **Internationalization** - Multi-language support
10. **Automated Testing** - Comprehensive unit and E2E test coverage

## License

This project is private and unlicensed.

## Contact

For questions or feedback, please contact the development team.
