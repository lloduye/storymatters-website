/*
 * PostgreSQL Database Schema for Story Matters Website
 * 
 * This file contains the database structure for stories and users.
 * Execute this file in a PostgreSQL database.
 * 
 * Syntax: PostgreSQL 12+
 */

-- Stories table
CREATE TABLE IF NOT EXISTS stories (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  author VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  publish_date DATE,
  image TEXT,
  category VARCHAR(100),
  read_time VARCHAR(50) DEFAULT '5 min',
  content TEXT,
  tags TEXT,
  featured BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'draft',
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'editor',
  status VARCHAR(50) DEFAULT 'active',
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- File uploads table for tracking uploaded files
CREATE TABLE IF NOT EXISTS file_uploads (
  id SERIAL PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100),
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stories_author ON stories(author);
CREATE INDEX IF NOT EXISTS idx_stories_status ON stories(status);
CREATE INDEX IF NOT EXISTS idx_stories_featured ON stories(featured);
CREATE INDEX IF NOT EXISTS idx_stories_category ON stories(category);
CREATE INDEX IF NOT EXISTS idx_stories_publish_date ON stories(publish_date);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Add comments for documentation
COMMENT ON TABLE stories IS 'Stories and articles published on the website';
COMMENT ON TABLE users IS 'User accounts for the CMS system';
COMMENT ON TABLE file_uploads IS 'Track uploaded files and their metadata';
