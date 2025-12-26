export type SlotStatus = 'available' | 'occupied' | 'reserved';

export interface ParkingSlot {
  id: string;
  row: string;
  number: number;
  status: SlotStatus;
  vehiclePlate?: string;
  reservedUntil?: Date;
  sensorId?: string;
}

export interface ParkingLot {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  totalSlots: number;
  availableSlots: number;
  pricePerHour: number;
  rating: number;
  distance?: number;
  slots: ParkingSlot[];
}

export interface Reservation {
  id: string;
  lotId: string;
  slotId: string;
  userId: string;
  vehiclePlate: string;
  startTime: Date;
  endTime: Date;
  totalAmount: number;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'payment' | 'refund';
  amount: number;
  description: string;
  createdAt: Date;
  status: 'pending' | 'completed' | 'failed';
}

export interface Wallet {
  balance: number;
  currency: string;
  transactions: Transaction[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehiclePlate: string;
  wallet: Wallet;
  reservations: Reservation[];
}
