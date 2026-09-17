# PROJECT TRACKER, FLOWS & INTEGRATION RULES

This document tracks completed tasks, remaining work, system workflows, and adherence to integration contracts.

# Placement Portal - Team Integration Contract

## 1. Ownership

- Admin module: owned by [your name]
- Student module: owned by [your name]
- Teacher/Faculty module: owned by teammate 1
- Placement Coordinator module: owned by teammate 2

No team member should change another module’s screens, resolvers, services, database migrations, or authorization logic without discussing it first.

## 2. Shared foundation - do not duplicate

These are shared platform features, not owned by the Teacher or Coordinator modules:

- Authentication: login, logout, refresh token, password hashing, sessions
- User table and profile basics
- RBAC / permission guard
- Organization, department, and batch tables
- Core question-bank entities
- Assessment, attempt, response, and result entities
- Notifications, audit logs, shared dashboard widgets
- GraphQL setup, Prisma client, Docker configuration, environment files

Teacher and Coordinator modules must consume these shared parts. They must not create alternative `TeacherUser`, `CoordinatorUser`, `StudentAccount`, or duplicate question/assessment tables.

## 3. Exact role names

Use these exact role values everywhere: database, API, frontend checks, seeds, and tests.

```ts
enum Role {
  STUDENT
  TEACHER
  PLACEMENT_COORDINATOR
  ADMIN
}
```

Do not use alternatives such as `FACULTY`, `COORDINATOR`, `PLACEMENT_OFFICER`, lowercase names, or hard-coded role IDs. If “Faculty” is preferred in the UI, display it as a label while retaining `TEACHER` internally.

## 4. Shared data rules

Every user belongs to one organization.

- A Student must belong to an organization, department, and batch.
- A Teacher must belong to an organization; department may be optional.
- A Placement Coordinator must belong to an organization; department may be optional because they can work across departments.
- An Admin must belong to an organization unless a future platform-super-admin role is added.
- Every organization-scoped record must include `organizationId`.

Never filter data only by a supplied ID. Every query and mutation must verify that the requester can access that record’s organization.

## 5. Teacher module responsibilities

The Teacher module owns authoring and academic management, not student attempt-taking.

### Teacher can manage

- Questions, topics, categories, tags, difficulty, explanations, and publication status
- Coding and debugging problem definitions
- Test cases and reference solutions
- Assessment drafts, sections, question selection, schedules, marks, negative marking, and attempt limits
- Question review and approval workflow
- Assessment-level participation and performance views
- Teacher-created practice sets or assignments

### Teacher must not build

- Student authentication/profile screens
- Student practice player or student test-taking UI
- Student bookmarks, streaks, recommendations, or personal dashboard
- Admin user/department/batch management
- Coordinator interventions, readiness policy, or college-wide reports
- A separate result-calculation system

### Required question fields

All question types must support:

```ts
id
organizationId
categoryId
topicId
type
difficulty
status
title
content
explanation
tags
createdById
updatedById
version
createdAt
updatedAt
publishedAt
```

Use these exact lifecycle statuses:

```ts
enum QuestionStatus {
  DRAFT
  PENDING_REVIEW
  APPROVED
  PUBLISHED
  RETIRED
  REJECTED
}
```

Students may only receive `PUBLISHED` questions. Teachers can work with their own drafts; Admins can access all organization data.

### Required assessment fields

```ts
id
organizationId
title
description
status
createdById
startsAt
endsAt
durationMinutes
totalMarks
negativeMarkingEnabled
attemptLimit
randomizeQuestions
randomizeOptions
publishedAt
createdAt
updatedAt
```

Use these assessment statuses:

```ts
enum AssessmentStatus {
  DRAFT
  SCHEDULED
  PUBLISHED
  CLOSED
  ARCHIVED
}
```

Do not mark an assessment as `PUBLISHED` unless it has at least one section and valid questions.

## 6. Placement Coordinator module responsibilities

The Coordinator module owns placement-program operations and aggregate decision-making.

### Coordinator can manage

- Placement preparation programs
- Company-specific preparation tracks
- Student cohorts for intervention
- Department and batch readiness monitoring
- Aggregate reporting and comparisons
- Intervention notes, follow-ups, and assigned practice/assessment plans
- Readiness configuration within the organization
- Integrity report review and flags

