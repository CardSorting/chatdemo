import { useEffect, useState } from 'react';
import { getPulseBalance, updatePulseBalance } from '../services/pulse/pulseService';

export const usePulse = (userId: string) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const balance = await getPulseBalance(userId);
        setBalance(balance);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [userId]);

  const addPulse = async (amount: number) => {
    try {
      const newBalance = balance + amount;
      await updatePulseBalance(userId, newBalance);
      setBalance(newBalance);
    } catch (err) {
      setError(err as Error);
    }
  };

  const deductPulse = async (amount: number) => {
    try {
      const newBalance = balance - amount;
      await updatePulseBalance(userId, newBalance);
      setBalance(newBalance);
    } catch (err) {
      setError(err as Error);
    }
  };

  return {
    balance,
    loading,
    error,
    addPulse,
    deductPulse,
  };
};