import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, CreditCard, Plus, Wallet, CheckCircle } from 'lucide-react';

interface ChapaPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number) => void;
  isProcessing: boolean;
}

const quickAmounts = [100, 250, 500, 1000];

export const ChapaPayment = ({ isOpen, onClose, onSuccess, isProcessing }: ChapaPaymentProps) => {
  const [amount, setAmount] = useState<number>(250);
  const [customAmount, setCustomAmount] = useState('');
  const [step, setStep] = useState<'amount' | 'confirm' | 'success'>('amount');

  const handleConfirm = async () => {
    setStep('confirm');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setStep('success');
    setTimeout(() => {
      onSuccess(amount);
      setStep('amount');
    }, 1500);
  };

  const handleCustomAmount = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0) {
      setAmount(num);
      setCustomAmount(value);
    } else if (value === '') {
      setCustomAmount('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-card shadow-2xl"
          >
            <div className="flex justify-center pt-3">
              <div className="h-1.5 w-12 rounded-full bg-muted" />
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Chapa Logo */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0D1117]">
                    <span className="text-lg font-bold text-[#7CD3A6]">C</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Add Funds</h2>
                    <p className="text-sm text-muted-foreground">Powered by Chapa</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <AnimatePresence mode="wait">
                {step === 'amount' && (
                  <motion.div
                    key="amount"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {/* Quick Amounts */}
                    <div className="mt-6 grid grid-cols-4 gap-3">
                      {quickAmounts.map((amt) => (
                        <motion.button
                          key={amt}
                          onClick={() => {
                            setAmount(amt);
                            setCustomAmount('');
                          }}
                          whileTap={{ scale: 0.95 }}
                          className={`rounded-xl border-2 p-3 text-center transition-all ${
                            amount === amt && customAmount === ''
                              ? 'border-primary bg-primary/10'
                              : 'border-border bg-muted/30 hover:border-primary/50'
                          }`}
                        >
                          <span className="text-lg font-bold">{amt}</span>
                          <span className="block text-xs text-muted-foreground">ETB</span>
                        </motion.button>
                      ))}
                    </div>

                    {/* Custom Amount */}
                    <div className="mt-4">
                      <label className="text-sm font-medium text-muted-foreground">
                        Or enter custom amount
                      </label>
                      <div className="mt-2 flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          value={customAmount}
                          onChange={(e) => handleCustomAmount(e.target.value)}
                          className="text-lg"
                        />
                        <span className="text-muted-foreground">ETB</span>
                      </div>
                    </div>

                    {/* Selected Amount Display */}
                    <div className="mt-6 rounded-xl bg-gradient-to-r from-[#7CD3A6]/20 to-[#0D1117]/20 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Amount to add</span>
                        <span className="text-3xl font-bold text-foreground">{amount} ETB</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleConfirm}
                      disabled={amount <= 0 || isProcessing}
                      className="mt-6 w-full py-6 text-lg font-semibold"
                      size="lg"
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Add {amount} ETB
                    </Button>
                  </motion.div>
                )}

                {step === 'confirm' && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center py-12"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="h-16 w-16 rounded-full border-4 border-muted border-t-primary"
                      />
                    </div>
                    <p className="mt-6 text-lg font-medium">Processing payment...</p>
                    <p className="text-sm text-muted-foreground">Please wait</p>
                  </motion.div>
                )}

                {step === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 10 }}
                      className="flex h-20 w-20 items-center justify-center rounded-full bg-success"
                    >
                      <CheckCircle className="h-10 w-10 text-success-foreground" />
                    </motion.div>
                    <p className="mt-6 text-xl font-bold text-success">Payment Successful!</p>
                    <p className="text-muted-foreground">{amount} ETB added to wallet</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chapa branding */}
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <span>Secured by</span>
                <span className="font-semibold text-[#7CD3A6]">Chapa</span>
                <span>• Ethiopia's Premier Payment Gateway</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
