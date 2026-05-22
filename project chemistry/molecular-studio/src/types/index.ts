export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  route: string;
}

export interface LuminaMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  streaming?: boolean;
  isError?: boolean;
  agentId?: 'lumina' | 'commentator';
}

export interface CanvasContext {
  module: string;
  model_id: string;
  selected_component: string;
  current_lesson: string;
  student_action: string;
}

export interface SubjectModule {
  updateContext: (context: Partial<CanvasContext>) => void;
  openDrawer: () => void;
}
