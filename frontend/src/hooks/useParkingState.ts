import { useState, useEffect, useCallback, useRef } from "react";
import { ParkingSlot, ParkingLot, SlotStatus } from "@/types/parking";

// Use your computer's actual IP. Verify it didn't change!
const WS_URL = "ws://192.168.1.113:8000";

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
    slots: [],
  },
  {
    id: "lot-2",
    name: "Piazza Municipality Parking",
    address: "Dejazmach Jote St (Near City Hall), Piazza",
    latitude: 9.0355,
    longitude: 38.7522,
    totalSlots: 120,
    availableSlots: 34,
    pricePerHour: 30,
    rating: 4.1,
    distance: 1.5,
    slots: []
  },
  {
    id: "lot-3",
    name: "Friendship Business Center",
    address: "Africa Avenue (Bole Road), Addis Ababa",
    latitude: 8.9948,
    longitude: 38.7842,
    totalSlots: 65,
    availableSlots: 12,
    pricePerHour: 60,
    rating: 4.6,
    distance: 0.9,
    slots: []
  },
  {
    id: "lot-4",
    name: "Kazanchis UN-ECA Area Parking",
    address: "Menelik II Ave, Kazanchis",
    latitude: 9.0191,
    longitude: 38.7668,
    totalSlots: 150,
    availableSlots: 58,
    pricePerHour: 40,
    rating: 4.4,
    distance: 2.2,
    slots: []
  }
];

export const useParkingState = () => {
  const [lots, setLots] = useState<ParkingLot[]>(initialLots);
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  // Derive the active lot and slot from the current 'lots' state
  // This is critical: whenever 'lots' changes, these variables refresh automatically
  const selectedLot = lots.find((l) => l.id === selectedLotId) || null;
  const selectedSlot =
    selectedLot?.slots.find((s) => s.id === selectedSlotId) || null;

  const updateSlotStatus = useCallback(
    (lotId: string, slotId: string, status: SlotStatus) => {
      console.log(`Updating Lot: ${lotId}, Slot: ${slotId} to ${status}`);

      setLots((prevLots) => {
        return prevLots.map((lot) => {
          if (lot.id !== lotId) return lot;

          const updatedSlots = lot.slots.map((s) => {
            // Safety: Convert both to string to avoid Number vs String comparison issues
            if (String(s.id) === String(slotId)) {
              return { ...s, status };
            }
            return s;
          });

          const availableCount = updatedSlots.filter(
            (s) => s.status === "available"
          ).length;

          return {
            ...lot,
            slots: updatedSlots,
            availableSlots: availableCount,
          };
        });
      });
    },
    []
  );

  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      console.log("Attempting to connect to WebSocket...");
      socket = new WebSocket(WS_URL);

      socket.onopen = () => {
        console.log("✅ WebSocket Connected to Backend");
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message.event === "ui_update") {
            // Use message.data because your NestJS gateway wraps it in { event, data }
            const { sensorId, isParked } = message.data;
            const status: SlotStatus = isParked ? "occupied" : "available";

            console.log(`🎯 Hardware Sync: Slot ${sensorId} -> ${status}`);

            // We target the "sensor" lot specifically for prototype
            updateSlotStatus("sensor", String(sensorId), status);
          }
        } catch (err) {
          console.error("❌ Failed to parse WebSocket message:", err);
        }
      };

      socket.onclose = () => {
        console.warn("⚠️ WebSocket Disconnected. Retrying in 3s...");
        reconnectTimeout = setTimeout(connect, 3000);
      };

      socket.onerror = (err) => {
        console.error("🚨 WebSocket Error:", err);
      };
    };

    connect();

    return () => {
      if (socket) socket.close();
      clearTimeout(reconnectTimeout);
    };
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
