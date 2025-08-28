# 🚀 Netlify Deployment Checklist

## Pre-Deployment Setup

### ✅ Environment Variables

- [ ] `DATABASE_URL` - Neon PostgreSQL connection string
- [ ] `ADMIN_TOKEN` - Secure admin authentication token
- [ ] `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- [ ] `CLOUDINARY_API_KEY` - Cloudinary API key
- [ ] `CLOUDINARY_API_SECRET` - Cloudinary API secret
- [ ] `PESAPAL_CONSUMER_KEY` - PesaPal consumer key
- [ ] `PESAPAL_CONSUMER_SECRET` - PesaPal consumer secret
- [ ] `PESAPAL_ENVIRONMENT` - Set to 'demo' for testing, 'live' for production

### ✅ Configuration Files

- [ ] `netlify.toml` - Netlify build configuration
- [ ] `.gitignore` - Excludes sensitive files
- [ ] `env.example` - Template for environment variables
- [ ] `env.production` - Production environment reference

### ✅ Code Preparation

- [ ] All API calls use relative URLs (`/api/*`)
- [ ] Netlify functions are in `netlify/functions/`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `build`

## Deployment Steps

### ✅ Connect to Netlify

- [ ] Go to [Netlify Dashboard](https://app.netlify.com/)
- [ ] Click "New site from Git"
- [ ] Choose Git provider (GitHub/GitLab)
- [ ] Select repository: `storymatters-website`

### ✅ Configure Build Settings

- [ ] Build command: `npm run build`
- [ ] Publish directory: `build`
- [ ] Functions directory: `netlify/functions`
- [ ] Node version: 18

### ✅ Set Environment Variables

- [ ] Go to Site settings > Environment variables
- [ ] Add all required environment variables
- [ ] Set scope to "All scopes"
- [ ] Verify no sensitive data in Git history

### ✅ Deploy

- [ ] Click "Deploy site"
- [ ] Wait for build completion
- [ ] Check for build errors
- [ ] Verify site is accessible

## Post-Deployment Verification

### ✅ Function Testing

- [ ] Test authentication endpoints
- [ ] Test story management
- [ ] Test user management
- [ ] Test file uploads
- [ ] Test payment integration

### ✅ Frontend Testing

- [ ] Test user login/logout
- [ ] Test story creation/editing
- [ ] Test admin dashboard
- [ ] Test responsive design
- [ ] Test form submissions

### ✅ Performance Check

- [ ] Page load times
- [ ] Function response times
- [ ] Image loading
- [ ] Database queries

## Security Verification

### ✅ Environment Variables

- [ ] No sensitive data in Git
- [ ] All secrets are in Netlify dashboard
- [ ] Production tokens are secure
- [ ] Database connection is encrypted

### ✅ Access Control

- [ ] Admin routes are protected
- [ ] User authentication works
- [ ] Role-based access control
- [ ] API endpoints are secure

## Monitoring Setup

### ✅ Netlify Analytics

- [ ] Enable site analytics
- [ ] Set up function monitoring
- [ ] Configure error tracking
- [ ] Set up performance alerts

### ✅ Custom Monitoring

- [ ] Database connection health
- [ ] Function execution logs
- [ ] Error rate monitoring
- [ ] Response time tracking

## Final Steps

### ✅ Documentation

- [ ] Update deployment guide
- [ ] Document environment variables
- [ ] Create troubleshooting guide
- [ ] Document rollback procedures

### ✅ Team Access

- [ ] Grant team access to Netlify
- [ ] Set up deployment notifications
- [ ] Configure branch deployments
- [ ] Set up preview deployments

### ✅ Backup & Recovery

- [ ] Document rollback process
- [ ] Test emergency procedures
- [ ] Set up automated backups
- [ ] Document disaster recovery

## 🎯 Success Criteria

Your deployment is successful when:

- ✅ Site is accessible at Netlify URL
- ✅ All functions are working
- ✅ Database connections are stable
- ✅ User authentication works
- ✅ Admin features are functional
- ✅ Performance is acceptable
- ✅ Security measures are in place

## 🚨 Emergency Contacts

If deployment fails:

1. Check Netlify build logs
2. Review function logs
3. Verify environment variables
4. Test functions locally
5. Contact support if needed

---

**Deployment Date:** ****\_\_\_****  
**Deployed By:** ****\_\_\_****  
**Status:** ****\_\_\_****  
**Notes:** ****\_\_\_****
