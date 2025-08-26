# Busybody Task List and Agent Instructions

## Task Batches Overview
This document outlines the parallel development batches for the Busybody project and instructions for starting multiple agents to work on them simultaneously.

## Starting Multiple Agents
To work on multiple batches in parallel:

1. Open multiple chat windows/instances
2. In each chat, use the task description provided below for the batch you want to work on
3. The task descriptions are formatted to clearly define the scope and requirements for each batch

## Available Task Batches

### 1. Frontend Infrastructure (Agent 1)
Task Description:
"Start implementing Frontend Infrastructure batch: Initialize React+TypeScript project with Vite, configure ESLint/Prettier/TypeScript, set up Chakra UI with theme configuration, implement Zustand store structure, and configure React Hook Form with validation schemas"

### 2. Frontend Components (Agent 2)
Task Description:
"Start implementing Frontend Components batch: Create base layout components (Header, Footer, Sidebar), build authentication components, develop task management components, implement notification components, and create dashboard components with analytics"

### 3. Backend Infrastructure (Agent 3)
Task Description:
"Start implementing Backend Infrastructure batch: Set up Node.js + Express.js server, configure TypeScript for backend, implement logging with Axiom, set up error handling with Sentry, and configure environment variables"

### 4. Database & ORM (Agent 4)
Task Description:
"Start implementing Database & ORM batch: Initialize PostgreSQL database, set up Prisma ORM with schema, create database migrations, implement data models, and configure backup and recovery"

### 5. Authentication System (Agent 5)
Task Description:
"Start implementing Authentication System batch: Set up NextAuth.js, implement OAuth providers, create JWT handling, develop role-based access, and set up password reset flow"

### 6. API Development (Agent 6)
Task Description:
"Start implementing API Development batch: Design RESTful endpoints, implement user management, create task CRUD operations, develop notification system, and build analytics endpoints"

### 7. Testing Infrastructure (Agent 7)
Task Description:
"Start implementing Testing Infrastructure batch: Set up Vitest, configure Playwright, create test utilities, set up test database, and implement CI automation"

### 8. DevOps & Deployment (Agent 8)
Task Description:
"Start implementing DevOps & Deployment batch: Configure Vercel deployment, set up Supabase hosting, implement CI/CD pipelines, configure monitoring, and set up backup systems"

### 9. Documentation (Agent 9)
Task Description:
"Start implementing Documentation batch: Create API documentation, write component documentation, document database schema, create deployment guides, and write contribution guidelines"

## Development Dependencies

Key dependencies between batches:
1. Frontend Components depend on Frontend Infrastructure
2. API endpoints depend on Database & Authentication
3. Testing depends on implemented features

## Recommended Startup Order

1. First Wave (can start immediately):
   - Frontend Infrastructure (Agent 1)
   - Backend Infrastructure (Agent 3)
   - Database & ORM (Agent 4)

2. Second Wave (start after first wave basics are ready):
   - Frontend Components (Agent 2)
   - Authentication System (Agent 5)
   - API Development (Agent 6)

3. Third Wave (start as features become available):
   - Testing Infrastructure (Agent 7)
   - DevOps & Deployment (Agent 8)
   - Documentation (Agent 9)

## Progress Tracking
Each agent maintains its own todo list and updates the central task tracking system. Progress can be monitored through the project dashboard.