# Task Management Frontend

A modern task management application built with [Next.js](https://nextjs.org) 16, React 19, and TypeScript.

## Features

- ✨ **Create & Edit Tasks** - Add new tasks or modify existing ones with a clean form interface
- 🔍 **Search** - Real-time search across task titles and descriptions
- 🎯 **Filter & Sort** - Filter by status and priority, sort by created date, due date, or priority
- 📄 **Pagination** - Navigate through large task lists with configurable page sizes
- 🎨 **Priority Badges** - Visual indicators for task priority levels (high, medium, low)
- ⏰ **Due Date Tracking** - Set and track task due dates with visual indicators
- 📱 **Responsive Design** - Built with Tailwind CSS for mobile and desktop

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI**: React 19, Tailwind CSS 4
- **Language**: TypeScript
- **State Management**: React Hooks
- **API Integration**: Fetch API with custom error handling

## Prerequisites

- Node.js 20+ installed
- Backend API running on `http://localhost:3000` (or configure `NEXT_PUBLIC_API_BASE_URL`)

## Getting Started

1. **Install dependencies**:

```bash
npm install
```

2. **Configure environment** (optional):

Create a `.env.local` file if you need to override the default API URL:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

3. **Run the development server**:

```bash
npm run dev
```

4. **Open the app**:

Navigate to [http://localhost:3001](http://localhost:3001) in your browser.

## Available Scripts

- `npm run dev` - Start development server on port 3001
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── page.tsx      # Main task management page
│   │   └── layout.tsx    # Root layout
│   ├── components/       # React components
│   │   └── TaskForm.tsx  # Reusable task form component
│   ├── lib/              # Utility functions
│   │   └── api.ts        # API client functions
│   └── types/            # TypeScript type definitions
│       └── task.ts       # Task-related types
├── public/               # Static assets
└── package.json
```

## API Integration

The frontend communicates with a NestJS backend API. Key endpoints:

- `GET /tasks` - Fetch tasks with pagination, filtering, and search
- `POST /tasks` - Create a new task
- `PATCH /tasks/:id` - Update an existing task
- `DELETE /tasks/:id` - Delete a task

### Query Parameters

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `search` - Search query for title/description
- `status` - Filter by status (pending, in_progress, done)
- `priority` - Filter by priority (low, medium, high)
- `sortBy` - Sort field (createdAt, dueDate, priority)
- `sortOrder` - Sort direction (asc, desc)

## Development

The app uses React 19's experimental compiler for optimized performance. Edit components in `src/` and the page will auto-reload.

## Building for Production

```bash
npm run build
npm start
```

This creates an optimized production build in the `.next` folder.
