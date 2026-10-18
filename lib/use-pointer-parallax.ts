import { useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect } from "react";
import { SPRING_SOFT } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-media-query";

/**
 * Interactive parallax: where the mouse is on the screen, as two soft springs from -1 to 1
 * (0 = centre). Turn them into per-layer offsets with useShift(): layers that are further
 * back move less, and layers moving in opposite directions read as depth. Touch input and
 * reduced motion leave the values at 0.
 */
export function usePointerParallax(): { x: MotionValue<number>; y: MotionValue<number> } {
  const reduce = usePrefersReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING_SOFT);
  const y = useSpring(rawY, SPRING_SOFT);

  useEffect(() => {
    if (reduce) return;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      rawX.set((event.clientX / window.innerWidth) * 2 - 1);
      rawY.set((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, rawX, rawY]);

  return { x, y };
}

/** A layer's offset in px for a pointer value: positive `amount` follows the pointer, negative opposes it. */
export function useShift(value: MotionValue<number>, amount: number): MotionValue<number> {
  return useTransform(value, (v) => v * amount);
}
