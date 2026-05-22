import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Sparkles } from 'lucide-react';
import CopilotDrawer, { FloatingAIButton } from '../ai/CopilotDrawer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const navLinks = [
  { path: '/biology', label: 'Biology' },
  { path: '/chemistry', label: 'Chemistry' },
  { path: '/physics', label: 'Physics' },
  { path: '/maths', label: 'Maths' },
  { path: '/programming', label: 'Programming' },
];

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-950 overflow-hidden text-gray-100 font-sans">
      {/* Top Navigation Bar */}
      <nav className="shrink-0 h-16 bg-gray-900/95 backdrop-blur-sm border-b border-white/10 flex items-center justify-between px-6 z-40 relative">
        
        {/* Left: Logo */}
        <NavLink to="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
          <div className="p-1.5 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
            <Box className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            VisualLearn
          </span>
        </NavLink>

        {/* Center: Subject Links */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-500/15 text-blue-400 shadow-inner'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right: Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-xs font-semibold text-blue-300">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Powered by Gemini</span>
          <span className="sm:hidden">Gemini</span>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden bg-black/90">
        {children}
      </main>

      {/* AI Copilot UI */}
      <FloatingAIButton />
      <CopilotDrawer />
    </div>
  );
};

export default MainLayout;
