# National Girlfriend Day Website - Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended - Easy Full-Stack)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Add Custom Domain:**
   - Go to [vercel.com](https://vercel.com) dashboard
   - Select your project → Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

### Option 2: Netlify (Frontend Only)

1. **Build for static hosting:**
   - Upload just the `frontend` folder to Netlify
   - Set custom domain in Site Settings

### Option 3: Railway (Full-Stack)

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy:**
   ```bash
   railway login
   railway init
   railway up
   ```

### Option 4: Heroku (Full-Stack)

1. **Install Heroku CLI**
2. **Create Procfile:**
   ```
   web: cd backend && npm start
   ```
3. **Deploy:**
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

## 🌐 Custom Domain Setup

### DNS Configuration (for any hosting provider):

1. **Buy domain** from GoDaddy, Namecheap, etc.
2. **Add DNS records:**
   - A record: `@` → `your-server-ip`
   - CNAME: `www` → `your-app-url`

### SSL Certificate:
Most providers (Vercel, Netlify, Railway) provide free SSL automatically.

## 💡 Production Considerations

### Environment Variables:
Create `.env` file for sensitive data:
```
NODE_ENV=production
PORT=3000
```

### Database:
For production, consider using:
- MongoDB Atlas (free tier)
- PostgreSQL on Railway
- Firebase Firestore

## 🔧 Files Included for Deployment:
- `vercel.json` - Vercel configuration
- Updated `package.json` with build scripts
- Production-ready server setup
