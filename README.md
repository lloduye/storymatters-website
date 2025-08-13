# Story Matters Website

A comprehensive CMS and website for Story Matters Entertainment, featuring story management, user authentication, and Google Sheets integration.

## 🚀 Features

- **Story Management**: Create, edit, and manage stories with rich text editor
- **User Management**: Role-based access control (Admin, Manager, Editor)
- **Google Sheets Integration**: Store data in Google Sheets as a database
- **Image Management**: Upload and manage story images
- **Responsive Design**: Modern UI built with React and Tailwind CSS
- **Authentication**: Secure login system with role-based dashboards

## 🔒 Security Features

- Password hashing with bcrypt
- Role-based access control
- Environment variable protection
- Secure file upload handling

## 📋 Prerequisites

- Node.js (v14 or higher)
- Google Cloud Platform account
- Google Sheets API enabled
- Service account credentials

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd storymatters-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your actual values:
   - `GOOGLE_SPREADSHEET_ID`: Your Google Spreadsheet ID
   - `ADMIN_TOKEN`: A secure admin token
   - Ensure `google-credentials.json` is in the root directory

4. **Set up Google Sheets**
   - Create a Google Spreadsheet
   - Add a "Stories" sheet with appropriate columns
   - Add a "Users" sheet with appropriate columns
   - Share with your service account email

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
├── server/                 # Node.js backend
│   └── index.js           # Express server
├── public/                 # Static assets
├── .env                    # Environment variables (not committed)
├── env.example            # Environment template
└── README.md              # This file
```

## 🔐 Environment Variables

Create a `.env` file based on `env.example`:

```env
GOOGLE_SERVICE_ACCOUNT_KEY=./google-credentials.json
GOOGLE_SPREADSHEET_ID=your-actual-spreadsheet-id
ADMIN_TOKEN=your-secure-admin-token
PORT=5000
```

## 🚨 Security Notes

- **Never commit** `.env` or `google-credentials.json` files
- Change the default `ADMIN_TOKEN` in production
- Use strong, unique passwords for all user accounts
- Regularly rotate API keys and tokens

## 📊 Google Sheets Setup

### Stories Sheet Columns:
- Title, Excerpt, Author, Location, Publish Date, Image, Category, Read Time, Content, Tags, Featured, Created At

### Users Sheet Columns:
- ID, Username, Email, Password, Full Name, Role, Status, Created At, Last Login, Permissions, Phone, Department, Notes

## 🚀 Deployment

1. Set up production environment variables
2. Build the frontend: `npm run build`
3. Deploy to your preferred hosting service
4. Ensure Google Sheets API access is configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is proprietary to Story Matters Entertainment.

## 🆘 Support

For support, contact the development team or create an issue in the repository.
