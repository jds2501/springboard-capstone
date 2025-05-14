# Offline PWA

This document summarizes the strategy for handling offline read-only support of journal entries. There will be no support for offline editing, adding, or deleting.

## IndexedDB

### High-Level Flow
* On Login
 * Fetch entries from server
 * Store them in IndexedDB (overwriting the local copy)
 * Render them in the UI
* On pagination
 * Fetch next page from server
 * Append entries to IndexedDB
 * Append entries to UI
* On Return to Main Screen
 * Load entries from IndexedDB immediately
 * Trigger a background refresh from server (page 1)
  * If new entries are found
   * Clear entries store and replace with server results for page 1 to ensure stale/deleted entries are removed

### Important Functions / Packages
* idb - wrapper library to make indexedDB in Promise-friendly APIs
* getAll() - can be used to show entries immediately present in IndexedDB
* put(entry) - used for overwriting an entry in indexedDB
* createObjectStore('entries', { keyPath: 'id}) - sets up the indexedDB DB
* openDB('entries-db', 1) - used for opened up the entries DB
* upgrade(db) - callback for when DB is successfully connected
* get(key) - retrieve a specific item from indexedDB
* clear() - deletes all the current data present in indexedDB

## Service Worker
Will use vite-plugin-pwa to generate a service worker with assets defined in the cache.

### Important Functions / Notes
* npm create @vite-pwa/pwa@latest - uses a series of prompts to get the service worker & manifest setup
* Main or index file needs to call registerSW();
* vite-config.ts needs to include VitePWA config
* Must be served over HTTPS or localhost