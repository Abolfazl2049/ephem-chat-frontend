# EphemChat Frontend

A Next.js-based frontend application for Ephem Chat.

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── (app)/             # Protected routes (app layout)
│   │   ├── enclave/       # Enclave management pages
│   │   └── page.tsx       # Dashboard
│   └── (auth)/            # Authentication routes
│       └── auth/          # Login/token restoration pages
├── components/            # Reusable React components
│   ├── layout/            # Layout components
│   └── ui/                # UI primitives (button, dialog, etc.)
├── features/              # Feature modules with screens/components/services
│   ├── auth/              # Authentication feature
│   ├── enclave/           # Enclave management feature
│   ├── matching/          # User matching feature
│   ├── shared/            # Shared utilities and types
│   └── user/              # User management feature
├── configs/               # Configuration files
├── libs/                  # Utility libraries
└── assets/                # Static assets and styles
```

## Key Features

- **Authentication**: Session creation and token restoration
- **Enclaves**: Create and manage secure chat rooms
- **User Matching**: Real-time user discovery and matching
- **Real-time Communication**: WebSocket support via Socket.IO
- **Responsive UI**: Tailwind CSS + Radix UI components

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **State Management**: Zustand
- **HTTP Client**: ofetch
- **WebSocket**: Socket.IO Client
- **Icons**: Lucide React

## Path Aliases

```typescript
@/*            → src/
@components/*  → src/components/
@features/*    → src/features/
@assets/*      → src/assets/
@styles/*      → src/assets/styles/
```

## Features Overview

### Authentication (`features/auth/`)

Handle user sessions and token management with form-based authentication flow.

### Enclaves (`features/enclave/`)

Create secure chat environments with WebRTC and real-time messaging capabilities.

### Matching (`features/matching/`)

Real-time user matching and discovery using WebSocket connections.

### User (`features/user/`)

User profile management and sidebar actions.
