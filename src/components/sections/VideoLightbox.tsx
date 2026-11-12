"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Play, X } from "lucide-react";

/**
 * Poster card + native <dialog> with the YouTube film. The iframe is mounted only
 * while the dialog is open (nothing from YouTube loads with the page), and uses
 * youtube-nocookie so no tracking cookies are set before the visitor presses play.
 */
export function VideoLightbox({
  videoId,
  title,
  label,
  closeLabel,
  dialogLabel,
  poster,
  duration,
}: {
  videoId: string;
  title: string;
  label: string;
  closeLabel: string;
  dialogLabel: string;
  poster: string;
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
      <button type="button" className="lh-video-poster" onClick={show}>
        <Image src={poster} alt="" fill sizes="(min-width: 1024px) 640px, 100vw" className="lh-video-poster__img" />
        <span className="lh-video-poster__shade" aria-hidden="true" />
        <span className="lh-video-poster__play" aria-hidden="true">
          <Play size={26} fill="currentColor" strokeWidth={0} />
        </span>
        <span className="lh-video-poster__meta">
          <span className="lh-video-poster__label">{label}</span>
          {duration && <span className="lh-video-poster__time">{duration}</span>}
        </span>
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
