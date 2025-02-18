import { useState, useEffect } from 'react';
import { RankUser } from '../types/rank';
import { RankService } from '../services/rankService';
import { toast } from 'react-toastify';

export const useRankList = () => {
  const [rankList, setRankList] = useState<RankUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRankList = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await RankService.getRankList();
      setRankList(data);
    } catch (err) {
      const errorMessage = 'Failed to load rank list';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRankList();
  }, []);

  return { rankList, isLoading, error, refreshRankList: fetchRankList };
}; 