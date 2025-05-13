## MarkdownPreview

A component that renders a sanitized preview of a journal entry's markdown.

### Props
- `journalId: string` — ID of the journal entry to fetch
- `description?: string` (optional) — if provided, skips fetch and uses this value

### State
- `description: string | null`
- `error: string | null`
- `isLoading: boolean`

### Behavior
- If `description` prop is provided, sanitize and render immediately.
- If `description` prop is not provided:
  - Fetch the journal entry by `journalId` on mount (`useEffect`)
  - On success: render sanitized markdown
  - On failure: show error
  - While loading: show a loading spinner
- Render markdown with `markdown-it`, sanitize with `sanitize-html`, and inject via `dangerouslySetInnerHTML`