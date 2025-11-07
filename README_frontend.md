# Frontend - Help Center Application

## 📋 Overview

The frontend is a modern, responsive React application that provides an intuitive help center interface for the Pôle Léonard de Vinci. It features an AI-powered chatbot (HelpAI), an administrative dashboard for managing help requests, and a clean, user-friendly design.

## 🎯 Key Features

### 1. **Interactive Chatbot (HelpAI)**
- Real-time conversation with AI assistant
- Smart question suggestions
- Context-aware responses
- Seamless fallback to human support

### 2. **Help Request Management**
- Submit questions when AI can't answer
- Track request status
- Administrator notification system
- Full conversation history

### 3. **Administrative Dashboard**
- View pending help requests
- Respond to user questions
- Mark requests as resolved
- Filter and search capabilities

### 4. **Multilingual Support**
- Primarily French interface
- Extensible to multiple languages
- Localized content and messages

## 🏗️ Architecture

```
source/frontend/help-center/
├── src/
│   ├── components/
│   │   ├── ChatBot/
│   │   │   ├── ChatWindow.tsx          # Main chat interface
│   │   │   ├── MessageBubble.tsx       # Individual messages
│   │   │   ├── SuggestionChips.tsx    # Question suggestions
│   │   │   └── LoadingIndicator.tsx   # Typing animation
│   │   ├── Admin/
│   │   │   ├── AdminDashboard.tsx      # Admin panel
│   │   │   ├── RequestList.tsx         # Help request list
│   │   │   ├── RequestDetail.tsx       # Request details
│   │   │   └── ResponseForm.tsx        # Response editor
│   │   ├── Layout/
│   │   │   ├── Header.tsx              # App header
│   │   │   ├── Sidebar.tsx             # Navigation
│   │   │   └── Footer.tsx              # App footer
│   │   └── Common/
│   │       ├── Button.tsx              # Reusable button
│   │       ├── Input.tsx               # Form inputs
│   │       ├── Modal.tsx               # Modal dialogs
│   │       └── Notification.tsx        # Toast notifications
│   ├── services/
│   │   ├── api.ts                      # Backend API client
│   │   ├── chatService.ts              # Chat functionality
│   │   └── adminService.ts             # Admin operations
│   ├── hooks/
│   │   ├── useChat.ts                  # Chat state management
│   │   ├── useHelpRequests.ts          # Request management
│   │   └── useAuth.ts                  # Authentication
│   ├── types/
│   │   ├── chat.types.ts               # Chat interfaces
│   │   ├── request.types.ts            # Request interfaces
│   │   └── user.types.ts               # User interfaces
│   ├── utils/
│   │   ├── formatters.ts               # Date/text formatting
│   │   ├── validators.ts               # Input validation
│   │   └── constants.ts                # App constants
│   ├── styles/
│   │   ├── globals.css                 # Global styles
│   │   ├── theme.ts                    # Theme configuration
│   │   └── variables.css               # CSS variables
│   ├── App.tsx                         # Root component
│   └── main.tsx                        # Entry point
├── public/
│   ├── index.html
│   └── assets/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env.example
```

## 🛠️ Technology Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI library |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **React Router** | Navigation |
| **Axios** | HTTP client |
| **Tailwind CSS** | Utility-first styling |
| **React Query** | Server state management |
| **Zustand** | Client state management |
| **React Hook Form** | Form management |
| **Zod** | Schema validation |
| **date-fns** | Date formatting |

## 📦 Installation

### Prerequisites

```bash
# Node.js 16+ and npm
node --version  # Should be 16.x or higher
npm --version   # Should be 8.x or higher
```

### Setup Steps

```bash
# Navigate to frontend directory
cd source/frontend/help-center

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

### Environment Configuration

Create `.env` file:

```env
# Backend API
VITE_API_BASE_URL=http://localhost:5000
VITE_API_TIMEOUT=30000

