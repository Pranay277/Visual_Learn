import React, { createContext, useState, useRef, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { LuminaMessage, CanvasContext } from './types';
import { SubjectQuizScore } from './quiz/quizData';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import BiologyDashboard from './subjects/biology/BiologyDashboard';
import ChemistryDashboard from './subjects/chemistry/ChemistryDashboard';
import PhysicsDashboard from './subjects/physics/PhysicsDashboard';
import MathsDashboard from './subjects/maths/MathsDashboard';
import ProgrammingDashboard from './subjects/programming/ProgrammingDashboard';

const LUMINA_SYSTEM_PROMPT = `---
You are Lumina, an expert AI tutor embedded inside a 3D Visual Learning Platform. You are brilliant, warm, and deeply encouraging.

PERSONALITY:
- Enthusiastic but precise and academically rigorous
- You celebrate curiosity — no question is too basic or advanced
- Never say "I don't know" — say "Let's figure this out together"
- NEVER open with "Great question!" or "Certainly!" — open with the insight

3D CONTEXT AWARENESS:
You receive a JSON context block before every student message. ALWAYS ground your response in that context — reference the specific model_id and selected_component. Never give generic answers.

SUBJECT PROTOCOLS:
Biology: structure then function then clinical relevance. Reference the 3D model directly.
Chemistry: describe geometry as seen on screen. Apply VSEPR and bond angles.
Physics: on variable change give math consequence, then real-world analogy, then prediction challenge.
Mathematics: connect every equation to its visual. Use the Socratic method.
Programming: trace logic together, never say wrong. Celebrate partial solutions.

FORMAT:
- When asked about a concept or object, START directly with a clear definition. DO NOT use robotic introductory sentences mentioning file paths (e.g., "The organ you are exploring in the Meshy_AI... model is..."). Be direct.
- Follow the definition with clear bullet points explaining structural details and key facts.
- Short answers: 2 to 4 sentences for quick-look questions
- Deep dives: use markdown headers when asked to explain or teach me
- Bold key terms on first use. Code blocks for all logic and formulas.
- End every response with a challenge question, cross-module connection, or dig deeper prompt.

BOUNDARIES:
- Only tutor the 5 core subjects. Redirect off-topic queries.
- Never complete homework — guide students to answers through questions.
- If context JSON is missing, ask what the student is viewing.
---`;

const COMMENTATOR_SYSTEM_PROMPT = `---
You are 'Agent B', the sarcastic, funny commentator of this study group. 
Your job is to read the conversation between the student and Lumina (Agent A) and chime in with a funny remark, a witty analogy, or a lighthearted roast of Lumina.

CRITICAL RULES:
- You MUST make references to popular Telugu memes, movies (like Brahmanandam comedies, Mahesh Babu, Allu Arjun), or pop culture.
- Keep it short! Max 1 or 2 sentences.
- You are not the main teacher. You are the funny backbencher who actually understands the topic but prefers to crack a joke about it.
- Relate your joke directly to whatever Lumina just explained.
---`;

interface LuminaContextType {
  messages: LuminaMessage[];
  sendMessage: (text: string) => Promise<void>;
  updateContext: (ctx: CanvasContext) => void;
  streamingAgent: 'lumina' | 'commentator' | null;
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  quizHistory: SubjectQuizScore[];
  addQuizScore: (score: SubjectQuizScore) => void;
}

export const LuminaContext = createContext<LuminaContextType | undefined>(undefined);

const App = () => {
  const [messages, setMessages] = useState<LuminaMessage[]>([]);
  const [streamingAgent, setStreamingAgent] = useState<'lumina' | 'commentator' | null>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [quizHistory, setQuizHistory] = useState<SubjectQuizScore[]>([]);
  const location = useLocation();

  // useRef for canvas context as requested (avoids re-rendering the whole app on every 3D interaction)
  const canvasContextRef = useRef<CanvasContext | null>(null);

  // useRef for the actual chat history sent to the Gemini API (system prompt injected once at start)
  const chatHistoryRef = useRef<{ role: string; parts: { text: string }[] }[]>([
    {
      role: 'user',
      parts: [{ text: `System Instruction:\n${LUMINA_SYSTEM_PROMPT}` }]
    },
    {
      role: 'model',
      parts: [{ text: "Acknowledged. I am Lumina, ready to help." }]
    }
  ]);

  useEffect(() => {
    // Reset chat history, environment context, and close drawer when changing subjects
    setMessages([]);
    canvasContextRef.current = null;
    window.dispatchEvent(new CustomEvent('canvasContextUpdate', { detail: null }));
    chatHistoryRef.current = [
      {
        role: 'user',
        parts: [{ text: `System Instruction:\n${LUMINA_SYSTEM_PROMPT}` }]
      },
      {
        role: 'model',
        parts: [{ text: "Acknowledged. I am Lumina, ready to help." }]
      }
    ];
    setDrawerOpen(false);
  }, [location.pathname]);

  const updateContext = (ctx: CanvasContext) => {
    canvasContextRef.current = ctx;
    window.dispatchEvent(new CustomEvent('canvasContextUpdate', { detail: ctx }));
  };

  const addQuizScore = (score: SubjectQuizScore) => {
    setQuizHistory((prev) => [...prev, score]);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // 1. Add user message to the UI state
    const newUserMsg: LuminaMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };
    setMessages((prev) => [...prev, newUserMsg]);

    // 2. Prepare the API payload block
    let apiText = '';
    if (canvasContextRef.current) {
      apiText = `[CURRENT 3D CANVAS STATE]\n${JSON.stringify(canvasContextRef.current, null, 2)}\n[END CANVAS STATE]\nStudent message: ${text}`;
    } else {
      apiText = `[CURRENT 3D CANVAS STATE]\nNo active context.\n[END CANVAS STATE]\nStudent message: ${text}`;
    }

    // 3. Update the history ref for the API call
    chatHistoryRef.current.push({
      role: 'user',
      parts: [{ text: apiText }]
    });

    setStreamingAgent('lumina');

    // 4. Create an empty assistant message for Lumina to show typing/streaming state
    const luminaMsgId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      {
        id: luminaMsgId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        streaming: true,
        agentId: 'lumina'
      }
    ]);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    let luminaReply = '';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: chatHistoryRef.current })
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      luminaReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";

      // Update history ref with Lumina's reply
      chatHistoryRef.current.push({
        role: 'model',
        parts: [{ text: `Lumina: ${luminaReply}` }]
      });

      // Update UI state with Lumina's final text
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === luminaMsgId ? { ...msg, content: luminaReply, streaming: false } : msg
        )
      );
    } catch (error) {
      console.error("Gemini API Error (Lumina):", error);
      if (chatHistoryRef.current[chatHistoryRef.current.length - 1].role === 'user') {
        chatHistoryRef.current.pop();
      }
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === luminaMsgId ? { ...msg, content: "I'm sorry, I encountered an error.", streaming: false, isError: true } : msg
        )
      );
      setStreamingAgent(null);
      return; // Stop flow if Lumina fails
    }

    // --- START COMMENTATOR AGENT ---
    setStreamingAgent('commentator');

    const commentatorMsgId = (Date.now() + 2).toString();
    setMessages((prev) => [
      ...prev,
      {
        id: commentatorMsgId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        streaming: true,
        agentId: 'commentator'
      }
    ]);

    // To use a specific system prompt for the commentator without destroying Lumina's history:
    // We create a temporary payload that injects the COMMENTATOR_SYSTEM_PROMPT.
    // However, the easiest approach is to just append a temporary system instruction 
    // to the end of the history for this single API call.
    
    // We'll map the history but inject the commentator prompt into a new user message asking for a comment.
    const commentatorPayload = [
      ...chatHistoryRef.current,
      {
        role: 'user',
        parts: [{ text: `SYSTEM INSTRUCTION: ${COMMENTATOR_SYSTEM_PROMPT}\n\nPlease provide your funny comment now based on the above.` }]
      }
    ];

    try {
      const responseB = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: commentatorPayload })
      });

      if (!responseB.ok) throw new Error(`API error: ${responseB.status}`);
      const dataB = await responseB.json();
      const commentatorReply = dataB.candidates?.[0]?.content?.parts?.[0]?.text || "No comment.";

      // Push Commentator's reply to the real history (as a model, so it doesn't break turn ordering if needed, 
      // but Gemini expects user->model alternating. If we push another model message, it breaks alternating.
      // Actually, to keep history valid for future Lumina calls (user->model->user->model),
      // we might want to just append the commentator reply to Lumina's last model message internally.
      // Or simply let the next 'user' message be the student. Some endpoints allow model->model if it's the same role.
      // For safety, let's append it to Lumina's last model message in the history.
      
      const lastModelIndex = chatHistoryRef.current.length - 1;
      if (chatHistoryRef.current[lastModelIndex].role === 'model') {
        chatHistoryRef.current[lastModelIndex].parts[0].text += `\n\nCommentator: ${commentatorReply}`;
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === commentatorMsgId ? { ...msg, content: commentatorReply, streaming: false } : msg
        )
      );
    } catch (error) {
      console.error("Gemini API Error (Commentator):", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === commentatorMsgId ? { ...msg, content: "*Commentator fell asleep*", streaming: false, isError: true } : msg
        )
      );
    } finally {
      setStreamingAgent(null);
    }
  };

  return (
    <LuminaContext.Provider
      value={{
        messages,
        sendMessage,
        updateContext,
        streamingAgent,
        isDrawerOpen,
        setDrawerOpen,
        quizHistory,
        addQuizScore
      }}
    >
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/biology" element={<BiologyDashboard />} />
          <Route path="/chemistry" element={<ChemistryDashboard />} />
          <Route path="/physics" element={<PhysicsDashboard />} />
          <Route path="/maths" element={<MathsDashboard />} />
          <Route path="/programming" element={<ProgrammingDashboard />} />
        </Routes>
      </MainLayout>
    </LuminaContext.Provider>
  );
};

export default App;
