import { useState, useCallback } from 'react';
import { 
  saveHelpRequest, 
  getHelpRequests, 
  convertChatMessages,
  formatConversationForDisplay 
} from '@/utils/helpRequestStorage';
import { HelpRequest } from '@/types/helpRequest';

interface UseHelpRequestReturn {
  createHelpRequest: (
    firstQuestion: string,
    messages: Array<{id: string, role: 'user' | 'assistant', content: string}>
  ) => HelpRequest | null;
  getAllRequests: () => HelpRequest[];
  isLoading: boolean;
}

export const useHelpRequest = (): UseHelpRequestReturn => {
  const [isLoading, setIsLoading] = useState(false);

  const createHelpRequest = useCallback((
    firstQuestion: string,
    messages: Array<{id: string, role: 'user' | 'assistant', content: string}>
  ): HelpRequest | null => {
    try {
      setIsLoading(true);
      
      const conversation = convertChatMessages(messages);
      
      const helpRequest = saveHelpRequest(firstQuestion, conversation);
      
      console.log('Demande d\'aide créée:', {
        id: helpRequest.id,
        email: helpRequest.userEmail,
        firstQuestion: helpRequest.firstQuestion,
        date: helpRequest.date,
        conversationPreview: formatConversationForDisplay(conversation)
      });
      
      return helpRequest;
    } catch (error) {
      console.error('Erreur lors de la création de la demande d\'aide:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAllRequests = useCallback((): HelpRequest[] => {
    try {
      return getHelpRequests();
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
      return [];
    }
  }, []);

  return {
    createHelpRequest,
    getAllRequests,
    isLoading
  };
};