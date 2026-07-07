-- ============================================================
--  UConnect — Complete Database SQL File
--  Database: PostgreSQL (Supabase)
--  Generated from Prisma Schema
-- ============================================================

-- ============================================================
--  SECTION 1: DROP EXISTING TABLES (Clean Slate)
-- ============================================================

DROP TABLE IF EXISTS "messages" CASCADE;
DROP TABLE IF EXISTS "mentor_connections" CASCADE;
DROP TABLE IF EXISTS "achievements" CASCADE;
DROP TABLE IF EXISTS "applications" CASCADE;
DROP TABLE IF EXISTS "resumes" CASCADE;
DROP TABLE IF EXISTS "team_members" CASCADE;
DROP TABLE IF EXISTS "teams" CASCADE;
DROP TABLE IF EXISTS "project_skills" CASCADE;
DROP TABLE IF EXISTS "projects" CASCADE;
DROP TABLE IF EXISTS "user_skills" CASCADE;
DROP TABLE IF EXISTS "skills" CASCADE;
DROP TABLE IF EXISTS "profiles" CASCADE;
DROP TABLE IF EXISTS "opportunities" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- ============================================================
--  SECTION 2: DROP EXISTING TYPES
-- ============================================================

DROP TYPE IF EXISTS "Role" CASCADE;
DROP TYPE IF EXISTS "ProjectStatus" CASCADE;
DROP TYPE IF EXISTS "ApplicationStatus" CASCADE;

-- ============================================================
--  SECTION 3: CREATE ENUMS
-- ============================================================

CREATE TYPE "Role" AS ENUM ('STUDENT', 'TEACHER', 'RECRUITER');
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED');
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

-- ============================================================
--  SECTION 4: CREATE TABLES
-- ============================================================

