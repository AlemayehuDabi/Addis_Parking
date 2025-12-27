import { motion, AnimatePresence } from 'framer-motion';
import { ParkingSlot, SlotStatus } from '@/types/parking';
import { Car, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ParkingSlotCardProps {
  slot: ParkingSlot;
  onSelect: (slot: ParkingSlot) => void;
  isSelected: boolean;
}

const statusConfig: Record<SlotStatus, { 
  icon: typeof Car; 
  label: string;
  className: string;
}> = {
  available: {
    icon: Car,
    label: 'Available',
    className: 'slot-available',
  },
  occupied: {
    icon: AlertCircle,
    label: 'Occupied',
    className: 'slot-occupied',
  },
  reserved: {
    icon: Clock,
    label: 'Reserved',
    className: 'slot-reserved',
  },
};

export const ParkingSlotCard = ({ slot, onSelect, isSelected }: ParkingSlotCardProps) => {
  const config = statusConfig[slot.status];
  const Icon = config.icon;
  const isAvailable = slot.status === 'available';

  return (
    <motion.button
      onClick={() => isAvailable && onSelect(slot)}
      disabled={!isAvailable}
      className={cn(
        'relative aspect-[4/3] rounded-lg border-2 p-2 transition-all duration-300',
        'flex flex-col items-center justify-center gap-1',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        config.className,
        isAvailable && 'cursor-pointer hover:scale-105 animate-pulse-glow',
        !isAvailable && 'cursor-not-allowed opacity-70',
        isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105'
      )}
      whileTap={isAvailable ? { scale: 0.95 } : {}}
      layout
      aria-label={`Parking slot ${slot.row}${slot.number}, ${config.label}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slot.status}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <Icon className="h-5 w-5 md:h-6 md:w-6" />
          <span className="mt-1 text-xs font-semibold">
            {slot.row}{slot.number}
          </span>
        </motion.div>
      </AnimatePresence>
      
      {/* Glow effect on status change */}
      {slot.status === 'available' && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-success/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
};
