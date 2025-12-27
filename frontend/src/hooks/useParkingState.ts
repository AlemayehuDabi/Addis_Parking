import { useState, useEffect, useCallback } from 'react';
import { ParkingSlot, ParkingLot, SlotStatus } from '@/types/parking';

const generateSlots = (rows: string[], slotsPerRow: number): ParkingSlot[] => {
  const slots: ParkingSlot[] = [];
  const statuses: SlotStatus[] = ['available', 'occupied', 'reserved'];
  
  rows.forEach((row) => {
    for (let i = 1; i <= slotsPerRow; i++) {
      const randomStatus = statuses[Math.floor(Math.random() * 3)];
      slots.push({
        id: `${row}${i}`,
        row,
        number: i,
        status: randomStatus,
        sensorId: `ESP32-${row}${i}`,
      });
    }
  });
  
  return slots;
};

const initialLots: ParkingLot[] = [
  {
    id: 'lot-1',
    name: 'Bole Medhanialem Parking',
    address: 'Bole Road, Addis Ababa',
    latitude: 9.0054,
    longitude: 38.7636,
    totalSlots: 48,
    availableSlots: 18,
    pricePerHour: 50,
    rating: 4.8,
    distance: 0.3,
    slots: generateSlots(['A', 'B', 'C', 'D'], 12),
  },
  {
    id: 'lot-2',
    name: 'Meskel Square Underground',
    address: 'Meskel Square, Addis Ababa',
    latitude: 9.0107,
    longitude: 38.7612,
    totalSlots: 120,
    availableSlots: 45,
    pricePerHour: 40,
    rating: 4.5,
    distance: 1.2,
    slots: generateSlots(['A', 'B', 'C', 'D', 'E', 'F'], 20),
  },
  {
    id: 'lot-3',
    name: 'Edna Mall Parking',
    address: 'CMC Road, Addis Ababa',
    latitude: 9.0321,
    longitude: 38.8012,
    totalSlots: 80,
    availableSlots: 32,
    pricePerHour: 35,
    rating: 4.6,
    distance: 2.5,
    slots: generateSlots(['A', 'B', 'C', 'D', 'E'], 16),
  },
  {
    id: 'lot-4',
    name: 'Friendship Park Lot',
    address: 'Friendship Park, Addis Ababa',
    latitude: 8.9957,
    longitude: 38.7789,
    totalSlots: 60,
    availableSlots: 28,
    pricePerHour: 30,
    rating: 4.3,
    distance: 3.1,
    slots: generateSlots(['A', 'B', 'C'], 20),
  },
];

export const useParkingState = () => {
  const [lots, setLots] = useState<ParkingLot[]>(initialLots);
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);

  // Simulate ESP32 sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLots((prevLots) =>
        prevLots.map((lot) => {
          const updatedSlots = lot.slots.map((slot) => {
            // 5% chance of status change to simulate real sensor data
            if (Math.random() < 0.05) {
              const currentStatus = slot.status;
              let newStatus: SlotStatus;
              
              if (currentStatus === 'occupied') {
                newStatus = Math.random() < 0.7 ? 'available' : 'occupied';
              } else if (currentStatus === 'available') {
                newStatus = Math.random() < 0.3 ? 'occupied' : 'available';
              } else {
                newStatus = slot.status;
              }
              
              return { ...slot, status: newStatus };
            }
            return slot;
          });

          const availableSlots = updatedSlots.filter((s) => s.status === 'available').length;
          
          return { ...lot, slots: updatedSlots, availableSlots };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const updateSlotStatus = useCallback((lotId: string, slotId: string, status: SlotStatus) => {
    setLots((prevLots) =>
      prevLots.map((lot) => {
        if (lot.id !== lotId) return lot;
        
        const updatedSlots = lot.slots.map((slot) =>
          slot.id === slotId ? { ...slot, status } : slot
        );
        
        const availableSlots = updatedSlots.filter((s) => s.status === 'available').length;
        
        return { ...lot, slots: updatedSlots, availableSlots };
      })
    );
  }, []);

  const reserveSlot = useCallback((lotId: string, slotId: string, duration: number) => {
    updateSlotStatus(lotId, slotId, 'reserved');
    
    // Auto-release after duration
    setTimeout(() => {
      updateSlotStatus(lotId, slotId, 'available');
    }, duration * 60 * 1000);
  }, [updateSlotStatus]);

  return {
    lots,
    selectedLot,
    setSelectedLot,
    selectedSlot,
    setSelectedSlot,
    updateSlotStatus,
    reserveSlot,
  };
};
