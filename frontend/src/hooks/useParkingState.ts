import { useState, useEffect, useCallback } from "react";
import { ParkingSlot, ParkingLot, SlotStatus } from "@/types/parking";

const WS_URL = "ws://192.168.1.113:8080";

const initialLots: ParkingLot[] = [
  {
    id: "sensor",
    name: "Prototype (Live ESP32)",
    address: "AASTU - Lab",
    latitude: 9.3,
    longitude: 38.6,
    totalSlots: 2,
    availableSlots: 2,
    pricePerHour: 50,
    rating: 5.0,
    distance: 0.1,
    slots: [
      { id: "1", row: "S", number: 1, status: "available", sensorId: "1" },
      { id: "2", row: "S", number: 2, status: "available", sensorId: "2" },
    ],
  },
  {
    id: "lot-1",
    name: "Bole Medhanialem Parking",
    address: "Bole Road, Addis Ababa",
    latitude: 9.0054,
    longitude: 38.7636,
    totalSlots: 48,
    availableSlots: 18,
    pricePerHour: 50,
    rating: 4.8,
    distance: 0.3,
    slots: [], // Assuming generateSlots helper is available or simplified
  },
];

export const useParkingState = () => {
  const [lots, setLots] = useState<ParkingLot[]>(initialLots);
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  // Derive the active lot and slot from the current 'lots' state
  const selectedLot = lots.find((l) => l.id === selectedLotId) || null;
  const selectedSlot =
    selectedLot?.slots.find((s) => s.id === selectedSlotId) || null;

  const updateSlotStatus = useCallback(
    (lotId: string, slotId: string, status: SlotStatus) => {
      setLots((prevLots) =>
        prevLots.map((lot) => {
          if (lot.id !== lotId) return lot;
          const updatedSlots = lot.slots.map((s) =>
            s.id === slotId ? { ...s, status } : s
          );
          return {
            ...lot,
            slots: updatedSlots,
            availableSlots: updatedSlots.filter((s) => s.status === "available")
              .length,
          };
        })
      );
    },
    []
  );

  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.event === "ui_update") {
          const { sensorId, isParked } = message.data;
          const status: SlotStatus = isParked ? "occupied" : "available";
          console.log(`Hardware Sync: Slot ${sensorId} -> ${status}`);
          updateSlotStatus("sensor", sensorId.toString(), status);
        }
      } catch (err) {
        console.error(err);
      }
    };
    return () => socket.close();
  }, [updateSlotStatus]);

  return {
    lots,
    selectedLot,
    setSelectedLot: (lot: ParkingLot | null) =>
      setSelectedLotId(lot?.id || null),
    selectedSlot,
    setSelectedSlot: (slot: ParkingSlot | null) =>
      setSelectedSlotId(slot?.id || null),
    updateSlotStatus,
  };
};
