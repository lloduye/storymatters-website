-- Stories table
CREATE TABLE
IF NOT EXISTS stories
(
  id SERIAL PRIMARY KEY,
  title VARCHAR
(255) NOT NULL,
  excerpt TEXT,
  author VARCHAR
(255) NOT NULL,
  location VARCHAR
(255),
  publish_date DATE,
  image TEXT,
  category VARCHAR
(100),
  read_time VARCHAR
(50) DEFAULT '5 min',
  content TEXT,
  tags TEXT,
  featured BOOLEAN DEFAULT FALSE,
  status VARCHAR
(50) DEFAULT 'draft',
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE
IF NOT EXISTS users
(
  id SERIAL PRIMARY KEY,
  username VARCHAR
(100) UNIQUE NOT NULL,
  full_name VARCHAR
(255) NOT NULL,
  email VARCHAR
(255) UNIQUE NOT NULL,
  password_hash VARCHAR
(255) NOT NULL,
  role VARCHAR
(50) DEFAULT 'editor',
  status VARCHAR
(50) DEFAULT 'active',
  phone VARCHAR
(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX
IF NOT EXISTS idx_stories_author ON stories
(author);
CREATE INDEX
IF NOT EXISTS idx_stories_status ON stories
(status);
CREATE INDEX
IF NOT EXISTS idx_stories_featured ON stories
(featured);
CREATE INDEX
IF NOT EXISTS idx_users_role ON users
(role);
CREATE INDEX
IF NOT EXISTS idx_users_status ON users
(status);
