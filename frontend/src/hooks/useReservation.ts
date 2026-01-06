import { useState, useEffect, useCallback } from 'react';
import { Reservation } from '@/types/parking';
import { toast } from 'sonner';

const apiUrl = import.meta.env.VITE_API_URL

export const useReservation = () => {
  const [activeReservation, setActiveReservation] = useState<Reservation | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [reservationHistory, setReservationHistory] = useState<Reservation[]>([
    {
      id: 'res-1',
      lotId: 'lot-1',
      slotId: 'A3',
      userId: 'user-1',
      vehiclePlate: 'AA-1234',
      startTime: new Date(Date.now() - 86400000 * 3),
      endTime: new Date(Date.now() - 86400000 * 3 + 7200000),
      totalAmount: 100,
      status: 'completed',
      createdAt: new Date(Date.now() - 86400000 * 3),
    },
    {
      id: 'res-2',
      lotId: 'lot-2',
      slotId: 'B7',
      userId: 'user-1',
      vehiclePlate: 'AA-1234',
      startTime: new Date(Date.now() - 86400000),
      endTime: new Date(Date.now() - 86400000 + 3600000),
      totalAmount: 40,
      status: 'completed',
      createdAt: new Date(Date.now() - 86400000),
    },
  ]);

  useEffect(() => {
    if (!activeReservation) return;

    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((activeReservation.endTime.getTime() - Date.now()) / 1000)
      );
      setTimeRemaining(remaining);

      if (remaining === 0) {
        setActiveReservation((prev) => 
          prev ? { ...prev, status: 'completed' } : null
        );
        setReservationHistory((prev) => 
          activeReservation ? [{ ...activeReservation, status: 'completed' }, ...prev] : prev
        );
        setActiveReservation(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeReservation]);

  const createReservation = useCallback(async (
    lotId: string,
    slotId: string,
    duration: number,
    pricePerHour: number,
    licensePlate: String
  ) => {
    try {
      
    const now = new Date();
    const endTime = new Date(now.getTime() + duration * 60 * 60 * 1000);
    const totalAmount = Math.ceil(duration * pricePerHour);

    const createReservationBody = {
      userId: "userId",
      spotId: slotId,
      parkingLotId: lotId,
      startTime: now,
      endTime,
      totalFee: totalAmount,
      licensePlate,
    }

    // calling post api
    const response = await fetch(`${apiUrl}/reservation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(createReservationBody)
    })

    const data = await response.json()

    if (!response.ok) {
      // 2. Error Handling: Get the error message from NestJS
      const errorData = await response.json();
      // toast
      toast(`Failed to cancel: ${errorData.message}`); 
      return;
    }

    console.log("This is reservation response: ", data)

    const reservation: Reservation = data
    // = {
    //   id: `res-${Date.now()}`,
    //   lotId,
    //   slotId,
    //   userId: 'user-1',
    //   vehiclePlate: 'AA-1234',
    //   startTime: now,
    //   endTime,
    //   totalAmount,
    //   status: 'active',
    //   createdAt: now,
    // };

    setActiveReservation(reservation);
    setTimeRemaining(duration * 60 * 60);

    return reservation;
    } catch (error) {
      // 4. Network Error Handling
      console.error("Network error during cancellation:", error);
      toast("Connection lost. Please try again.");
    }
  }, []);

  const cancelReservation = useCallback(async (
    reservationId: string
  ) => {
    try {
          
        // 1. Logic Check: Don't try to cancel if we don't have an ID
        if (!reservationId) {
          console.log("No reservation Id!")
          return
        }

        const response = await fetch(`${apiUrl}/reservations/${reservationId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
        })

        if (!response.ok) {
          // 2. Error Handling: Get the error message from NestJS
          const errorData = await response.json();
          // toast
          toast(`Failed to cancel: ${errorData.message}`); 
          return;
        }

        if (activeReservation) {
          const cancelledItem = { ...activeReservation, status: 'cancelled' as const };
          
          setReservationHistory((prev) => [cancelledItem, ...prev]);
          setActiveReservation(null);
          setTimeRemaining(0);
          
          toast("Reservation cancelled successfully")
        }
    } catch (error) {
        // 4. Network Error Handling
        console.error("Network error during cancellation:", error);
        toast("Connection lost. Please try again.");
    }
  }, [activeReservation]);

  const formatTimeRemaining = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  }, []);

  // update status - by id

  // findOne - by id

  // findActive

  // findAll - history

  return {
    activeReservation,
    timeRemaining,
    reservationHistory,
    createReservation,
    cancelReservation,
    formatTimeRemaining,
  };
};