### Coordinator must not build

- User/role/department/batch CRUD screens; those belong to Admin
- Question editing or assessment authoring; those belong to Teacher
- Student test/practice/coding interfaces; those belong to Student
- A second analytics calculation system that contradicts student result data
- A second question bank or assessment table

### Required coordinator data

Use separate coordinator-owned tables for:

```ts
placement_programs
placement_program_students
interventions
intervention_students
readiness_configurations
readiness_snapshots
coordinator_notes
integrity_reviews
```

An intervention should reference existing students, assessments, practice sets, or topics by ID. Do not copy student names, scores, or question content into coordinator tables.

## 7. Shared API contract

Use GraphQL and keep naming consistent.

### Shared read operations

```graphql
me
student(id: ID!)
students(filter: StudentFilter)
question(id: ID!)
questions(filter: QuestionFilter)
assessment(id: ID!)
assessments(filter: AssessmentFilter)
attempt(id: ID!)
studentAnalytics(studentId: ID!)
batchAnalytics(batchId: ID!)
```

### Teacher mutations

```graphql
createQuestion
updateQuestion
submitQuestionForReview
approveQuestion
publishQuestion
retireQuestion
createAssessment
updateAssessment
scheduleAssessment
publishAssessment
closeAssessment
```

### Coordinator mutations

```graphql
createPlacementProgram
updatePlacementProgram
assignStudentsToProgram
createIntervention
updateInterventionStatus
configureReadiness
recordCoordinatorNote
reviewIntegrityEvent
```

Every mutation must return the changed object, a clear user-safe error message when applicable, and must enforce authorization in the backend—not only by hiding frontend buttons.

## 8. Student-facing dependencies

Teacher and Coordinator work must expose data in forms the Student module can safely consume.

Teacher provides:

- Published questions only
- Published/scheduled assessments only
- Assessment rules, sections, timing, and question availability
- Explanations only after the configured result-release point
- Coding problem details without hidden test cases or reference solutions

Coordinator provides:

- Readiness score, component scores, calculation explanation, and update date
- Assigned interventions/practice plans
- Recommendations containing a reason, priority, and target link
- No confidential teacher notes or other students’ data

## 9. Security and privacy requirements

- Use the logged-in user identity from the JWT; never accept `userId` as the authority for protected actions.
- Check organization scope in every resolver/service.
- Check role permissions in every resolver/service.
- Never expose hidden test cases, reference solutions, answer keys, AI prompts, refresh tokens, password hashes, or internal audit details.
- Coordinator aggregate reports must not expose a student’s private data to unauthorized users.
- Integrity events are review signals, not proof of cheating.
- Readiness is an indicative preparation score, not a placement guarantee.

## 10. Database and migration rules

- Use one shared Prisma schema.
- Before adding a model or enum, search the schema to avoid duplicates.
- Do not rename or remove existing fields without informing the team.
- Use descriptive migrations, for example: `add_teacher_question_workflow`.
- One feature branch per module.
- Rebase or merge the shared development branch before creating a migration.
- Never edit an already-applied migration.
- Add indexes for commonly filtered fields: `organizationId`, `departmentId`, `batchId`, `studentId`, `assessmentId`, `questionId`, `status`, and dates.
- Use UTC for stored timestamps; convert to local time only in the UI.

## 11. Git and code rules

- Branch names:
  - `feature/teacher-question-bank`
  - `feature/teacher-assessments`
  - `feature/coordinator-readiness`
  - `feature/coordinator-interventions`
- Keep commits small and focused.
- Do not commit `.env`, generated credentials, database dumps, or node modules.
- Do not reformat unrelated files.
- Every pull request must state:
  - owned module
  - database changes
  - API changes
  - new environment variables
  - effect on Student/Admin modules
  - test evidence
- Request review from the owner of a touched shared module.

## 12. Definition of done

A feature is complete only when it has:

- backend authorization checks
- GraphQL input validation
- organization scoping
- loading, empty, error, and success UI states
- basic tests
- no hard-coded IDs, role names, department names, or college names
- documentation of changed API types and database fields
- confirmation that Student and Admin screens are unaffected

## 13. Integration checkpoints

