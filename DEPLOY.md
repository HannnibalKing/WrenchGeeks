# How to Deploy WrenchGeeks (and hide your GitHub username)

Currently, your site is hosted on GitHub Pages, which uses the URL format:
`https://HannibalKing.github.io/WrenchGeeks`

If you want to hide "HannibalKing" or have a professional URL, you have two main options:

## Option 1: Buy a Custom Domain (Professional)
This gives you `www.wrenchgeeks.com` (or similar).
1. Buy a domain from Namecheap, GoDaddy, or Google Domains (~$10/year).
2. Go to your GitHub Repository Settings -> Pages.
3. Under "Custom domain", enter your new domain (e.g., `wrenchgeeks.com`).
4. GitHub will verify it and your site will now be at that address.

## Option 2: Use Netlify or Vercel (Free & Neutral)
If you don't want to pay, you can use a different host that doesn't use your username in the URL.

### Using Netlify (Recommended)
1. Go to [Netlify.com](https://www.netlify.com) and sign up (you can use your GitHub login).
2. Click "Add new site" -> "Import an existing project".
3. Select "GitHub" and choose your `WrenchGeeks` repository.
4. **Build Settings:**
   - **Publish directory:** `docs`
5. Click "Deploy".
6. Netlify will give you a random name like `happy-mechanic-12345.netlify.app`.
7. You can change this in "Site Settings" -> "Change site name" to something like `wrenchgeeks-app.netlify.app`.

**Result:** Your URL will be `https://wrenchgeeks-app.netlify.app`. No "HannibalKing" visible.

## Option 3: Cloudflare Pages (Free & Fast)
Similar to Netlify, but runs on Cloudflare's network.
1. Go to Cloudflare Dashboard -> Pages.
2. Connect GitHub account.
3. Select `WrenchGeeks`.
4. Set **Build output directory** to `docs`.
5. Deploy.
6. URL will be `wrenchgeeks.pages.dev`.
