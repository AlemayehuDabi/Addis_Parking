import { motion } from 'framer-motion';
import { ParkingSlot } from '@/types/parking';
import { ParkingSlotCard } from './ParkingSlotCard';

interface ParkingGridProps {
  slots: ParkingSlot[];
  selectedSlot: ParkingSlot | null;
  onSelectSlot: (slot: ParkingSlot) => void;
}

export const ParkingGrid = ({ slots, selectedSlot, onSelectSlot }: ParkingGridProps) => {
  // Group slots by row
  const slotsByRow = slots.reduce((acc, slot) => {
    if (!acc[slot.row]) {
      acc[slot.row] = [];
    }
    acc[slot.row].push(slot);
    return acc;
  }, {} as Record<string, ParkingSlot[]>);

  const rows = Object.keys(slotsByRow).sort();

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-success" />
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-destructive" />
          <span className="text-muted-foreground">Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-accent" />
          <span className="text-muted-foreground">Reserved</span>
        </div>
      </div>

      {/* Grid */}
      <div className="space-y-3">
        {rows.map((row, rowIndex) => (
          <motion.div
            key={row}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: rowIndex * 0.1 }}
            className="flex items-center gap-3"
          >
            {/* Row Label */}
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted font-mono text-sm font-semibold">
              {row}
            </div>
            
            {/* Slots */}
            <div className="grid flex-1 grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12">
              {slotsByRow[row].map((slot, slotIndex) => (
                <motion.div
                  key={slot.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: rowIndex * 0.1 + slotIndex * 0.02 }}
                >
                  <ParkingSlotCard
                    slot={slot}
                    onSelect={onSelectSlot}
                    isSelected={selectedSlot?.id === slot.id}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Driving Lane Indicator */}
      <div className="mt-6 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" style={{ width: '100px' }} />
          <span className="text-xs font-medium text-muted-foreground">DRIVING LANE</span>
          <div className="h-px flex-1 bg-border" style={{ width: '100px' }} />
        </div>
      </div>
    </div>
  );
};