1. Before coding: agree on Prisma schema, enums, role names, GraphQL naming, and folder structure.
2. After Teacher foundation: integrate question and assessment APIs with Student read-only flows.
3. After Coordinator foundation: integrate analytics and readiness data with Student/Admin dashboards.
4. Before release: run one complete flow:
   Admin creates users and batches → Teacher publishes questions and assessment → Student completes it → Coordinator views results and creates intervention → Student sees recommendation.

The one workflow everyone must test together is:

`Admin setup → Teacher publishes content → Student practices/attempts → results are calculated once → Coordinator acts on the same results.`

That prevents almost every integration mismatch.
# SCET Placement Portal — Full A-to-Z Test Checklist

> **How to use this document**: Start from Test Case #1 and work through sequentially.
> Mark each row as ✅ PASS or ❌ FAIL. If any test fails, note the error in the "Notes" column.

---

## PHASE 0: Environment Verification

| #   | Test Case                           | Steps                                                                                     | Expected Result                                               | Status | Notes |
| --- | ----------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------ | ----- |
| 0.1 | Node.js installed                   | Run `node --version` in terminal                                                          | Shows `v18.x` or higher                                       | ☐      |       |
| 0.2 | npm installed                       | Run `npm --version`                                                                       | Shows `v9.x` or higher                                        | ☐      |       |
| 0.3 | Python installed                    | Run `python --version`                                                                    | Shows `3.8+`                                                  | ☐      |       |
| 0.4 | Project files exist                 | Open `d:\scetplacement-main` in File Explorer                                             | Folder contains `backend\`, `assets\`, `index.html`, etc.     | ☐      |       |
| 0.5 | Backend `.env` exists               | Check `d:\scetplacement-main\backend\.env`                                                | File exists with `DATABASE_URL`, `GEMINI_API_KEY`             | ☐      |       |
| 0.6 | Backend dependencies installed      | Run `cd d:\scetplacement-main\backend && npm install`                                     | No errors. `node_modules` folder created.                     | ☐      |       |

---

## PHASE 1: Backend Startup

| #   | Test Case                           | Steps                                                                                     | Expected Result                                               | Status | Notes |
| --- | ----------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------ | ----- |
| 1.1 | Backend starts without errors       | Run `cd d:\scetplacement-main\backend && npm run dev`                                     | Console shows `🚀 Teacher Module Backend running at: http://localhost:4000/` | ☐      |       |
| 1.2 | GraphQL Playground loads            | Open `http://localhost:4000` in browser                                                   | Apollo GraphQL Playground UI appears                          | ☐      |       |
| 1.3 | GraphQL introspection works         | In Playground, click "Schema" or "Docs" tab                                               | Shows Query & Mutation types listed                           | ☐      |       |

---

## PHASE 2: Frontend Startup

| #   | Test Case                           | Steps                                                                                     | Expected Result                                               | Status | Notes |
| --- | ----------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------ | ----- |
| 2.1 | Frontend server starts              | Open **new terminal**, run `cd d:\scetplacement-main && python -m http.server 3000`       | Console shows `Serving HTTP on :: port 3000`                  | ☐      |       |
| 2.2 | Login page loads                    | Open `http://localhost:3000` in browser                                                   | Login page with SCET branding appears                         | ☐      |       |
| 2.3 | Login page assets load              | Check the login page visually                                                             | No broken images, CSS loads correctly, fonts render            | ☐      |       |

---

## PHASE 3: Login & Navigation

| #   | Test Case                           | Steps                                                                                     | Expected Result                                               | Status | Notes |
| --- | ----------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------ | ----- |
| 3.1 | Login button works                  | Click the "Sign In" button on the login page                                              | Redirects to `faculty-dashboard.html`                         | ☐      |       |
| 3.2 | Dashboard loads                     | Observe the dashboard page                                                                | Shows stat cards, active assessments section, sidebar nav      | ☐      |       |
| 3.3 | Sidebar navigation - all links      | Click each icon in the left sidebar (Dashboard, Questions, Editor, AI Review, Assessments, Builder, Results, Students) | Each link loads the correct page without 404                  | ☐      |       |
| 3.4 | Theme toggle works                  | Click the sun/moon icon in the header                                                     | Page switches between light and dark mode                     | ☐      |       |
| 3.5 | Logout button works                 | Click "Logout" button                                                                     | Redirects back to `index.html` (login)                        | ☐      |       |

