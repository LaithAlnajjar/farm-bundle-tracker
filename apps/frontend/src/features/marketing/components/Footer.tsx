import { Link } from 'react-router';
import { BrandMark } from '@/features/marketing/components/BrandMark';
import { BRAND, FOOTER, NAV_LINKS } from '@/features/marketing/content/homeContent';

/** Wooden footer with brand, section links and the fan-project disclaimer. */
export function Footer() {
  return (
    <footer className="bg-soil">
      <div className="page-container flex flex-wrap items-center gap-7 px-8 py-9">
        <BrandMark compact tagline={BRAND.footerTagline} />
        <div className="flex-1" />
        <div className="flex flex-wrap gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-body text-xl text-parchment transition-colors hover:text-paper"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/register"
            className="font-body text-xl text-parchment transition-colors hover:text-paper"
          >
            Start a board
          </Link>
        </div>
      </div>

      <div className="border-t-3 border-bark bg-bark">
        <div className="page-container flex flex-wrap justify-between gap-4 px-8 py-3">
          <span className="font-body text-[17px] text-linen-dim">
            {FOOTER.legal}
          </span>
          <span className="font-body text-[17px] text-linen-dim">
            {FOOTER.motto}
          </span>
        </div>
      </div>
    </footer>
  );
}
