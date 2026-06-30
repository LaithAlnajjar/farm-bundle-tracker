import { BRAND, NAV_LINKS } from '@/features/marketing/content/homeContent';

/** Sticky wooden top bar with brand, nav links and sign-in. */
export function Navbar() {
  return (
    <nav className="wood-plank nav-shadow sticky top-0 z-50 border-b-4 border-wood-darker">
      <div className="page-container flex h-14.5 items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <span aria-hidden className="text-[22px]">
            {BRAND.emoji}
          </span>
          <span className="text-shadow-strong font-arcade text-[9px] leading-normal tracking-[0.06em] text-parchment">
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
            className="sign-in-shadow cursor-pointer border-2 border-primary-edge bg-primary px-4 py-1 font-pixel text-[17px] tracking-[0.05em] text-primary-foreground"
          >
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
}
