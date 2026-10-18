import { Container } from "@/components/ui/Container";
import { Sparkle } from "@/components/ui/Sparkle";
import { BUILD_YEAR, navLinks, profile } from "@/lib/content";

export function Footer() {
  return (
    <footer className="on-dark bg-ink text-paper">
      <Container className="flex flex-col gap-10 border-t border-paper/15 py-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="flex items-center gap-3 font-display text-2xl">
            <Sparkle className="size-4 text-lagoon" />
            {profile.name}
          </p>
          <p className="mt-2 text-sm text-paper-muted">
            {profile.role} · {profile.location}
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} className="underline-offset-4 hover:underline">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#top" className="underline-offset-4 hover:underline">
                Back to top
              </a>
            </li>
          </ul>
        </nav>

        <div className="text-sm text-paper-muted md:text-right">
          <p>© {BUILD_YEAR} {profile.name}</p>
          <p className="mt-1">Built with Next.js, Tailwind CSS and Motion.</p>
        </div>
      </Container>
    </footer>
  );
}