---

## PHASE 4: Faculty Dashboard (`faculty-dashboard.html`)

| #   | Test Case                           | Steps                                                                                     | Expected Result                                               | Status | Notes |
| --- | ----------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------ | ----- |
| 4.1 | Dashboard stat cards visible        | Look at the top of the dashboard                                                          | Shows cards like Total Questions, Active Tests, etc.          | ☐      |       |
| 4.2 | Department dropdown works           | Change "Department" from CSE to ECE                                                       | Scope badge updates to show "ECE"                             | ☐      |       |
| 4.3 | Semester dropdown works             | Change "Semester" from 7 to 5                                                             | Scope badge updates to show "Sem 5"                           | ☐      |       |
| 4.4 | Class dropdown works                | Change "Class" to Div B                                                                   | Scope badge updates to show "Div B"                           | ☐      |       |
| 4.5 | Active assessments subtitle updates | After changing a dropdown, check the subtitle under "Active Assessments"                  | Text reads "Real-time status for ECE - Div B" (or whatever selected) | ☐      |       |
| 4.6 | CSS context-selector-card styled    | Look at the scope selector area                                                           | Has gradient background and rounded border (not plain white)   | ☐      |       |

---

## PHASE 5: Question Bank (`faculty-questions.html`)

| #   | Test Case                           | Steps                                                                                     | Expected Result                                               | Status | Notes |
| --- | ----------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------ | ----- |
| 5.1 | Questions page loads                | Navigate to Question Bank via sidebar                                                     | Page loads with table of questions                             | ☐      |       |
| 5.2 | Department filter works             | Change Department dropdown                                                                | Scope badge updates dynamically                               | ☐      |       |
| 5.3 | Semester filter works               | Change Semester dropdown                                                                  | Scope badge updates dynamically                               | ☐      |       |
| 5.4 | "Create Question" button works      | Click "Create New Question" button                                                        | Navigates to `faculty-question-editor.html`                   | ☐      |       |
| 5.5 | CSS renders correctly               | Inspect the context-selector-card                                                         | Gradient background visible (no broken `{{` CSS)              | ☐      |       |

---

## PHASE 6: Question Editor + AI Generation (`faculty-question-editor.html`)

> ⚠️ **This is the most critical section — tests the LIVE AI integration.**

| #   | Test Case                           | Steps                                                                                     | Expected Result                                               | Status | Notes |
| --- | ----------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------ | ----- |
| 6.1 | Editor page loads                   | Navigate to Question Editor via sidebar                                                   | Form with Topic, Difficulty, Question Type fields appears      | ☐      |       |
| 6.2 | Question type switcher works        | Click "MCQ", then "Coding", then "Debugging"                                              | Form fields dynamically change (options vs code editor)        | ☐      |       |
| 6.3 | AI Generate button visible          | Look for "Generate with AI" or similar button                                             | Button is present and clickable                               | ☐      |       |
| 6.4 | **AI generates MCQ questions**      | Set Topic="Data Structures", Difficulty="MEDIUM", Type="MCQ", Count=3, click Generate     | Returns 3 real AI-generated questions with realistic options   | ☐      |       |
| 6.5 | AI MCQ content is NOT generic       | Read the generated question text                                                          | Question is specific to "Data Structures", NOT "Which describes the core concept of..." | ☐      |       |
| 6.6 | **AI generates Coding questions**   | Set Type="CODING", Topic="Linked Lists", click Generate                                   | Returns questions with starter code and test cases             | ☐      |       |
| 6.7 | Scope selectors update badge        | Change Department/Semester/Class dropdowns                                                | Badge and subtitle text update accordingly                     | ☐      |       |
| 6.8 | Save question button works          | Fill all fields manually, click "Save Question"                                           | Question saved (button shows confirmation state)               | ☐      |       |

---

## PHASE 7: AI Review Queue (`faculty-question-review.html`)

