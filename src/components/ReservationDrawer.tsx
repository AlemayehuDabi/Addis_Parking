import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParkingSlot, ParkingLot } from '@/types/parking';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { X, Clock, CreditCard, Car, MapPin, Shield } from 'lucide-react';

interface ReservationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lot: ParkingLot | null;
  slot: ParkingSlot | null;
  onConfirm: (duration: number) => void;
  walletBalance: number;
}

export const ReservationDrawer = ({
  isOpen,
  onClose,
  lot,
  slot,
  onConfirm,
  walletBalance,
}: ReservationDrawerProps) => {
  const [duration, setDuration] = useState(2); // hours
  
  if (!lot || !slot) return null;

  const estimatedCost = Math.ceil(duration * lot.pricePerHour);
  const hasEnoughBalance = walletBalance >= estimatedCost;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-card shadow-2xl"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3">
              <div className="h-1.5 w-12 rounded-full bg-muted" />
            </div>

            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Quick Reserve</h2>
                  <p className="text-sm text-muted-foreground">Secure your spot instantly</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Slot Info */}
              <div className="mt-6 flex items-center gap-4 rounded-xl bg-muted/50 p-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Car className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">Slot {slot.row}{slot.number}</span>
                    <span className="rounded-full bg-success/20 px-2 py-0.5 text-xs font-medium text-success">
                      Available
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {lot.name}
                  </div>
                </div>
              </div>

              {/* Duration Slider */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Duration
                  </label>
                  <span className="text-lg font-bold text-primary">{duration}h</span>
                </div>
                <Slider
                  value={[duration]}
                  onValueChange={(value) => setDuration(value[0])}
                  min={0.5}
                  max={8}
                  step={0.5}
                  className="mt-4"
                />
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>30 min</span>
                  <span>8 hours</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="mt-6 space-y-3 rounded-xl bg-muted/30 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Rate</span>
                  <span>{lot.pricePerHour} ETB/hour</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span>{duration} hours</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total</span>
                    <span className="text-2xl font-bold text-primary">{estimatedCost} ETB</span>
                  </div>
                </div>
              </div>

              {/* Wallet Balance */}
              <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/30 p-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Wallet Balance</span>
                </div>
                <span className={`font-semibold ${hasEnoughBalance ? 'text-success' : 'text-destructive'}`}>
                  {walletBalance.toFixed(2)} ETB
                </span>
              </div>

              {/* Confirm Button */}
              <motion.div className="mt-6">
                <Button
                  onClick={() => onConfirm(duration)}
                  disabled={!hasEnoughBalance}
                  className="btn-glow w-full py-6 text-lg font-semibold"
                  size="lg"
                >
                  <Shield className="mr-2 h-5 w-5" />
                  {hasEnoughBalance ? 'Confirm Reservation' : 'Insufficient Balance'}
                </Button>
                {!hasEnoughBalance && (
                  <p className="mt-2 text-center text-sm text-destructive">
                    Add {(estimatedCost - walletBalance).toFixed(2)} ETB to your wallet
                  </p>
                )}
              </motion.div>

              {/* Safety Note */}
              <p className="mt-4 text-center text-xs text-muted-foreground">
                🔒 Secured by end-to-end encryption
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
