import { motion, AnimatePresence } from "framer-motion";
import { ParkingSlot, SlotStatus } from "@/types/parking";
import { Car, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig: Record<SlotStatus, any> = {
  available: {
    icon: CheckCircle2,
    label: "Available",
    bgColor: "#dcfce7", // Light Green
    textColor: "#16a34a", // Dark Green
    borderColor: "#bbf7d0",
  },
  occupied: {
    icon: Car,
    label: "Occupied",
    bgColor: "#fee2e2", // Light Red
    textColor: "#dc2626", // Dark Red
    borderColor: "#fecaca",
  },
  reserved: {
    icon: Clock,
    label: "Reserved",
    bgColor: "#fef9c3", // Light Yellow
    textColor: "#ca8a04", // Dark Yellow
    borderColor: "#fef08a",
  },
};

export const ParkingSlotCard = ({ slot, onSelect, isSelected }: any) => {
  const config = statusConfig[slot.status];
  const Icon = config.icon;

  return (
    <motion.button
      onClick={() => slot.status === "available" && onSelect(slot)}
      animate={{
        backgroundColor: config.bgColor,
        borderColor: config.borderColor,
        color: config.textColor,
      }}
      className={cn(
        "relative aspect-[4/3] rounded-xl border-2 p-2 transition-all flex flex-col items-center justify-center shadow-sm",
        slot.status === "available" ? "cursor-pointer" : "cursor-not-allowed",
        isSelected && "ring-4 ring-primary ring-offset-2 z-10 scale-105"
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slot.status}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="flex flex-col items-center"
        >
          <Icon className="h-6 w-6 mb-1" />
          <span className="text-xs font-bold">{slot.id}</span>
        </motion.div>
      </AnimatePresence>

      {slot.status === "occupied" && (
        <span className="absolute top-1 right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
        </span>
      )}
    </motion.button>
  );
};
