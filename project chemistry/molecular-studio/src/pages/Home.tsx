import React from 'react';
import { Link } from 'react-router-dom';
import { Dna, FlaskConical, Atom, Sigma, Code2, Sparkles } from 'lucide-react';

const subjects = [
  {
    id: 'biology',
    name: 'Biology',
    route: '/biology',
    icon: Dna,
    color: 'text-green-400',
    bgLight: 'bg-green-500/10',
    border: 'border-green-500/20',
    glow: 'hover:shadow-[0_0_30px_rgba(74,222,128,0.15)] hover:border-green-500/50',
    description: 'Explore 3D anatomy and cellular structures'
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    route: '/chemistry',
    icon: FlaskConical,
    color: 'text-blue-400',
    bgLight: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    glow: 'hover:shadow-[0_0_30px_rgba(96,165,250,0.15)] hover:border-blue-500/50',
    description: 'Visualize molecular geometry and reactions'
  },
  {
    id: 'physics',
    name: 'Physics',
    route: '/physics',
    icon: Atom,
    color: 'text-orange-400',
    bgLight: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    glow: 'hover:shadow-[0_0_30px_rgba(251,146,60,0.15)] hover:border-orange-500/50',
    description: 'Simulate forces, fields, and motion'
  },
  {
    id: 'maths',
    name: 'Mathematics',
    route: '/maths',
    icon: Sigma,
    color: 'text-purple-400',
    bgLight: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    glow: 'hover:shadow-[0_0_30px_rgba(192,132,252,0.15)] hover:border-purple-500/50',
    description: 'See equations come alive in 3D space'
  },
  {
    id: 'programming',
    name: 'Programming',
    route: '/programming',
    icon: Code2,
    color: 'text-pink-400',
    bgLight: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    glow: 'hover:shadow-[0_0_30px_rgba(244,114,182,0.15)] hover:border-pink-500/50',
    description: 'Solve logic puzzles and build games'
  }
];

const Home = () => {
  return (
    <div className="h-full w-full overflow-y-auto relative bg-gray-950">
      {/* Animated Subtle Grid Background */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 0%, black, transparent)'
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 flex flex-col items-center">
        {/* Hero Section */}
        <div className="text-center mb-20 mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-semibold mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Welcome to the future of learning</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6">
            Learn Through <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Exploration
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Interact with 3D models. Ask Lumina anything.
          </p>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-24 relative">
          
          {/* Subtle background glow behind the grid */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

          {subjects.map((subject, index) => {
            const Icon = subject.icon;
            // Center the last card on the bottom row if it's the 5th item in a 3-column grid
            const isLast = index === subjects.length - 1;
            
            return (
              <Link 
                key={subject.id} 
                to={subject.route}
                className={`group relative flex flex-col p-8 rounded-3xl bg-gray-900/50 border backdrop-blur-md transition-all duration-300 transform hover:-translate-y-1.5 ${subject.border} ${subject.glow} ${isLast ? 'lg:col-start-2' : ''}`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${subject.bgLight}`}>
                  <Icon className={`w-7 h-7 ${subject.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-wide group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                  {subject.name}
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm md:text-base font-medium">
                  {subject.description}
                </p>
                
                {/* Internal Card Glow */}
                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 bg-current ${subject.color}`} />
              </Link>
            )
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-auto pb-10">
          <div className="inline-flex items-center justify-center gap-2 text-sm text-gray-600 font-medium bg-white/5 px-6 py-2 rounded-full border border-white/5">
            Powered by <span className="text-gray-300">React Three Fiber</span> + <span className="text-gray-300">Gemini AI</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
