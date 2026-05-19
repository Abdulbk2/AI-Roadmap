# AI-Agentic Autonomous Academic & Career Roadmap

A modern AI-powered web application that helps university students intelligently and autonomously plan their academic journey and career pathway.

## Overview

The platform serves as a virtual academic and career advisor. It analyzes a student's interests, academic performace, skills, and goals to provide personalized roadmaps and gap analyses.

## Core Features
1. **AI Career Recommendation Engine**: Generates customized career path ideas.
2. **Skill Gap Analysis**: Compares current skills to industry expectations, highlighting gaps.
3. **Academic Roadmap**: Manage courses and semesters to fulfill graduation requirements.
4. **AI Chat Assistant**: Talk with Gemini right in your browser to ask about interview prep or course planning.

## Tech Stack
- **Frontend**: React 19, React Router, Tailwind CSS v4, Lucide React, Shadcn UI
- **Backend / API**: Express 4, Node.js + @google/genai SDK
- **Database / Auth**: Firebase Firestore + Firebase Auth (Google Sign-in)

## Local Development (AI Studio Preview)

1. Ensure the platform injected `GEMINI_API_KEY` into the secrets panel or local `.env` file.
2. Ensure you have executed `set_up_firebase` from the agent successfully.
3. The server natively runs via Vite middleware when in Dev mode.

\`\`\`bash
npm run dev
\`\`\`

## Architecture Notes
- The \`server.ts\` handles direct \`@google/genai\` calls for security.
- The UI proxy endpoints are exposed as \`/api/recommendations/generate\` and \`/api/chat\`.
- Firestore is locked down by rigorous \`firestore.rules\`.
