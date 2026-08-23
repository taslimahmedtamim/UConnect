# 🚀 UConnect | AI-Powered Career & Community Ecosystem

Welcome to **UConnect**, a next-generation platform designed to bridge the gap between talented individuals, collaborative teams, mentorship, and career opportunities. UConnect acts as a comprehensive ecosystem for professional growth, offering everything from interactive AI-driven skill roadmapping to explainable job matching and a vibrant community feed.

---

## ✨ Comprehensive Features

### 👤 Dynamic Profiles & U-SkillMap
- **Unified Identity**: A clean, professional layout to showcase your skills, projects, summary, and experience.
- **AI Profile Insights**: Instantly generates actionable insights, strengths, weaknesses, and a match score based on your target career.
- **U-SkillMap**: Visualize your technical domains. Connects directly to Google's Gemini AI to generate personalized learning roadmaps, interactive quizzes, and a floating study assistant based on your exact career goals.

### 🧠 Career Command Center (Dashboard)
- **Career Journey Tracker**: Visually track your progress through SkillMap, Projects, Resumes, and Jobs.
- **Context-Aware AI Recommendation**: Your dashboard generates a daily focus and specific action items based on your skills and goals.
- **Daily Commitment Tracker**: Build consistency with a daily learning check-in that generates smart AI-driven push notifications to keep you on track.

### 🌐 Community Feed
- **Reddit-Style Networking**: A fully integrated community feed where users can post thoughts, share knowledge, and ask questions.
- **Interactive Engagement**: Upvote posts with a heart-based like system and jump into threaded comment discussions directly from the feed.

### 🎓 Mentorship & Help Board
- **AI Mentor Matchmaking**: UConnect uses AI to analyze your skill gaps and instantly pairs you with the perfect mentors from the community.
- **Session Booking**: Mentors and students can schedule sessions directly through the platform.
- **Help Board**: Post specific coding or career problems and get matched with peers or experts who can assist. Features an AI-assistant that can optionally answer your help board questions instantly.

### 💡 AI Project Portfolio
- **AI Project Generator**: Don't know what to build? The Gemini-powered AI Assistant generates complete, portfolio-ready project ideas with problem statements, recommended stacks, features, and difficulty ratings tailored to your current skill level.
- **Showcase**: Beautifully track and display your projects with visual progress bars and status indicators.

### 👥 Smart Team Matchmaking
- **Explainable Match Percentage**: Instantly calculate your match percentage against a team's required skills.
- **Missing Skills Alert**: Highlights exactly what skills you are missing so you can jump back to U-SkillMap to learn them.
- **Find My Ideal Team**: Surface only the teams where you have a strong skill match.

### 💼 Opportunity Engine & U-Resume
- **Match Score UI**: Job cards feature visual match scores comparing your profile to job requirements.
- **U-Resume**: Build, scan, and improve your resume using AI. Features an Applicant Tracking System (ATS) simulator that evaluates your resume against specific job descriptions to boost your hireability.

### 🤖 Global UConnect AI Assistant
- A floating global AI assistant accessible from any page via a purple spark icon. It securely inherits your entire profile context (skills, career goals, experience) to act as a hyper-personalized, context-aware career advisor.

---

## 🛠️ Technology Stack
- **Framework**: Next.js 16 (App Router)
- **Frontend**: React 19, Tailwind CSS v4, Lucide React (Icons)
- **Backend/API**: Next.js Route Handlers (`/api`)
- **Database**: MySQL managed via Prisma ORM
- **AI Integration**: `@google/generative-ai` SDK (Gemini API 3.5 Flash)
- **Authentication**: Custom JWT (JSON Web Tokens) & bcryptjs
- **State Management**: React Context (`UserProvider`, `ThemeProvider`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MySQL server running locally or remotely

### 1. Installation
```bash
# Install dependencies
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory and configure the following variables:
```env
# Database Connection (MySQL)
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/uconnect_db"

# Authentication Secret
JWT_SECRET="your-super-secret-jwt-key"

# Google Gemini API Key
GEMINI_API_KEY="your-google-gemini-api-key"
```

### 3. Database Setup
Sync the Prisma schema to your MySQL database to create the necessary tables:
```bash
npx prisma db push
```

### 4. Run the Development Server
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to explore the ecosystem.

---

## 📂 Project Structure Highlights
- `/app/dashboard` - The Career Command Center & Daily Tracker.
- `/app/feed` - Reddit-style Community Feed.
- `/app/mentors` - AI Mentor Matchmaking and scheduling.
- `/app/resume` - ATS Simulator and AI Resume Builder.
- `/app/projects` - AI Project Assistant and Portfolio.
- `/app/teams` - Smart matchmaking algorithm and team cards.
- `/app/opportunities` - Job board with explainable match scoring.
- `/components/GlobalAIAssistant.tsx` - The floating contextual AI advisor.
- `/prisma/schema.prisma` - Core data schema.

---

## 📝 License
This project is licensed under the MIT License.
