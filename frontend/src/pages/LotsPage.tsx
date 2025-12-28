import { useState } from "react";
import { motion } from "framer-motion";
import { useParkingState } from "@/hooks/useParkingState";
import { useWallet } from "@/hooks/useWallet";
import { useReservation } from "@/hooks/useReservation";
import { LotCard } from "@/components/LotCard";
import { ParkingGrid } from "@/components/ParkingGrid";
import { ReservationDrawer } from "@/components/ReservationDrawer";
import { ChevronLeft, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const LotsPage = () => {
  const {
    lots,
    selectedLot,
    setSelectedLot,
    selectedSlot,
    setSelectedSlot,
    updateSlotStatus,
  } = useParkingState();
  const { wallet, makePayment } = useWallet();
  const { createReservation } = useReservation();
  const [showDrawer, setShowDrawer] = useState(false);

  const handleSelectSlot = (slot: any) => {
    setSelectedSlot(slot);
    setShowDrawer(true);
  };

  const handleConfirmReservation = async (duration: number) => {
    if (!selectedLot || !selectedSlot) return;
    const cost = Math.ceil(duration * selectedLot.pricePerHour);
    const success = await makePayment(cost, `Parking at ${selectedLot.name}`);
    if (success) {
      updateSlotStatus(selectedLot.id, selectedSlot.id, "reserved");
      setShowDrawer(false);
    }
  };

  if (selectedLot) {
    return (
      <div className="flex h-full flex-col bg-background">
        <div className="flex items-center gap-4 border-b p-4 bg-card">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedLot(null)}
          >
            <ChevronLeft />
          </Button>
          <div>
            <h1 className="font-bold">{selectedLot.name}</h1>
            <p className="text-xs text-muted-foreground">
              {selectedLot.availableSlots} spots left
            </p>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <ParkingGrid
            slots={selectedLot.slots}
            selectedSlot={selectedSlot}
            onSelectSlot={handleSelectSlot}
          />
        </div>
        <ReservationDrawer
          isOpen={showDrawer}
          onClose={() => setShowDrawer(false)}
          lot={selectedLot}
          slot={selectedSlot}
          onConfirm={handleConfirmReservation}
          walletBalance={wallet.balance}
        />
      </div>
    );
  }

  return (
    <div className="p-4 grid gap-4 sm:grid-cols-2">
      {lots.map((lot) => (
        <LotCard
          key={lot.id}
          lot={lot}
          isSelected={false}
          onSelect={setSelectedLot}
        />
      ))}
    </div>
  );
};

export default LotsPage;
