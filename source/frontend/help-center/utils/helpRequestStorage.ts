import { HelpRequest, HelpRequestStorage, ConversationMessage } from '@/types/helpRequest';

const STORAGE_KEY = 'help-requests';
const DEFAULT_USER_EMAIL = 'lucas.barrez@edu.devinci.fr';

export const getHelpRequests = (): HelpRequest[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const storage: HelpRequestStorage = JSON.parse(data);
    return storage.requests || [];
  } catch (error) {
    console.error('Erreur lors de la lecture des demandes d\'aide:', error);
    return [];
  }
};

export const saveHelpRequest = (
  firstQuestion: string,
  conversation: ConversationMessage[]
): HelpRequest => {
  try {
    const requests = getHelpRequests();
    
    const newRequest: HelpRequest = {
      id: generateRequestId(),
      userEmail: DEFAULT_USER_EMAIL,
      firstQuestion,
      date: new Date().toISOString(),
      conversation,
      status: 'pending'
    };
    
    requests.push(newRequest);
    
    const storage: HelpRequestStorage = { requests };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
    
    console.log('Demande d\'aide sauvegardée:', newRequest);
    return newRequest;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la demande d\'aide:', error);
    throw error;
  }
};

export const updateHelpRequestStatus = (
  id: string, 
  status: HelpRequest['status']
): void => {
  try {
    const requests = getHelpRequests();
    const requestIndex = requests.findIndex(req => req.id === id);
    
    if (requestIndex !== -1) {
      requests[requestIndex].status = status;
      const storage: HelpRequestStorage = { requests };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
  }
};

export const deleteHelpRequest = (id: string): void => {
  try {
    const requests = getHelpRequests();
    const filteredRequests = requests.filter(req => req.id !== id);
    
    const storage: HelpRequestStorage = { requests: filteredRequests };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  } catch (error) {
    console.error('Erreur lors de la suppression de la demande d\'aide:', error);
  }
};

const generateRequestId = (): string => {
  return `help-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const formatConversationForDisplay = (conversation: ConversationMessage[]): string => {
  return conversation
    .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
    .join('\n\n');
};

export const convertChatMessages = (messages: Array<{id: string, role: 'user' | 'assistant', content: string}>): ConversationMessage[] => {
  return messages.map(msg => ({
    role: msg.role,
    content: msg.content,
    timestamp: new Date().toISOString()
  }));
};