import { BRAND, FOOTER_LINKS } from '@/content/home';

/** Wooden footer with brand, secondary links and a fan-project disclaimer. */
export function Footer() {
  return (
    <footer className="wood-plank border-t-4 border-wood-darker px-6 py-8 shadow-[0_-4px_12px_rgb(0_0_0_/_0.2)]">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span aria-hidden className="text-xl">
            {BRAND.emoji}
          </span>
          <span className="font-pixel text-[17px] tracking-[0.06em] text-parchment">
            {BRAND.name}
          </span>
          <span className="ml-1.5 font-body text-[11px] font-bold text-tan">
            {BRAND.tagline}
          </span>
        </div>

        <ul className="flex list-none gap-[22px] p-0">
          {FOOTER_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-pixel text-base tracking-[0.04em] text-cork transition-colors hover:text-tan"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <p className="font-body text-[11px] font-semibold text-wood-light">
          Not affiliated with ConcernedApe or Stardew Valley.
        </p>
      </div>
    </footer>
  );
}
