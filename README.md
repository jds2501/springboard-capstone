# Emotional Regulation Journal

A full-stack web application that enables users to track their thoughts and emotions through journaling and derive insights based on their entries. This application is designed for clients and individuals interested in mental health tracking.

## 🎯 Features

- **Secure Authentication**: Auth0 integration for user authentication and authorization
- **Journal Management**: Create, read, update, and delete journal entries
- **Entry Import**: Import journal entries from markdown files
- **AI-Powered Insights**: Analyze journal entries to provide emotional trends and insights using Together AI
- **Responsive Design**: Mobile / Desktop friendly web app built with React and Vite
- **Real-time Validation**: Form validation and error handling
- **Markdown Support**: Rich text formatting for journal entries

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │────│  Express Server │────│   PostgreSQL    │
│     (Vite)      │    │    (Node.js)    │    │   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       │
    ┌─────────┐            ┌─────────────┐
    │  Auth0  │            │ Together AI │
    └─────────┘            └─────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd springboard-capstone
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create `.env` files in both `client/` and `server/` directories:

   **Server (`server/.env`):**

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/emotional_journal"
   AUTH0_DOMAIN="your-auth0-domain"
   AUTH0_AUDIENCE="your-auth0-audience"
   TOGETHER_API_KEY="your-together-ai-api-key"
   ```

   **Client (`client/.env`):**

   ```env
   VITE_AUTH0_DOMAIN="your-auth0-domain"
   VITE_AUTH0_CLIENT_ID="your-auth0-client-id"
   VITE_AUTH0_AUDIENCE="your-auth0-audience"
   VITE_API_BASE_URL="http://localhost:3000"
   ```

4. **Set up the database**

   ```bash
   cd server
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the development servers**

   ```bash
   # From the root directory
   npm run dev
   ```

   This will start both the client (port 5173) and server (port 3000) concurrently.

## 📁 Project Structure

```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── routes/         # Routing configuration
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── build/              # Production build output
├── server/                 # Express.js backend API
│   ├── controllers/        # API route handlers
│   ├── middleware/         # Express middleware
│   ├── prisma/            # Database schema and migrations
│   ├── routes/            # API route definitions
│   └── tests/             # Backend test files
├── Docs/                  # Project documentation
│   ├── APIs/              # API specifications
│   ├── DB Model/          # Database design
│   └── Frontend/          # Frontend specifications
└── sample-entries/        # Sample journal entries for testing
```

## 🔧 Available Scripts

### Root Level

- `npm run dev` - Start both client and server in development mode
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run client` - Start only the client development server
- `npm run server` - Start only the server development server

### Client (`client/`)

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run test` - Run tests with Vitest
- `npm run lint` - Run ESLint

### Server (`server/`)

- `npm run dev` - Start server with nodemon (auto-restart)
- `npm run start` - Start production server
- `npm run test` - Run Jest tests
- `npm run dev:prepare` - Generate Prisma client for development
- `npm run test:prepare` - Generate Prisma client for testing

## 🧪 Testing

### Frontend Tests

```bash
cd client
npm run test        # Run tests in watch mode
npm run test:run    # Run tests once
npm run test:ui     # Run tests with UI
```

### Backend Tests

```bash
cd server
npm test
```

The backend includes comprehensive test suites for:

- Authentication middleware
- Entry CRUD operations
- Entry analysis and trends
- User management
- Import functionality

## 📊 Database Schema

The application uses PostgreSQL with Prisma ORM. Key entities include:

- **Users**: Auth0 user IDs with internal user IDs
- **Entries**: Journal entries with title, description, and date

See `server/prisma/schema.prisma` for the complete database schema.

## 🔐 Authentication

The application uses Auth0 for authentication:

- Secure JWT token-based authentication
- Protected API routes

## 🤖 AI Integration

The application integrates with Together AI to provide:

- Emotional sentiment analysis
- Trend identification across entries
- Personalized insights and recommendations
- Pattern recognition in journaling habits

## 📱 Responsive Web App

The client is built as a responsive web app with:

- Responsive design for mobile and desktop
- Fast loading with Vite
- Modern React 19 features
- Component-based architecture

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Environment Setup

Ensure all environment variables are properly configured for your production environment, including:

- Database connection strings
- Auth0 configuration
- Together AI API keys
- CORS settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is part of a Springboard capstone project.

## 📧 Support

For questions or issues, please refer to the documentation in the `Docs/` directory or create an issue in the repository.
