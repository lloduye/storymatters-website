# 🔐 Netlify Environment Variables - ACTUAL VALUES

**⚠️ IMPORTANT: This file contains your actual credentials. DO NOT commit this to Git!**

Copy these values exactly as shown below and paste them into your Netlify dashboard under **Site settings > Environment variables**.

## Required Environment Variables

### Database Configuration

```
DATABASE_URL=postgresql://neondb_owner:npg_QANzfo0P5YlC@ep-divine-credit-aeo8sru9-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### App Configuration

```
ADMIN_TOKEN=admin123
```

### Cloudinary Configuration

```
CLOUDINARY_CLOUD_NAME=dvbedfiv7
CLOUDINARY_API_KEY=651552198245358
CLOUDINARY_API_SECRET=iQX55hdMyifxg69toEOYBsxJK9U
```

#### PesaPal Integration
```
PESAPAL_CONSUMER_KEY=oi8kiBIenB6FYAVE7UoM4XQVV1NkFEQ2
PESAPAL_CONSUMER_SECRET=K2C+Cp4AFy2XV/ancyeyfbZYbPs=
PESAPAL_ENVIRONMENT=production
```

## How to Set in Netlify

1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site settings > Environment variables**
4. Click **"Add a variable"**
5. Add each variable above with its exact value
6. Set scope to **"All scopes"**
7. Click **"Save"**

## Security Notes

- ✅ These values are now secure and won't be committed to Git
- ✅ Your `env.local` file now uses placeholders
- ✅ Production values will be stored securely in Netlify
- ✅ Local development can still use actual values if needed

## After Setting Variables

1. **Redeploy your site** to apply the new environment variables
2. **Test all functionality** to ensure everything works
3. **Delete this file** after you've copied the values to Netlify

---

**Last Updated:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")  
**Status:** Ready for Netlify deployment
