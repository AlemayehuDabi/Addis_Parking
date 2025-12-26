import { useState, useCallback } from 'react';
import { Wallet, Transaction } from '@/types/parking';

const initialWallet: Wallet = {
  balance: 1250.00,
  currency: 'ETB',
  transactions: [
    {
      id: 'txn-1',
      type: 'deposit',
      amount: 500,
      description: 'Added via Chapa',
      createdAt: new Date(Date.now() - 86400000 * 2),
      status: 'completed',
    },
    {
      id: 'txn-2',
      type: 'payment',
      amount: -150,
      description: 'Parking at Bole Medhanialem',
      createdAt: new Date(Date.now() - 86400000),
      status: 'completed',
    },
    {
      id: 'txn-3',
      type: 'deposit',
      amount: 1000,
      description: 'Added via Chapa',
      createdAt: new Date(Date.now() - 3600000),
      status: 'completed',
    },
    {
      id: 'txn-4',
      type: 'payment',
      amount: -100,
      description: 'Parking at Meskel Square',
      createdAt: new Date(),
      status: 'completed',
    },
  ],
};

export const useWallet = () => {
  const [wallet, setWallet] = useState<Wallet>(initialWallet);
  const [isProcessing, setIsProcessing] = useState(false);

  const addFunds = useCallback(async (amount: number) => {
    setIsProcessing(true);
    
    // Simulate Chapa payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const newTransaction: Transaction = {
      id: `txn-${Date.now()}`,
      type: 'deposit',
      amount,
      description: 'Added via Chapa',
      createdAt: new Date(),
      status: 'completed',
    };

    setWallet((prev) => ({
      ...prev,
      balance: prev.balance + amount,
      transactions: [newTransaction, ...prev.transactions],
    }));

    setIsProcessing(false);
    return true;
  }, []);

  const makePayment = useCallback(async (amount: number, description: string) => {
    if (wallet.balance < amount) {
      return false;
    }

    setIsProcessing(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newTransaction: Transaction = {
      id: `txn-${Date.now()}`,
      type: 'payment',
      amount: -amount,
      description,
      createdAt: new Date(),
      status: 'completed',
    };

    setWallet((prev) => ({
      ...prev,
      balance: prev.balance - amount,
      transactions: [newTransaction, ...prev.transactions],
    }));

    setIsProcessing(false);
    return true;
  }, [wallet.balance]);

  return {
    wallet,
    isProcessing,
    addFunds,
    makePayment,
  };
};
