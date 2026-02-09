import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SkeletonShimmerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function SkeletonShimmer({ className, ...props }: SkeletonShimmerProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-muted",
        className
      )}
      {...props}
    >
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          translateX: ["−100%", "100%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonShimmer className="h-4 w-24" />
          <SkeletonShimmer className="h-8 w-16" />
        </div>
        <SkeletonShimmer className="h-12 w-12 rounded-xl" />
      </div>
      <SkeletonShimmer className="mt-4 h-2 w-full rounded-full" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b border-border/50 p-4">
      <SkeletonShimmer className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <SkeletonShimmer className="h-4 w-32" />
        <SkeletonShimmer className="h-3 w-24" />
      </div>
      <SkeletonShimmer className="h-6 w-16 rounded-full" />
      <SkeletonShimmer className="h-8 w-20 rounded-lg" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-4 border-b border-border/50 bg-muted/30 p-4">
        <SkeletonShimmer className="h-4 w-24" />
        <SkeletonShimmer className="h-4 w-20" />
        <SkeletonShimmer className="h-4 w-28" />
        <SkeletonShimmer className="h-4 w-16" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <SkeletonShimmer className="h-8 w-48" />
        <SkeletonShimmer className="h-4 w-64" />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <SkeletonShimmer className="mb-4 h-6 w-32" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <SkeletonShimmer className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-1">
                  <SkeletonShimmer className="h-4 w-full max-w-[200px]" />
                  <SkeletonShimmer className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <SkeletonShimmer className="mb-4 h-6 w-32" />
          <SkeletonShimmer className="h-[200px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function PatientCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
      <div className="flex items-start gap-4">
        <SkeletonShimmer className="h-16 w-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <SkeletonShimmer className="h-5 w-32" />
          <SkeletonShimmer className="h-4 w-24" />
          <div className="flex gap-2">
            <SkeletonShimmer className="h-6 w-16 rounded-full" />
            <SkeletonShimmer className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
