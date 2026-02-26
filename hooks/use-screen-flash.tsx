"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type FlashColor = "success" | "failure";

interface FlashState {
    active: boolean;
    color: FlashColor;
}

let globalFlash: ((color: FlashColor) => void) | null = null;

export function useScreenFlash() {
    const flash = (color: FlashColor) => {
        globalFlash?.(color);
    };
    return { flash };
}

/** Mount this once in your layout — it renders the overlay  */
export function ScreenFlashOverlay() {
    const [state, setState] = useState<FlashState>({ active: false, color: "success" });

    useEffect(() => {
        globalFlash = (color: FlashColor) => {
            setState({ active: true, color });
            setTimeout(() => setState((s) => ({ ...s, active: false })), 350);
        };
        return () => {
            globalFlash = null;
        };
    }, []);

    const colorMap = {
        success: "rgba(57,255,20,0.15)",
        failure: "rgba(255,0,110,0.18)",
    };

    return (
        <AnimatePresence>
            {state.active && (
                <motion.div
                    key="screen-flash"
                    className="fixed inset-0 pointer-events-none z-[9999]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    style={{ background: colorMap[state.color] }}
                />
            )}
        </AnimatePresence>
    );
}
