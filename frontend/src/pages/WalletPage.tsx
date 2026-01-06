import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@/hooks/useWallet';
import { WalletSection } from '@/components/WalletSection';
import { ChapaPayment } from '@/components/ChapaPayment';

const WalletPage = () => {
  const { wallet, addFunds, isProcessing } = useWallet();
  const [showPayment, setShowPayment] = useState(false);

  const handleAddFunds = async (amount: number) => {
    await addFunds(amount);
    setShowPayment(false);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card p-4">
        <h1 className="text-xl font-bold text-white">Wallet</h1>
        <p className="text-sm text-muted-foreground">Manage your parking balance</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <WalletSection
            wallet={wallet}
            onAddFunds={() => setShowPayment(true)}
          />
        </motion.div>
      </div>

      {/* Chapa Payment Modal */}
      <ChapaPayment
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onSuccess={handleAddFunds}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default WalletPage;
