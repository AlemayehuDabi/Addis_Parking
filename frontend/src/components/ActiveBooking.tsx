import { motion } from 'framer-motion';
import { Reservation } from '@/types/parking';
import { Clock, MapPin, Navigation, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActiveBookingProps {
  reservation: Reservation | null;
  timeRemaining: number;
  formatTime: (seconds: number) => string;
  lotName?: string;
  onCancel: (reservationId: string) => void;
  onFindCar: () => void;
}

export const ActiveBooking = ({
  reservation,
  timeRemaining,
  formatTime,
  lotName,
  onCancel,
  onFindCar,
}: ActiveBookingProps) => {
  if (!reservation) {
    return (
      <div className="glass-card flex flex-col items-center justify-center rounded-xl p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Clock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-300">No Active Booking</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Reserve a parking spot to see your booking here
        </p>
      </div>
    );
  }

  const progress = (timeRemaining / ((reservation.endTime.getTime() - reservation.startTime.getTime()) / 1000)) * 100;
  const isLowTime = timeRemaining < 600; // Less than 10 minutes

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden rounded-xl"
    >
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-primary">
              Active Booking
            </span>
            <h3 className="mt-1 text-lg font-bold">Slot {reservation.slotId}</h3>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-success/20 px-3 py-1 text-success">
            <div className="h-2 w-2 animate-pulse rounded-full bg-success" />
            <span className="text-xs font-medium">Active</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{lotName || 'Parking Lot'}</span>
        </div>

        {/* Timer */}
        <div className="mt-6 text-center">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Time Remaining
          </span>
          <motion.div
            className={`mt-2 font-mono text-4xl font-bold ${
              isLowTime ? 'text-destructive' : 'text-foreground'
            }`}
            animate={isLowTime ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.5, repeat: isLowTime ? Infinity : 0 }}
          >
            {formatTime(timeRemaining)}
          </motion.div>
          
          {/* Progress bar */}
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              className={`h-full rounded-full ${isLowTime ? 'bg-destructive' : 'bg-primary'}`}
              initial={{ width: '100%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Low time warning */}
        {isLowTime && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
          >
            <AlertCircle className="h-4 w-4" />
            <span>Your parking time is almost up!</span>
          </motion.div>
        )}

        {/* Actions */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            onClick={onFindCar}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Navigation className="h-4 w-4" />
            Find My Car
          </Button>
          <Button
            onClick={() => onCancel(reservation.id)}
            variant="destructive"
            className="flex items-center gap-2"
          >
            End Parking
          </Button>
        </div>

        {/* Vehicle plate */}
        <div className="mt-4 text-center">
          <span className="rounded-lg bg-muted px-4 py-2 font-mono text-sm font-semibold">
            {reservation.vehiclePlate}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