# Feature Flags
VITE_ENABLE_ADMIN=true
VITE_ENABLE_ANALYTICS=false

# App Configuration
VITE_APP_NAME=Help Center
VITE_APP_VERSION=1.0.0
```

## 🚀 Development

### Start Development Server

```bash
npm run dev
```

Opens at `http://localhost:5173` (or next available port)

### Build for Production

```bash
npm run build
```

Output: `dist/` directory

### Preview Production Build

```bash
npm run preview
```

### Linting & Formatting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Format with Prettier
npm run format

# Type checking
npm run type-check
```

## 🎨 User Interface Walkthrough

### 1. Chat Interface

![Chat Interface](./docs/images/chat-interface.png)

**Features:**
- Clean, modern design with purple accent color (#8B7AB8)
- Message bubbles for user and assistant
- Typing indicator while AI processes
- Input field with send button
- Floating help button (bottom-left corner)

**User Flow:**
1. User clicks on floating help button (N icon)
2. Chat window opens with welcome message
3. User sees suggested questions as clickable chips
4. User can type custom question or click suggestion
5. AI responds with contextual information
6. If AI can't answer, user can request human help

### 2. Suggestion System

![Suggestions](./docs/images/suggestions.png)

**When AI Can't Answer:**
```
Message: "Je n'ai pas trouvé la réponse à ma question, 
         je demande de l'aide à HelpAI"

Suggestions:
- Comment justifier une absence si je suis alternat ?
- Que se passe t-il si je ne valide pas un module ?
- Quelles sont les démarches à faire pour un stage en entreprise ?
```

**Features:**
- Dynamic suggestions based on popular FAQs
- One-click question submission
- Context-aware recommendations

### 3. Loading States

![Loading](./docs/images/loading.png)

**Design:**
- Three animated dots (...) 
- Purple color matching brand
- Smooth pulsing animation
- Shows while waiting for AI response

### 4. Handling Unknowns

![Unknown Answer](./docs/images/no-answer.png)

**Message:**
```
"Je n'ai pas d'information sur ce sujet dans ma base de connaissances."

