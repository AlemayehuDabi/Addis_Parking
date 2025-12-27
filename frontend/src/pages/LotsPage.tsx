import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParkingState } from '@/hooks/useParkingState';
import { useWallet } from '@/hooks/useWallet';
import { useReservation } from '@/hooks/useReservation';
import { LotCard } from '@/components/LotCard';
import { ParkingGrid } from '@/components/ParkingGrid';
import { ReservationDrawer } from '@/components/ReservationDrawer';
import { toast } from '@/hooks/use-toast';
import { Search, SlidersHorizontal, ChevronLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const LotsPage = () => {
  const { lots, selectedLot, setSelectedLot, selectedSlot, setSelectedSlot, updateSlotStatus } = useParkingState();
  const { wallet, makePayment } = useWallet();
  const { createReservation } = useReservation();
  const [showDrawer, setShowDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLots = lots.filter(
    (lot) =>
      lot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    }
  };

  if (selectedLot) {
    return (
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-border bg-card p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedLot(null);
              setSelectedSlot(null);
            }}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-bold">{selectedLot.name}</h1>
            <p className="text-sm text-muted-foreground">{selectedLot.address}</p>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-auto p-4">
          <ParkingGrid
            slots={selectedLot.slots}
            selectedSlot={selectedSlot}
            onSelectSlot={handleSelectSlot}
          />
        </div>

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
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card p-4">
        <h1 className="text-xl font-bold">Parking Lots</h1>
        <p className="text-sm text-muted-foreground">Find available parking near you</p>

        {/* Search */}
        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Lot List */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredLots.map((lot, index) => (
            <motion.div
              key={lot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <LotCard
                lot={lot}
                isSelected={false}
                onSelect={setSelectedLot}
              />
            </motion.div>
          ))}
        </div>

        {filteredLots.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-semibold">No lots found</h3>
            <p className="text-sm text-muted-foreground">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LotsPage;
