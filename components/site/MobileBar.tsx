import { generalEnquiryLink } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";

/** Most of this audience arrives on mobile from social. */
export function MobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] flex gap-2.5 border-t border-contour/20 bg-snowline p-2.5 sm:hidden">
      <a
        href={generalEnquiryLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 items-center justify-center rounded-sm bg-[#25D366] px-4 py-3.5 text-[13px] uppercase tracking-[0.1em] text-white [font-variation-settings:'wdth'_100,'wght'_700]"
      >
        WhatsApp
      </a>
      <Button href="/tours" className="flex-1 justify-center py-3.5">
        Tours
      </Button>
    </div>
  );
}
