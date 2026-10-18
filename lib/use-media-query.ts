import { useCallback, useSyncExternalStore } from "react";

/**
 * Hydration-safe media query hook.
 *
 * useSyncExternalStore uses the server snapshot (false) during hydration and then
 * immediately re-renders with the real value, so server and client markup always agree.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True on viewports where the pinned, stacked project experience is used. */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}

/** Stacked project panels run on desktop only, and never with reduced motion. */
export function useStackedMode(): boolean {
  const desktop = useIsDesktop();
  const reduce = usePrefersReducedMotion();
  return desktop && !reduce;
}

/**
 * The phone and tablet version of the stack: project cards pile up while you scroll, but keep
 * their natural height (see lib/use-pile.ts). Never with reduced motion. Like the other hooks
 * it is false on the server and during hydration, so the first paint is a plain list.
 */
export function usePileMode(): boolean {
  const narrow = useMediaQuery("(max-width: 1023.98px)");
  const reduce = usePrefersReducedMotion();
  return narrow && !reduce;
}
