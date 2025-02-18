import { useState, useEffect } from 'react';
import { Application } from '../types/application';
import { ApplicationService } from '../services/applicationService';
import { toast } from 'react-toastify';

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await ApplicationService.getApplications(userId);
      setApplications(data);
    } catch (err) {
      const errorMessage = 'Failed to load applications';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplicationDecision = async (application: Application, decision: boolean) => {
    try {
      await ApplicationService.resolveApplication({
        courseId: application.courseId,
        accountId: application.accountId,
        decision,
      });
      await fetchApplications();
      toast.success(`Application ${decision ? 'approved' : 'rejected'} successfully`);
    } catch (err) {
      toast.error('Failed to process application');
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return { applications, isLoading, error, handleApplicationDecision };
}; 