# CSS Naming Convention Guide

## Overview

All CSS classes now use a consistent prefixing system to prevent naming collisions and improve component isolation.

## Naming Convention

### **BEM-inspired with Component Prefix**

We use a modified BEM (Block Element Modifier) approach with component/page prefixes:

```
{component-name}__{element-name}--{modifier}
{page-name}__{element-name}--{modifier}
```

## Examples by Component/Page Type

### **Components** (use component name as prefix)

```css
/* JournalEntry component */
.journal-entry {
} /* Block */
.journal-entry__date {
} /* Element */
.journal-entry__title {
} /* Element */
.journal-entry--highlighted {
} /* Modifier */

/* Button component */
.button {
} /* Block */
.button--primary {
} /* Modifier */
.button--secondary {
} /* Modifier */
.button--small {
} /* Size modifier */

/* Spinner component */
.spinner {
} /* Block */
.spinner__ring {
} /* Element */
.spinner--large {
} /* Modifier */
```

### **Pages** (use page name as prefix)

```css
/* EntryPage */
.entry-page {
} /* Block */
.entry-page__container {
} /* Element */
.entry-page__title {
} /* Element */
.entry-page__form {
} /* Element */
.entry-page__form-group {
} /* Sub-element */
.entry-page__form-label {
} /* Sub-element */
.entry-page__form-input {
} /* Sub-element */
.entry-page__back-button {
} /* Element with modifier intent */

/* Dashboard page */
.dashboard {
} /* Block */
.dashboard-container {
} /* Element (legacy, but acceptable) */
.dashboard-header {
} /* Element */
.dashboard-title {
} /* Element */
```

### **Layout Components**

```css
/* PageLayout */
.page-layout {
} /* Block */
.page-container {
} /* Element (legacy, but acceptable) */

/* AuthenticatedLayout */
.authenticated-layout {
} /* Block */

/* PublicLayout */
.public-layout {
} /* Block */
```

## Benefits

1. **No Naming Collisions** - Each component/page has its own namespace
2. **Clear Ownership** - Easy to identify which component a class belongs to
3. **Better Maintainability** - Components can be moved/reused without CSS conflicts
4. **Debugging** - DevTools clearly show component structure
5. **Team Collaboration** - Consistent naming reduces confusion

## Implementation Status

### ✅ **Updated Components:**

- `JournalEntry` - Uses `journal-entry__*` pattern
- `Spinner` - Uses `spinner__*` pattern
- `Loading` - Uses `loading__*` pattern

### ✅ **Updated Pages:**

- `EntryPage` - Uses `entry-page__*` pattern

### ✅ **Already Well-Named:**

- `Dashboard` - Uses `dashboard-*` pattern
- `LandingPage` - Uses `landing-*` pattern
- `Button` - Uses `button--*` pattern
- `PageLayout` - Uses `page-*` pattern

## Best Practices

1. **Use double underscores (`__`)** for elements
2. **Use double dashes (`--`)** for modifiers
3. **Keep component prefixes short but descriptive**
4. **Avoid overly nested element names** (max 2 levels deep)
5. **Use semantic names** that describe purpose, not appearance

## Example Implementation

```jsx
// Component JSX
function EntryPage() {
  return (
    <div className="entry-page">
      <div className="entry-page__container">
        <h1 className="entry-page__title">Add Entry</h1>
        <form className="entry-page__form">
          <div className="entry-page__form-group">
            <label className="entry-page__form-label">Title</label>
            <input className="entry-page__form-input" />
          </div>
        </form>
      </div>
    </div>
  );
}
```

```css
/* Component CSS */
.entry-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

.entry-page__container {
  max-width: 600px;
  margin: 0 auto;
}

.entry-page__title {
  font-size: var(--font-size-2xl);
  color: var(--color-text-primary);
}

.entry-page__form-group {
  margin-bottom: var(--spacing-md);
}

.entry-page__form-label {
  font-weight: var(--font-weight-medium);
  color: var(--color-primary);
}

.entry-page__form-input {
  padding: var(--spacing-md);
  border: 2px solid var(--color-border);
}
```
