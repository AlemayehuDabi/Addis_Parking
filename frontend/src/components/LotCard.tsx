import { motion } from 'framer-motion';
import { ParkingLot } from '@/types/parking';
import { MapPin, Star, Clock, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LotCardProps {
  lot: ParkingLot;
  isSelected: boolean;
  onSelect: (lot: ParkingLot) => void;
}

export const LotCard = ({ lot, isSelected, onSelect }: LotCardProps) => {
  const availabilityPercentage = (lot.availableSlots / lot.totalSlots) * 100;
  
  return (
    <motion.div
      onClick={() => onSelect(lot)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`glass-card-hover cursor-pointer rounded-xl p-4 ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{lot.name}</h3>
          <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{lot.address}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-accent/20 px-2 py-1 text-accent">
          <Star className="h-3 w-3 fill-current" />
          <span className="text-xs font-medium">{lot.rating}</span>
        </div>
      </div>

      {/* Availability Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Car className="h-4 w-4" />
            Available Spots
          </span>
          <span className={`font-semibold ${
            lot.availableSlots > 10 ? 'text-success' : lot.availableSlots > 0 ? 'text-warning' : 'text-destructive'
          }`}>
            {lot.availableSlots}/{lot.totalSlots}
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${availabilityPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              availabilityPercentage > 50
                ? 'bg-success'
                : availabilityPercentage > 20
                ? 'bg-warning'
                : 'bg-destructive'
            }`}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {lot.distance}km away
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-lg font-bold text-foreground">{lot.pricePerHour}</span>
          <span className="text-sm text-muted-foreground">ETB/hr</span>
        </div>
      </div>
    </motion.div>
  );
};
