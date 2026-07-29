"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Interstitial } from "@/site/components/Interstitial";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaced in server logs for diagnosis; never shown to the visitor.
    console.error(error);
  }, [error]);

  return (
    <Interstitial
      eyebrow="Something went wrong"
      title="A stitch came loose."
      intro="We hit an unexpected error. Please try again — if it persists, the atelier is only a call or a message away."
    >
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center bg-gold px-8 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-ink hover:bg-gold-2"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center border border-gold/30 px-8 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-bone hover:border-gold hover:bg-gold hover:text-ink"
        >
          Return home
        </Link>
      </div>
    </Interstitial>
  );
}
