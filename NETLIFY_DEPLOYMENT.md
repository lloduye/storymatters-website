# Netlify Deployment Guide

## Prerequisites

- Netlify account
- GitHub/GitLab repository connected to Netlify
- Environment variables configured

## Environment Variables Setup

### Required Environment Variables

Set these in your Netlify dashboard under **Site settings > Environment variables**:

#### Database Configuration

```
DATABASE_URL=postgresql://neondb_owner:npg_QANzfo0P5YlC@ep-divine-credit-aeo8sru9-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

#### App Configuration

```
ADMIN_TOKEN=your_secure_admin_token_here
```

#### Cloudinary Configuration

```
CLOUDINARY_CLOUD_NAME=dvbedfiv7
CLOUDINARY_API_KEY=651552198245358
CLOUDINARY_API_SECRET=iQX55hdMyifxg69toEOYBsxJK9U
```

#### PesaPal Integration

```
PESAPAL_CONSUMER_KEY=oi8kiBIenB6FYAVE7UoM4XQVV1NkFEQ2
PESAPAL_CONSUMER_SECRET=K2C+Cp4AFy2XV/ancyeyfbZYbPs=
PESAPAL_ENVIRONMENT=demo
```

### Build Environment Variables

These are automatically set by the `netlify.toml` file:

```
NODE_VERSION=18
NPM_FLAGS=--legacy-peer-deps
CI=false
REACT_APP_ENV=production
GENERATE_SOURCEMAP=false
```

## Deployment Steps

### 1. Connect Repository

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click **"New site from Git"**
3. Choose your Git provider (GitHub, GitLab, etc.)
4. Select your repository: `storymatters-website`

### 2. Configure Build Settings

The build settings are automatically configured via `netlify.toml`:

- **Build command**: `npm run build`
- **Publish directory**: `build`
- **Functions directory**: `netlify/functions`

### 3. Set Environment Variables

1. Go to **Site settings > Environment variables**
2. Add each environment variable listed above
3. Set the scope to **All scopes** for production deployment

### 4. Deploy

1. Click **"Deploy site"**
2. Wait for the build to complete
3. Your site will be available at the provided Netlify URL

## Post-Deployment Configuration

### Custom Domain (Optional)

1. Go to **Domain management**
2. Add your custom domain
3. Configure DNS settings as instructed

### SSL Certificate

- Netlify automatically provides SSL certificates
- No additional configuration needed

## Function Deployment

Your Netlify functions are located in `netlify/functions/` and include:

- `auth.js` - Authentication functions
- `stories.js` - Story management
- `users.js` - User management
- `upload.js` - File upload handling
- `pesapal-api.js` - Payment integration

## Troubleshooting

### Common Issues

#### Build Failures

- Check Node.js version compatibility
- Verify all environment variables are set
- Check for missing dependencies

#### Function Errors

- Verify function syntax
- Check environment variables in function scope
- Review Netlify function logs

#### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check Neon database accessibility
- Ensure SSL mode is properly configured

### Debugging

1. Check **Deploy logs** for build errors
2. Review **Function logs** for runtime errors
3. Use **Netlify Dev** for local testing

## Local Development with Netlify

### Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Run Locally

```bash
netlify dev
```

This will run your site locally with Netlify functions and environment variables.

## Performance Optimization

### Build Optimizations

- Source maps disabled for production
- Static assets cached for 1 year
- Security headers enabled

### Function Optimization

- Uses esbuild for faster bundling
- External modules properly configured
- Optimized for cold starts

## Security Considerations

### Environment Variables

- Never commit sensitive data to Git
- Use Netlify's environment variable system
- Rotate secrets regularly

### Headers

- XSS protection enabled
- Content type sniffing disabled
- Frame options restricted

## Monitoring and Analytics

### Netlify Analytics

- Built-in analytics available
- Performance monitoring
- Error tracking

### Custom Monitoring

- Function execution logs
- Build performance metrics
- Deployment status tracking

## Support Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify Functions Guide](https://docs.netlify.com/functions/overview/)
- [Netlify Community](https://community.netlify.com/)
- [Function Examples](https://functions.netlify.com/)

## Emergency Rollback

If you need to rollback:

1. Go to **Deploys** tab
2. Find the previous working deployment
3. Click **"Publish deploy"**
4. Your site will revert to the previous version
