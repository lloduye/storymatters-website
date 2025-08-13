# Story Matters Website with CMS

A comprehensive website for Story Matters with an integrated Content Management System (CMS) that uses Google Sheets as a backend database.

## Features

### Public Website

- **Responsive Design**: Modern, mobile-friendly interface
- **Story Showcase**: Display stories with rich content and images
- **Category Filtering**: Organize stories by categories
- **Search & Navigation**: Easy browsing and discovery
- **Social Sharing**: Share stories on social media

### CMS (Content Management System)

- **Admin Dashboard**: Overview of stories, statistics, and quick actions
- **Story Editor**: Rich text editor with image upload capabilities
- **Google Sheets Integration**: Store and manage stories in Google Sheets
- **Image Management**: Upload and manage story images
- **Authentication**: Secure admin login system
- **Real-time Updates**: Changes reflect immediately on the website

## Tech Stack

### Frontend

- **React 19**: Modern React with hooks
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **React Quill**: Rich text editor
- **React Hook Form**: Form handling and validation
- **Axios**: HTTP client for API calls
- **React Hot Toast**: Toast notifications

### Backend

- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **Google Sheets API**: Database backend
- **Multer**: File upload handling
- **CORS**: Cross-origin resource sharing

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Cloud Platform account
- Google Sheets API enabled

### 1. Clone the Repository

```bash
git clone <repository-url>
cd storymatters-website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Google Sheets Setup

#### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API

#### Step 2: Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details
4. Download the JSON key file
5. Place the JSON file in the project root as `google-credentials.json`

#### Step 3: Create Google Sheet

1. Create a new Google Sheet
2. Name the first sheet "Stories"
3. Add the following headers in row 1:
   ```
   title | excerpt | author | location | publishDate | image | category | readTime | content | tags | featured | createdAt
   ```
4. Share the sheet with your service account email (found in the JSON file)
5. Copy the Sheet ID from the URL

### 4. Environment Configuration

1. Copy `env.example` to `.env`
2. Update the following variables:
   ```env
   GOOGLE_SERVICE_ACCOUNT_KEY=./google-credentials.json
   GOOGLE_SPREADSHEET_ID=your-sheet-id-here
   ADMIN_TOKEN=your-secure-admin-token
   PORT=5000
   ```

### 5. Start the Development Server

```bash
# Start both frontend and backend
npm run dev

# Or start them separately
npm run server  # Backend only (port 5000)
npm start       # Frontend only (port 3000)
```

### 6. Access the Application

- **Public Website**: http://localhost:3000
- **CMS Admin**: http://localhost:3000/admin
- **API Health Check**: http://localhost:5000/api/health

## CMS Usage

### Admin Login

- **URL**: http://localhost:3000/admin
- **Username**: admin
- **Password**: admin123

### Creating Stories

1. Login to the CMS
2. Click "Create New Story" or navigate to `/admin/stories/new`
3. Fill in the story details:
   - Title and excerpt
   - Author and location
   - Category and tags
   - Upload an image
   - Write content using the rich text editor
4. Click "Publish Story"

### Managing Stories

- View all stories in the dashboard
- Edit existing stories
- Delete stories (with confirmation)
- Mark stories as featured
- Preview stories before publishing

## API Endpoints

### Public Endpoints

- `GET /api/stories` - Get all stories
- `GET /api/stories/:id` - Get a specific story
- `GET /api/health` - Health check

### Protected Endpoints (Require Admin Token)

- `POST /api/stories` - Create a new story
- `PUT /api/stories/:id` - Update a story
- `DELETE /api/stories/:id` - Delete a story
- `POST /api/upload` - Upload an image

## File Structure

```
storymatters-website/
├── public/                 # Static files
├── src/
│   ├── components/         # Reusable components
│   │   ├── cms/           # CMS-specific components
│   │   │   └── AdminLayout.js
│   │   ├── Navbar.js
│   │   └── Footer.js
│   ├── pages/             # Page components
│   │   ├── cms/          # CMS pages
│   │   │   ├── AdminLogin.js
│   │   │   ├── AdminDashboard.js
│   │   │   └── StoryEditor.js
│   │   ├── Home.js
│   │   ├── Stories.js
│   │   ├── StoryDetail.js
│   │   └── ...
│   └── App.js
├── server/                # Backend server
│   └── index.js
├── package.json
├── env.example
└── README.md
```

## Deployment

### Frontend (Netlify/Vercel)

1. Build the project: `npm run build`
2. Deploy the `build` folder to your hosting platform

### Backend (Heroku/Railway)

1. Set environment variables in your hosting platform
2. Deploy the `server` folder
3. Update the API base URL in the frontend

### Environment Variables for Production

```env
GOOGLE_SERVICE_ACCOUNT_KEY=your-service-account-key
GOOGLE_SPREADSHEET_ID=your-sheet-id
ADMIN_TOKEN=your-secure-token
PORT=5000
NODE_ENV=production
```

## Security Considerations

1. **Admin Authentication**: Implement proper JWT authentication in production
2. **API Security**: Use HTTPS and proper CORS configuration
3. **File Upload**: Validate file types and sizes
4. **Environment Variables**: Never commit sensitive data to version control
5. **Google Sheets Permissions**: Use least privilege access

## Troubleshooting

### Common Issues

1. **Google Sheets API Error**

   - Verify service account credentials
   - Check sheet permissions
   - Ensure API is enabled

2. **Image Upload Fails**

   - Check file size (max 5MB)
   - Verify file type (images only)
   - Ensure upload directory exists

3. **CMS Not Loading**
   - Check if backend server is running
   - Verify API endpoints
   - Check browser console for errors

### Support

For issues and questions, please check the troubleshooting section or create an issue in the repository.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