| #   | Test Case                           | Steps                                                                                     | Expected Result                                               | Status | Notes |
| --- | ----------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------ | ----- |
| 7.1 | Review page loads                   | Navigate to AI Review via sidebar                                                         | Shows list of AI-generated questions pending review            | ☐      |       |
| 7.2 | Approve button works                | Click "Approve Question" on first item                                                    | Button changes to "✓ Approved" and becomes disabled            | ☐      |       |
| 7.3 | Reject button works                 | Click "Reject" on second item                                                             | Question card is removed from the list                        | ☐      |       |
| 7.4 | Edit button navigates               | Click "Edit Question" on any item                                                         | Navigates to `faculty-question-editor.html`                   | ☐      |       |
| 7.5 | Scope badge updates                 | Change dropdowns                                                                          | Badge shows updated dept/sem/div                              | ☐      |       |
| 7.6 | CSS renders correctly               | Check context-selector-card styling                                                       | Gradient background renders (no `{{` CSS error)                | ☐      |       |

---

## PHASE 8: Assessments (`faculty-assessments.html`)

| #   | Test Case                           | Steps                                                                                     | Expected Result                                               | Status | Notes |
| --- | ----------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------ | ----- |
| 8.1 | Assessments page loads              | Navigate to Assessments via sidebar                                                       | Table with assessment rows appears                            | ☐      |       |
| 8.2 | "New Assessment" button             | Click "New Assessment" button                                                             | Navigates to `faculty-assessment-builder.html`                | ☐      |       |
| 8.3 | "View Analytics" button             | Click "View Analytics" on any live test                                                   | Navigates to `faculty-assessment-results.html`                | ☐      |       |
| 8.4 | Scope badge updates                 | Change dropdowns                                                                          | Badge shows updated dept/sem/div                              | ☐      |       |
| 8.5 | CSS renders correctly               | Check the page                                                                            | No CSS errors, gradient card renders                          | ☐      |       |

---

## PHASE 9: Assessment Builder (`faculty-assessment-builder.html`)

| #   | Test Case                           | Steps                                                                                     | Expected Result                                               | Status | Notes |
| --- | ----------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------ | ----- |
| 9.1 | Builder page loads                  | Navigate to Assessment Builder via sidebar                                                | Form with Title, Duration, Company Pattern, Dates appears      | ☐      |       |
| 9.2 | Proctoring checkboxes work          | Toggle Tab Switching, Copy-Paste, Shuffle checkboxes                                      | Checkboxes toggle on/off correctly                            | ☐      |       |
| 9.3 | Publish without title fails         | Leave title empty, click "Publish & Schedule"                                             | Title input gets focus (does NOT submit)                      | ☐      |       |
| 9.4 | **Publish with title succeeds**     | Type "Test Mock Exam", click "Publish & Schedule"                                         | Button changes to "✓ Published!", redirects to assessments page after 1.2s | ☐      |       |
| 9.5 | Cancel button works                 | Click "Cancel"                                                                            | Navigates back to `faculty-assessments.html`                  | ☐      |       |
| 9.6 | NO `alert()` popup                  | Click "Publish & Schedule"                                                                | No browser `alert()` dialog. Uses inline UI feedback instead. | ☐      |       |

---

## PHASE 10: Assessment Results (`faculty-assessment-results.html`)

| #   | Test Case                           | Steps                                                                                     | Expected Result                                               | Status | Notes |
| --- | ----------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------ | ----- |
| 10.1 | Results page loads                 | Navigate to Results via sidebar or "View Analytics" button                                | Shows stat cards + leaderboard table                          | ☐      |       |
| 10.2 | Stat cards display correctly       | Look at the 3 stat cards at top                                                           | Shows Batch Average, Turnout, Placement Qualified             | ☐      |       |
| 10.3 | Leaderboard ranks visible          | Check the table                                                                           | Student names with rank #1, #2, #3, scores, integrity flags   | ☐      |       |
| 10.4 | Scope badge updates                | Change dropdowns                                                                          | Badge shows updated dept/sem/div                              | ☐      |       |

---

## PHASE 11: Student Roster (`faculty-students.html`)

| #   | Test Case                           | Steps                                                                                     | Expected Result                                               | Status | Notes |
| --- | ----------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------ | ----- |
| 11.1 | Students page loads                | Navigate to Students via sidebar                                                          | Table with student rows, CGPA, readiness bars appears          | ☐      |       |
| 11.2 | Progress bars render               | Check "Placement Readiness" column                                                        | Colored progress bars visible (green/blue/yellow)             | ☐      |       |
| 11.3 | Scope badge updates                | Change Department dropdown to IT                                                          | Badge and subtitle both update                                | ☐      |       |
| 11.4 | Subtitle updates dynamically       | After changing dropdown                                                                   | Subtitle says "Monitoring IT - Div A (Batch 2026)"            | ☐      |       |

