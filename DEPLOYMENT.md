# Deployment Guide for TAS Outsourcing Blog Preview

## 📦 Prerequisites

1. GitHub account
2. Vercel account (free tier works)
3. Git installed locally

## 🚀 Step 1: Push to GitHub

### Create a new repository on GitHub:

1. Go to [GitHub New Repository](https://github.com/new)
2. Name it: `tas-blog-preview` (or your preferred name)
3. Make it **Private** or **Public** based on preference
4. **DON'T** initialize with README (we already have one)
5. Click "Create Repository"

### Push your local code:

```bash
# Add GitHub remote (replace with your repository URL)
git remote add origin https://github.com/YOUR-USERNAME/tas-blog-preview.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🌐 Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Easiest)

1. Go to [Vercel](https://vercel.com)
2. Sign up/Login with your GitHub account
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: **Next.js** (auto-detected)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)
6. Click "Deploy"
7. Wait 2-3 minutes for deployment
8. Your app will be live at: `https://[your-project].vercel.app`

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (in blog-preview directory)
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? tas-blog-preview
# - In which directory? ./
# - Override settings? N
```

## 🔧 Step 3: Configure Production

### Environment Variables (Optional)

In Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add variables:
   - `NEXT_PUBLIC_PRODUCTION_URL`: https://tascoutsourcing.sa
   - `NEXT_PUBLIC_API_ENDPOINT`: Your Laravel API URL

### Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your domain: `preview.tascoutsourcing.sa`
3. Follow DNS configuration instructions

## 📁 Step 4: Articles Directory Setup

### Important: Articles Directory

The blog system expects articles in a parent `articles/` directory. For production:

1. **Option 1**: Include articles in the repository
   - Remove `/articles` from `.gitignore`
   - Commit your markdown files

2. **Option 2**: Use a separate articles repository
   - Create a GitHub Action to copy articles during build

3. **Option 3**: Modify the path in `src/lib/articles.ts`:
   ```typescript
   // Change from:
   const articlesDirectory = path.join(process.cwd(), '..', 'articles');
   // To:
   const articlesDirectory = path.join(process.cwd(), 'articles');
   ```

## 🔄 Step 5: Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every pull request gets a unique URL

## 📊 Step 6: Monitoring

### Vercel Dashboard Features:
- **Analytics**: Page views, performance metrics
- **Logs**: Real-time function logs
- **Domains**: Manage custom domains
- **Environment Variables**: Secure configuration

## 🐛 Troubleshooting

### Build Fails
```bash
# Check build logs in Vercel dashboard
# Common fixes:
npm install  # Ensure all dependencies
npm run build  # Test build locally
```

### Articles Not Showing
- Verify articles directory path
- Check file permissions
- Ensure `.md` file extension

### CSS Not Loading
- Clear build cache in Vercel
- Check Tailwind configuration

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [GitHub Actions for Vercel](https://github.com/marketplace/actions/vercel-action)

## 📞 Support

For deployment issues:
- Vercel Support: [vercel.com/support](https://vercel.com/support)
- GitHub Issues: Create an issue in your repository

---

**Deployment URL Pattern**: `https://tas-blog-preview.vercel.app`
**Custom Domain**: `preview.tascoutsourcing.sa` (optional)

Last updated: January 2025