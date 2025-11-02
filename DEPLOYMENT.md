# GitHub Pages Deployment Guide

Your UConnect landing page is ready to go live! Follow these simple steps to enable GitHub Pages.

## Enable GitHub Pages

1. **Go to your repository settings**
   - Visit: https://github.com/taslimahmedtamim/Uconnect/settings/pages

2. **Configure the source**
   - Under "Build and deployment"
   - Source: Select **GitHub Actions**

3. **Wait for deployment**
   - The workflow will run automatically (check the Actions tab)
   - Your site will be live at: `https://taslimahmedtamim.github.io/Uconnect/`

## What We've Set Up

✅ **Landing Page Files**
- `index.html` - Main landing page with hero, features, CTA sections
- `styles.css` - Responsive styling with dark/light mode support
- `script.js` - Interactive menu and form handling
- `assets/` - Logo, favicon, and hero illustration

✅ **Deployment Workflow**
- `.github/workflows/deploy.yml` - Automated GitHub Pages deployment
- Triggers on every push to main branch
- Can also be manually triggered from Actions tab

✅ **Repository Hygiene**
- `.gitignore` - Keeps unnecessary files out of version control

## Verify Deployment

After enabling GitHub Pages:

1. Go to the **Actions** tab in your repository
2. You should see a "Deploy to GitHub Pages" workflow running
3. Once complete (green checkmark), click on it to see the deployment URL
4. Visit your live site!

## Custom Domain (Optional)

To use a custom domain like `uconnect.example.com`:

1. Add a `CNAME` file to the repository root with your domain
2. Configure DNS settings with your domain provider
3. Update GitHub Pages settings with your custom domain

## Troubleshooting

**Workflow not running?**
- Check: Repository Settings → Actions → General
- Ensure "Allow all actions and reusable workflows" is enabled

**404 error?**
- Verify the source is set to "GitHub Actions" (not branch)
- Check the workflow completed successfully in Actions tab
- Wait 1-2 minutes after first deployment

**Assets not loading?**
- Make sure all asset paths are relative (e.g., `/assets/logo.svg`)
- The current setup uses root-relative paths, which work correctly

## Local Development

Test changes locally before pushing:

```bash
# Serve with Python
python3 -m http.server 5173

# Or use VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

Visit: http://localhost:5173

## Next Steps

1. ✅ Enable GitHub Pages (see steps above)
2. Share your live URL with the team
3. Iterate on design and content as needed
4. Consider adding analytics (Google Analytics, Plausible, etc.)
5. Add contact form backend integration when ready

---

**Need help?** Open an issue in the repository or reach out to the team.
