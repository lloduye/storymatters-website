# Image Storage Setup Guide

## Overview

This guide explains how to set up online image storage for the Story Matters website using Cloudinary, ensuring images are stored online and accessible without rebuilding the website.

## Current Issues Fixed

1. **Images were not being stored online** - The previous upload function only generated placeholder images
2. **Images were lost during story creation** - Multipart form data wasn't properly handled
3. **Images required website rebuilds** - No persistent online storage was implemented

## Solution: Cloudinary Integration

### 1. Set Up Cloudinary Account

1. Go to [Cloudinary.com](https://cloudinary.com) and create a free account
2. Get your credentials from the Dashboard:
   - Cloud Name
   - API Key
   - API Secret

### 2. Environment Variables

Add these variables to your environment files:

```bash
# Cloudinary Configuration for Image Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Install Dependencies

The Cloudinary package has been added to `netlify/functions/package.json`. Run:

```bash
cd netlify/functions
npm install
```

### 4. Database Updates

The database schema has been updated to support Cloudinary URLs:

- `stories.image` field: Changed from `TEXT` to `VARCHAR(500)` to accommodate Cloudinary URLs
- `file_uploads.file_url` field: Updated to `VARCHAR(500)` for consistency

### 5. How It Works Now

#### Image Upload Process:

1. **Frontend**: User selects an image file
2. **Conversion**: Image is converted to base64 format
3. **Upload**: Base64 data is sent to `/api/upload` endpoint
4. **Cloudinary**: Image is uploaded to Cloudinary cloud storage
5. **Database**: Image URL is stored in the database
6. **Story Creation**: Story is created with the image URL

#### Benefits:

- ✅ **Images stored online** - No local storage required
- ✅ **Persistent URLs** - Images remain accessible after deployment
- ✅ **No rebuilds needed** - Images are served from Cloudinary CDN
- ✅ **Scalable** - Cloudinary handles image optimization and delivery
- ✅ **Cost-effective** - Free tier available for reasonable usage

### 6. File Structure

```
netlify/functions/
├── upload.js          # Handles image uploads to Cloudinary
├── stories.js         # Manages story CRUD operations
└── package.json       # Includes cloudinary dependency

src/pages/cms/
├── EditorCreateStory.js    # Updated to use new upload process
├── EditorStoryEditor.js    # Updated to use new upload process
└── StoryEditor.js          # Updated to use new upload process
```

### 7. Testing the Setup

1. **Create a story with an image**:

   - Go to Editor Dashboard → Create Story
   - Upload an image
   - Verify the image appears in the preview
   - Publish the story

2. **Check image storage**:
   - Image should be accessible via Cloudinary URL
   - URL should be stored in the database
   - Image should display on the website without rebuilding

### 8. Troubleshooting

#### Common Issues:

1. **"Cloudinary not configured" error**:

   - Check environment variables are set correctly
   - Verify Cloudinary credentials are valid

2. **Images not displaying**:

   - Check browser console for errors
   - Verify image URLs are being stored in database
   - Check if Cloudinary URLs are accessible

3. **Upload failures**:
   - Check file size (max 5MB)
   - Verify file type is image (jpg, png, gif, etc.)
   - Check network connectivity

### 9. Security Considerations

- **API Keys**: Never commit Cloudinary credentials to version control
- **File Validation**: Only image files are accepted
- **Size Limits**: 5MB maximum file size enforced
- **Access Control**: Uploads require valid authentication tokens

### 10. Cost Management

- **Free Tier**: 25GB storage, 25GB bandwidth/month
- **Monitoring**: Check Cloudinary dashboard for usage
- **Optimization**: Images are automatically optimized by Cloudinary

## Summary

With this setup, your website now:

- Stores all images online in Cloudinary
- Provides persistent image URLs that don't require website rebuilds
- Handles image uploads efficiently with proper error handling
- Maintains security with authentication and file validation

Images will now be properly stored and displayed on your website, solving the issue where images were showing as "successfully uploaded" but not displaying.
