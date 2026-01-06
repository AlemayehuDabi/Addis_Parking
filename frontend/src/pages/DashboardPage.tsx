import { motion } from 'framer-motion';
import { useReservation } from '@/hooks/useReservation';
import { useParkingState } from '@/hooks/useParkingState';
import { ActiveBooking } from '@/components/ActiveBooking';
import { ReservationHistory } from '@/components/ReservationHistory';
import { toast } from '@/hooks/use-toast';
import { User, Car, Mail, Phone, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/auth-client';

const DashboardPage = () => {
  const { activeReservation, timeRemaining, reservationHistory, cancelReservation, formatTimeRemaining } = useReservation();
  const { lots } = useParkingState();

  const activeLot = activeReservation
    ? lots.find((lot) => lot.id === activeReservation.lotId)
    : null;

  const handleCancel = (reservationId: string) => {
    cancelReservation(reservationId);
    toast({
      title: "Booking Ended",
      description: "Your parking session has been ended",
    });
  };

  const handleFindCar = () => {
    toast({
      title: "Opening Navigation",
      description: `Navigating to ${activeLot?.name || 'your car'}`,
    });
  };

  // session
  const {data: session, isPending} = useSession()

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card p-4">
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Manage your parking</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80">
                  <User className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-200">{session.user.name}</h2>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="flex items-center gap-1 rounded-lg bg-muted px-2 py-1 text-xs text-gray-300">
                      <Car className="h-3 w-3" />
                      AA-1234
                    </span>
                    <span className="text-xs text-success">Verified Driver</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{session.user.email}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Phone number will be available soon.</span>
              </div>
            </div>
          </motion.div>

          {/* Active Booking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ActiveBooking
              reservation={activeReservation}
              timeRemaining={timeRemaining}
              formatTime={formatTimeRemaining}
              lotName={activeLot?.name}
              onCancel={handleCancel}
              onFindCar={handleFindCar}
            />
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-3"
          >
            <div className="glass-card rounded-xl p-4 text-center">
              <span className="text-2xl font-bold text-primary">{reservationHistory.length + (activeReservation ? 1 : 0)}</span>
              <p className="text-xs text-muted-foreground">Total Bookings</p>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <span className="text-2xl font-bold text-success">
                {reservationHistory.filter((r) => r.status === 'completed').length}
              </span>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <span className="text-2xl font-bold text-warning">
                {reservationHistory.reduce((acc, r) => acc + r.totalAmount, 0) + (activeReservation?.totalAmount || 0)}
              </span>
              <p className="text-xs text-muted-foreground">ETB Spent</p>
            </div>
          </motion.div>

          {/* Booking History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ReservationHistory reservations={reservationHistory} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
