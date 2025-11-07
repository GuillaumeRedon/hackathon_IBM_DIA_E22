import { useState, useEffect, useCallback } from 'react';
import { getHelpRequests, updateHelpRequestStatus, formatConversationForDisplay } from '@/utils/helpRequestStorage';
import { HelpRequest } from '@/types/helpRequest';

interface UseAdminHelpRequestsReturn {
  helpRequests: HelpRequest[];
  pendingRequests: HelpRequest[];
  loading: boolean;
  refreshRequests: () => void;
  updateRequestStatus: (id: string, status: HelpRequest['status']) => void;
  getRequestById: (id: string) => HelpRequest | undefined;
}


export const useAdminHelpRequests = (): UseAdminHelpRequestsReturn => {
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshRequests = useCallback(() => {
    try {
      setLoading(true);
      const requests = getHelpRequests();
      setHelpRequests(requests);
    } catch (error) {
      console.error('Erreur lors du chargement des demandes d\'aide:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRequestStatus = useCallback((id: string, status: HelpRequest['status']) => {
    try {
      updateHelpRequestStatus(id, status);
      refreshRequests();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  }, [refreshRequests]);

  const getRequestById = useCallback((id: string): HelpRequest | undefined => {
    return helpRequests.find(request => request.id === id);
  }, [helpRequests]);

  useEffect(() => {
    refreshRequests();
  }, []);

  const pendingRequests = helpRequests.filter(request => request.status === 'pending');

  return {
    helpRequests,
    pendingRequests,
    loading,
    refreshRequests,
    updateRequestStatus,
    getRequestById
  };
};