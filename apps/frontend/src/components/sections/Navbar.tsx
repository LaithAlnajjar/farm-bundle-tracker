import { BRAND, NAV_LINKS } from '@/content/home';

/** Sticky wooden top bar with brand, nav links and sign-in. */
export function Navbar() {
  return (
    <nav className="wood-plank sticky top-0 z-[200] border-b-4 border-wood-darker shadow-[0_4px_16px_rgb(0_0_0_/_0.32)]">
      <div className="mx-auto flex h-[58px] max-w-[1120px] items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <span aria-hidden className="text-[22px]">
            {BRAND.emoji}
          </span>
          <span className="font-arcade text-[9px] leading-normal tracking-[0.06em] text-parchment [text-shadow:1px_1px_0_rgb(0_0_0_/_0.5)]">
            {BRAND.name}
          </span>
        </a>

        <div className="flex items-center gap-7">
          <ul className="flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-pixel text-[19px] tracking-[0.05em] text-tan transition-colors hover:text-parchment"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="cursor-pointer border-2 border-primary-edge bg-primary px-4 py-1 font-pixel text-[17px] tracking-[0.05em] text-primary-foreground shadow-[3px_3px_0_rgb(0_0_0_/_0.35)]"
          >
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
}
