import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import admin from 'firebase-admin';

// Initialize Firebase Admin (wait, we shouldn't fail if no creds are present initially maybe?)
// Default empty initialization relies on application default credentials, which might not be set in dev.
// We can use Firebase client for most things, but server actions might need admin.
// For now let's just initialize the GenAI client.

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini
let ai: GoogleGenAI | null = null;

function getAi() {
  if (!ai) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is required');
    }
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });
  }
  return ai;
}

app.post('/api/recommendations/generate', async (req, res) => {
  try {
    const aiClient = getAi();
    const { studentProfile, skills, courses } = req.body;

    const prompt = `
    You are an expert Academic and Career Advisor.
    Analyze the following student profile and provide 3 career path recommendations, missing skills to acquire, and immediate next steps.
    
    Student Profile:
    Major: ${studentProfile?.major}
    Graduation Year: ${studentProfile?.graduationYear}
    
    Current Skills:
    ${skills?.map((s: any) => `- ${s.name} (${s.proficiency})`).join('\n') || 'None listed'}
    
    Courses Completed:
    ${courses?.map((c: any) => `- ${c.courseName} (${c.grade})`).join('\n') || 'None listed'}
    
    Provide your response in JSON format matching this schema:
    {
      "careerRecommendations": [
        { "title": "string", "reason": "string" }
      ],
      "missingSkills": ["string"],
      "nextSteps": [
        { "title": "string", "type": "Course|Certification|Internship|Skill", "description": "string" }
      ]
    }`;

    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const aiClient = getAi();
    const { message, history } = req.body;

    // We can reconstruct chat history, but for simplicity we'll just use generateContent
    // or properly format the history. Let's just use generateContentStream for now.
    
    const response = await aiClient.models.generateContentStream({
      model: "gemini-2.5-flash", // Fast responses for chat
      contents: message,
      config: {
        systemInstruction: "You are a friendly, professional AI academic and career advisor. You help university students navigate their courses, skills, and career paths.",
      }
    });

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');

    for await (const chunk of response) {
      if (chunk.text) {
        res.write(chunk.text);
      }
    }
    res.end();
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
