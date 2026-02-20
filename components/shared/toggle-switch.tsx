"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  value: "yes" | "no";
  onChange: (value: "yes" | "no") => void;
  labels?: [string, string];
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: {
    container: "w-24 h-8",
    knob: "w-6 h-6",
    text: "text-xs",
    padding: "px-2",
  },
  md: {
    container: "w-32 h-10",
    knob: "w-8 h-8",
    text: "text-sm",
    padding: "px-3",
  },
  lg: {
    container: "w-40 h-12",
    knob: "w-10 h-10",
    text: "text-base",
    padding: "px-4",
  },
};

export function ToggleSwitch({
  value,
  onChange,
  labels = ["YES", "NO"],
  size = "md",
  className,
}: ToggleSwitchProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const sizes = sizeClasses[size];

  const handleToggle = (newValue: "yes" | "no") => {
    if (newValue === value) return;

    // Trigger arc flash effect
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);

    onChange(newValue);
  };

  const isYes = value === "yes";
  const glowColor = isYes ? "#00d9ff" : "#ff006e";

  return (
    <div
      className={cn(
        "relative inline-flex items-center",
        sizes.container,
        className
      )}
      style={{
        clipPath:
          "polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)",
        background: "rgba(26, 31, 58, 0.8)",
        border: `2px solid ${glowColor}40`,
        boxShadow: `0 0 20px ${glowColor}30, inset 0 0 10px ${glowColor}10`,
      }}
    >
      {/* Background glow for active side */}
      <motion.div
        className="absolute top-1 bottom-1 rounded"
        animate={{
          left: isYes ? "4px" : "50%",
          right: isYes ? "50%" : "4px",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        style={{
          background: `${glowColor}20`,
          boxShadow: `0 0 15px ${glowColor}40, inset 0 0 10px ${glowColor}20`,
        }}
      />

      {/* Electric arc flash effect on toggle */}
      {isAnimating && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{ duration: 0.15 }}
          style={{
            background: `linear-gradient(
              90deg,
              transparent,
              ${isYes ? "#ff006e30" : "#00d9ff30"},
              transparent
            )`,
          }}
        />
      )}

      {/* YES button */}
      <button
        onClick={() => handleToggle("yes")}
        className={cn(
          "relative z-10 flex-1 h-full flex items-center justify-center",
          "font-bold tracking-wider transition-colors duration-200",
          sizes.text,
          isYes ? "text-[#00d9ff]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        )}
        style={{
          textShadow: isYes ? "0 0 10px rgba(0, 217, 255, 0.8)" : "none",
        }}
      >
        {labels[0]}
      </button>

      {/* NO button */}
      <button
        onClick={() => handleToggle("no")}
        className={cn(
          "relative z-10 flex-1 h-full flex items-center justify-center",
          "font-bold tracking-wider transition-colors duration-200",
          sizes.text,
          !isYes ? "text-[#ff006e]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        )}
        style={{
          textShadow: !isYes ? "0 0 10px rgba(255, 0, 110, 0.8)" : "none",
        }}
      >
        {labels[1]}
      </button>

      {/* Animated knob/slider */}
      <motion.div
        className={cn(
          "absolute top-1 rounded pointer-events-none",
          sizes.knob
        )}
        animate={{
          left: isYes ? "4px" : "calc(100% - 4px - 2rem)",
          backgroundColor: glowColor,
          boxShadow: `0 0 20px ${glowColor}, 0 0 40px ${glowColor}80`,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
          mass: 1,
        }}
        style={{
          [size === "sm" ? "width" : size === "md" ? "width" : "width"]:
            size === "sm" ? "2rem" : size === "md" ? "2.5rem" : "3rem",
          [size === "sm" ? "height" : size === "md" ? "height" : "height"]:
            size === "sm" ? "1.5rem" : size === "md" ? "2rem" : "2.5rem",
          top: size === "sm" ? "0.25rem" : size === "md" ? "0.25rem" : "0.25rem",
        }}
      >
        {/* Spark particles on toggle */}
        {isAnimating && (
          <>
            <motion.div
              className="absolute w-1 h-1 rounded-full bg-white"
              initial={{ scale: 0, x: "50%", y: "50%" }}
              animate={{
                scale: [0, 1, 0],
                x: ["50%", "50%", "150%"],
                y: ["50%", "-100%", "-200%"],
                opacity: [1, 1, 0],
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute w-1 h-1 rounded-full bg-white"
              initial={{ scale: 0, x: "50%", y: "50%" }}
              animate={{
                scale: [0, 1, 0],
                x: ["50%", "50%", "-50%"],
                y: ["50%", "-100%", "-200%"],
                opacity: [1, 1, 0],
              }}
              transition={{ duration: 0.3, delay: 0.05 }}
            />
          </>
        )}
      </motion.div>
    </div>
  );
}
