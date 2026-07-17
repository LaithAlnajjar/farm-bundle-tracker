import { Link } from 'react-router';
import { useAuth } from '@/features/auth';
import { BrandMark } from '@/features/marketing/components/BrandMark';
import { NAV_LINKS } from '@/features/marketing/content/homeContent';
import { chunkyButtonVariants } from '@/shared/components/farm-ui';
import { cn } from '@/shared/lib/utils';

/** Sticky wooden top bar with brand, section links and sign-in. */
export function Navbar() {
  const { isAuthenticated } = useAuth();
  const accountHref = isAuthenticated ? '/farms' : '/signin';
  const accountLabel = isAuthenticated ? 'My farms' : 'Sign in';
  const startHref = isAuthenticated ? '/farms' : '/register';

  return (
    <nav className="sticky top-0 z-50 border-b-4 border-bark bg-soil shadow-drop-4">
      <div className="page-container flex items-center gap-5 px-8 py-3">
        <a href="#top">
          <BrandMark />
        </a>

        <div className="flex-1" />

        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-body text-[21px] text-parchment transition-colors hover:text-paper"
            >
              {link.label}
            </a>
          ))}
          <Link
            to={accountHref}
            className="font-body text-[21px] text-parchment transition-colors hover:text-paper"
          >
            {accountLabel}
          </Link>
        </div>

        <Link
          to={startHref}
          className={cn(
            chunkyButtonVariants({ variant: 'primary' }),
            'px-4 py-2 shadow-drop-4 hover:shadow-drop-2',
          )}
        >
          + Start a board
        </Link>
      </div>
    </nav>
  );
}
