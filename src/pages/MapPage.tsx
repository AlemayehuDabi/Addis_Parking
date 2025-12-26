import { useState } from 'react';
import { motion } from 'framer-motion';
import { ParkingMap } from '@/components/ParkingMap';
import { LotCard } from '@/components/LotCard';
import { ParkingGrid } from '@/components/ParkingGrid';
import { ReservationDrawer } from '@/components/ReservationDrawer';
import { useParkingState } from '@/hooks/useParkingState';
import { useWallet } from '@/hooks/useWallet';
import { useReservation } from '@/hooks/useReservation';
import { toast } from '@/hooks/use-toast';
import { ChevronLeft, MapPin, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MapPage = () => {
  const { lots, selectedLot, setSelectedLot, selectedSlot, setSelectedSlot, updateSlotStatus } = useParkingState();
  const { wallet, makePayment } = useWallet();
  const { createReservation } = useReservation();
  const [showDrawer, setShowDrawer] = useState(false);
  const [view, setView] = useState<'map' | 'lot'>('map');

  const handleSelectLot = (lot: typeof lots[0]) => {
    setSelectedLot(lot);
    setView('lot');
  };

  const handleBack = () => {
    setView('map');
    setSelectedLot(null);
    setSelectedSlot(null);
  };

  const handleSelectSlot = (slot: typeof selectedLot extends { slots: infer S } ? S extends (infer T)[] ? T : never : never) => {
    setSelectedSlot(slot);
    setShowDrawer(true);
  };

  const handleConfirmReservation = async (duration: number) => {
    if (!selectedLot || !selectedSlot) return;

    const cost = Math.ceil(duration * selectedLot.pricePerHour);
    const success = await makePayment(cost, `Parking at ${selectedLot.name}`);

    if (success) {
      createReservation(selectedLot.id, selectedSlot.id, duration, selectedLot.pricePerHour);
      updateSlotStatus(selectedLot.id, selectedSlot.id, 'reserved');
      setShowDrawer(false);
      setSelectedSlot(null);
      toast({
        title: "Reservation Confirmed! 🎉",
        description: `Slot ${selectedSlot.id} reserved for ${duration} hours`,
      });
    } else {
      toast({
        title: "Payment Failed",
        description: "Insufficient wallet balance",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-full flex-col">
      {view === 'map' ? (
        <>
          {/* Map View */}
          <div className="relative flex-1">
            <ParkingMap
              lots={lots}
              selectedLot={selectedLot}
              onSelectLot={handleSelectLot}
            />
          </div>

          {/* Lot List */}
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="absolute bottom-16 left-0 right-0 px-4 md:bottom-0"
          >
            <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-4">
              {lots.map((lot, index) => (
                <motion.div
                  key={lot.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="w-72 flex-shrink-0"
                >
                  <LotCard
                    lot={lot}
                    isSelected={selectedLot?.id === lot.id}
                    onSelect={handleSelectLot}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      ) : (
        <>
          {/* Lot Detail View */}
          <div className="flex items-center gap-4 border-b border-border bg-card p-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="font-bold">{selectedLot?.name}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {selectedLot?.address}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-warning text-warning" />
                  {selectedLot?.rating}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-primary">{selectedLot?.pricePerHour}</span>
              <span className="text-sm text-muted-foreground"> ETB/hr</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 border-b border-border bg-muted/30 p-4">
            <div className="text-center">
              <span className="text-2xl font-bold text-success">{selectedLot?.availableSlots}</span>
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-destructive">
                {(selectedLot?.totalSlots || 0) - (selectedLot?.availableSlots || 0) - 
                  (selectedLot?.slots.filter(s => s.status === 'reserved').length || 0)}
              </span>
              <p className="text-xs text-muted-foreground">Occupied</p>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-warning">
                {selectedLot?.slots.filter(s => s.status === 'reserved').length || 0}
              </span>
              <p className="text-xs text-muted-foreground">Reserved</p>
            </div>
          </div>

          {/* Parking Grid */}
          <div className="flex-1 overflow-auto p-4">
            {selectedLot && (
              <ParkingGrid
                slots={selectedLot.slots}
                selectedSlot={selectedSlot}
                onSelectSlot={handleSelectSlot}
              />
            )}
          </div>
        </>
      )}

      {/* Reservation Drawer */}
      <ReservationDrawer
        isOpen={showDrawer}
        onClose={() => {
          setShowDrawer(false);
          setSelectedSlot(null);
        }}
        lot={selectedLot}
        slot={selectedSlot}
        onConfirm={handleConfirmReservation}
        walletBalance={wallet.balance}
      />
    </div>
  );
};

export default MapPage;
