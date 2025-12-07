# UConnect

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Process](https://img.shields.io/badge/process-Agile-blue)](#sdlc--process-agile)
[![Platform](https://img.shields.io/badge/platform-Web%20first%20%E2%86%92%20Mobile%20next-purple)](#development-plan-web-first-mobile-next)
[![Tech Stack](https://img.shields.io/badge/stack-React%20%7C%20Node%20%7C%20Python%20%7C%20Postgres%20%7C%20OpenAI-orange)](#tech-stack)

UConnect is an AI-driven university ecosystem that connects students, teachers, and recruiters to collaborate on projects, form balanced teams, build verified portfolios, generate polished resumes, and discover opportunities.

Core value: Turn academic work into verifiable career assets and accelerate the path from learning → experience → employment.

---

## Table of Contents

- [Vision & Summary](#vision--summary)
- [Development Plan (Web First → Mobile Next)](#development-plan-web-first-mobile-next)
- [SDLC & Process (Agile)](#sdlc--process-agile)
- [Key Features](#key-features)
  - [Feature Highlights (at a glance)](#feature-highlights-at-a-glance)
  - [Core Modules](#core-modules)
  - [Career & Employability](#career--employability)
  - [AI & Analytics](#ai--analytics)
  - [Collaboration & Community](#collaboration--community)
  - [Engagement & Gamification](#engagement--gamification)
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Monorepo Structure](#monorepo-structure)
- [Getting Started (Web)](#getting-started-web)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [AI Services Setup](#ai-services-setup)
  - [Running Tests, Lint, Format](#running-tests-lint-format)
- [Mobile App Plan](#mobile-app-plan)
- [Data Model & Concepts](#data-model--concepts)
- [API & Integrations (Overview)](#api--integrations-overview)
- [Security, Privacy & Ethics](#security-privacy--ethics)
- [Demo & Pitch Flow](#demo--pitch-flow)
- [Success Metrics](#success-metrics)
- [Contributing](#contributing)
- [License](#license)
- [Team & Contact](#team--contact)
- [Appendix: Full Feature Index](#appendix-full-feature-index)

---

## Vision & Summary

- Project Name: UConnect
- Vision: An AI-driven university ecosystem connecting students, teachers, and industry — automating team formation, learning, portfolio building, resume generation, and job/internship discovery.
- Who it serves: Students, faculty/mentors, recruiters/companies.
- Outcomes:
  - Faster, fairer team formation and mentorship.
  - Verified portfolios and certificates as credible hiring signals.
  - Personalized career paths and job matches that reflect true skills.

---

## Development Plan (Web First → Mobile Next)

We will prioritize a web-based release first, then build the mobile app.

- Web first:
  - Focus on core flows: auth, profiles, project/team formation, portfolio, resume generation, opportunity discovery.
  - Ship quickly to validate with students/faculty; iterate based on feedback.
- Mobile next:
  - Build a dedicated mobile app after the web release stabilizes.
  - Target tech: React Native to maximize reuse with the React web stack.
  - Mobile priorities: notifications, quick apply, chat, task updates, mentor sessions.

---

## SDLC & Process (Agile)

- Framework: Agile (Scrum/Kanban hybrid depending on team size and cadence).
- Cadence:
  - Iterative delivery in short cycles.
  - Lightweight planning, continuous refinement, and frequent releases.
- Ceremonies:
  - Planning and backlog refinement
  - Daily standups
  - Review/demo
  - Retrospective with actionable improvements
- Backlog & Prioritization:
  - Value-first prioritization; capture user feedback from web release to inform subsequent iterations and mobile scope.
- Definition of Done:
  - Coded, reviewed, tested, documented (user-facing notes where needed), and deployed.
- Branching & CI/CD:
  - Trunk-based or short-lived feature branches.
  - GitHub Actions for tests/lint/build; preview deployments for frontend; automatic checks before merge.

---


## Key Features

A quick, skimmable overview first — then expandable deep dives.

### Feature Highlights (at a glance)

| Category | Highlights |
|---|---|
| Core Modules | Profile → evolving skill graph, AI team formation, Teacher supervision, Project lifecycle & realtime comms, Project Showcase |
| Career & Employability | AI Resume (U‑Resume), Job/Internship matching, Skill gap insights, Personalized roadmaps, Recruiter dashboard, Verified certificates |
| AI & Analytics | Skill Graph, Hybrid recommender, NLP job parsing, Career predictor, Interview coach, University AI Mentor (campus chatbot) |
| Collaboration & Community | Help board with issue conversion, Open collaboration, Mentorship, Voice/Video, Cross‑university challenges |
| Engagement & Gamification | Badges, Leaderboards, Streaks & XP |

<details>
<summary>User journey (how it fits together)</summary>

1) Create Profile → 2) Evolve with skills/learning/interests/projects/contributions →  
3) AI analyzes profile to suggest career paths, reveal gaps, and generate roadmaps →  
4) AI forms/assists team creation with matched peers; teachers pick teams to supervise →  
5) Work in a realtime project space (chat, tasks, files) →  
6) Showcase projects to the whole university; get help via open collaboration →  
7) AI generates a polished resume and matches jobs/internships →  
8) Apply faster and track outcomes; grow U‑Score with verified impact.
</details>

---

### Core Modules

- Progressive Profiles & Skill Graph
  - Start simple; grow over time with skills, learning, interests, projects, contributions, endorsements.
  - Transparent, evidence‑linked skill graph per user with recency/quality weighting.
- Intelligent Team Formation
  - AI suggests balanced teams by skills, interests, availability, and diversity; supports hard/soft constraints.
  - Teachers can hand‑pick or approve teams and choose which to supervise for projects/thesis.
- Smart Project Lifecycle Tracker
  - Tasks, milestones, deadlines, AI task‑splitting, burnup/burndown, nudges, and progress analytics.
- UConnect Communication Space
  - Realtime chat, project channels, DMs with attachments, file sharing, activity timelines; voice/video ready.
- Opportunity Discovery Hub
  - Projects, hackathons, internships, and events ranked by match score, proximity, stack, and difficulty.
- Project Showcase (University‑wide)
  - Public gallery of approved projects to avoid duplicates, inspire upgrades, and enable iteration/maintenance.
  - Cross‑department discovery (e.g., CSE + Design + BBA) to encourage interdisciplinary work.
- AI‑Curated Project Repository
  - Archive with outcomes, metadata, repo links, templates; powerful search and filters.
- U‑Score (Reputation & Skill Scoring)
  - Combines outcomes, reviews, mentor feedback, contributions; explainable with faculty guardrails/overrides.

<details>
<summary>Why it matters</summary>
- Faster, fairer team formation and transparent supervision
- Less admin overhead; more outcome‑driven learning
- University‑wide knowledge reuse and better project quality
</details>

---

### Career & Employability

- U‑Resume (AI Resume/CV)
  - One‑click conversion from profile into polished resumes; multiple templates; export to PDF/DOCX/LinkedIn.
  - AI bullet rewriting emphasizes impact, metrics, and action verbs.
- Job/Internship Matching
  - Aggregated feeds (LinkedIn, Google Jobs, local portals) with match %, skill gaps, geolocation/remote filters.
- U‑SkillMap (Skill Gap Analyzer)
  - Clear comparison against job requirements; prioritized learning paths and time‑to‑readiness with resources and mini‑projects.
- Personalized Roadmaps & Path Advisor
  - AI recommends target roles (Backend, Data, UX, PM) with rationale; adaptive roadmaps with milestones and mentor suggestions.
  - Compare paths, pivot recommendations, assessments, and exportable plans.
- Apply‑with‑UConnect
  - 1‑click apply using your AI resume + prefilled cover letter; optional per‑job AI tweaks; status tracking.
- Recruiter Dashboard & Verified Certificates
  - Evidence‑backed candidate cards, U‑Score filters, micro‑internships/challenges; mentor/company verifications (optional blockchain anchoring).

---

### AI & Analytics

- Skill Graph & Knowledge Map (Neo4j)
  - Visualize prerequisites, related skills, and job links; track growth over time.
- Hybrid Recommendation Engine
  - Content‑based + collaborative filtering + peer success signals for projects, teams, opportunities, and mentors.
- NLP Job Parsing & Matching
  - BERT/sentence‑transformers to parse JDs and compute similarity to profiles/portfolios.
- AI Career Predictor
  - Forecast probable career trajectories using alumni and outcome data.
- Performance & Growth Analytics
  - Skill growth curves, team contribution metrics, project outcomes, benchmarks.
- AI Interview Coach
  - Mock interviews (text/voice) with structured feedback and scores.
- University AI Mentor (Campus Chatbot)
  - Answers university‑specific questions (semester calendar, notices, documents, faculty details, processes).
  - Trained on curated, permissioned campus content; supports quick Q&A for freshers and beyond.

---

### Collaboration & Community

- Help Board & Issue Conversion
  - Share repos, request help (bugs, features, review, docs); auto‑extract metadata; convert into tracked tickets.
  - GitHub OAuth sync for issues/PRs and status.
- Open Collaboration & Mentorship
  - Peer mentorship, office hours, forums; mentor marketplace with tags and booking.
- Voice & Video + Auto‑Scheduler
  - WebRTC/Jitsi for calls; Smart Task Assistant suggests breakdowns, effort, deadlines; Calendar sync.
- Cross‑University Mode
  - Joint competitions, shared project calls, and industry challenges with transparent governance.
- Governance, Licensing, and Safety
  - Owner permissions, license templates (MIT/Apache/CC), consent, moderation tools; academic tie‑ins for assessed labs/capstones.


---

### Engagement & Gamification

- Badges & Achievements
- Leaderboards & Challenges
- Streaks & XP

---

## Architecture Overview

- Frontend SPA (React) handles UI, routing, and OAuth flows. Web is the primary client initially.
- Backend API (REST/GraphQL) manages users, projects, teams, scoring, notifications.
- Realtime (Socket.io/Firebase) for chat, presence, and live updates.
- AI Services (Python microservices) for recommendations, resume generation, matching, and interview coach.
- Datastores: Postgres (primary), MongoDB (optional docs), Neo4j (skill graph), Vector DB (FAISS/Pinecone), Elasticsearch (text search), Redis (queues/cache), S3/Cloud Storage.
- Integrations: OAuth/SSO, GitHub sync, job portals, maps/geolocation.
- Mobile: React Native app consuming the same APIs; push notifications via FCM/APNs; deep links to resources.

---

## Tech Stack

- Frontend (Web):
  - React, Tailwind CSS, shadcn/ui, React Query, React Router, Chart.js/Recharts
  - Hosting: Vercel (or Netlify)
- Backend:
  - Node.js + Express (or Django alternative)
  - ORM/migrations: Prisma (Node) or Django ORM (Python)
- AI/ML:
  - Python, scikit-learn, TensorFlow/PyTorch, sentence-transformers, spaCy, OpenAI API
- Databases:
  - PostgreSQL (primary), MongoDB (optional), Neo4j (graph)
- Search/Matching:
  - Elasticsearch (text search) and/or FAISS/Pinecone (semantic)
- Realtime:
  - Socket.io or Firebase
- Storage:
  - AWS S3 or Firebase Storage
- Auth:
  - OAuth2 (Google, GitHub), University SSO, JWT
- Hosting:
  - Vercel (frontend), Render/Heroku/AWS/GCP (backend)
- Jobs & Maps:
  - LinkedIn Jobs, Google Jobs, local portals (APIs/scraping), Google Maps
- Mobile (Planned):
  - React Native, React Query, Expo Router or React Navigation, FCM/APNs, CodePush/OTA

---

## Monorepo Structure

```
UConnect/
├── backend/          # Node/Express or Django (choose one baseline)
│   ├── src/
│   ├── prisma/       # or migration tooling of choice
│   ├── tests/
│   └── package.json  # or requirements.txt for Django
├── frontend/         # React + Tailwind + shadcn/ui (Web)
│   ├── src/
│   ├── public/
│   ├── tests/
│   └── package.json
├── mobile/           # React Native app (planned)
│   ├── app/
│   ├── src/
│   ├── tests/
│   └── package.json
├── ai/               # Python microservices for AI/recs/resume/interview coach
│   ├── services/
│   ├── models/
│   ├── tests/
│   └── requirements.txt
├── docs/             # Architecture, ADRs, API docs, diagrams
├── tests/            # End-to-end, integration (e.g., Playwright/Cypress)
└── README.md
```

---

## Getting Started (Web)

### Prerequisites

- Node.js 18+
- npm or yarn
- Python 3.9+
- PostgreSQL 14+
- (Optional) Redis for queues
- Git

### Environment Variables

Create .env files for backend, frontend, and AI services.

Backend (.env)
```
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/uconnect
JWT_SECRET=replace_me
# OAuth
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
# AI/Vector/Search
OPENAI_API_KEY=...
PINECONE_API_KEY=...
PINECONE_ENV=...
ELASTICSEARCH_URL=http://localhost:9200
# Queue/Cache
REDIS_URL=redis://localhost:6379
# Storage
S3_BUCKET=your-s3-bucket
S3_REGION=ap-south-1
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
```

Frontend (.env.local)
```
VITE_API_URL=http://localhost:4000/api
VITE_OAUTH_REDIRECT_URL=http://localhost:3000/auth/callback
VITE_APP_NAME=UConnect
```

AI Services (.env)
```
OPENAI_API_KEY=...
FAISS_INDEX_PATH=.data/faiss.index
PINECONE_API_KEY=...
PINECONE_ENV=...
```

### Backend Setup

Node.js + Express (example)
```
cd backend
npm install
# If using Prisma (or your ORM):
npx prisma migrate dev --name init
npm run dev
```

Django (alternative)
```
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:4000
```

### Frontend Setup

```
cd frontend
npm install
npm start
# open http://localhost:3000
```

### AI Services Setup

```
cd ai
pip install -r requirements.txt
# Start service(s), e.g. FastAPI/Flask entrypoint:
python run_service.py
```

### Running Tests, Lint, Format

- Backend tests: `npm test` (Node) or `pytest` (Python)
- Frontend tests: `npm test`
- Lint: `npm run lint`
- Format: `npm run format`

---

## Mobile App Plan

- Tech: React Native (Expo or bare) to reuse business logic and UI patterns from the web where sensible.
- API: Same REST/GraphQL endpoints; shared types via OpenAPI/Swagger or codegen to reduce drift.
- Auth: OAuth with deep links (App/Universal Links), secure token storage.
- Features (initial):
  - Push notifications for deadlines, chat mentions, mentor feedback.
  - Quick actions: apply to jobs, update task status, check-in for sessions.
  - Lightweight profile edits and resume export links.
- Offline-first (select screens): local cache with background sync for tasks/messages.
- Release: Closed beta after the web release stabilizes; iterate via OTA updates (Expo/CodePush).

---

## Data Model & Concepts

Core entities:
- User (student, teacher, recruiter)
- Profile (skills, GPA, achievements, endorsements)
- Project (repo link, description, outcomes)
- Team (members, roles, approvals)
- Opportunity (job, internship)
- MentorMatch (sessions, feedback)
- U-Score (reputation & performance metrics)
- Roadmap (career path, milestones, resources)

Illustrative ER (simplified)
```mermaid
erDiagram
  USER ||--o{ PROFILE : has
  USER ||--o{ TEAM_MEMBER : participates
  TEAM ||--o{ TEAM_MEMBER : includes
  USER ||--o{ PROJECT : owns
  PROJECT ||--o{ TASK : contains
  PROJECT ||--o{ FEEDBACK : receives
  USER ||--o{ FEEDBACK : gives
  USER ||--o{ OPPORTUNITY_APPLICATION : applies
  OPPORTUNITY ||--o{ OPPORTUNITY_APPLICATION : tracks
  USER ||--o{ CERTIFICATE : earns
  USER ||--o{ ROADMAP : follows
  ROADMAP ||--o{ MILESTONE : contains
```

U-Score considerations:
- Inputs: project outcomes, peer reviews, mentor feedback, code contributions, on-time delivery.
- Guardrails: explainability, bias checks, manual overrides for faculty.

---

## API & Integrations (Overview)

Representative endpoints (example; subject to change):
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/oauth/callback`
- Users/Profiles: `GET /api/users/:id`, `PUT /api/users/:id`, `GET /api/users/:id/score`
- Projects/Teams: `POST /api/projects`, `GET /api/projects`, `POST /api/teams/suggest`, `POST /api/projects/:id/tasks`
- Career/Resume: `POST /api/resume/generate`, `GET /api/opportunities?near=...&skills=...`
- Community: `POST /api/help-posts`, `POST /api/help-posts/:id/convert`, `POST /api/github/issues`
- Roadmaps: `POST /api/career-paths/recommend`, `POST /api/roadmaps/generate`, `PUT /api/roadmaps/:id/progress`

Integrations:
- GitHub OAuth + repo import, create issues/PRs, contribution sync.
- Job feeds (LinkedIn, Google Jobs, local portals), Google Maps geolocation.
- OpenAI/LLMs for summaries, matching, interview coach.

Documentation:
- Plan to expose OpenAPI/Swagger at `/api/docs`.

---

## Security, Privacy & Ethics

- Data Privacy Controls: Clear settings for public/recruiter/private fields.
- Explainable Recommendations: “Matched because of Python, ML project X, teamwork rating.”
- Secure Auth & Verification: SSO/OAuth, JWT, 2FA, encrypted storage, audit trails.
- Bias & Fairness: Regular audits on matching/scoring; appeal workflows; teacher overrides.
- Certificates & Integrity: Optional blockchain anchoring for tamper-resistance.
- Compliance: Respect site terms for job aggregation; licensing and consent for public projects.

---

## Demo & Pitch Flow

1. Opening Problem (20s): Student struggles to find teammates/internships.
2. Live Flow (90s): Profile → Auto team formation → Project summary → Auto resume → Job matches near me → Apply.
3. Technical Slide (60s): Architecture + AI matching.
4. Impact (30s): Faster placements, fair teams, verified portfolios.
5. Closing (20s): Scale to more universities; national hiring funnel.

---

## Success Metrics

- Team formation satisfaction rates after projects.
- U-Score correlation with job placement.
- Count of verified internships/certificates.
- Average time-to-hire for U-Hire users.
- Engagement (DAU/retention/messages per project).

---

## Contributing

We welcome contributions!

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "Add your-feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

Guidelines:
- Follow lint and code style
- Add tests for new features
- Small, focused PRs with clear descriptions
- Respect licensing and consent for shared projects

Consider adding:
- CONTRIBUTING.md
- CODE_OF_CONDUCT.md
- SECURITY.md
- .env.example
- CI (GitHub Actions) for lint/test/build

---

## License

MIT License — see [LICENSE](LICENSE).

---

## Team & Contact

| Member                | Profession     | Gmail                          | GitHub                                                    |
|-----------------------|----------------|--------------------------------|-----------------------------------------------------------|
| Taslim Ahmed Tamim    | Student        | taslimahmedtamim4u@gmail.com   | [taslimahmedtamim](https://github.com/taslimahmedtamim)   |
| Salman Kabir Sany     | Student        | salmankabirsany@gmail.com      | [salmankabirsany](https://github.com/salmankabirsany)     |
| Majharul Islam        | Student        | majharul.cs@gmail.com          | [MrMajharul](https://github.com/MrMajharul)               |

For bug reports/feature requests, please open an issue.

---

## Quick Start (Landing Page)

A static, responsive landing page is included at the repository root.

- Entry file: `index.html` (uses `styles.css`, `script.js`, and assets under `assets/`)
- Open directly in a browser, or serve locally for best results.

Serve locally with Python:

```bash
python3 -m http.server 5173
```

Then open:

```bash
http://localhost:5173
```

Alternatively, use the VS Code Live Server extension and choose “Open with Live Server”.

---

## Appendix: Full Feature Index

This README integrates the consolidated feature specification. For a complete serial listing across Core, Career, Analytics, Collaboration, Gamification, Security, UX, Integration, Plan, and Demo …

- Core Modules (11)
- Career & Employability (6) + Career Path Advisor (10)
- AI & Analytics (6)
- Collaboration & Productivity (4) + Community/Open Collaboration (9)
- Engagement & Gamification (3)
- Security, Privacy & Trust (4)
- UX/Frontend (3)
- Integration & Tech Stack (11)
- Demo & Pitch Strategy (5 steps)
- Success Metrics (5)
- Stretch Features (5)
- Ethics & Fairness (3)
