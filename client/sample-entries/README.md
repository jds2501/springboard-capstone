# Sample Markdown Files for Import Testing

This directory contains sample markdown files that you can use to test the import functionality of the journal application.

## Valid Sample Files

These files should import successfully:

### 1. `basic-entry.md`

A simple, straightforward journal entry about a good day with gratitude elements.

### 2. `anxiety-entry.md`

A more detailed entry about dealing with anxiety, including coping strategies and reflections.

### 3. `weekend-reflection.md`

A weekend recap with structured sections for different activities and emotional check-ins.

### 4. `career-breakthrough.md`

An excited entry about getting a promotion, including the journey and future plans.

### 5. `simple-gratitude.md`

A short, simple entry focused on small daily gratitudes.

## Invalid Sample Files (for Error Testing)

These files should fail to import and display appropriate error messages:

### 1. `invalid-missing-date.md`

Missing the required `date` field in the front matter.
**Expected Error**: "Missing metadata: Title and/or date"

### 2. `invalid-missing-title.md`

Missing the required `title` field in the front matter.
**Expected Error**: "Missing metadata: Title and/or date"

### 3. `invalid-date-format.md`

Has an invalid date format in the front matter.
**Expected Error**: "Invalid date format. Use YYYY-MM-DD."

## How to Test

1. Start your development server (both client and server)
2. Navigate to the Dashboard page
3. Click the "Import" button
4. Select one of these markdown files from your file system
5. Observe the import process and any success/error messages

## Expected Markdown Format

All valid markdown files should have front matter with at least:

```yaml
---
title: Your Entry Title
date: YYYY-MM-DD
---
Your journal content here...
```

The date can be in various formats (ISO string, etc.) but should be parseable by JavaScript's `Date()` constructor.

## File Size Limit

The backend has a 2MB file size limit for imports. All sample files are well under this limit.
