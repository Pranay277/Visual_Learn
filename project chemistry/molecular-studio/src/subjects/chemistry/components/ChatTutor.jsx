import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey && apiKey !== '[GCP_API_KEY]' ? new GoogleGenerativeAI(apiKey) : null;

export default function ChatTutor() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hi! I'm your AI Chemistry Tutor powered by Gemini. How can I help you prepare for NEET today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Store the chat session so Gemini remembers context
  const chatSessionRef = useRef(null);

  // Initialize the chat session
  useEffect(() => {
    if (genAI && !chatSessionRef.current) {
      // Use gemini-2.5-flash
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: "You are an expert, encouraging high school chemistry tutor helping a student prepare for the NEET exam. Keep your answers concise, accurate, and easy to understand. Format math and chemical formulas clearly. Do not answer questions outside of science/chemistry.",
      });

      chatSessionRef.current = model.startChat({
        generationConfig: {
          maxOutputTokens: 250, // Setting the limit to keep responses concise
          temperature: 0.7,
        },
        history: [],
      });
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    if (!genAI || !chatSessionRef.current) {
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'ai', text: "API Key is missing or invalid! Please paste your key into the .env file and restart the server." }]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    try {
      // Call the real Gemini API
      const result = await chatSessionRef.current.sendMessage(userMessage);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { sender: 'ai', text: text }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages(prev => [...prev, { sender: 'ai', text: `API Error: ${error.message || 'Unknown error'}. Check your key or internet.` }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button className="chat-fab" onClick={() => setIsOpen(true)}>
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window glass-panel">
          <div className="chat-header">
            <div className="chat-title">
              <Sparkles size={18} color="var(--accent-purple)" />
              <span>AI Study Buddy</span>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}><X size={18} /></button>
          </div>

          <div className="chat-body">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message-wrapper ${msg.sender}`}>
                <div className="message">{msg.text}</div>
              </div>
            ))}
            {isTyping && (
              <div className="message-wrapper ai">
                <div className="message typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-footer">
            <input
              type="text"
              placeholder="Ask a chemistry question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button className="send-btn" onClick={handleSend} disabled={!input.trim()}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        .chat-fab {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--accent-purple);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
          transition: transform 0.2s;
          z-index: 1000;
        }
        .chat-fab:hover { transform: scale(1.1); }
        
        .chat-window {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 350px;
          height: 500px;
          background: rgba(20, 20, 30, 0.85);
          backdrop-filter: blur(16px);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          z-index: 1000;
          overflow: hidden;
        }
        
        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border-color);
          background: rgba(255,255,255,0.02);
        }
        .chat-title { display: flex; align-items: center; gap: 0.5rem; font-weight: 600; }
        .close-btn { background: transparent; border: none; color: var(--text-muted); cursor: pointer; }
        .close-btn:hover { color: white; }
        
        .chat-body {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .message-wrapper { display: flex; }
        .message-wrapper.user { justify-content: flex-end; }
        
        .message {
          max-width: 85%;
          padding: 0.8rem 1rem;
          border-radius: 12px;
          font-size: 0.9rem;
          line-height: 1.4;
        }
        .message-wrapper.ai .message { background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: var(--text-main); border-bottom-left-radius: 4px; }
        .message-wrapper.user .message { background: var(--accent-purple); color: white; border-bottom-right-radius: 4px; }
        
        .chat-footer {
          display: flex;
          gap: 0.5rem;
          padding: 1rem;
          border-top: 1px solid var(--border-color);
          background: rgba(255,255,255,0.02);
        }
        .chat-footer input {
          flex: 1;
          background: rgba(0,0,0,0.2);
          border: 1px solid var(--border-color);
          padding: 0.8rem 1rem;
          border-radius: 20px;
          color: white;
          outline: none;
        }
        .chat-footer input:focus { border-color: var(--accent-purple); }
        .send-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--accent-purple);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        
        .typing-indicator { display: flex; gap: 4px; align-items: center; padding: 1rem !important; }
        .typing-indicator span {
          width: 6px; height: 6px; background: var(--text-muted); border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </>
  );
}
