"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Sparkle } from "@/components/ui/Sparkle";
import { navLinks, profile } from "@/lib/content";
import { EASE_OUT, SPRING_SNAPPY } from "@/lib/motion";
import { cn, pad } from "@/lib/utils";

/** Sections watched for the active state, and which nav link each one lights up. */
const OBSERVED = ["top", "about", "work", "experience", "achievements", "contact"];
const LINK_FOR: Record<string, string | null> = {
  top: null,
  about: "about",
  work: "work",
  experience: "experience",
  achievements: "experience",
  contact: "contact",
};

/**
 * Floating pill navigation.
 * - Dark pill so it reads on every section (light or ink) without background switching.
 * - Active section follows the viewport's centre line (IntersectionObserver); the highlight
 *   slides between links with a shared layout animation (layoutId).
 * - Mobile: a small disclosure panel (not a modal): Escape, outside click and link click close it.
 */
export function Navigation() {
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const targets = OBSERVED.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(LINK_FOR[entry.target.id] ?? null);
        }
      },
      // A 1%-tall band just above the viewport centre decides which section is "current".
      { rootMargin: "-45% 0px -54% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    firstLinkRef.current?.focus();
    const onPointerDown = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && open) {
      setOpen(false);
      toggleRef.current?.focus();
    }
  }

  return (
    <header className="on-dark fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        ref={navRef}
        aria-label="Primary"
        onKeyDown={onKeyDown}
        className="relative w-full max-w-md md:w-auto md:max-w-none"
      >
        <div className="flex items-center justify-between gap-2 rounded-full border border-paper/10 bg-ink/90 p-1.5 pl-4 text-paper shadow-[0_14px_40px_-16px_rgba(3,25,27,0.6)] backdrop-blur-md md:gap-1 md:pl-2">
          <a
            href="#top"
            aria-label={`${profile.name}, back to top`}
            className="flex items-center gap-2 rounded-full pr-2 md:px-3 md:py-2"
          >
            <Sparkle className="size-4 text-lagoon" />
            <span className="font-display text-xl italic leading-none">MK</span>
          </a>

          <ul className="hidden items-center md:flex">
            {navLinks.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className="relative block rounded-full px-4 py-2 text-sm"
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="nav-pill"
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full bg-lagoon"
                        transition={{ type: "spring", ...SPRING_SNAPPY }}
                      />
                    ) : null}
                    <span
                      className={cn(
                        "relative z-10 transition-colors duration-300",
                        isActive ? "font-medium text-ink" : "text-paper/75 hover:text-paper",
                      )}
                    >
                      {link.label}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>

          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-full bg-paper/10 md:hidden"
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>

        <AnimatePresence>
          {open ? (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className="absolute inset-x-0 top-full mt-2 origin-top rounded-3xl border border-paper/10 bg-ink/95 p-3 text-paper shadow-[0_24px_60px_-20px_rgba(3,25,27,0.7)] backdrop-blur-md md:hidden"
            >
              <ul>
                {navLinks.map((link, i) => (
                  <li key={link.id}>
                    <a
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={`#${link.id}`}
                      onClick={() => setOpen(false)}
                      aria-current={active === link.id ? "location" : undefined}
                      className={cn(
                        "flex items-baseline justify-between rounded-2xl px-4 py-3 transition-colors",
                        active === link.id ? "bg-lagoon text-ink" : "hover:bg-paper/10",
                      )}
                    >
                      <span className="font-display text-3xl leading-none">{link.label}</span>
                      <span className="eyebrow">{pad(i + 1)}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </nav>
    </header>
  );
}