---

## PHASE 12: GraphQL API Direct Testing

> Test the backend API directly via the GraphQL Playground at `http://localhost:4000`.

| #    | Test Case                          | GraphQL Query/Mutation                                                                                                                              | Expected Result                                               | Status | Notes |
| ---- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------ | ----- |
| 12.1 | AI generates MCQ via API           | `mutation { generateQuestionsWithAi(topic: "Arrays", count: 2, difficulty: "EASY", type: "MCQ") { title type difficulty content explanation tags } }` | Returns 2 questions with real AI content (not generic fallback) | ☐      |       |
| 12.2 | AI generates Coding via API        | `mutation { generateQuestionsWithAi(topic: "Sorting", count: 1, difficulty: "HARD", type: "CODING") { title type content } }`                       | Returns 1 coding question with starterCode and testCases       | ☐      |       |
| 12.3 | API rejects unauthorized role      | Send query without valid teacher context                                                                                                            | Returns "Unauthorized" error                                  | ☐      |       |

---

## PHASE 13: Cross-Page Consistency

| #    | Test Case                          | Steps                                                                                     | Expected Result                                               | Status | Notes |
| ---- | ---------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------ | ----- |
| 13.1 | All pages have working theme toggle | Visit every faculty page, click sun/moon icon on each                                     | Dark mode toggles correctly on ALL 8 pages                    | ☐      |       |
| 13.2 | All scope badges are dynamic       | On each page, change Department to ECE                                                    | Badge updates to "ECE — Sem 7 — Div A" on all pages           | ☐      |       |
| 13.3 | No `{{` CSS bugs on any page       | Open each page and inspect the scope selector area                                        | Gradient background renders correctly (no double-brace CSS)    | ☐      |       |
| 13.4 | No `alert()` on any button         | Click all buttons on all pages                                                            | No raw browser `alert()` dialogs appear anywhere              | ☐      |       |
| 13.5 | All sidebar links correct          | On each page, check which sidebar item is highlighted                                     | Current page sidebar icon has `active` class                  | ☐      |       |
| 13.6 | Mobile sidebar offcanvas           | Resize browser to < 992px, click hamburger menu                                           | Sidebar opens as an offcanvas overlay                         | ☐      |       |

---

## Summary Scorecard

| Phase | Section                    | Total Tests | Passed | Failed |
| ----- | -------------------------- | ----------- | ------ | ------ |
| 0     | Environment                | 6           |        |        |
| 1     | Backend Startup            | 3           |        |        |
| 2     | Frontend Startup           | 3           |        |        |
| 3     | Login & Navigation         | 5           |        |        |
| 4     | Dashboard                  | 6           |        |        |
| 5     | Question Bank              | 5           |        |        |
| 6     | Question Editor + AI       | 8           |        |        |
| 7     | AI Review Queue            | 6           |        |        |
| 8     | Assessments                | 5           |        |        |
| 9     | Assessment Builder         | 6           |        |        |
| 10    | Assessment Results         | 4           |        |        |
| 11    | Student Roster             | 4           |        |        |
| 12    | GraphQL API                | 3           |        |        |
| 13    | Cross-Page Consistency     | 6           |        |        |
|       | **TOTAL**                  | **70**      |        |        |

---

## Test Order Recommendation

> **Start here and follow this exact order for the cleanest test run:**

1. **Phase 0** → Confirm Node, Python, files exist
2. **Phase 1** → Start backend, verify GraphQL loads
3. **Phase 2** → Start frontend server
4. **Phase 3** → Login → Dashboard (verifies basic flow)
5. **Phase 12** → Test AI directly in GraphQL Playground (fastest way to confirm Gemini works)
6. **Phase 6** → Test AI generation from the actual frontend UI
7. **Phase 4** → Dashboard dropdowns and badges
8. **Phase 5 → 11** → Remaining pages in order
9. **Phase 13** → Cross-page sweep

---

