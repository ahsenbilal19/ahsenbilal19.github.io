# Ahsen Bilal — Portfolio

## 📁 Folder Structure
```
portfolio/
├── index.html          ← Main file (all 4 pages inside)
├── css/
│   └── style.css       ← All styles
├── js/
│   └── main.js         ← Particles, typing, routing, animations
├── assets/
│   ├── Ahsen_Bilal_Resume.pdf   ← Put your CV here!
│   └── (project screenshots go here later)
└── README.md
```

---

## 🚀 STEP-BY-STEP: Going Live (Free, Permanent Link)

### Step 1 — Open in VS Code
- Open the `portfolio` folder in VS Code
- Install the extension **Live Server** (right-click index.html → Open with Live Server) to preview locally

### Step 2 — Add your CV
- Copy your `Ahsen_Bilal_Resume_BEST.docx` or export it as PDF
- Rename it `Ahsen_Bilal_Resume.pdf`
- Place it inside the `assets/` folder

### Step 3 — Create a GitHub account (if you don't have one)
- Go to https://github.com and sign up
- Your username: ahsenbilal19 (you already have this!)

### Step 4 — Create a new GitHub Repository
1. Click the **+** icon → **New repository**
2. Name it exactly: `ahsenbilal19.github.io`
   ⚠️ This special name tells GitHub to host it as your website
3. Set it to **Public**
4. Click **Create repository**

### Step 5 — Upload your files
**Option A (Easy — drag & drop):**
1. Open your new repo on GitHub
2. Click **uploading an existing file**
3. Drag your entire `portfolio` folder contents (not the folder itself)
4. Click **Commit changes**

**Option B (VS Code — recommended):**
```bash
# In VS Code terminal (Ctrl + `)
git init
git add .
git commit -m "Initial portfolio launch"
git branch -M main
git remote add origin https://github.com/ahsenbilal19/ahsenbilal19.github.io.git
git push -u origin main
```

### Step 6 — Enable GitHub Pages
1. Go to your repo → **Settings** → **Pages** (left sidebar)
2. Source: **Deploy from a branch**
3. Branch: **main** → **/ (root)**
4. Click **Save**

### Step 7 — Your live link 🎉
```
https://ahsenbilal19.github.io
```
Wait 2–5 minutes after first deploy. Then share this link anywhere!

---

## 🖼️ Adding Project Images Later

1. Take a screenshot of your project (or use a mockup tool)
2. Save it as `smart-rental.jpg`, `music-app.jpg`, etc.
3. Put it in the `assets/` folder
4. In `index.html`, find the project card and change:

```html
<!-- FROM THIS (emoji placeholder): -->
<div class="project-img">🏠</div>

<!-- TO THIS (real image): -->
<div class="project-img has-image">
  <img src="assets/smart-rental.jpg" alt="Smart Rental Platform">
</div>
```

5. Save → push to GitHub → live in ~1 minute

---

## 🖼️ Adding Your Profile Photo

In `index.html`, find this comment in the About page:
```html
<!-- Replace the emoji below with: <img src="../assets/photo.jpg" alt="Ahsen Bilal"> -->
👨‍💻
```
Replace with:
```html
<img src="assets/photo.jpg" alt="Ahsen Bilal">
```

---

## ✏️ Quick Edits Reference

| What to change | Where in index.html |
|---|---|
| Your name/tagline | `#page-home` → `.hero-name` |
| Hero description | `.hero-desc` paragraph |
| Skills list | `#page-about` → `.skills-grid` |
| Project links | `#page-projects` → `.proj-link` href="" |
| Contact email | Change all `ranacnco17@gmail.com` instances |
| LinkedIn/GitHub | Search `ahsenbilal19` and update hrefs |

---

## 🔄 Updating Your Portfolio After Changes
Every time you edit files:
```bash
git add .
git commit -m "Update portfolio"
git push
```
Changes go live in ~30 seconds.

---

## 🌐 Custom Domain (Optional — Later)
If you ever buy a domain like `ahsenbilal.dev`:
1. Go to repo → Settings → Pages → Custom domain
2. Type your domain and save
3. Done — same site, professional domain

---

Built with: Pure HTML · CSS · Vanilla JS · GitHub Pages (Free forever)
