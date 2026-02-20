"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  variant?: "default" | "success" | "danger" | "gold";
  glowColor?: string;
  animated?: boolean;
  className?: string;
  children: ReactNode;
}

const variantStyles = {
  default: {
    border: "rgba(0, 217, 255, 0.3)",
    glow: "rgba(0, 217, 255, 0.4)",
    innerGlow: "rgba(0, 217, 255, 0.1)",
  },
  success: {
    border: "rgba(57, 255, 20, 0.3)",
    glow: "rgba(57, 255, 20, 0.4)",
    innerGlow: "rgba(57, 255, 20, 0.1)",
  },
  danger: {
    border: "rgba(255, 0, 110, 0.3)",
    glow: "rgba(255, 0, 110, 0.4)",
    innerGlow: "rgba(255, 0, 110, 0.1)",
  },
  gold: {
    border: "rgba(255, 215, 0, 0.3)",
    glow: "rgba(255, 215, 0, 0.4)",
    innerGlow: "rgba(255, 215, 0, 0.1)",
  },
};

export function GlowCard({
  variant = "default",
  glowColor,
  animated = true,
  className,
  children,
}: GlowCardProps) {
  const styles = variantStyles[variant];
  const customGlow = glowColor || styles.glow;

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden",
        "bg-[#1a1f3a]/80 backdrop-blur-sm",
        className
      )}
      style={{
        clipPath:
          "polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)",
      }}
      whileHover={animated ? { scale: 1.02 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {/* Outer border layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${styles.border} 0%, transparent 50%, ${styles.border} 100%)`,
          clipPath:
            "polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)",
        }}
      />

      {/* Inner border layer */}
      <div
        className="absolute inset-[1px] pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${styles.border}40 0%, transparent 50%, ${styles.border}40 100%)`,
          clipPath:
            "polygon(7px 0, calc(100% - 7px) 0, 100% 7px, 100% calc(100% - 7px), calc(100% - 7px) 100%, 7px 100%, 0 calc(100% - 7px), 0 7px)",
        }}
      />

      {/* Animated neon border glow */}
      {animated && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            boxShadow: [
              `inset 0 0 20px ${styles.innerGlow}, 0 0 20px ${customGlow}30`,
              `inset 0 0 30px ${styles.innerGlow}, 0 0 40px ${customGlow}50`,
              `inset 0 0 20px ${styles.innerGlow}, 0 0 20px ${customGlow}30`,
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Holographic gradient overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        animate={
          animated
            ? {
                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
              }
            : undefined
        }
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: `linear-gradient(
            135deg,
            transparent 0%,
            ${customGlow}08 25%,
            ${customGlow}05 50%,
            ${customGlow}08 75%,
            transparent 100%
          )`,
          backgroundSize: "200% 200%",
        }}
      />

      {/* Tech grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `linear-gradient(${customGlow}10 1px, transparent 1px),
            linear-gradient(90deg, ${customGlow}10 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Horizontal scan-line overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            ${customGlow}05 2px,
            ${customGlow}05 4px
          )`,
        }}
      />

      {/* Inner shadow for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: "inset 0 2px 20px rgba(0, 0, 0, 0.5)",
        }}
      />

      {/* Content */}
      <div className="relative z-20 p-6">{children}</div>
    </motion.div>
  );
}
