# Migration from Google Sheets to Neon Database

## Overview

This guide will help you migrate your Story Matters website from Google Sheets to Neon database on Netlify.

## Prerequisites

- Neon database account with connection string
- Google Sheets data you want to migrate
- Netlify account

## Step 1: Set up Neon Database

1. **Go to your Neon dashboard**
2. **Copy your connection string** (looks like: `postgresql://username:password@host/database`)
3. **Add it to Netlify environment variables:**
   - Variable Name: `DATABASE_URL`
   - Variable Value: Your Neon connection string

## Step 2: Create Database Tables

1. **Connect to your Neon database** (using Neon console or any PostgreSQL client)
2. **Run the SQL schema** from `database-schema.sql`:
   ```sql
   -- Copy and paste the contents of database-schema.sql
   ```

## Step 3: Migrate Your Data

1. **Install dependencies:**

   ```bash
   npm install googleapis pg
   ```

2. **Set up environment variables locally:**

   ```bash
   export GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
   export GOOGLE_SPREADSHEET_ID='your-spreadsheet-id'
   export DATABASE_URL='your-neon-connection-string'
   ```

3. **Run the migration script:**
   ```bash
   node migrate-to-neon.js
   ```

## Step 4: Update Netlify Functions

Your Netlify Functions have already been updated to use Neon instead of Google Sheets.

## Step 5: Deploy to Netlify

1. **Commit and push your changes:**

   ```bash
   git add .
   git commit -m "Migrate from Google Sheets to Neon database"
   git push
   ```

2. **Netlify will automatically deploy** with the new Neon-based functions

## Step 6: Verify Migration

1. **Check your Neon database** to ensure data was migrated
2. **Test your website** to ensure stories and users are loading
3. **Remove Google Sheets environment variables** from Netlify (optional)

## Benefits of Neon over Google Sheets

✅ **Better Performance** - Faster database queries  
✅ **No Rate Limits** - Unlimited API calls  
✅ **Real-time Updates** - Instant data synchronization  
✅ **Better Security** - Managed database with proper access controls  
✅ **Scalability** - Handles high traffic automatically  
✅ **No API Key Management** - Built-in Netlify integration

## Troubleshooting

- **Connection Issues**: Verify your `DATABASE_URL` is correct
- **Migration Errors**: Check that your Google Sheets data structure matches the expected format
- **Function Errors**: Ensure the `pg` package is installed in your Netlify Functions

## Support

If you encounter issues during migration, check the Netlify Functions logs in your dashboard.
