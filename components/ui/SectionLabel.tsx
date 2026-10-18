import { Sparkle } from "@/components/ui/Sparkle";
import { cn } from "@/lib/utils";

interface SectionLabelProps {
  index: string;
  label: string;
  /** Use "dark" on ink backgrounds. */
  tone?: "light" | "dark";
  className?: string;
}

/** Numbered section marker: "✦ 02 ———— Selected work". */
export function SectionLabel({ index, label, tone = "light", className }: SectionLabelProps) {
  return (
    <div className={cn("eyebrow mb-12 flex items-center gap-4 lg:mb-16", className)}>
      <Sparkle className={cn("size-3.5 shrink-0", tone === "dark" ? "text-lagoon" : "text-deepsea")} />
      <span>{index}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-current opacity-25" />
      <span>{label}</span>
    </div>
  );
}
