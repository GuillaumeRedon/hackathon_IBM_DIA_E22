export interface HelpRequest {
  id: string;
  userEmail: string;
  firstQuestion: string;
  date: string;
  conversation: ConversationMessage[];
  status: 'pending' | 'resolved' | 'in-progress';
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface HelpRequestStorage {
  requests: HelpRequest[];
}