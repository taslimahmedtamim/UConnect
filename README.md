# 🚀 UConnect 2.0 | AI Career & Team Ecosystem

Welcome to **UConnect 2.0**, an advanced, AI-powered platform built to bridge the gap between talented individuals, teams, and career opportunities. UConnect acts as a comprehensive ecosystem for professional growth, offering everything from verified certifications to an interactive AI resume builder.

## ✨ Key Features

### 👤 Dynamic Professional Profiles
- **LinkedIn-Style Interface**: A clean, professional layout to showcase your skills, summary, and experience.
- **Direct Image Uploads**: Seamlessly upload and update your profile picture.
- **Verified Certifications**: Upload certificates with an associated transaction/reference ID; certificates with a valid ID are marked with a green verification tick.

### 📄 Interactive AI Resume Builder
- **Two-Pane Editor**: Build your resume using an intuitive form on the left while watching it render in real-time on a beautifully formatted A4 preview on the right.
- **Classic Professional Templates**: Generates resumes with classic serif typography, structured bullet points, and clean separators.
- **Native PDF Export**: Uses heavily optimized `@media print` CSS to strip UI elements and export pixel-perfect, text-searchable PDFs directly from the browser without relying on heavy third-party libraries.
- **Rich Sections**: Dedicated sections for Experience, Education, Projects, and Achievements with smart bullet-point rendering.

### 🤖 Gemini AI Resume Scanner
- Built-in Applicant Tracking System (ATS) simulator powered by Google's **Gemini 1.5 Flash**.
- **Targeted Feedback**: Input a target job title, and the AI analyzes your entire resume to provide:
  - An ATS Match Score (out of 100)
  - Identified Missing Keywords and Skill Gaps
  - Actionable Improvement Suggestions

### 💬 Team & Messaging Ecosystem
- Collaborative team spaces with integrated messaging features to connect with mentors, teammates, and recruiters.
- Discover opportunities, participate in projects, and collaborate in real time.

---

## 🛠️ Technology Stack
- **Framework**: Next.js 16 (App Router)
- **Frontend**: React 19, Tailwind CSS v4, Lucide React (Icons)
- **Backend/API**: Next.js Route Handlers (`/api`)
- **Database**: MySQL managed via Prisma ORM
- **AI Integration**: `@google/generative-ai` SDK (Gemini API)
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs for secure password hashing
- **File Storage**: Cloud object storage (e.g. Vercel Blob / Cloudinary / Supabase Storage) for avatars and certificates

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MySQL server running locally or remotely
- An object storage account (Vercel Blob, Cloudinary, or Supabase) for file uploads

### 1. Installation
```bash
# Install dependencies
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory and configure the following variables:
```env
# Database Connection (MySQL)
# Local dev example — in production, use your hosted MySQL connection string
# (e.g. PlanetScale, TiDB Cloud, Railway), including SSL params if required
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/uconnect_db"

# Authentication Secret
JWT_SECRET="your-super-secret-jwt-key"

# Google Gemini API Key (For AI Resume Scanner)
GEMINI_API_KEY="your-google-gemini-api-key"

# File Storage (choose one provider and set its credentials)
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
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
- `/app/resume` - The interactive two-pane resume builder and PDF exporter.
- `/app/profile` - The dynamic user profile interface.
- `/app/api/resume/scan` - The Gemini AI ATS scoring endpoint.
- `/app/api/upload` - File upload handler (uploads to configured object storage).
- `/prisma/schema.prisma` - Database models (Users, Certificates, Projects).

---

## 📝 License
This project is licensed under the MIT License.
