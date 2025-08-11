# Trello App Frontend

A modern, responsive task management application built with Next.js 15, React 19, and TypeScript. Features a beautiful drag-and-drop interface for managing boards, lists, and tasks.

## 🚀 Features

- **Modern UI/UX** - Clean, intuitive interface with Tailwind CSS
- **Drag & Drop** - Smooth drag-and-drop functionality for lists and tasks
- **Real-time Updates** - Live updates with React Query
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Type Safety** - Full TypeScript support
- **Component Library** - Built with shadcn/ui components
- **State Management** - Zustand for global state management
- **Activity Tracking** - Comprehensive activity logs
- **Comment System** - Task collaboration with comments
- **Loading States** - Beautiful loading indicators throughout

## 🛠️ Tech Stack

### Core Technologies
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript 5** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework

### Key Libraries
- **@dnd-kit** - Modern drag and drop library
- **@tanstack/react-query** - Data fetching and caching
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API calls
- **date-fns** - Date utility library
- **Lucide React** - Beautiful icon library

### UI Components
- **shadcn/ui** - High-quality React components
- **Radix UI** - Accessible component primitives
- **class-variance-authority** - Component variant management
- **clsx** - Conditional CSS class names

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Turbopack** - Fast bundler for development

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Backend API** running (see backend README)
- **Modern browser** with ES6+ support

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd trello-app/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the environment example file and configure your variables:

```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Optional: Analytics and Monitoring
# NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
# NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn

# Optional: Feature Flags
# NEXT_PUBLIC_ENABLE_DEBUG_MODE=false
# NEXT_PUBLIC_ENABLE_BETA_FEATURES=false
```

### 4. Start the Development Server

```bash
npm run dev
```

The application will open at `http://localhost:3000`.

### 5. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── boards/            # Board pages
│   │   │   └── [id]/          # Dynamic board routes
│   │   ├── demo-delete/       # Demo pages
│   │   ├── drag-drop-demo/    # Drag and drop demos
│   │   ├── task-details-demo/ # Task details demos
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── ActivityLog.tsx   # Activity tracking
│   │   ├── BoardCard.tsx     # Board display
│   │   ├── DndBoard.tsx      # Drag and drop board
│   │   ├── DraggableTask.tsx # Draggable task component
│   │   ├── DroppableList.tsx # Droppable list component
│   │   ├── List.tsx          # List component
│   │   ├── SortableList.tsx  # Sortable list wrapper
│   │   └── ...
│   ├── hooks/                # Custom React hooks
│   │   ├── useActivity.ts    # Activity management
│   │   ├── useBoards.ts      # Board operations
│   │   ├── useComments.ts    # Comment management
│   │   ├── useLists.ts       # List operations
│   │   └── useTasks.ts       # Task operations
│   ├── lib/                  # Utility libraries
│   │   └── utils.ts          # Helper functions
│   ├── providers/            # React context providers
│   │   ├── DndProvider.tsx   # Drag and drop context
│   │   └── QueryProvider.tsx # React Query provider
│   ├── services/             # API services
│   │   └── api.ts            # API client configuration
│   ├── stores/               # State management
│   │   └── useAppStore.ts    # Zustand store
│   └── types/                # TypeScript type definitions
│       └── index.ts          # Type definitions
├── public/                   # Static assets
├── package.json
├── next.config.ts            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── README.md
```

## 🎨 Component Architecture

### Core Components

- **DndBoard** - Main drag and drop board container
- **SortableList** - Wrapper for draggable lists
- **DroppableList** - List container that accepts dropped tasks
- **DraggableTask** - Individual draggable task component
- **BoardCard** - Board display and management
- **ActivityLog** - Activity tracking and display

### UI Components

Built with shadcn/ui for consistency and accessibility:
- **Button** - Various button variants and states
- **Card** - Content containers with headers
- **Dialog** - Modal dialogs and forms
- **Input** - Form input fields
- **Select** - Dropdown selection components
- **Badge** - Status and priority indicators

## 🔌 API Integration

### API Client

The frontend communicates with the backend through a centralized API service:

```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Data Fetching

Uses React Query for efficient data management:

```typescript
// hooks/useBoards.ts
const { data: boards, isLoading, error } = useQuery({
  queryKey: ['boards'],
  queryFn: boardsApi.getAll,
});
```

### Real-time Updates

Automatic cache invalidation and refetching when data changes:

