import { useMotionValue, useScroll, type MotionValue } from "motion/react";
import { useEffect, type RefObject } from "react";
import { clamp } from "@/lib/utils";

/**
 * The gap kept above a card that fits on screen, in rem, so the floating navigation never covers
 * its heading. Must match the `5rem` in the article classes of ProjectPanel.
 */
export const PILE_INSET_REM = 5;

/**
 * "The pile": the phone and tablet version of the stacked project panels.
 *
 * The desktop stack pins every panel to the top of a full-screen frame. That cannot work on a
 * phone, where one card is taller than the screen and its lower half would be cut off. So here
 * a card keeps its natural height and pins when its BOTTOM edge reaches the bottom of the
 * screen. By then everything above has scrolled past, and the next card slides over it.
 * Cards that do fit on screen pin just below the floating navigation instead. In CSS terms
 * (the classes live on the article in ProjectPanel):
 *
 *     top: min(5rem, 100dvh - cardHeight)
 *
 * A sticky `top` cannot read the element's own height, so this hook measures the card with a
 * ResizeObserver and publishes it as `--pile-h`. Sticky positioning itself is switched on by
 * `data-pile="on"`, which is only set after that first measurement: without JavaScript, or
 * with reduced motion, the cards are an ordinary list.
 *
 * Returns how far the NEXT card has slid over this one (0 = not at all, 1 = fully). It is read
 * from the next card's live position, so it stays correct whatever the card heights are.
 */
export function usePile(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  isLast: boolean,
): MotionValue<number> {
  const { scrollY } = useScroll();
  const covered = useMotionValue(0);

  useEffect(() => {
    const card = ref.current;
    if (!active || !card) return;

    const pin = () => {
      card.style.setProperty("--pile-h", `${card.offsetHeight}px`);
      card.dataset.pile = "on";
    };
    pin();
    const resizeObserver = new ResizeObserver(pin);
    resizeObserver.observe(card);

    // The card that covers this one is its next sibling; the last card is never covered.
    const next = isLast ? null : card.nextElementSibling;
    const inset = PILE_INSET_REM * parseFloat(getComputedStyle(document.documentElement).fontSize);
    const measure = () => {
      if (!next) return;
      const screen = window.innerHeight;
      const box = next.getBoundingClientRect();
      // Where the next card will come to rest: just below the navigation, or by its bottom edge
      // when it is taller than that. "Fully covered" means it has got there.
      const restTop = Math.max(0, Math.min(inset, screen - box.height));
      covered.set(clamp((screen - box.top) / Math.max(1, screen - restTop), 0, 1));
    };
    measure();
    const stopScroll = scrollY.on("change", measure);
    window.addEventListener("resize", measure);

    return () => {
      resizeObserver.disconnect();
      stopScroll();
      window.removeEventListener("resize", measure);
      card.style.removeProperty("--pile-h");
      delete card.dataset.pile;
      covered.set(0);
    };
  }, [ref, active, isLast, scrollY, covered]);

  return covered;
}
