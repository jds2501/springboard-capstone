-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  auth0_id TEXT NOT NULL UNIQUE
);

-- Entries table
CREATE TABLE entries (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  encryption_version INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index to optimize journal lookup by user and date
CREATE INDEX idx_entries_user_date ON entries(user_id, date);
