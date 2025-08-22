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
4. Create two sheets:
   - **Sheet 1**: Rename to "Stories"
   - **Sheet 2**: Rename to "Users"

### Stories Sheet Setup

Add the following headers in row 1 of the "Stories" sheet:

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
L1: status
M1: viewCount
N1: createdAt
O1: updatedAt
```

**Important Notes:**

- **Column L (status)**: Use "draft" for unpublished stories, "published" for live stories
- **Column M (viewCount)**: Number of views (can start with 0)
- **Column N (createdAt)**: When the story was first created
- **Column O (updatedAt)**: When the story was last modified

### Users Sheet Setup

Add the following headers in row 1 of the "Users" sheet:

```
A1: ID
B1: username
C1: email
D1: password
E1: fullName
F1: role
G1: status
H1: createdAt
I1: lastLogin
J1: permissions
K1: phone
L1: department
M1: notes
```

**Important Notes:**

- **Column D (password)**: Must contain bcrypt-hashed passwords
- **Column F (role)**: Use "admin" for administrators, "editor" for content editors
- **Column G (status)**: Use "active" for active users, "inactive" for disabled users
- **Column H (createdAt)**: When the user account was created
- **Column I (lastLogin)**: When the user last logged in (auto-updated)

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

## Step 10: Sample Data Structure

### Stories Data

Here's what your stories data should look like:

| title                  | excerpt                             | author      | location       | publishDate | image       | category              | readTime   | content                           | tags                   | featured | status    | viewCount | createdAt            | updatedAt            |
| ---------------------- | ----------------------------------- | ----------- | -------------- | ----------- | ----------- | --------------------- | ---------- | --------------------------------- | ---------------------- | -------- | --------- | --------- | -------------------- | -------------------- |
| Community Impact Story | A story about community development | John Editor | Nairobi, Kenya | 2024-01-15  | sample1.jpg | Community Development | 5 min read | <p>This is a sample story...</p>  | Community, Development | true     | published | 150       | 2024-01-15T10:00:00Z | 2024-01-15T10:00:00Z |
| Youth Empowerment      | Empowering young people             | Jane Editor | Mombasa, Kenya | 2024-01-20  | sample2.jpg | Youth                 | 3 min read | <p>Youth empowerment story...</p> | Youth, Empowerment     | false    | draft     | 0         | 2024-01-20T14:30:00Z | 2024-01-20T14:30:00Z |

### Users Data

Here's what your users data should look like:

| ID  | username | email           | password (hashed)        | fullName    | role   | status | createdAt            | lastLogin            | permissions | phone         | department | notes           |
| --- | -------- | --------------- | ------------------------ | ----------- | ------ | ------ | -------------------- | -------------------- | ----------- | ------------- | ---------- | --------------- |
| 1   | admin    | admin@cms.com   | $2a$10$... (bcrypt hash) | Admin User  | admin  | active | 2024-01-01T00:00:00Z | 2024-01-15T10:00:00Z | all         | +254700000000 | Management | Main admin user |
| 2   | editor1  | editor1@cms.com | $2a$10$... (bcrypt hash) | John Editor | editor | active | 2024-01-01T00:00:00Z | 2024-01-15T10:00:00Z | content     | +254700000001 | Content    | Content editor  |

**Important**: The passwords in the sheet must be bcrypt-hashed. You cannot use plain text passwords.

## Troubleshooting

### General Issues

- **Permission Denied**: Make sure the service account email has editor access to the sheet
- **Sheet Not Found**: Verify the spreadsheet ID in your .env file
- **Missing Columns**: Ensure all required columns are present in the first row
- **Data Not Saving**: Check that the service account has write permissions

### Login Issues

- **"Invalid credentials" error**:
  - Verify the Users sheet exists and has the correct headers
  - Ensure passwords are bcrypt-hashed (not plain text)
  - Check that user status is "active"
  - Verify username/email matches exactly (case-sensitive)
- **"Account is not active" error**: Set user status to "active" in the Users sheet
- **"Login failed" error**: Check the server console for detailed error messages
- **Users sheet not found**: Make sure you have a "Users" sheet (not just "Stories")

### Testing the Setup

1. Run the test endpoint: `http://localhost:5000/api/test-sheets`
2. Check the server console for detailed logs during login attempts
3. Verify the Users sheet structure matches the required format
