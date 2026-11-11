"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Play, X } from "lucide-react";

/**
 * Play trigger + native <dialog> with the YouTube film. The iframe is mounted only
 * while the dialog is open (nothing from YouTube loads with the page), and uses
 * youtube-nocookie so no tracking cookies are set before the visitor presses play.
 *
 * `link`: round play button + label (hero). `poster`: large 16:9 thumbnail card.
 */
export function VideoLightbox({
  videoId,
  title,
  label,
  closeLabel,
  dialogLabel,
  variant = "link",
  poster,
  duration,
}: {
  videoId: string;
  title: string;
  label: string;
  closeLabel: string;
  dialogLabel: string;
  variant?: "link" | "poster";
  poster?: string;
  duration?: string;
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
      {variant === "poster" && poster ? (
        <button type="button" className="lh-video-poster" onClick={show}>
          <Image src={poster} alt="" fill sizes="(min-width: 1024px) 640px, 100vw" className="lh-video-poster__img" />
          <span className="lh-video-poster__shade" aria-hidden="true" />
          <span className="lh-video-poster__play" aria-hidden="true">
            <Play size={26} fill="currentColor" strokeWidth={0} />
          </span>
          <span className="lh-video-poster__meta">
            {label}
            {duration && <span className="lh-video-poster__time">{duration}</span>}
          </span>
        </button>
      ) : (
        <button type="button" className="lh-hero__cta-ghost lh-video-trigger" onClick={show}>
          <span className="lh-hero__cta-play lh-video-trigger__play" aria-hidden="true">
            <Play size={15} fill="currentColor" strokeWidth={0} />
          </span>
          {label}
        </button>
      )}
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
