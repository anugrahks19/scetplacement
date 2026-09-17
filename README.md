# SCET Placement Portal — Setup & Run Guide

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Folder Structure](#folder-structure)
5. [Step-by-Step Setup](#step-by-step-setup)
6. [Running the Application](#running-the-application)
7. [Environment Variables](#environment-variables)
8. [Architecture Diagram](#architecture-diagram)
9. [Available Pages](#available-pages)
10. [API Reference (GraphQL)](#api-reference-graphql)
11. [Troubleshooting](#troubleshooting)

---

## Project Overview

The **SCET Placement Cell Portal** is a web-based placement preparation and management system for faculty members of Sardar Vallabhbhai Patel Institute of Technology (SCET). Faculty can:

- **Create** MCQ, Coding, and Debugging questions (manually or with AI)
- **Review** AI-generated questions before publishing
- **Build & Schedule** mock placement assessments for students
- **Monitor** student performance with leaderboards and analytics
- **Track** student placement readiness across departments & divisions

The AI engine is powered by **Google Gemini 3.6 Flash** via the Generative AI SDK.

---

## Tech Stack

| Layer       | Technology                                   |
| ----------- | -------------------------------------------- |
| Frontend    | HTML5, Bootstrap 5, Vanilla JavaScript       |
| Backend     | Node.js, Apollo Server (GraphQL), TypeScript |
| Database    | PostgreSQL (Neon Serverless)                  |
| ORM         | Prisma                                       |
| AI Engine   | Google Gemini 3.6 Flash (`@google/generative-ai`) |
| Dev Tooling | tsx (TypeScript runner), Python http.server   |

---

## Prerequisites

Before you begin, make sure you have the following installed:

| Tool       | Minimum Version | Check Command        |
| ---------- | --------------- | -------------------- |
| **Node.js** | v18+           | `node --version`     |
| **npm**     | v9+            | `npm --version`      |
| **Python**  | v3.8+          | `python --version`   |
| **Git**     | Any            | `git --version`      |

> ⚠️ **Windows Users**: Use PowerShell or Windows Terminal. Avoid Git Bash for the Python server.

---

## Folder Structure

```
d:\scetplacement-main\
│
├── backend\                          # Apollo GraphQL Backend
│   ├── src\
│   │   ├── main.ts                   # Server entry point (port 4000)
│   │   ├── prisma\
│   │   │   └── prisma.service.ts     # Prisma client singleton
│   │   └── modules\
│   │       └── teacher\
│   │           ├── ai\               # AI question generation module
│   │           │   ├── ai.service.ts     # Gemini API integration
│   │           │   ├── ai.resolver.ts    # GraphQL resolvers
│   │           │   └── ai.types.ts       # GraphQL type definitions
│   │           ├── question\         # Question CRUD module
│   │           ├── review\           # Review workflow module
│   │           └── assessment\       # Assessment scheduling module
│   ├── prisma\
│   │   └── schema.prisma            # Database schema
│   ├── package.json
│   └── .env                         # Environment variables (DO NOT COMMIT)
│
├── assets\                           # CSS, JS, images, vendor libraries
│   ├── css\
│   ├── js\
│   ├── images\
│   └── vendor\                       # Bootstrap, jQuery, etc.
│
├── index.html                        # Login page (entry point)
├── faculty-dashboard.html            # Faculty main dashboard
├── faculty-questions.html            # Question bank with filters
├── faculty-question-editor.html      # Create/Edit questions + AI generation
├── faculty-question-review.html      # AI review queue
├── faculty-assessments.html          # Assessment list
├── faculty-assessment-builder.html   # Create & schedule assessments
├── faculty-assessment-results.html   # Leaderboard & analytics
├── faculty-students.html             # Student roster & readiness tracker
│
├── scetplacement.pdf                 # Original project specification
└── README.md                         # This file
```

---

## Step-by-Step Setup

### Step 1: Clone / Extract the Project

```powershell
cd d:\
# If from ZIP, extract to d:\scetplacement-main
# If from Git:
git clone <repo-url> scetplacement-main
cd scetplacement-main
```

### Step 2: Install Backend Dependencies

```powershell
cd d:\scetplacement-main\backend
npm install
```

This installs Apollo Server, Prisma, Google Generative AI SDK, and all other dependencies.

### Step 3: Configure Environment Variables

Create or verify the file `d:\scetplacement-main\backend\.env`:

```env
DATABASE_URL="postgresql://neondb_owner:<password>@<neon-host>/neondb?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://neondb_owner:<password>@<neon-host-unpooled>/neondb?sslmode=require"
GEMINI_API_KEY="<your-google-gemini-api-key>"
NEON_BRANCH=production
```

> 🔑 Get a Gemini API key from: https://aistudio.google.com/apikey

### Step 4: Generate Prisma Client

```powershell
cd d:\scetplacement-main\backend
npx prisma generate
```

### Step 5: Push Database Schema (First Time Only)

```powershell
npx prisma db push
```

This creates all tables in the Neon PostgreSQL database.

---

## Running the Application

You need **two terminals** running simultaneously:

### Terminal 1 — Backend (GraphQL API Server)

```powershell
cd d:\scetplacement-main\backend
npm run dev
```

**Expected output:**
```
🚀 Teacher Module Backend running at: http://localhost:4000/
```

The GraphQL Playground is accessible at: **http://localhost:4000**

### Terminal 2 — Frontend (Static File Server)

```powershell
cd d:\scetplacement-main
python -m http.server 3000
```

**Expected output:**
```
Serving HTTP on :: port 3000 (http://[::]:3000/) ...
```

### Access the Application

Open your browser and go to: **http://localhost:3000**

This opens the Login page. Click the login button to enter the Faculty Dashboard.

---

## Environment Variables

| Variable              | Description                           | Required |
| --------------------- | ------------------------------------- | -------- |
| `DATABASE_URL`        | Neon PostgreSQL pooled connection URL | ✅ Yes    |
| `DATABASE_URL_UNPOOLED` | Neon direct connection (migrations) | ✅ Yes    |
| `GEMINI_API_KEY`      | Google Gemini API key for AI features | ✅ Yes    |
| `NEON_BRANCH`         | Neon branch name                      | Optional |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                           │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Dashboard │  │Questions │  │ Editor   │  │Assessments│   │
│  │  .html   │  │  .html   │  │  .html   │  │  .html   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │              │             │              │         │
│       └──────────────┴─────────────┴──────────────┘         │
│                          │                                  │
│                   fetch() / GraphQL                         │
│                          │                                  │
└──────────────────────────┼──────────────────────────────────┘
                           │
                    HTTP :3000 (Python)
                    HTTP :4000 (Apollo)
                           │
┌──────────────────────────┼──────────────────────────────────┐
│               BACKEND (Apollo Server)                       │
│                          │                                  │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌─────────┐ │
│  │ Question  │  │ Review    │  │Assessment │  │   AI    │ │
│  │ Module    │  │ Module    │  │ Module    │  │ Module  │ │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └────┬────┘ │
│        │               │              │              │      │
│        └───────────────┴──────────────┘              │      │
│                        │                             │      │
│                   Prisma ORM                   Gemini API   │
│                        │                             │      │
└────────────────────────┼─────────────────────────────┼──────┘
                         │                             │
                         ▼                             ▼
              ┌──────────────────┐         ┌──────────────────┐
              │  Neon PostgreSQL │         │  Google Gemini   │
              │  (Cloud DB)      │         │  3.6 Flash API   │
              └──────────────────┘         └──────────────────┘
```

---

## Available Pages

| #  | Page                              | URL Path                          | Description                                |
| -- | --------------------------------- | --------------------------------- | ------------------------------------------ |
| 1  | Login                             | `/index.html`                     | Entry point, faculty sign-in               |
| 2  | Faculty Dashboard                 | `/faculty-dashboard.html`         | Overview cards, active assessments, stats   |
| 3  | Question Bank                     | `/faculty-questions.html`         | View all questions with dept/sem filters    |
| 4  | Question Editor                   | `/faculty-question-editor.html`   | Create MCQ/Coding/Debugging + AI generate  |
| 5  | AI Review Queue                   | `/faculty-question-review.html`   | Approve/Edit/Reject AI-generated questions |
| 6  | Assessments                       | `/faculty-assessments.html`       | View all scheduled & completed tests       |
| 7  | Assessment Builder                | `/faculty-assessment-builder.html`| Configure & publish new assessments        |
| 8  | Assessment Results                | `/faculty-assessment-results.html`| Leaderboard, scores, integrity flags       |
| 9  | Student Roster                    | `/faculty-students.html`          | Student list, CGPA, readiness tracking     |

---

## API Reference (GraphQL)

**Endpoint:** `http://localhost:4000`

### Mutations

#### Generate Questions with AI
```graphql
mutation {
  generateQuestionsWithAi(
    topic: "Data Structures"
    count: 3
    difficulty: "MEDIUM"
    type: "MCQ"
  ) {
    title
    type
    difficulty
    content
    explanation
    tags
  }
}
```

### Queries

#### Review a Question with AI
```graphql
query {
  reviewQuestionWithAi(id: "<question-uuid>") {
    isApproved
    feedback
    suggestedFixes
  }
}
```

---

## Troubleshooting

| Problem                                    | Solution                                                    |
| ------------------------------------------ | ----------------------------------------------------------- |
| `EADDRINUSE: port 3000`                    | Kill existing process: `taskkill /F /IM python.exe`         |
| `EADDRINUSE: port 4000`                    | Kill existing process: `taskkill /F /IM node.exe`           |
| Backend shows `Cannot find module`         | Run `cd backend && npm install` again                       |
| AI returns mock/fallback data              | Check `GEMINI_API_KEY` in `.env` is valid                   |
| `gemini-1.5-pro is not found`              | Model was deprecated. Already fixed to `gemini-3.6-flash`   |
| CSS `context-selector-card` not styled     | Check for `{{` double-brace bug (already fixed)             |
| GraphQL Playground won't load              | Ensure backend is running: `npm run dev` in `/backend`      |
| Database connection error                  | Verify `DATABASE_URL` in `.env` and Neon dashboard status   |
| Frontend dropdown changes don't reflect    | Hard-refresh with `Ctrl+Shift+R` to clear browser cache     |

---

## Quick Start (TL;DR)

```powershell
# Terminal 1: Backend
cd d:\scetplacement-main\backend
npm install
npm run dev

# Terminal 2: Frontend
cd d:\scetplacement-main
python -m http.server 3000

# Open browser → http://localhost:3000
```

---

*Built for SCET Placement Cell | Faculty Module*
