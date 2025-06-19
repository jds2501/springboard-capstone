# React Router DOM Setup

This document explains the React Router DOM implementation in the Emotional Regulation Journal application.

## Overview

The application now uses React Router DOM for navigation, maintaining the existing authentication-based flow while providing a scalable routing structure for future development.

## Current Routes

- `/` - Landing page (public, redirects to dashboard if authenticated)
- `/dashboard` - Main dashboard (protected, requires authentication)

## Key Components

### AppRouter (`/src/routes/AppRouter.jsx`)

- Main router configuration using `createBrowserRouter`
- Defines all application routes
- Handles error boundaries for each route

### Route Protection

- **ProtectedRoute**: Wraps authenticated-only routes, redirects to landing if not logged in
- **PublicRoute**: Wraps public routes, redirects to dashboard if already authenticated

### Navigation Utilities (`/src/routes/navigation.js`)

- `useAppNavigation()` hook provides programmatic navigation functions
- Pre-defined navigation functions for common routes
- Generic `navigateTo()` function for custom navigation

## Authentication Flow

1. **Logged out user visits any route** → Redirected to landing page (`/`)
2. **User logs in** → Redirected to dashboard (`/dashboard`)
3. **Logged in user visits landing page** → Automatically redirected to dashboard
4. **Logged in user visits protected route** → Route loads normally
5. **User logs out** → Redirected back to landing page

## Adding New Routes

To add a new route, follow these steps:

### 1. Create the page component

```jsx
// src/pages/NewPage.jsx
const NewPage = () => {
  return <div>New Page Content</div>;
};
export default NewPage;
```

### 2. Export from pages index

```jsx
// src/pages/index.js
export { default as NewPage } from "./NewPage";
```

### 3. Add route to AppRouter

```jsx
// In src/routes/AppRouter.jsx
{
  path: "/new-page",
  element: <ProtectedRoute><NewPage /></ProtectedRoute>,
  errorElement: <ErrorPage error={{ message: "New page error" }} onRetry={() => window.location.reload()} />
}
```

### 4. Add navigation function (optional)

```jsx
// In src/routes/navigation.js
goToNewPage: () => navigate('/new-page'),
```

## Planned Routes

The following routes are prepared in the navigation utilities for future implementation:

- `/add-entry` - Add new journal entry
- `/trends` - View emotion trends
- `/profile` - User profile management
- `/settings` - Application settings

## Authentication Configuration

The Auth0Provider is configured to redirect users to `/dashboard` after successful login. This can be modified in `/src/main.jsx` if needed.

## Usage Examples

### Using navigation in components

```jsx
import { useAppNavigation } from "../routes";

const MyComponent = () => {
  const { goToDashboard, goToAddEntry } = useAppNavigation();

  return (
    <div>
      <button onClick={goToDashboard}>Go to Dashboard</button>
      <button onClick={goToAddEntry}>Add Entry</button>
    </div>
  );
};
```

### Using Link components for navigation

```jsx
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/add-entry">Add Entry</Link>
    </nav>
  );
};
```