-- USERS table (central entity)
CREATE TABLE "users" (
    "id"        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    "name"      TEXT        NOT NULL,
    "email"     TEXT        NOT NULL UNIQUE,
    "password"  TEXT        NOT NULL,
    "role"      "Role"      NOT NULL DEFAULT 'STUDENT',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PROFILES table (1:1 with User)
CREATE TABLE "profiles" (
    "id"          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    "headline"    TEXT,
    "bio"         TEXT,
    "university"  TEXT,
    "department"  TEXT,
    "yearOfStudy" INT,
    "phone"       TEXT,
    "avatarUrl"   TEXT,
    "userId"      UUID        NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
    "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SKILLS table
CREATE TABLE "skills" (
    "id"        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    "name"      TEXT        NOT NULL UNIQUE,
    "category"  TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- USER_SKILLS join table (M:N User <-> Skill)
CREATE TABLE "user_skills" (
    "id"      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "level"   INT  DEFAULT 50,
    "userId"  UUID NOT NULL REFERENCES "users"("id")  ON DELETE CASCADE,
    "skillId" UUID NOT NULL REFERENCES "skills"("id") ON DELETE CASCADE,
    UNIQUE ("userId", "skillId")
);

-- PROJECTS table
CREATE TABLE "projects" (
    "id"          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    "title"       TEXT            NOT NULL,
    "description" TEXT,
    "status"      "ProjectStatus" NOT NULL DEFAULT 'PLANNING',
    "ownerId"     UUID            NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "createdAt"   TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    "updatedAt"   TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- PROJECT_SKILLS join table (M:N Project <-> Skill)
CREATE TABLE "project_skills" (
    "id"        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL REFERENCES "projects"("id") ON DELETE CASCADE,
    "skillId"   UUID NOT NULL REFERENCES "skills"("id")   ON DELETE CASCADE,
    UNIQUE ("projectId", "skillId")
);

-- TEAMS table
CREATE TABLE "teams" (
    "id"        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    "name"      TEXT        NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TEAM_MEMBERS join table
CREATE TABLE "team_members" (
    "id"        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    "role"      TEXT        DEFAULT 'member',
    "joinedAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "userId"    UUID        NOT NULL REFERENCES "users"("id")    ON DELETE CASCADE,
    "teamId"    UUID        NOT NULL REFERENCES "teams"("id")    ON DELETE CASCADE,
    "projectId" UUID        REFERENCES "projects"("id")          ON DELETE SET NULL,
    UNIQUE ("userId", "teamId")
);

-- RESUMES table
CREATE TABLE "resumes" (
    "id"            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    "fileUrl"       TEXT,
    "templateName"  TEXT        DEFAULT 'professional',
    "generatedDate" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "userId"        UUID        NOT NULL REFERENCES "users"("id") ON DELETE CASCADE
);

-- OPPORTUNITIES table
CREATE TABLE "opportunities" (
    "id"          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    "type"        TEXT        NOT NULL,
    "title"       TEXT        NOT NULL,
    "description" TEXT,
    "company"     TEXT,
    "location"    TEXT,
    "isRemote"    BOOLEAN     NOT NULL DEFAULT FALSE,
    "deadline"    TIMESTAMPTZ,
    "postedById"  UUID        REFERENCES "users"("id") ON DELETE SET NULL,
    "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- APPLICATIONS join table
CREATE TABLE "applications" (
    "id"            UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    "status"        "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "appliedAt"     TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    "updatedAt"     TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    "userId"        UUID                NOT NULL REFERENCES "users"("id")        ON DELETE CASCADE,
    "opportunityId" UUID                NOT NULL REFERENCES "opportunities"("id") ON DELETE CASCADE,
    UNIQUE ("userId", "opportunityId")
);

-- ACHIEVEMENTS table
CREATE TABLE "achievements" (
    "id"        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    "type"      TEXT        NOT NULL,
    "title"     TEXT        NOT NULL,
    "xpPoints"  INT         NOT NULL DEFAULT 0,
    "userId"    UUID        NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "awardedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- MENTOR_CONNECTIONS table
CREATE TABLE "mentor_connections" (
    "id"        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    "expertise" TEXT,
    "status"    TEXT        NOT NULL DEFAULT 'active',
    "menteeId"  UUID        NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "mentorId"  UUID        NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE ("menteeId", "mentorId")
);

-- MESSAGES table
CREATE TABLE "messages" (
    "id"         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    "content"    TEXT        NOT NULL,
    "sentAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "isRead"     BOOLEAN     NOT NULL DEFAULT FALSE,
    "senderId"   UUID        NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "receiverId" UUID        NOT NULL REFERENCES "users"("id") ON DELETE CASCADE
);

-- ============================================================
--  SECTION 5: INDEXES (Performance)
-- ============================================================

CREATE INDEX idx_users_email       ON "users"("email");
CREATE INDEX idx_users_role        ON "users"("role");
CREATE INDEX idx_projects_owner    ON "projects"("ownerId");
CREATE INDEX idx_projects_status   ON "projects"("status");
CREATE INDEX idx_applications_user ON "applications"("userId");
CREATE INDEX idx_applications_opp  ON "applications"("opportunityId");
CREATE INDEX idx_achievements_user ON "achievements"("userId");
CREATE INDEX idx_messages_sender   ON "messages"("senderId");
CREATE INDEX idx_messages_receiver ON "messages"("receiverId");
CREATE INDEX idx_user_skills_user  ON "user_skills"("userId");
CREATE INDEX idx_team_members_team ON "team_members"("teamId");

-- ============================================================
--  SECTION 6: AUTO-UPDATE updatedAt TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON "users"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON "profiles"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_projects_updated_at
    BEFORE UPDATE ON "projects"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_opportunities_updated_at
    BEFORE UPDATE ON "opportunities"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_applications_updated_at
    BEFORE UPDATE ON "applications"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
--  SECTION 7: SEED DATA (password for all = password123)
--  NOTE: These bcrypt hashes are for 'password123'
-- ============================================================

INSERT INTO "users" ("id", "name", "email", "password", "role") VALUES
('a1000000-0000-0000-0000-000000000001','Taslim Ahmed Tamim','taslim@uconnect.com','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6Ql5K6oVxm','STUDENT'),
('a1000000-0000-0000-0000-000000000002','Salman Kabir Sany','salman@uconnect.com','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6Ql5K6oVxm','STUDENT'),
('a1000000-0000-0000-0000-000000000003','Majharul Islam','majharul@uconnect.com','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6Ql5K6oVxm','STUDENT'),
('a1000000-0000-0000-0000-000000000004','Dr. Hasan Mahmud','hasan@uconnect.com','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6Ql5K6oVxm','TEACHER'),
('a1000000-0000-0000-0000-000000000005','Sarah Chen','sarah@techcorp.com','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6Ql5K6oVxm','RECRUITER');

INSERT INTO "profiles" ("userId","headline","bio","university","department","yearOfStudy","phone") VALUES
('a1000000-0000-0000-0000-000000000001','Full-Stack Developer & AI Enthusiast','Passionate about building scalable web apps.','United International University','Computer Science & Engineering',3,'+880-1700-000001'),
('a1000000-0000-0000-0000-000000000002','Backend Developer & Problem Solver','Competitive programmer passionate about algorithms.','United International University','Computer Science & Engineering',3,'+880-1700-000002'),
('a1000000-0000-0000-0000-000000000003','Frontend Developer & UI/UX Enthusiast','Love creating beautiful user interfaces.','United International University','Computer Science & Engineering',3,'+880-1700-000003'),
('a1000000-0000-0000-0000-000000000004','Associate Professor — Software Engineering','Researcher in AI-driven software engineering.','United International University','Computer Science & Engineering',NULL,NULL),
('a1000000-0000-0000-0000-000000000005','Talent Acquisition Lead — TechCorp','Hiring top tech talent for innovative projects.',NULL,NULL,NULL,NULL);

INSERT INTO "skills" ("id","name","category") VALUES
('b1000000-0000-0000-0000-000000000001','JavaScript','Language'),
('b1000000-0000-0000-0000-000000000002','Python','Language'),
('b1000000-0000-0000-0000-000000000003','React','Frontend'),
('b1000000-0000-0000-0000-000000000004','Node.js','Backend'),
('b1000000-0000-0000-0000-000000000005','Express','Backend'),
('b1000000-0000-0000-0000-000000000006','PostgreSQL','Database'),
('b1000000-0000-0000-0000-000000000007','MongoDB','Database'),
('b1000000-0000-0000-0000-000000000008','TensorFlow','AI/ML'),
('b1000000-0000-0000-0000-000000000009','Machine Learning','AI/ML'),
('b1000000-0000-0000-0000-000000000010','TypeScript','Language'),
('b1000000-0000-0000-0000-000000000011','CSS/Tailwind','Frontend'),
('b1000000-0000-0000-0000-000000000012','Docker','DevOps'),
('b1000000-0000-0000-0000-000000000013','Git','Tool'),
('b1000000-0000-0000-0000-000000000014','REST API','Architecture'),
('b1000000-0000-0000-0000-000000000015','GraphQL','Architecture');

INSERT INTO "user_skills" ("userId","skillId","level") VALUES
('a1000000-0000-0000-0000-000000000001','b1000000-0000-0000-0000-000000000001',90),
('a1000000-0000-0000-0000-000000000001','b1000000-0000-0000-0000-000000000003',85),
('a1000000-0000-0000-0000-000000000001','b1000000-0000-0000-0000-000000000004',80),
('a1000000-0000-0000-0000-000000000001','b1000000-0000-0000-0000-000000000002',75),
('a1000000-0000-0000-0000-000000000001','b1000000-0000-0000-0000-000000000006',70),
('a1000000-0000-0000-0000-000000000002','b1000000-0000-0000-0000-000000000002',90),
('a1000000-0000-0000-0000-000000000002','b1000000-0000-0000-0000-000000000004',85),
('a1000000-0000-0000-0000-000000000002','b1000000-0000-0000-0000-000000000006',80),
('a1000000-0000-0000-0000-000000000002','b1000000-0000-0000-0000-000000000012',70),
('a1000000-0000-0000-0000-000000000002','b1000000-0000-0000-0000-000000000014',85),
('a1000000-0000-0000-0000-000000000003','b1000000-0000-0000-0000-000000000001',85),
('a1000000-0000-0000-0000-000000000003','b1000000-0000-0000-0000-000000000003',90),
('a1000000-0000-0000-0000-000000000003','b1000000-0000-0000-0000-000000000011',92),
('a1000000-0000-0000-0000-000000000003','b1000000-0000-0000-0000-000000000010',75),
('a1000000-0000-0000-0000-000000000003','b1000000-0000-0000-0000-000000000013',80);

INSERT INTO "projects" ("id","title","description","status","ownerId") VALUES
('c1000000-0000-0000-0000-000000000001','UConnect — University Ecosystem Platform','AI-driven platform connecting students, teachers, and recruiters.','IN_PROGRESS','a1000000-0000-0000-0000-000000000001'),
('c1000000-0000-0000-0000-000000000002','Smart Campus Chatbot','AI-powered chatbot for university Q&A.','PLANNING','a1000000-0000-0000-0000-000000000002'),
('c1000000-0000-0000-0000-000000000003','Student Portfolio Showcase','Gallery for students to showcase projects.','COMPLETED','a1000000-0000-0000-0000-000000000003');

INSERT INTO "project_skills" ("projectId","skillId") VALUES
('c1000000-0000-0000-0000-000000000001','b1000000-0000-0000-0000-000000000003'),
('c1000000-0000-0000-0000-000000000001','b1000000-0000-0000-0000-000000000004'),
('c1000000-0000-0000-0000-000000000001','b1000000-0000-0000-0000-000000000006'),
('c1000000-0000-0000-0000-000000000002','b1000000-0000-0000-0000-000000000002'),
('c1000000-0000-0000-0000-000000000002','b1000000-0000-0000-0000-000000000008'),
('c1000000-0000-0000-0000-000000000003','b1000000-0000-0000-0000-000000000003'),
('c1000000-0000-0000-0000-000000000003','b1000000-0000-0000-0000-000000000011');

INSERT INTO "teams" ("id","name") VALUES
('d1000000-0000-0000-0000-000000000001','Team UConnect'),
('d1000000-0000-0000-0000-000000000002','AI Research Squad');

INSERT INTO "team_members" ("userId","teamId","role","projectId") VALUES
('a1000000-0000-0000-0000-000000000001','d1000000-0000-0000-0000-000000000001','leader','c1000000-0000-0000-0000-000000000001'),
('a1000000-0000-0000-0000-000000000002','d1000000-0000-0000-0000-000000000001','backend-lead','c1000000-0000-0000-0000-000000000001'),
('a1000000-0000-0000-0000-000000000003','d1000000-0000-0000-0000-000000000001','frontend-lead','c1000000-0000-0000-0000-000000000001'),
('a1000000-0000-0000-0000-000000000002','d1000000-0000-0000-0000-000000000002','leader','c1000000-0000-0000-0000-000000000002'),
('a1000000-0000-0000-0000-000000000001','d1000000-0000-0000-0000-000000000002','member','c1000000-0000-0000-0000-000000000002');

INSERT INTO "opportunities" ("id","type","title","description","company","location","isRemote","deadline","postedById") VALUES
('e1000000-0000-0000-0000-000000000001','internship','Full-Stack Developer Intern','Join our engineering team.','TechCorp','Dhaka, Bangladesh',TRUE,'2026-08-31 00:00:00+00','a1000000-0000-0000-0000-000000000005'),
('e1000000-0000-0000-0000-000000000002','job','Machine Learning Engineer','Work on cutting-edge ML models.','AI Labs','Remote',TRUE,'2026-09-15 00:00:00+00','a1000000-0000-0000-0000-000000000005'),
('e1000000-0000-0000-0000-000000000003','hackathon','UIU Hackathon 2026','Build solutions in 48 hours!','UIU','UIU Campus',FALSE,'2026-07-20 00:00:00+00',NULL);

INSERT INTO "applications" ("userId","opportunityId","status") VALUES
('a1000000-0000-0000-0000-000000000001','e1000000-0000-0000-0000-000000000001','PENDING'),
('a1000000-0000-0000-0000-000000000002','e1000000-0000-0000-0000-000000000002','ACCEPTED'),
('a1000000-0000-0000-0000-000000000003','e1000000-0000-0000-0000-000000000003','PENDING');

INSERT INTO "achievements" ("userId","type","title","xpPoints") VALUES
('a1000000-0000-0000-0000-000000000001','badge','First Project Created',100),
('a1000000-0000-0000-0000-000000000001','badge','Team Leader',150),
('a1000000-0000-0000-0000-000000000001','milestone','5 Skills Added',50),
('a1000000-0000-0000-0000-000000000002','badge','Problem Solver',200),
('a1000000-0000-0000-0000-000000000002','certificate','Python Mastery',300),
('a1000000-0000-0000-0000-000000000003','badge','UI Wizard',150),
('a1000000-0000-0000-0000-000000000003','badge','Project Completed',250);

INSERT INTO "mentor_connections" ("menteeId","mentorId","expertise") VALUES
('a1000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000004','Software Engineering & Project Management'),
('a1000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000004','AI/ML Research & Backend Architecture');

INSERT INTO "messages" ("senderId","receiverId","content") VALUES
('a1000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000002','Hey Salman! Ready for the sprint planning today?'),
('a1000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000001','Yes! I have the backend API design ready to discuss.'),
('a1000000-0000-0000-0000-000000000003','a1000000-0000-0000-0000-000000000001','The frontend components are looking great!'),
('a1000000-0000-0000-0000-000000000004','a1000000-0000-0000-0000-000000000001','Great progress on UConnect. Let''s discuss the AI features.');

INSERT INTO "resumes" ("userId","templateName") VALUES
('a1000000-0000-0000-0000-000000000001','professional');

-- ============================================================
--  SECTION 8: VERIFICATION — run after seeding
-- ============================================================

SELECT
    (SELECT COUNT(*) FROM "users")         AS total_users,
    (SELECT COUNT(*) FROM "profiles")      AS total_profiles,
    (SELECT COUNT(*) FROM "skills")        AS total_skills,
    (SELECT COUNT(*) FROM "projects")      AS total_projects,
    (SELECT COUNT(*) FROM "teams")         AS total_teams,
    (SELECT COUNT(*) FROM "opportunities") AS total_opportunities,
    (SELECT COUNT(*) FROM "achievements")  AS total_achievements,
    (SELECT COUNT(*) FROM "applications")  AS total_applications,
    (SELECT COUNT(*) FROM "messages")      AS total_messages;

-- ============================================================
--  TEST ACCOUNTS (password for all: password123)
--  Student:   taslim@uconnect.com
--  Student:   salman@uconnect.com
--  Student:   majharul@uconnect.com
--  Teacher:   hasan@uconnect.com
--  Recruiter: sarah@techcorp.com
-- ============================================================
