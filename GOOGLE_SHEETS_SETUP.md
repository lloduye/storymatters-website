# Google Sheets Setup Guide

This guide will help you set up Google Sheets as a database for the Story Matters CMS.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" or create a new one
3. Give your project a name (e.g., "Story Matters CMS")
4. Click "Create"

## Step 2: Enable Google Sheets API

1. In your Google Cloud project, go to "APIs & Services" > "Library"
2. Search for "Google Sheets API"
3. Click on "Google Sheets API"
4. Click "Enable"

## Step 3: Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - **Name**: `story-matters-cms`
   - **Description**: `Service account for Story Matters CMS`
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

## Step 4: Generate Service Account Key

1. In the Credentials page, find your service account
2. Click on the service account email
3. Go to the "Keys" tab
4. Click "Add Key" > "Create new key"
5. Choose "JSON" format
6. Click "Create"
7. The JSON file will download automatically

## Step 5: Set Up Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Name it "Story Matters CMS"
4. Rename the first sheet to "Stories"
5. Add the following headers in row 1:

```
A1: title
B1: excerpt
C1: author
D1: location
E1: publishDate
F1: image
G1: category
H1: readTime
I1: content
J1: tags
K1: featured
L1: createdAt
```

## Step 6: Share the Sheet

1. In your Google Sheet, click "Share" (top right)
2. Click "Change to anyone with the link"
3. Set permission to "Editor"
4. Copy the service account email from your JSON file
5. Add the service account email as an editor
6. Click "Done"

## Step 7: Get Sheet ID

1. Look at your Google Sheet URL
2. The URL will look like: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit`
3. Copy the Sheet ID (the long string between `/d/` and `/edit`)

## Step 8: Configure Environment

1. Place the downloaded JSON file in your project root
2. Rename it to `google-credentials.json`
3. Create a `.env` file in your project root
4. Add the following content:

```env
GOOGLE_SERVICE_ACCOUNT_KEY=./google-credentials.json
GOOGLE_SPREADSHEET_ID=your-sheet-id-here
ADMIN_TOKEN=admin123
PORT=5000
```

Replace `your-sheet-id-here` with the actual Sheet ID you copied.

## Step 9: Test the Setup

1. Start the development server: `npm run dev`
2. Go to http://localhost:3000/admin
3. Login with username: `admin`, password: `admin123`
4. Try creating a new story
5. Check your Google Sheet to see if the data appears

## Troubleshooting

### Common Issues

1. **"Google Sheets API not enabled"**

   - Go back to Google Cloud Console and enable the API

2. **"Permission denied"**

   - Make sure you shared the sheet with the service account email
   - Check that the service account has editor permissions

3. **"Invalid credentials"**

   - Verify the JSON file is in the correct location
   - Check that the file path in `.env` is correct

4. **"Sheet not found"**
   - Verify the Sheet ID is correct
   - Make sure the sheet is shared with the service account

### Security Notes

- Never commit the `google-credentials.json` file to version control
- Add it to your `.gitignore` file
- In production, use environment variables for the credentials
- Consider using Google Cloud Secret Manager for production deployments

## Sample Data

You can add some sample data to test the system:

| title        | excerpt                        | author   | location       | publishDate | image              | category              | readTime   | content                       | tags                   | featured | createdAt            |
| ------------ | ------------------------------ | -------- | -------------- | ----------- | ------------------ | --------------------- | ---------- | ----------------------------- | ---------------------- | -------- | -------------------- |
| Sample Story | This is a sample story excerpt | John Doe | Nairobi, Kenya | 2024-01-15  | /Images/sample.jpg | Community Development | 5 min read | <p>Sample content here...</p> | Community, Development | true     | 2024-01-15T10:00:00Z |

## Next Steps

Once the setup is complete, you can:

1. Create stories through the CMS
2. Edit existing stories
3. Upload images
4. Manage story categories and tags
5. Mark stories as featured

The data will automatically sync between your website and Google Sheets!
