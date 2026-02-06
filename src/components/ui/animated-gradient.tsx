"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

export const AnimatedGradient = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: [
            "radial-gradient(circle at 0% 0%, hsl(var(--primary) / 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 100% 0%, hsl(var(--primary) / 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 100% 100%, hsl(var(--primary) / 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 0% 100%, hsl(var(--primary) / 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 0% 0%, hsl(var(--primary) / 0.15) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      {children}
    </div>
  );
};

export const GradientOrb = ({ className }: { className?: string }) => {
  return (
    <motion.div
      className={cn(
        "absolute h-96 w-96 rounded-full bg-primary/20 blur-3xl",
        className
      )}
      animate={{
        x: [0, 100, 0],
        y: [0, 50, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};
