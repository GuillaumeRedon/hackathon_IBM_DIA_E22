import { getHelpRequests, formatConversationForDisplay } from '@/utils/helpRequestStorage';
import { HelpRequest } from '@/types/helpRequest';

export const debugHelpRequests = (): void => {
  const requests = getHelpRequests();
  
  if (requests.length === 0) {
    console.log('📋 Aucune demande d\'aide trouvée');
    return;
  }
  
  console.log(`📋 ${requests.length} demande(s) d'aide trouvée(s):`);
  
  requests.forEach((request, index) => {
    console.group(`🎫 Demande #${index + 1} - ${request.id}`);
    console.log('📧 Email:', request.userEmail);
    console.log('❓ Première question:', request.firstQuestion);
    console.log('📅 Date:', new Date(request.date).toLocaleString('fr-FR'));
    console.log('📊 Statut:', request.status);
    console.log('💬 Conversation:');
    console.log(formatConversationForDisplay(request.conversation));
    console.groupEnd();
  });
};

export const exportHelpRequests = (): string => {
  const requests = getHelpRequests();
  return JSON.stringify(requests, null, 2);
};

export const clearAllHelpRequests = (): void => {
  localStorage.removeItem('help-requests');
  console.log('🗑️ Toutes les demandes d\'aide ont été supprimées');
};

if (typeof window !== 'undefined') {
  (window as any).debugHelpRequests = debugHelpRequests;
  (window as any).exportHelpRequests = exportHelpRequests;
  (window as any).clearAllHelpRequests = clearAllHelpRequests;
}