import React, { useContext, useEffect, useState, useRef } from 'react';
import { LuminaContext } from '../../App';
import { X, Sparkles, Brain, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { CanvasContext } from '../../types';

export const FloatingAIButton = () => {
  const context = useContext(LuminaContext);
  if (!context) return null;
  const { isDrawerOpen, setDrawerOpen } = context;
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    const handleContextUpdate = () => {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 2000);
      return () => clearTimeout(timer);
    };
    
    window.addEventListener('canvasContextUpdate', handleContextUpdate);
    return () => window.removeEventListener('canvasContextUpdate', handleContextUpdate);
  }, []);

  if (isDrawerOpen) return null;

  return (
    <button
      onClick={() => setDrawerOpen(true)}
      className={`fixed bottom-6 right-6 z-40 p-4 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/50 hover:bg-blue-500 transition-all ${
        isPulsing ? 'animate-pulse ring-4 ring-blue-400' : ''
      }`}
    >
      <Brain className="w-8 h-8" />
    </button>
  );
};

const CopilotDrawer = () => {
  const context = useContext(LuminaContext);
  if (!context) return null;
  
  const { messages, sendMessage, streamingAgent, isDrawerOpen, setDrawerOpen } = context;
  const [inputText, setInputText] = useState('');
  const [canvasCtx, setCanvasCtx] = useState<CanvasContext | null>(null);
  const [pulseContext, setPulseContext] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleContextUpdate = (e: any) => {
      setCanvasCtx(e.detail);
      setPulseContext(true);
      setTimeout(() => setPulseContext(false), 1500);
    };
    
    window.addEventListener('canvasContextUpdate', handleContextUpdate);
    return () => window.removeEventListener('canvasContextUpdate', handleContextUpdate);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingAgent]);

  const handleSend = () => {
    if (inputText.trim() && !streamingAgent) {
      sendMessage(inputText);
      setInputText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isStreaming = streamingAgent !== null;
  const placeholderText = streamingAgent === 'lumina' ? "Lumina is thinking..." : 
                          streamingAgent === 'commentator' ? "Brahmi is typing..." : 
                          "Ask about this...";

  return (
    <div 
      className={`fixed top-0 right-0 h-full z-50 w-full md:w-[380px] bg-gray-900/90 backdrop-blur-xl border-l border-white/10 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
        isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-bold text-white tracking-wide">Study Group</h2>
          {canvasCtx?.module && (
            <span className="ml-2 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
              {canvasCtx.module}
            </span>
          )}
        </div>
        <button 
          onClick={() => setDrawerOpen(false)} 
          className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Context Pill */}
      {canvasCtx?.selected_component && (
        <div className="px-4 py-2 bg-black/20 border-b border-white/5 shrink-0 flex items-center justify-center">
          <div className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-white/5 text-gray-300 border border-white/10 transition-all duration-500 ${
            pulseContext ? 'ring-2 ring-blue-500/50 bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : ''
          }`}>
            Viewing: <span className="text-white ml-1 font-semibold">{canvasCtx.selected_component}</span>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {messages.length === 0 && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg shadow-blue-500/20">
              L
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 text-gray-300 text-sm leading-relaxed">
              Hi! I'm Lumina — your AI tutor. Ask me anything, and brace yourself for Brahmi!
            </div>
          </div>
        )}
        
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isCommentator = msg.agentId === 'commentator';
          
          return (
            <div key={msg.id} className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
              {!isUser && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg ${
                  isCommentator ? 'bg-gradient-to-br from-orange-500 to-red-600 shadow-orange-500/20' : 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-blue-500/20'
                }`}>
                  {isCommentator ? 'B' : 'L'}
                </div>
              )}
              <div 
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  isUser 
                    ? 'bg-blue-600 text-white rounded-tr-sm shadow-lg shadow-blue-600/20' 
                    : isCommentator 
                      ? 'bg-orange-500/10 border border-orange-500/20 text-orange-100 rounded-tl-sm'
                      : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm'
                } ${msg.isError ? 'border-red-500/50 bg-red-500/10 text-red-200' : ''}`}
              >
                {!isUser ? (
                  <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 max-w-none text-sm">
                    {msg.streaming && !msg.content ? (
                      <div className="flex gap-1 items-center h-5">
                        <div className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.3s] ${isCommentator ? 'bg-orange-400' : 'bg-blue-400'}`}></div>
                        <div className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.15s] ${isCommentator ? 'bg-orange-400' : 'bg-blue-400'}`}></div>
                        <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${isCommentator ? 'bg-orange-400' : 'bg-blue-400'}`}></div>
                      </div>
                    ) : (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    )}
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-black/40 border-t border-white/10 shrink-0">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholderText}
            disabled={isStreaming}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-all disabled:opacity-50"
            rows={Math.max(1, Math.min(4, inputText.split('\n').length))}
            style={{ minHeight: '46px' }}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isStreaming}
            className="absolute right-2 bottom-2 p-2 rounded-lg text-blue-400 hover:bg-blue-500/20 disabled:text-gray-600 disabled:hover:bg-transparent transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CopilotDrawer;
