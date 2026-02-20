"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  format?: "currency" | "number" | "compact";
  className?: string;
}

function formatValue(value: number, format: string): string {
  switch (format) {
    case "currency":
      return value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    case "compact":
      if (value >= 1e9) return (value / 1e9).toFixed(2) + "B";
      if (value >= 1e6) return (value / 1e6).toFixed(2) + "M";
      if (value >= 1e3) return (value / 1e3).toFixed(2) + "K";
      return value.toFixed(2);
    default:
      return value.toLocaleString();
  }
}

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 0.5,
  format = "number",
  className,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (value !== prevValue) {
      const delta = Math.abs(value - prevValue);
      const percentageChange = prevValue !== 0 ? delta / prevValue : 0;

      setIsAnimating(true);
      setShouldShake(percentageChange > 0.2);

      const startTime = performance.now();
      const startValue = prevValue;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1);

        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (value - startValue) * easeOut;

        setDisplayValue(currentValue);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayValue(value);
          setPrevValue(value);
          setIsAnimating(false);
          setTimeout(() => setShouldShake(false), 500);
        }
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [value, prevValue, duration]);

  const formattedValue = formatValue(displayValue, format);
  const formattedPrev = formatValue(prevValue, format);

  // Split into individual digits for animation
  const digits = formattedValue.split("");

  return (
    <motion.div
      className={cn(
        "font-mono inline-flex items-baseline",
        isAnimating && "glow-text-cyan",
        shouldShake && "animate-shake",
        className
      )}
      animate={
        isAnimating
          ? {
              textShadow: [
                "0 0 10px rgba(0, 217, 255, 0.3)",
                "0 0 20px rgba(0, 217, 255, 0.6)",
                "0 0 10px rgba(0, 217, 255, 0.3)",
              ],
            }
          : {}
      }
      transition={{ duration: 0.5 }}
    >
      {prefix && (
        <span className="text-[var(--accent-cyan)] mr-1">{prefix}</span>
      )}

      <span className="relative overflow-hidden h-[1.2em] inline-flex items-center">
        <AnimatePresence mode="popLayout">
          {digits.map((digit, index) => (
            <motion.span
              key={`${index}-${digit}`}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: index * 0.02,
              }}
              className={cn(
                "inline-block tabular-nums",
                digit === "," || digit === "."
                  ? "text-[var(--muted-foreground)]"
                  : "text-[var(--foreground)]"
              )}
            >
              {digit}
            </motion.span>
          ))}
        </AnimatePresence>
      </span>

      {suffix && (
        <span className="text-[var(--muted-foreground)] ml-1">{suffix}</span>
      )}

      {/* Pulse effect overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={
          isAnimating
            ? {
                opacity: [0, 0.3, 0],
              }
            : { opacity: 0 }
        }
        transition={{ duration: 0.5 }}
        style={{
          background:
            "radial-gradient(circle at center, rgba(0, 217, 255, 0.2), transparent)",
        }}
      />
    </motion.div>
  );
}