*SCET Placement Portal — Test Verification Document v1.0*
*Generated: September 2026*
# SCET Placement Portal - Workflow & Progress Log

## Technology Stack Used
- HTML5 / CSS3 (DashQ Template styling)
- Bootstrap 5 & Bootstrap Icons
- JavaScript (Vanilla JS for template interactions)
- Python 3 (For scripting HTML generation & cleanup with BeautifulSoup4)

## Project Workflow
1. **Analyze existing template structure**: Understand the base `dashboard-faculty.html` to adapt it to our exact needs.
2. **Generate specific module pages**: Extract the base layout, strip out irrelevant sidebars (HRMS, CRM, etc.), and generate the exact pages needed for the Teacher module as outlined in the Team Integration Contract.
3. **Link navigation**: Update the main `index.html` (portal) so that selecting "Faculty" redirects directly to the newly generated `faculty-dashboard.html`.
4. **Iteratively implement page contents**: Populate `faculty-questions.html`, `faculty-assessments.html`, etc., with actual HTML forms and data tables.

## Work Completed

### [2026-09-16] Initial Setup & Module Generation
- Evaluated the existing HTML files and `restructure.py` script.
- Saved the Team Integration Contract to `INTEGRATION_CONTRACT.md`.
- Installed `beautifulsoup4` to process HTML templates reliably.
- Created `generate_faculty_module.py` to parse `faculty-dashboard.html`, strip unnecessary Mega Menu and Sidebar links, and inject clean Teacher module links.
- Ran the python script to generate the required HTML pages for the Teacher module:
  - `faculty-dashboard.html`
  - `faculty-questions.html`
  - `faculty-question-editor.html`
  - `faculty-question-review.html`
  - `faculty-assessments.html`
  - `faculty-assessment-builder.html`
  - `faculty-assessment-results.html`
- Updated the login script inside `index.html` so that selecting 'Faculty' navigates directly to `faculty-dashboard.html`.

### [2026-09-16] Faculty Dashboard & Module Redesign
- **Resolved Layout Misalignment**: Fixed grid layout issues caused by rightbar content overflow. Restored standard 80px aside / fluid main / 60px rightbar architecture.
- **Top Class & Semester Selector**: Added prominent Semester (Sem 5-8), Department (CSE/IT/ECE), Class/Section (Div A, Div B, All), and Track selectors with live context feedback at the top of the dashboard.
- **Removed Bloat & Irrelevant Demo Content**: Completely removed Crypto AI, invoices, job feeds, podcasts, healthcare links, and the 31°C weather/San Francisco widget.
- **Tailored Faculty Quick Access**: Implemented dedicated faculty shortcuts for Question Bank, Add Question, AI Review (18 pending), Assessments, Test Builder, Class Results, and Student Roster.
- **Built Pure Faculty Suite**: Rebuilt `faculty-dashboard.html`, `faculty-questions.html`, `faculty-question-editor.html`, `faculty-question-review.html`, `faculty-assessments.html`, `faculty-assessment-builder.html`, `faculty-assessment-results.html`, and `faculty-students.html` with consistent styling, theme support, and responsive layouts.


### [Next Steps] Future Implementation Workflow
Following the Teacher module requirements from the SRS, we will proceed to implement the subsequent features:

1. **Question Bank Management (aculty-questions.html & aculty-question-editor.html)**
   - Build tables with filtering (Category, Topic, Difficulty, Status).
   - Implement the creation forms for MCQs, Coding, and Debugging problems.
   - Enforce lifecycle states (DRAFT, PENDING_REVIEW, APPROVED, PUBLISHED).

2. **Question Review Workflow (aculty-question-review.html)**
   - Create a dedicated queue interface for faculty to review AI-generated questions or peer drafts.
   - Add approval and rejection mechanisms with feedback.

3. **Assessment Engine (aculty-assessments.html & aculty-assessment-builder.html)**
   - Develop the assessment listing view with state badges.
   - Build the complex Assessment Builder:
     - Basic details (Time, Marks, Negative Marking).
     - Section management and Question selection from the Question Bank.
   - Prevent publishing if an assessment lacks valid sections/questions.

4. **Assessment Results (aculty-assessment-results.html)**
   - Build participation reports.
   - Implement performance views specific to a single assessment.
