# Story Matters Website

A modern, responsive website for Story Matters Entertainment with a comprehensive content management system.

## ✨ Features

- **Modern React Frontend** with responsive design
- **Content Management System** for stories and articles
- **User Management** with role-based access control
- **Neon PostgreSQL Database** for fast, reliable data storage
- **Netlify Functions** for serverless backend operations
- **Real-time Updates** and live content management

## 🚀 Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/lloduye/storymatters-website.git
   cd storymatters-website
   ```

2. **Install dependencies**

   ```bash
   npm install
   cd netlify/functions && npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   ```

   Edit `.env` with your actual values:

   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `ADMIN_TOKEN`: A secure admin token

4. **Set up Neon Database**

   - Create a Neon account at [neon.tech](https://neon.tech)
   - Create a new project and database
   - Copy your connection string to `DATABASE_URL`
   - The database tables will be created automatically

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
storymatters-website/
├── src/                    # React frontend
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts
│   └── App.js             # Main app component
├── netlify/                # Netlify Functions (backend)
│   └── functions/         # Serverless functions
├── public/                 # Static assets
├── .env                    # Environment variables (not committed)
├── env.example            # Environment template
└── README.md              # This file
```

## 🔐 Environment Variables

Create a `.env` file based on `env.example`:

```env
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
ADMIN_TOKEN=your-secure-admin-token
PORT=5000
```

## 🚨 Security Notes

- **Never commit** `.env` file
- Change the default `ADMIN_TOKEN` in production
- Use strong, unique passwords for all user accounts
- Regularly rotate API keys and tokens

## 📊 Database Schema

### Stories Table:

- id, title, excerpt, author, location, publish_date, image, category, read_time, content, tags, featured, status, view_count, created_at, updated_at

### Users Table:

- id, username, full_name, email, password_hash, role, status, phone, created_at, updated_at

## 🚀 Deployment

1. Set up production environment variables in Netlify
2. Build the frontend: `npm run build`
3. Deploy to Netlify (automatic with GitHub integration)
4. Ensure Neon database connection is configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is proprietary to Story Matters Entertainment.

## 🆘 Support

For support, contact the development team or create an issue in the repository.
