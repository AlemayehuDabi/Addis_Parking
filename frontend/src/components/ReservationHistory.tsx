import { motion } from 'framer-motion';
import { Reservation } from '@/types/parking';
import { Calendar, Receipt, Download, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface ReservationHistoryProps {
  reservations: Reservation[];
}

export const ReservationHistory = ({ reservations }: ReservationHistoryProps) => {
  const downloadReceipt = (reservation: Reservation) => {
    // Simulate receipt download
    const receipt = `
SMART PARKING RECEIPT
=====================
Booking ID: ${reservation.id}
Date: ${format(reservation.startTime, 'PPP')}
Time: ${format(reservation.startTime, 'h:mm a')} - ${format(reservation.endTime, 'h:mm a')}
Slot: ${reservation.slotId}
Vehicle: ${reservation.vehiclePlate}
Amount: ${reservation.totalAmount} ETB
Status: ${reservation.status.toUpperCase()}
=====================
Thank you for using Smart Parking!
    `;
    
    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${reservation.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (reservations.length === 0) {
    return (
      <div className="glass-card flex flex-col items-center justify-center rounded-xl p-8 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold text-gray-300">No Booking History</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Your past reservations will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 font-semibold text-gray-300">
        <Calendar className="h-4 w-4" />
        Booking History
      </h3>

      {reservations.map((reservation, index) => (
        <motion.div
          key={reservation.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card overflow-hidden rounded-xl"
        >
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-300">Slot {reservation.slotId}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      reservation.status === 'completed'
                        ? 'bg-success/20 text-success'
                        : reservation.status === 'cancelled'
                        ? 'bg-destructive/20 text-destructive'
                        : 'bg-warning/20 text-warning'
                    }`}
                  >
                    {reservation.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {format(reservation.startTime, 'PPP')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(reservation.startTime, 'h:mm a')} -{' '}
                  {format(reservation.endTime, 'h:mm a')}
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-gray-300">{reservation.totalAmount} ETB</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Receipt className="h-3 w-3" />
                <span>{reservation.id}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => downloadReceipt(reservation)}
                className="gap-1 text-xs text-gray-300"
              >
                <Download className="h-3 w-3" />
                Receipt
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
