# JaSON Feature TODO

Feature backlog from a full codebase review (2026-07-04). JaSON is intentionally simple — a
single-request HTTP client, not a Postman competitor. No environments/variables/placeholders
by design; see "Explicitly out of scope" below.

## Current State Summary

- **Request building**: Fixed method list (GET/POST/PUT/PATCH/DELETE/HEAD/OPTIONS, no custom
  method). Headers are a freeform `Name: value` textarea (`RequestFields.tsx:303-313`) — no
  key/value row UI, no per-row enable/disable. No query-param builder — must hand-edit the URL.
  Body supports JSON/XML/urlencoded/multipart via a content-type dropdown, but form-data is
  authored as JSON and converted at send time (no key/value table, no file/binary upload). No
  dedicated Auth UI — only a passive read-only decode of a manually-typed
  `Authorization: Bearer/Basic` header (`RequestFields.tsx:283-334`, uses `jwt-decode`). Axios
  request has a fixed, non-configurable 5-minute timeout; cancel/abort works. No "copy as
  cURL"/code-gen. Manifest permissions are minimal (`host_permissions` only).
- **Response handling**: Three tabs (formatted/raw/headers). Status chip + response time chip,
  but no response size (bytes) shown. Pretty-printing via Prettier for JSON/XML under 50k chars;
  no HTML rendering/preview. In-response search is explicitly disabled
  (`WrappedAceEditor.tsx:92` removes Ace's `find` command).
- **History/organization**: Dexie/IndexedDB-backed flat chronological history (cap 1000
  entries), searchable by space-delimited terms, with a single `favourite` boolean — no
  named/saved requests, no folders/collections, no tags. No import/export. No response diffing.
  Strictly single-request-at-a-time — no multiple tabs/workspaces.
- **UI/settings**: No settings/options page at all — the only user preference is a light/dark
  theme toggle. No onboarding or empty-state guidance beyond an About dialog. No Chrome-level
  keyboard shortcuts (`commands`) registered, and no in-app keyboard shortcuts beyond
  Enter-to-send in the URL field.

## P0 — Quick wins (high value, low effort)

- [ ] **Copy as cURL** — generate a cURL command (and maybe `fetch()` snippet) from the current
      request.
- [ ] **Response size indicator** — show payload size (bytes/KB) next to the existing
      status/time chips in `ResponseFields.tsx`.
- [ ] **Re-enable in-response search** — Ace's `find` command is explicitly disabled
      (`WrappedAceEditor.tsx:92`); either remove that override or add a dedicated search box.
- [ ] **Keyboard shortcuts** — `Cmd/Ctrl+Enter` to send from anywhere in the form, and a
      registered Chrome `commands` shortcut to open the extension.
- [ ] **Configurable request timeout** — the 5-minute axios timeout (`requestHandler.ts:64`) is
      hardcoded; expose it as a field near the method/content-type selectors.

## P1 — Meaningful capability additions (medium effort)

- [ ] **Structured headers editor** — key/value rows with per-row enable/disable checkboxes,
      replacing (or offered alongside) the raw textarea.
- [ ] **Query parameter builder** — key/value rows that sync bidirectionally with the URL's
      query string.
- [ ] **Lightweight Auth tab** — Basic (username/password) and Bearer/API-key fields that write
      the `Authorization`/custom header for you. Extends the existing passive JWT/Basic-decode
      feature (`state.ts:77-113`) — still no vault/OAuth flow, no environments.
- [ ] **Named/saved requests** — extend the existing `favourite` flag into an actual
      name/label + description on history entries.
- [ ] **Multiple request tabs** — allow more than one request open at once (browser-tab-like),
      since today state is fully global/single-request (`state.ts:39-49`). Highest-effort item
      here, but addresses the "stagnated" feeling most directly.
- [ ] **Export/import history** — JSON export of history or saved/favourited requests, and
      re-import, for backup or sharing.
- [ ] **Settings page** — first one the extension has ever had: default headers, timeout,
      editor font size, history retention limit, default theme.

## P2 — Larger / nice-to-have

- [ ] **HTML response preview** — render `text/html` responses in a sandboxed iframe tab
      alongside formatted/raw/headers.
- [ ] **Response diff** — compare two history entries' responses side-by-side.
- [ ] **File/binary body support** — real file picker for multipart bodies instead of
      JSON-authored form data.
- [ ] **Onboarding/empty states** — first-run guidance and empty-state copy in the history
      panel (currently blank).
- [ ] **Custom/arbitrary HTTP method input** — free-text method field for non-standard verbs.
- [ ] **System theme option** — follow OS light/dark preference in addition to the manual
      toggle.

## Explicitly out of scope

- **Environments / variables / placeholders** — deliberately excluded; this isn't the tool's
  intent. Flagged only because it's the most commonly requested Postman-style feature, in case
  priorities change later.
