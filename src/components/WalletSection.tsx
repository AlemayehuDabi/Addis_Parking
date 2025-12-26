import { motion } from 'framer-motion';
import { Wallet, Transaction } from '@/types/parking';
import { ArrowUpRight, ArrowDownLeft, Plus, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface WalletSectionProps {
  wallet: Wallet;
  onAddFunds: () => void;
}

export const WalletSection = ({ wallet, onAddFunds }: WalletSectionProps) => {
  return (
    <div className="space-y-4">
      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-6 text-primary-foreground"
      >
        {/* Decorative elements */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-foreground/10" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-primary-foreground/5" />

        <div className="relative">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <span className="text-sm font-medium opacity-90">Available Balance</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold">{wallet.balance.toFixed(2)}</span>
            <span className="text-lg opacity-80">{wallet.currency}</span>
          </div>
          <Button
            onClick={onAddFunds}
            variant="secondary"
            className="mt-6 gap-2 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"
          >
            <Plus className="h-4 w-4" />
            Add Funds
          </Button>
        </div>
      </motion.div>

      {/* Transaction History */}
      <div className="glass-card rounded-xl p-4">
        <h3 className="flex items-center gap-2 font-semibold">
          <span>Recent Transactions</span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {wallet.transactions.length}
          </span>
        </h3>

        <div className="mt-4 space-y-3">
          {wallet.transactions.slice(0, 5).map((txn, index) => (
            <motion.div
              key={txn.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 rounded-lg bg-muted/30 p-3"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  txn.type === 'deposit'
                    ? 'bg-success/20 text-success'
                    : txn.type === 'refund'
                    ? 'bg-warning/20 text-warning'
                    : 'bg-destructive/20 text-destructive'
                }`}
              >
                {txn.type === 'deposit' || txn.type === 'refund' ? (
                  <ArrowDownLeft className="h-5 w-5" />
                ) : (
                  <ArrowUpRight className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{txn.description}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(txn.createdAt), 'MMM d, h:mm a')}
                </p>
              </div>
              <span
                className={`font-semibold ${
                  txn.amount > 0 ? 'text-success' : 'text-foreground'
                }`}
              >
                {txn.amount > 0 ? '+' : ''}{txn.amount} ETB
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
