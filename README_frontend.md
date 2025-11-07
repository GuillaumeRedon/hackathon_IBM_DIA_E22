# Frontend - Help Center Application

## 📋 Overview

The frontend is a modern, responsive Next.js application built with React and TypeScript that provides an intuitive help center interface for the Pôle Léonard de Vinci. It features an AI-powered chatbot (HelpAI), an administrative dashboard for managing help requests, and a clean, user-friendly design with custom CSS variables.

## 🎯 Key Features

### 1. **Interactive Chatbot (HelpAI)**
- Real-time conversation with AI assistant via backend API
- Smart question suggestions with clickable chips
- Markdown response rendering for rich content
- Context-aware responses with conversation history
- Seamless fallback to human support requests

### 2. **Help Request Management**
- Submit questions when AI can't provide satisfactory answers
- Track request status (pending/resolved)
- Administrator notification system via email capture
- Full conversation history preservation in localStorage

### 3. **Administrative Dashboard**
- View pending help requests with metadata
- Respond to user questions with rich form interface
- Mark requests as resolved with API integration
- Dynamic request list updates
- Professional success feedback modals

### 4. **Modern UI/UX**
- Custom CSS variable-based theming
- Responsive design for all device sizes
- Professional modal system
- Clean typography and spacing
- Purple accent branding (#8072B9)

## 🏗️ Architecture

```
source/frontend/help-center/
├── app/                            # Next.js App Router
│   ├── globals.css                 # Global styles with CSS variables
│   ├── layout.tsx                  # Root layout component
│   ├── page.tsx                    # Home page with search & themes
│   └── admin/
│       ├── page.tsx                # Admin dashboard
│       └── form/
│           └── page.tsx            # Admin response form
├── components/
│   ├── Chat.tsx                    # Main chatbot component
│   ├── HelpAIModal.tsx            # Chat modal container
│   ├── SearchCard.tsx             # Search interface component
│   ├── Chip.tsx                   # Clickable theme chips
│   ├── DropdownCard.tsx           # FAQ dropdown component
│   ├── ListCard.tsx               # List display component
│   ├── WaitingSection.tsx         # Loading/waiting UI
│   ├── header.tsx                 # Application header
│   ├── ui/                        # Shadcn/ui components
│   │   ├── button.tsx             # Button variants
│   │   ├── input.tsx              # Form inputs
│   │   ├── textarea.tsx           # Text areas
│   │   ├── select.tsx             # Select dropdowns
│   │   ├── dialog.tsx             # Modal dialogs
│   │   └── ...                    # Other UI primitives
│   └── utils/
│       └── Card.tsx               # Reusable card component
├── hooks/
│   ├── useHelpRequest.ts          # Help request management
│   ├── useAdminHelpRequests.ts    # Admin request operations
│   └── use-*.ts                   # Additional custom hooks
├── utils/
│   ├── helpRequestStorage.ts      # localStorage operations
│   ├── debugHelpRequests.ts       # Development debugging
│   ├── constants/
│   │   ├── mockTheme.ts           # Theme data
│   │   └── mockSearch.ts          # Search suggestions
│   └── types/
│       └── searchSuggestion.type.ts # Type definitions
├── types/
│   └── helpRequest.ts             # Help request interfaces
├── lib/
│   └── utils.ts                   # Utility functions
├── public/
│   └── assets/                    # Static assets
├── package.json                   # Dependencies & scripts
├── next.config.ts                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.js             # Tailwind CSS configuration
└── postcss.config.mjs             # PostCSS configuration
```

## 🛠️ Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.0.1 | React framework with App Router |
| **React** | 19.2.0 | UI library |
| **TypeScript** | ^5 | Type safety |
| **Tailwind CSS** | ^4 | Utility-first styling |
| **Tailwind Animate CSS** | ^1.4.0 | Animation utilities |
| **React Markdown** | ^10.1.0 | Markdown rendering |
| **Lucide React** | ^0.552.0 | Icon library |
| **Radix UI** | Various | Accessible UI primitives |
| **Framer Motion** | ^11.18.2 | Animation library |
| **Clsx** | ^2.1.1 | Conditional className utility |
| **Class Variance Authority** | ^0.7.1 | Component variant management |
| **Sonner** | ^2.0.7 | Toast notifications |
| **pnpm** | - | Package manager |

## 📦 Installation

### Prerequisites

```bash
# Node.js 18+ and pnpm
node --version  # Should be 18.x or higher
pnpm --version  # Should be 8.x or higher

# Install pnpm if not available
npm install -g pnpm
```

### Setup Steps

```bash
# Navigate to frontend directory
cd source/frontend/help-center

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Available Scripts

```bash
# Development server
pnpm dev          # Starts Next.js dev server at localhost:3000

# Production build
pnpm build        # Creates optimized production build
pnpm start        # Starts production server

# Code quality
pnpm lint         # Runs ESLint for code linting
```

## 🚀 Development

### Start Development Server

```bash
pnpm dev
```

Opens at `http://localhost:3000` by default

### Key Development URLs

- **Main App**: http://localhost:3000/
- **Admin Dashboard**: http://localhost:3000/admin
- **Admin Form**: http://localhost:3000/admin/form

### Development Features

- **Hot Reload**: Instant updates on file changes
- **TypeScript**: Full type checking in development
- **ESLint**: Code quality enforcement
- **Tailwind CSS**: Instant styling with utility classes

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

### CSS Variables & Theming

The application uses custom CSS variables defined in `app/globals.css`:

```css
:root {
  --background: #F5F8FA;           /* Main background */
  --foreground: #171717;           /* Text color */
  --grey-button: #EFF2F5;          /* Button background */
  --bg-grey: #F5F8FA;              /* Secondary background */
  --strong-blue: #181C32;          /* Primary text */
  --purple-accent: #8072B9;        /* Accent color */
}

/* Tailwind integration */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-grey-button: var(--grey-button);
  --color-bg-grey: var(--bg-grey);
  --color-strong-blue: var(--strong-blue);
  --color-purple-accent: var(--purple-accent);
}
```

### Component Styling Patterns

#### Custom CSS Classes

```css
/* Applied via className */
.grey-button {
  background-color: var(--grey-button);
}

.bg-grey {
  background-color: var(--bg-grey);
}

.strong-blue {
  color: var(--strong-blue);
}

.purple-accent {
  background-color: var(--purple-accent);
}
```

#### Button Styles

```tsx
// Primary Action Button
<button className="px-6 py-3 bg-purple-accent text-white rounded-xl hover:opacity-90 transition-colors">
  Envoyer
</button>

// Secondary Button
<button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200 transition-colors">
  Annuler
</button>

// Icon Button
<button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
  <Icon className="w-5 h-5" />
</button>
```

#### Message Bubbles

```tsx
// User Message (Right-aligned, Purple)
<div className="max-w-[70%] p-4 rounded-xl bg-purple-accent text-white">
  {message}
</div>

// Assistant Message (Left-aligned, Gray)
<div className="max-w-[70%] p-4 rounded-xl grey-button strong-blue">
  <ReactMarkdown>{message}</ReactMarkdown>
</div>
```

## 🔌 Backend Integration

### API Communication

The frontend communicates with the FastAPI backend through fetch requests:

#### Chat API Integration

```typescript
// In components/Chat.tsx
const handleSubmit = async (e: React.FormEvent) => {
  const apiMessages = [...messages, userMessage].map(msg => ({
    id: msg.id,
    role: msg.role === 'assistant' ? 'agent' : msg.role,
    content: msg.content
  }));

  const response = await fetch('http://localhost:8000/v1/ask/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: apiMessages })
  });

  const data = await response.json();
  // Handle response...
};
```

#### Admin API Integration

```typescript
// In app/admin/form/page.tsx
const handleSubmit = async (e: React.FormEvent) => {
  const requestData = {
    titre: formData.question,
    contenu: `Question: ${formData.question}\n\nRéponse: ${formData.reponse}`,
    ecoles: formData.ecole,
    utilisateurs: formData.utilisateur,
    langue: formData.langue
  };

  const response = await fetch('http://localhost:8000/v1/add_question/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData)
  });
};
```