[Ouvrir une demande d'aide] Button
```

**Features:**
- Polite acknowledgment of limitation
- Clear call-to-action button
- Seamless transition to help request

### 5. Help Request Confirmation

![Help Request Modal](./docs/images/help-request-modal.png)

**Modal Content:**
```
Demande d'aide administrateur

Êtes-vous sûr de vouloir ouvrir une demande d'aide ?
Un administrateur sera notifié et vous contactera bientôt.

[Annuler]  [Confirmer]
```

**Features:**
- Clear confirmation dialog
- Purple "Confirmer" button
- Gray "Annuler" button for cancel
- Centered modal with backdrop

### 6. Request Submitted

![Request Submitted](./docs/images/request-submitted.png)

**Success Message:**
```
"Votre demande d'aide a été transmise à un administrateur. 
Vous recevrez une réponse par mail dans les plus brefs délais. 
Vous pouvez quitter le chat."

Input: "Chat désactivé - demande d'aide envoyée"
```

**Features:**
- Clear success confirmation
- Disabled chat input (grayed out)
- Instructions for next steps
- Maintains conversation history

### 7. Admin Dashboard

![Admin Dashboard](./docs/images/admin-dashboard.png)

**Layout:**
```
Help Center                                    Lucas BARREZ 🎓

Administration

Sélectionnez une question pour y répondre et configurer ses paramètres

💬 Demandes d'aide en attente (2)

1. Quelles sont les démarches à faire pour un stage en entreprise ?
   📧 lucas.barrez@edu.devinci.fr  📅 07/11/2025  💬 2 messages   >

2. À quelle heure ouvre la cantine à l'ESILV ?
   📧 lucas.barrez@edu.devinci.fr  📅 07/11/2025  💬 2 messages   >
```

**Features:**
- Clean list of pending requests
- User email displayed
- Timestamp for each request
- Message count
- Click to view details

### 8. Admin Response Interface

![Admin Response](./docs/images/admin-response.png)

**Form Fields:**
```
Répondre à une demande d'aide

Informations de la demande:
📧 lucas.barrez@edu.devinci.fr
🕐 07/11/2025 10:41:26
👥 2 messages

Question:
À quelle heure ouvre la cantine à l'ESILV ?

Conversation complète:
USER: À quelle heure ouvre la cantine à l'ESILV ?
ASSISTANT: Je n'ai pas d'information sur ce sujet dans ma base de connaissances.

Réponse:
[Il n'y a pas de cantine à l'ESILV.]

Langue: [Français ▾]
École: [ESILV ▾]
Type d'utilisateur: [student ▾]

[Annuler]  [📊 Résoudre la demande]
```

**Features:**
- Full conversation context
- Rich text response editor
- Metadata selectors (Language, School, User Type)
- Clear submit button with icon
- Cancel option

### 9. Success Confirmation

![Success](./docs/images/success-confirmation.png)

**Modal:**
```
✓ Demande résolue avec succès !

La réponse a été enregistrée et la demande d'aide a été 
marquée comme résolue.

[Retour à l'administration]
```

**Features:**
- Green checkmark icon
- Clear success message
- Return to dashboard button
- Celebratory confirmation

### 10. Updated Dashboard

![Updated Dashboard](./docs/images/updated-dashboard.png)

**After Resolution:**
```
💬 Demandes d'aide en attente (1)

1. Quelles sont les démarches à faire pour un stage en entreprise ?
   📧 lucas.barrez@edu.devinci.fr  📅 07/11/2025  💬 2 messages   >
```

**Features:**
- Counter updates automatically
- Resolved request removed from list
- Clean, up-to-date view

## 🎨 Design System

### Color Palette

```css
:root {
  /* Primary */
  --primary: #8B7AB8;        /* Purple - Main brand color */
  --primary-light: #A595C9;  /* Lighter purple */
  --primary-dark: #6B5A98;   /* Darker purple */
  
  /* Neutrals */
  --white: #FFFFFF;
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-500: #6B7280;
  --gray-700: #374151;
  --gray-900: #111827;
  
  /* Semantic */
  --success: #10B981;        /* Green */
  --error: #EF4444;          /* Red */
  --warning: #F59E0B;        /* Orange */
  --info: #3B82F6;           /* Blue */
}
```

### Typography

```css
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  
  /* Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
}
```

### Spacing

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-12: 3rem;     /* 48px */
}
```

### Component Patterns

#### Button Styles

```tsx
// Primary Button
<button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-colors">
  Confirmer
</button>

// Secondary Button
<button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors">
  Annuler
</button>

// Icon Button
<button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
  <Icon className="w-5 h-5" />
</button>
```

#### Message Bubbles

```tsx
// User Message
<div className="bg-primary text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-[80%] ml-auto">
  {message}
</div>

// Assistant Message
<div className="bg-gray-100 text-gray-900 rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%]">
  {message}
</div>
```

## 🔌 API Integration

### API Service Structure

```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle errors globally
    if (error.response?.status === 401) {
      // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Chat Service

```typescript
// src/services/chatService.ts
import api from './api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  answer: string;
  confidence: number;
  sources?: string[];
}

export const chatService = {
  async sendMessage(message: string): Promise<ChatResponse> {
    return api.post('/chat', { message });
  },

  async getSuggestions(): Promise<string[]> {
    return api.get('/chat/suggestions');
  },
};
```

### Admin Service

```typescript
// src/services/adminService.ts
import api from './api';

export interface HelpRequest {
  id: string;
  question: string;
  conversation: ChatMessage[];
  userEmail: string;
  status: 'pending' | 'resolved';
  createdAt: Date;
  school: string;
  userType: string;
}

export const adminService = {
  async getHelpRequests(): Promise<HelpRequest[]> {
    return api.get('/admin/requests');
  },

  async getRequestById(id: string): Promise<HelpRequest> {
    return api.get(`/admin/requests/${id}`);
  },

  async resolveRequest(
    id: string,
    response: string,
    metadata: {
      language: string;
      school: string;
      userType: string;
    }
  ): Promise<void> {
    return api.post(`/admin/requests/${id}/resolve`, {
      response,
      ...metadata,
    });
  },

  async createHelpRequest(
    question: string,
    conversation: ChatMessage[]
  ): Promise<HelpRequest> {
    return api.post('/admin/requests', {
      question,
      conversation,
    });
  },
};
```

## 🪝 Custom Hooks

### useChat Hook

```typescript
// src/hooks/useChat.ts
import { useState, useCallback } from 'react';
import { chatService } from '../services/chatService';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    setIsLoading(true);
    setError(null);

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await chatService.sendMessage(content);
      
      // Add assistant response
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.answer,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
};
```

### useHelpRequests Hook

```typescript
// src/hooks/useHelpRequests.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/adminService';

export const useHelpRequests = () => {
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['helpRequests'],
    queryFn: adminService.getHelpRequests,
  });

  const resolveRequest = useMutation({
    mutationFn: ({
      id,
      response,
      metadata,
    }: {
      id: string;
      response: string;
      metadata: any;
    }) => adminService.resolveRequest(id, response, metadata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['helpRequests'] });
    },
  });

  return {
    requests: requests ?? [],
    isLoading,
    resolveRequest: resolveRequest.mutate,
    isResolving: resolveRequest.isPending,
  };
};
```

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Test Example

```typescript
// src/components/ChatBot/__tests__/ChatWindow.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatWindow } from '../ChatWindow';

describe('ChatWindow', () => {
  it('renders chat interface', () => {
    render(<ChatWindow />);
    expect(screen.getByPlaceholderText('Tapez votre message...')).toBeInTheDocument();
  });

  it('sends message on submit', async () => {
    render(<ChatWindow />);
    const input = screen.getByPlaceholderText('Tapez votre message...');
    const sendButton = screen.getByRole('button', { name: /envoyer/i });

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    expect(await screen.findByText('Test message')).toBeInTheDocument();
  });
});
```

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile */
@media (max-width: 640px) { }

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1025px) { }
```

### Mobile Optimizations

- Touch-friendly buttons (min 44x44px)
- Collapsible chat window
- Simplified admin dashboard
- Horizontal scrolling for request lists
- Bottom navigation on mobile

## 🔐 Security

### Input Sanitization

```typescript
import DOMPurify from 'isomorphic-dompurify';

const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
};
```

### CSRF Protection

```typescript
api.interceptors.request.use((config) => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  return config;
});
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables (Production)

```env
VITE_API_BASE_URL=https://api.helpcenter.devinci.fr
VITE_ENABLE_ANALYTICS=true
VITE_SENTRY_DSN=your_sentry_dsn
```

## 📊 Analytics

### Track User Actions

```typescript
import { analytics } from './utils/analytics';

// Track chat interaction
analytics.track('chat_message_sent', {
  messageLength: message.length,
  hasAttachment: false,
});

// Track help request
analytics.track('help_request_created', {
  topic: 'general',
  school: 'ESILV',
});
```

## 🔧 Troubleshooting

### Common Issues

**Issue**: Build fails with TypeScript errors
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

**Issue**: API calls failing
- Check VITE_API_BASE_URL in .env
- Verify backend is running
- Check CORS configuration

**Issue**: Styles not loading
```bash
# Rebuild Tailwind
npm run build:css
```

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

See main [README.md](../../README.md) for contribution guidelines.

## 📧 Support

For questions: [kryptosphere@devinci.fr](mailto:kryptosphere@devinci.fr)

---

**Built with ❤️ for the IBM Hackathon at Pôle Léonard de Vinci**