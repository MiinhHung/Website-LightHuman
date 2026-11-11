"use client";

import { useRef, useState } from "react";
import { Play, X } from "lucide-react";

/**
 * Play button + native <dialog> with the YouTube film. The iframe is mounted only
 * while the dialog is open (nothing from YouTube loads with the page), and uses
 * youtube-nocookie so no tracking cookies are set before the visitor presses play.
 */
export function VideoLightbox({
  videoId,
  title,
  label,
  closeLabel,
  dialogLabel,
}: {
  videoId: string;
  title: string;
  label: string;
  closeLabel: string;
  dialogLabel: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  function show() {
    setOpen(true);
    ref.current?.showModal();
  }
  function hide() {
    ref.current?.close();
  }

  return (
    <>
      <button type="button" className="lh-hero__cta-ghost lh-video-trigger" onClick={show}>
        <span className="lh-hero__cta-play lh-video-trigger__play" aria-hidden="true">
          <Play size={15} fill="currentColor" strokeWidth={0} />
        </span>
        {label}
      </button>
      <dialog
        ref={ref}
        className="lh-video"
        aria-label={dialogLabel}
        onClose={() => setOpen(false)}
        // Click on the backdrop (the dialog box itself, outside the frame) closes it.
        onClick={(e) => e.target === e.currentTarget && hide()}
      >
        <div className="lh-video__frame">
          {open && (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          )}
        </div>
        <button type="button" className="lh-video__close" onClick={hide}>
          <X size={20} strokeWidth={2} aria-hidden="true" />
          <span className="sr-only">{closeLabel}</span>
        </button>
      </dialog>
    </>
  );
}
