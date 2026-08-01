# UConnect

<div align="center">

![UConnect Logo](https://img.shields.io/badge/U-Connect-2563eb?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTggOHY0YTQgNCAwIDAgMCA4IDBWOCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Font Awesome](https://img.shields.io/badge/Font_Awesome-339AF0?logo=fontawesome&logoColor=white)](https://fontawesome.com/)

**Turn Academic Work Into Career Assets**

An AI-driven university ecosystem connecting students, teachers, and recruiters to collaborate on projects, form balanced teams, build verified portfolios, and discover opportunities.

[Live Demo](#demo) • [Features](#-features) • [Screenshots](#-screenshots) • [Getting Started](#-getting-started) • [Team](#-team)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Pages Overview](#-pages-overview)
- [Customization](#-customization)
- [Team](#-team)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About

**UConnect** is a comprehensive web platform designed to bridge the gap between academic learning and professional employment. The platform enables:

- 🎓 **Students** to showcase projects, build skills, and find opportunities
- 👨‍🏫 **Teachers** to supervise teams and mentor students
- 💼 **Recruiters** to discover verified talent with real project experience

### Core Value Proposition

> Transform academic work into verifiable career assets and accelerate the path from **learning → experience → employment**.

---

## ✨ Features

### 🏠 Core Modules

| Feature | Description |
|---------|-------------|
| **Dashboard** | Centralized hub with quick stats, active projects, recent activity, and personalized recommendations |
| **Profile** | Evolving skill graph with verified badges, achievements, and comprehensive user information |
| **Projects** | Full project lifecycle management with status tracking and collaboration tools |
| **Teams** | AI-powered team formation based on skills, interests, and compatibility |

### 💼 Career & Employability

| Feature | Description |
|---------|-------------|
| **U-Resume** | AI-powered resume builder that generates ATS-friendly resumes from your profile |
| **Opportunities** | Job/internship matching with real-time listings and skill-based recommendations |
| **U-SkillMap** | Visual skill tracking with prerequisites, related skills, and growth analytics |
| **Showcase** | Public portfolio to display completed projects and achievements |

### 🏆 Community & Engagement

| Feature | Description |
|---------|-------------|
| **Leaderboard** | Gamified rankings with XP, streaks, and competitive challenges |
| **Mentors** | Connect with industry professionals and senior students |
| **Messages** | Real-time communication with team members and mentors |
| **Help Center** | Comprehensive FAQ and support resources |

### 🎨 UI/UX Features

- 🌙 **Dark/Light Mode** - Seamless theme switching with system preference detection
- 📱 **Fully Responsive** - Mobile-first design that works on all devices
- ⚡ **Smooth Animations** - Subtle transitions and micro-interactions
- 🎯 **Intuitive Navigation** - Collapsible sidebar with organized sections

---

## 📸 Screenshots

<details>
<summary>🏠 Landing Page</summary>

The landing page features:
- Hero section with animated elements
- Feature highlights with quick links
- How it works step-by-step guide
- Testimonials from users
- Team section
- Responsive footer

</details>

<details>
<summary>📊 Dashboard</summary>

The dashboard includes:
- Quick stats cards (Projects, Team Members, XP, Streak)
- Active projects overview
- Recent activity feed
- Quick actions panel
- Personalized recommendations

</details>

<details>
<summary>👤 Profile</summary>

The profile page shows:
- Hero section with avatar and verification badge
- Skills distribution with progress bars
- Achievements and badges
- Projects portfolio
- Activity timeline

</details>

---

## 🛠 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) |
| **Styling** | Custom CSS with CSS Variables, Flexbox, Grid |
| **Typography** | Google Fonts (Inter) |
| **Icons** | Font Awesome 6.4, Custom SVG Icons |
| **Design System** | Custom component library with consistent theming |

### Key Technical Features

```
✓ CSS Custom Properties for theming
✓ CSS Grid & Flexbox layouts
✓ Smooth scroll navigation
✓ LocalStorage for theme persistence
✓ Modular JavaScript architecture
✓ Responsive breakpoints
✓ Accessible markup (ARIA labels)
```

---

## 📁 Project Structure

```
UConnect/
├── index.html              # Landing page
├── styles.css              # Main stylesheet (4000+ lines)
├── script.js               # Core JavaScript functionality
├── profile-integration.js  # Profile & domain integration
├── README.md               # Documentation
│
└── pages/
    ├── layout.css          # Shared layout styles for dashboard pages
    ├── layout.js           # Shared JavaScript for dashboard pages
    │
    ├── dashboard.html      # Main user dashboard
    ├── profile.html        # User profile page
    ├── projects.html       # Projects management
    ├── teams.html          # Team formation & management
    ├── opportunities.html  # Job/internship listings
    │
    ├── resume.html         # AI Resume Builder (U-Resume)
    ├── skillmap.html       # Visual skill tracking (U-SkillMap)
    ├── showcase.html       # Public project showcase
    │
    ├── leaderboard.html    # Gamification rankings
    ├── mentors.html        # Mentor connections
    ├── messages.html       # Messaging system
    │
    ├── login.html          # Authentication - Login
    ├── register.html       # Authentication - Registration
    └── help.html           # Help & FAQ
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (Node Package Manager)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/taslimahmedtamim/UConnect.git
   cd UConnect/UConnect_raw1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables (Optional)**
   Copy `.env.example` to `.env`:
   ```bash
   # Add your MongoDB Atlas connection string to .env if available
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/uconnect
   JWT_SECRET=your_jwt_secret_key
   ```
   *(Note: If `MONGODB_URI` is omitted, UConnect automatically runs in local memory store mode).*

4. **Start the backend server & frontend**
   ```bash
   npm start
   ```

5. **Visit in browser**
   - Main App: `http://localhost:3000`
   - Login Page: `http://localhost:3000/pages/login.html`
   - API Endpoint: `http://localhost:3000/api`

---

## ☁️ Free Vercel Deployment Guide

1. Push your code to GitHub.
2. Sign in to [Vercel](https://vercel.com).
3. Click **Add New Project** and select your GitHub repository.
4. Set **Environment Variables** in Vercel project settings:
   - `MONGODB_URI`: Your MongoDB Atlas Connection URI
   - `JWT_SECRET`: Random secure string
5. Click **Deploy**. Vercel will automatically build the static frontend and serverless API functions!


---

## 📄 Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/index.html` | Landing page with features, testimonials, and CTA |
| **Login** | `/pages/login.html` | User authentication |
| **Register** | `/pages/register.html` | New user registration |
| **Dashboard** | `/pages/dashboard.html` | Main user hub |
| **Profile** | `/pages/profile.html` | User profile & settings |
| **Projects** | `/pages/projects.html` | Project management |
| **Teams** | `/pages/teams.html` | Team collaboration |
| **Opportunities** | `/pages/opportunities.html` | Job listings |
| **Resume** | `/pages/resume.html` | Resume builder |
| **SkillMap** | `/pages/skillmap.html` | Skill visualization |
| **Showcase** | `/pages/showcase.html` | Portfolio display |
| **Leaderboard** | `/pages/leaderboard.html` | Rankings & gamification |
| **Mentors** | `/pages/mentors.html` | Mentor connections |
| **Messages** | `/pages/messages.html` | Communication |
| **Help** | `/pages/help.html` | Support & FAQ |

---

## 🎨 Customization

### Theme Colors

Edit CSS variables in `styles.css`:

```css
:root {
    --primary: #2563eb;       /* Main brand color */
    --primary-dark: #1d4ed8;  /* Darker shade */
    --primary-light: #3b82f6; /* Lighter shade */
    --accent: #8b5cf6;        /* Accent color */
    
    /* Status colors */
    --success: #10b981;
    --warning: #f59e0b;
    --error: #ef4444;
    --info: #3b82f6;
}
```

### Dark Mode

The platform supports automatic dark mode. Colors are defined in:

```css
[data-theme="dark"] {
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --text-primary: #f1f5f9;
    /* ... */
}
```

### Adding New Domains

Edit `profile-integration.js` to add new skill domains:

```javascript
const domainOptions = {
    'your-domain': {
        name: 'Your Domain Name',
        icon: icons.yourIcon,
        color: '#hexcolor',
        skills: [
            { name: 'Skill 1', level: 85, category: 'Core' },
            // ...
        ]
    }
};
```

---

## 👥 Team

<div align="center">

| <img src="https://github.com/taslimahmedtamim.png" width="100" style="border-radius:50%"/> | <img src="https://github.com/salmankabirsany.png" width="100" style="border-radius:50%"/> | <img src="https://github.com/MrMajharul.png" width="100" style="border-radius:50%"/> |
|:---:|:---:|:---:|
| **Taslim Ahmed Tamim** | **Salman Kabir Sany** | **Majharul Islam** |
| Full Stack Developer | Backend Developer | AI/ML Engineer |
| [![GitHub](https://img.shields.io/badge/-GitHub-181717?logo=github)](https://github.com/taslimahmedtamim) | [![GitHub](https://img.shields.io/badge/-GitHub-181717?logo=github)](https://github.com/salmankabirsany) | [![GitHub](https://img.shields.io/badge/-GitHub-181717?logo=github)](https://github.com/MrMajharul) |

</div>

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Update documentation for new features
- Test on multiple browsers
- Ensure responsive design works

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 UConnect Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 📬 Contact

- **Project Link**: [https://github.com/taslimahmedtamim/UConnect](https://github.com/taslimahmedtamim/UConnect)
- **Email**: taslimahmedtamim4u@gmail.com

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by the UConnect Team

</div>
