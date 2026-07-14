import { TRUST_STRIP } from '@/features/marketing/content/homeContent';
import { PixelIcon } from '@/shared/components/farm-ui';

/** Thin bark band under the hero: one-liner plus a row of item sprites. */
export function TrustStrip() {
  return (
    <div className="border-b-4 border-ink bg-bark">
      <div className="page-container flex flex-wrap items-center justify-center gap-4.5 px-8 py-4">
        <span className="font-body text-[21px] text-linen">
          {TRUST_STRIP.text}
        </span>
        <span className="flex items-center gap-2.5">
          {TRUST_STRIP.icons.map((icon) => (
            <PixelIcon key={icon} name={icon} size={26} />
          ))}
        </span>
      </div>
    </div>
  );
}
