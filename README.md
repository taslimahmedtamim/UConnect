# 🚀 UConnect | AI Career & Team Ecosystem

Welcome to **UConnect**, an advanced, AI-powered platform built to bridge the gap between talented individuals, teams, and career opportunities. UConnect acts as a comprehensive ecosystem for professional growth, offering everything from interactive skill roadmapping to explainable AI job matches.

## ✨ Key Features

### 👤 Dynamic Professional Profiles & U-SkillMap
- **Unified Identity**: A clean, professional layout to showcase your skills, projects, summary, and experience.
- **U-SkillMap**: Visualize your technical domains using radar charts and matrices. Connects directly to Gemini AI to generate personalized learning roadmaps based on your target career goal.

### 🧠 Career Command Center (Dashboard)
- **Career Journey Tracker**: Visually track your progress through SkillMap, Projects, Resumes, and Jobs.
- **Context-Aware AI Recommendation**: Using Gemini AI, your dashboard generates a daily focus and specific action items based on your exact skills and goals.

### 💡 AI Project Portfolio
- **AI Project Generator**: Don't know what to build? The Gemini-powered AI Assistant generates complete, portfolio-ready project ideas with problem statements, recommended stacks, features, and difficulty ratings.
- **Showcase**: Beautifully track and display your projects with visual progress bars and status indicators.

### 👥 Smart Team Matchmaking
- **Explainable Match Percentage**: Instantly calculate your match percentage against a team's required skills.
- **Missing Skills Alert**: Highlights exactly what skills you are missing so you can jump back to U-SkillMap to learn them.
- **Find My Ideal Team**: Surface only the teams where you have a strong skill match.

### 💼 Opportunity Engine & AI Scoring
- **Match Score UI**: Job cards feature visual match scores comparing your profile to job requirements.
- **Skill Discovery Loop**: Click on a missing skill on a job posting to be taken straight to the SkillMap to add it to your learning path.
- **AI Resume Review**: Built-in Applicant Tracking System (ATS) simulator evaluates your custom resume against specific job opportunities.

### 🤖 Global UConnect AI Assistant
- A floating global AI assistant accessible from any page. It securely inherits your entire profile context (skills, career goals, experience) to act as a hyper-personalized career advisor.

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
- `/app/dashboard` - The Career Command Center.
- `/app/projects` - AI Project Assistant and Portfolio.
- `/app/teams` - Smart matchmaking algorithm and team cards.
- `/app/opportunities` - Job board with explainable match scoring.
- `/components/GlobalAIAssistant.tsx` - The floating contextual AI advisor.
- `/prisma/schema.prisma` - Core data schema.

---

## 📝 License
This project is licensed under the MIT License.