```typescript
const createBoard = useMutation({
  mutationFn: boardsApi.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['boards'] });
  },
});
```

## 🎯 Key Features Implementation

### Drag and Drop

Built with @dnd-kit for smooth, accessible drag and drop:

```typescript
// DndBoard.tsx
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  // Handle list and task reordering
};
```

### Loading States

Comprehensive loading indicators throughout the UI:

```typescript
// Loading states for different operations
{isMoving && <LoadingSpinner />}
{isUpdatingPosition && <LoadingSpinner />}
{isUpdatingPositions && <LoadingSpinner />}
```

### Responsive Design

Mobile-first approach with Tailwind CSS:

```typescript
// Responsive grid layouts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

## 🎨 Styling and Theming

### Tailwind CSS

Utility-first CSS framework with custom configuration:

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Custom color palette
      },
    },
  },
};
```

### Component Variants

Consistent component styling with class-variance-authority:

```typescript
// button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // ... more variants
      },
    },
  }
);
```

## 📱 Responsive Design

### Breakpoints

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Mobile Optimizations

- Touch-friendly drag and drop
- Responsive grid layouts
- Mobile-optimized navigation
- Touch gesture support

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 🌐 Environment Variables

### Required

- `NEXT_PUBLIC_API_URL` - Backend API base URL

### Optional

- `NEXT_PUBLIC_ANALYTICS_ID` - Analytics tracking ID
- `NEXT_PUBLIC_SENTRY_DSN` - Error monitoring
- `NEXT_PUBLIC_ENABLE_DEBUG_MODE` - Debug features
- `NEXT_PUBLIC_ENABLE_BETA_FEATURES` - Beta functionality

## 🚀 Performance Optimizations

### Code Splitting

- Automatic route-based code splitting
- Dynamic imports for heavy components
- Lazy loading of non-critical features

### Caching

- React Query for API response caching
- Optimistic updates for better UX
- Background refetching for data freshness

### Bundle Optimization

- Tree shaking for unused code
- Image optimization with Next.js
- CSS purging with Tailwind

## 🧪 Testing

### Testing Strategy

- **Unit Tests** - Component testing with Jest
- **Integration Tests** - API integration testing
- **E2E Tests** - User flow testing with Playwright

### Running Tests

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

## 📊 Analytics and Monitoring

### Built-in Analytics

- Page view tracking
- User interaction monitoring
- Performance metrics
- Error tracking

### Custom Events

```typescript
// Track user actions
trackEvent('task_created', { listId, priority });
trackEvent('list_reordered', { boardId, oldPosition, newPosition });
```

## 🔐 Security Features

### Input Validation

- TypeScript for compile-time validation
- Runtime validation with Zod
- XSS protection
- CSRF protection

### API Security

- Secure API communication
- Input sanitization
- Rate limiting support
- Error message sanitization

## 🌍 Internationalization

### i18n Support

- Multi-language support ready
- Locale-aware date formatting
- RTL language support
- Cultural adaptations

### Localization Setup

```typescript
// i18n configuration
const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'es', 'fr', 'de'],
};
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
npm install -g vercel
vercel --prod
```

### Other Platforms

- **Netlify** - Static site hosting
- **AWS Amplify** - Full-stack hosting
- **Docker** - Containerized deployment

### Environment Setup

Ensure production environment variables are configured:
- `NEXT_PUBLIC_API_URL` - Production API endpoint
- Analytics and monitoring keys
- Feature flags for production

## 🔍 Troubleshooting

### Common Issues

1. **Build Errors**
   - Check TypeScript compilation
   - Verify all dependencies are installed
   - Clear Next.js cache

2. **API Connection Issues**
   - Verify backend is running
   - Check CORS configuration
   - Validate environment variables

3. **Drag and Drop Issues**
   - Check browser compatibility
   - Verify touch device support
   - Review console for errors

### Debug Mode

Enable debug mode for detailed logging:

```bash
NEXT_PUBLIC_ENABLE_DEBUG_MODE=true npm run dev
```

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Install dependencies
4. Make your changes
5. Add tests if applicable
6. Submit a pull request

### Code Standards

- Follow TypeScript best practices
- Use ESLint for code formatting
- Write meaningful commit messages
- Add JSDoc comments for complex functions

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the troubleshooting section
- Review component documentation
- Open an issue on GitHub
- Check the backend README for API details

## 🔗 Related Documentation

- [Backend API Documentation](../backend/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query)

---

**Happy Coding! 🎉**
