import { motion } from "framer-motion";
import { Stethoscope } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
      onAnimationComplete={onComplete}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5"
        animate={{
          background: [
            "linear-gradient(to bottom right, hsl(var(--primary) / 0.1), hsl(var(--background)), hsl(var(--primary) / 0.05))",
            "linear-gradient(to bottom right, hsl(var(--primary) / 0.05), hsl(var(--background)), hsl(var(--primary) / 0.1))",
            "linear-gradient(to bottom right, hsl(var(--primary) / 0.1), hsl(var(--background)), hsl(var(--primary) / 0.05))",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Logo container */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Logo with pulse effect */}
        <motion.div
          className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/20 border border-primary/30 backdrop-blur-sm shadow-2xl shadow-primary/30"
          animate={{
            boxShadow: [
              "0 25px 50px -12px hsl(var(--primary) / 0.3)",
              "0 35px 60px -15px hsl(var(--primary) / 0.4)",
              "0 25px 50px -12px hsl(var(--primary) / 0.3)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Stethoscope className="h-12 w-12 text-primary" />
          </motion.div>

          {/* Pulse rings */}
          <motion.div
            className="absolute inset-0 rounded-3xl border-2 border-primary/30"
            animate={{ scale: [1, 1.3, 1.3], opacity: [0.5, 0, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div
            className="absolute inset-0 rounded-3xl border-2 border-primary/30"
            animate={{ scale: [1, 1.5, 1.5], opacity: [0.3, 0, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
          />
        </motion.div>

        {/* Text */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">MedCare HMS</h1>
          <p className="mt-1 text-muted-foreground">Hospital Management System</p>
        </motion.div>

        {/* Loading spinner */}
        <motion.div
          className="mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="relative h-1.5 w-48 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-primary/50 via-primary to-primary/50"
              animate={{ x: ["0%", "200%", "0%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
