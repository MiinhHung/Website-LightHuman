"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Behaviour and motion of the approved mock (assets/js/main.js + sections.js),
 * ported to run once per route and tear itself down on navigation. It works on
 * data attributes in server-rendered markup; React-owned text is pre-split
 * (`.wd > .wi`, `data-split-done`) so nothing here rewrites React nodes.
 */

type Off = () => void;

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));

function setup(): Off {
  const offs: Off[] = [];
  const on = <K extends keyof HTMLElementEventMap>(el: EventTarget, type: K | string, fn: (e: never) => void, opts?: AddEventListenerOptions) => {
    el.addEventListener(type, fn as EventListener, opts);
    offs.push(() => el.removeEventListener(type, fn as EventListener, opts));
  };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  document.documentElement.classList.toggle("no-motion", reduce);

  const io = (els: Element[], cb: (el: HTMLElement) => void, opts?: IntersectionObserverInit) => {
    if (!els.length) return;
    const ob = new IntersectionObserver((list) => {
      list.forEach((e) => {
        if (e.isIntersecting) {
          cb(e.target as HTMLElement);
          ob.unobserve(e.target);
        }
      });
    }, opts ?? { threshold: 0.2 });
    els.forEach((el) => ob.observe(el));
    offs.push(() => ob.disconnect());
  };

  /* ---------------- filters (case studies, posts) + post search */
  $$("[data-filter-group]").forEach((group) => {
    const key = group.dataset.filterGroup!;
    const list = $(`[data-filter-list="${key}"]`);
    const empty = $(`[data-filter-empty="${key}"]`);
    const search = key === "post" ? $<HTMLInputElement>("[data-post-search]") : null;
    const results = $("[data-results]");
    let cur = "all";
    const apply = () => {
      const q = search ? search.value.trim().toLowerCase() : "";
      let shown = 0;
      if (list)
        $$("[data-cat]", list).forEach((el) => {
          const ok = (cur === "all" || el.dataset.cat === cur) && (!q || (el.dataset.text || "").includes(q));
          el.hidden = !ok;
          if (ok) shown++;
        });
      if (empty) empty.hidden = shown > 0;
      if (results) results.textContent = q ? `${shown} kết quả cho “${search!.value.trim()}”` : `${shown} bài viết`;
    };
    $$("[data-filter]", group).forEach((b) =>
      on(b, "click", () => {
        cur = b.dataset.filter!;
        $$("[data-filter]", group).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        apply();
      }),
    );
    if (search) on(search, "input", apply);
  });

  /* ---------------- tabs (client stage, core values) */
  $$("[data-tabs]").forEach((t) => {
    const tabs = $$('[role="tab"]', t);
    const select = (tab: HTMLElement, focus?: boolean) => {
      tabs.forEach((x) => {
        const sel = x === tab;
        x.setAttribute("aria-selected", String(sel));
        x.tabIndex = sel ? 0 : -1;
        const panel = document.getElementById(x.getAttribute("aria-controls")!);
        if (panel) panel.hidden = !sel;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((tab, i) => {
      on(tab, "click", () => select(tab));
      on(tab, "keydown", (e: KeyboardEvent) => {
        const n = ({ ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 } as Record<string, number>)[e.key];
        if (n) {
          e.preventDefault();
          select(tabs[(i + n + tabs.length) % tabs.length], true);
        }
        if (e.key === "Home") {
          e.preventDefault();
          select(tabs[0], true);
        }
        if (e.key === "End") {
          e.preventDefault();
          select(tabs[tabs.length - 1], true);
        }
      });
    });
  });

  /* ---------------- service strips (desktop accordion) */
  const accWide = window.matchMedia("(min-width: 1025px)");
  $$("[data-acc]").forEach((acc) => {
    const items = $$(".acc-item", acc);
    const set = (it: HTMLElement) => items.forEach((x) => x.classList.toggle("is-active", x === it));
    items.forEach((it) => {
      on(it, "pointerenter", (e: PointerEvent) => e.pointerType === "mouse" && set(it));
      on(it, "focusin", () => set(it));
      // Large touch screens: first tap opens the strip, the second follows the link.
      on(it, "click", (e: MouseEvent) => {
        if (accWide.matches && !it.classList.contains("is-active")) {
          e.preventDefault();
          set(it);
        }
      });
    });
  });

  /* ---------------- process steps light up */
  io($$(".tl-row"), (el) => el.classList.add("is-lit"), { threshold: 0.45, rootMargin: "0px 0px -12% 0px" });

  /* ---------------- copy article link */
  $$("[data-copy]").forEach((b) =>
    on(b, "click", () => {
      const done = () => b.setAttribute("aria-label", "Đã sao chép liên kết");
      if (navigator.clipboard) navigator.clipboard.writeText(b.dataset.copy!).then(done, done);
      else done();
    }),
  );

  /* ---------------- count up */
  const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  io(
    $$("[data-count]"),
    (el) => {
      const end = parseInt(el.dataset.count!, 10);
      const suf = el.dataset.suffix || "";
      if (reduce || !end) return;
      let t0: number | null = null;
      const dur = 1600;
      const step = (t: number) => {
        if (!el.isConnected) return;
        if (!t0) t0 = t;
        const p = Math.min(1, (t - t0) / dur);
        const k = 1 - Math.pow(1 - p, 4);
        el.textContent = fmt(Math.round(end * k)) + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      el.textContent = "0" + suf;
      requestAnimationFrame(step);
    },
    { threshold: 0.6 },
  );

  /* ---------------- images open like a spotlight */
  io($$("[data-clip-reveal]"), (el) => el.classList.add("in"), { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

  /* ---------------- sticky sub-nav / table of contents: mark the section in view */
  const spy = (links: HTMLAnchorElement[]) => {
    if (!links.length) return;
    const map: Record<string, HTMLAnchorElement> = {};
    links.forEach((a) => {
      const t = document.getElementById(a.getAttribute("href")!.slice(1));
      if (t) map[t.id] = a;
    });
    const ob = new IntersectionObserver(
      (list) =>
        list.forEach((e) => {
          if (!e.isIntersecting) return;
          links.forEach((a) => a.classList.remove("is-active"));
          map[e.target.id]?.classList.add("is-active");
        }),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    Object.keys(map).forEach((id) => ob.observe(document.getElementById(id)!));
    offs.push(() => ob.disconnect());
  };
  spy($$<HTMLAnchorElement>('[data-subnav] a[href^="#"]'));
  spy($$<HTMLAnchorElement>('.toc a[href^="#"]'));

  /* ---------------- pointer effects (mouse only, motion allowed) */
  if (fine && !reduce) {
    $$(".hero").forEach((h) => {
      const light = $(".hero-light", h);
      if (!light) return;
      on(h, "pointermove", (e: PointerEvent) => {
        const b = h.getBoundingClientRect();
        light.style.setProperty("--lx", `${(((e.clientX - b.left) / b.width) * 100).toFixed(1)}%`);
        light.style.setProperty("--ly", `${(((e.clientY - b.top) / b.height) * 100).toFixed(1)}%`);
      });
    });

    const glow = $(".cursor-light");
    if (glow) {
      let gx = 0,
        gy = 0,
        cx = 0,
        cy = 0,
        gOn = false,
        raf = 0;
      on(document, "pointermove", (e: PointerEvent) => {
        gx = e.clientX;
        gy = e.clientY;
        const dark = (e.target as Element).closest?.(".tone-navy, .tone-deep");
        if (!!dark !== gOn) {
          gOn = !!dark;
          glow.classList.toggle("on", gOn);
        }
      });
      const loop = () => {
        cx += (gx - cx) * 0.12;
        cy += (gy - cy) * 0.12;
        glow.style.transform = `translate(${cx}px,${cy}px)`;
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      offs.push(() => {
        cancelAnimationFrame(raf);
        glow.classList.remove("on");
      });
    }

    $$("[data-cursor-reveal]").forEach((sec) => {
      const box = $(".cursor-img", sec);
      const im = box && $<HTMLImageElement>("img", box);
      if (!box || !im) return;
      let tx = 0,
        ty = 0,
        x = 0,
        y = 0,
        shown = false,
        raf = 0;
      const tick = () => {
        x += (tx - x) * 0.16;
        y += (ty - y) * 0.16;
        box.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) scale(${shown ? 1 : 0.6}) rotate(${((tx - x) * 0.04).toFixed(2)}deg)`;
        box.style.opacity = shown ? "1" : "0";
        raf = shown || Math.abs(tx - x) > 0.5 ? requestAnimationFrame(tick) : 0;
      };
      $$("[data-reveal-img]", sec).forEach((row) => {
        on(row, "pointerenter", () => {
          if (im.getAttribute("src") !== row.dataset.revealImg) im.src = row.dataset.revealImg!;
          shown = true;
          if (!raf) raf = requestAnimationFrame(tick);
        });
        on(row, "pointerleave", () => {
          shown = false;
          if (!raf) raf = requestAnimationFrame(tick);
        });
      });
      on(sec, "pointermove", (e: PointerEvent) => {
        tx = e.clientX + 170;
        ty = e.clientY;
        if (!x) {
          x = tx;
          y = ty;
        }
      });
      offs.push(() => cancelAnimationFrame(raf));
    });

    $$("[data-magnetic]").forEach((b) => {
      on(b, "pointermove", (e: PointerEvent) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1)}px,${((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1)}px)`;
      });
      on(b, "pointerleave", () => {
        b.style.transform = "";
      });
    });
  }

  /* ---------------- sections.js: reveal, spotlight, parallax, progress bar */
  const reveal = $$(".sx-reveal");
  if (reduce) reveal.forEach((el) => el.classList.add("is-visible"));
  else io(reveal, (el) => el.classList.add("is-visible"), { threshold: 0.15 });

  $$(".sx-card").forEach((card) =>
    on(card, "pointermove", (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${(e.clientX - r.left).toFixed(1)}px`);
      card.style.setProperty("--my", `${(e.clientY - r.top).toFixed(1)}px`);
    }),
  );

  const wideMQ = window.matchMedia("(min-width: 768px)");
  const speedEls = $$("[data-speed]") as (HTMLElement & { _off?: number })[];
  if (speedEls.length) {
    const CLAMP = 120;
    let visible: typeof speedEls = [];
    let ticking = false;
    const enabled = () => wideMQ.matches && !reduce;
    const resetAll = () =>
      speedEls.forEach((el) => {
        el.style.transform = "";
        el.style.willChange = "";
        el._off = 0;
      });
    const update = () => {
      ticking = false;
      if (!enabled()) return;
      const vc = window.innerHeight / 2;
      visible.forEach((el) => {
        const speed = parseFloat(el.getAttribute("data-speed")!) || 0;
        const r = el.getBoundingClientRect();
        const base = r.top + r.height / 2 - (el._off || 0);
        const off = Math.max(-CLAMP, Math.min(CLAMP, (base - vc) * speed * -1));
        el._off = off;
        el.style.transform = `translate3d(0,${off.toFixed(1)}px,0)`;
      });
    };
    const request = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    const apply = () => {
      if (enabled()) {
        speedEls.forEach((el) => (el.style.willChange = "transform"));
        request();
      } else resetAll();
    };
    const ob = new IntersectionObserver(
      (list) => {
        list.forEach((e) => {
          const el = e.target as (typeof speedEls)[number];
          const i = visible.indexOf(el);
          if (e.isIntersecting && i < 0) visible.push(el);
          else if (!e.isIntersecting && i > -1) visible.splice(i, 1);
        });
        request();
      },
      { rootMargin: "200px 0px 200px 0px" },
    );
    speedEls.forEach((el) => ob.observe(el));
    offs.push(() => {
      ob.disconnect();
      visible = [];
      resetAll();
    });
    on(window, "scroll", request, { passive: true });
    on(window, "resize", apply);
    on(wideMQ, "change", apply);
    apply();
  }

  /* ---------------- GSAP: hero, headings, scrubbed words, timelines, staggered groups */
  const scrubWords = $$("[data-scrub-words]");
  if (reduce) {
    scrubWords.forEach((el) => el.classList.add("is-static"));
  } else {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const words = (el: HTMLElement) => $$(".wi", el);

      $$("[data-hero]").forEach((h) => {
        const title = $("[data-lines]", h);
        const media = $("[data-hero-media] img", h);
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        if (media) tl.fromTo(media, { scale: 1.16 }, { scale: 1, duration: 2.2 }, 0);
        if (title) tl.from(words(title), { yPercent: 115, duration: 1.15, stagger: 0.045 }, 0.15);
        const rest = $$(".kicker, .crumbs, .hero-lede, .hero-actions, .nf-links", h);
        if (rest.length) tl.from(rest, { y: 26, opacity: 0, duration: 1, stagger: 0.08 }, 0.35);
        if (media) gsap.to(media, { yPercent: 12, ease: "none", scrollTrigger: { trigger: h, start: "top top", end: "bottom top", scrub: true } });
      });

      $$("[data-split]").forEach((el) => {
        gsap.from(words(el), { yPercent: 110, duration: 1, ease: "expo.out", stagger: 0.035, scrollTrigger: { trigger: el, start: "top 86%" } });
      });

      scrubWords.forEach((el) => {
        const ws = $$(".w", el);
        let last = -1;
        ScrollTrigger.create({
          trigger: el,
          start: "top 78%",
          end: "bottom 45%",
          scrub: true,
          onUpdate: (self) => {
            const n = Math.round(self.progress * ws.length);
            if (n === last) return;
            ws.forEach((w, i) => w.classList.toggle("on", i < n));
            last = n;
          },
        });
      });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 761px)", () => {
        $$("[data-hscroll]").forEach((sec) => {
          const track = $("[data-hscroll-track]", sec);
          const pin = $(".hscroll-pin", sec);
          if (!track || !pin) return;
          const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
          if (dist() < 40) return;
          sec.classList.add("is-pinned");
          gsap.to(track, {
            x: () => -dist(),
            ease: "none",
            scrollTrigger: { trigger: pin, start: "center center", end: () => "+=" + dist(), pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1 },
          });
        });
      });

      $$("[data-vtimeline]").forEach((list) => {
        const fill = $(".vt-fill", list);
        if (fill) gsap.fromTo(fill, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: list, start: "top 65%", end: "bottom 65%", scrub: true } });
        $$("li", list).forEach((li) =>
          ScrollTrigger.create({ trigger: li, start: "top 66%", onEnter: () => li.classList.add("is-lit"), onLeaveBack: () => li.classList.remove("is-lit") }),
        );
      });

      $$("[data-tl]").forEach((tl) => {
        gsap.fromTo(tl, { "--p": 0 }, { "--p": 1, ease: "none", scrollTrigger: { trigger: tl, start: "top 65%", end: "bottom 65%", scrub: true } });
      });

      const groups = [
        ".logos-head > *", ".acc-item", ".cstage", ".tl-row", ".ab-card", ".ab-quote", ".ab-frame", ".val-card", ".team-row",
        ".index-list > li", ".bento-cell", ".steps-row > li", ".member", ".case-card", ".post-card:not(.post-featured)",
        ".tool-card, .tool-suggest", ".scope-cell", ".feat-list > li", ".snap-card", ".faq-item", ".alt-k", ".related-list > li", ".mc-list > div",
      ];
      groups.forEach((sel) => {
        const els = $$(sel);
        if (!els.length) return;
        gsap.set(els, { y: 48, opacity: 0 });
        ScrollTrigger.batch(els, {
          start: "top 90%",
          once: true,
          onEnter: (b) => gsap.to(b, { y: 0, opacity: 1, duration: 1.1, ease: "expo.out", stagger: 0.08, overwrite: true }),
        });
      });
    });
    const refresh = () => ScrollTrigger.refresh();
    const t = window.setTimeout(refresh, 400);
    on(window, "load", refresh);
    offs.push(() => {
      window.clearTimeout(t);
      ctx.revert();
    });
  }

  return () => offs.splice(0).forEach((f) => f());
}

/** Thin gold scroll-progress bar on top of the header (one per app, survives navigation). */
function useProgressBar() {
  useEffect(() => {
    const wrap = document.createElement("div");
    wrap.className = "sx-progress";
    wrap.setAttribute("aria-hidden", "true");
    wrap.innerHTML = '<div class="sx-progress-bar"></div>';
    document.body.appendChild(wrap);
    const bar = wrap.firstChild as HTMLElement;
    let ticking = false;
    const update = () => {
      ticking = false;
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.transform = `scaleX(${p.toFixed(4)})`;
    };
    const request = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    update();
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      wrap.remove();
    };
  }, []);
}

/** Navy wipe between pages: plays on internal link clicks, then hands over to the router. */
function usePageWipe() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const wipe = document.querySelector<HTMLElement>(".page-wipe");
    if (!wipe || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (wipe.classList.contains("go")) {
      wipe.classList.remove("go");
      wipe.classList.add("in");
    }
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.("a");
      if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const href = a.getAttribute("href") || "";
      if (a.target || a.hasAttribute("download") || !href.startsWith("/") || href.startsWith("//")) return;
      const [path] = href.split("#");
      if (path === window.location.pathname || path === "") return;
      e.preventDefault();
      e.stopPropagation();
      wipe.classList.remove("in");
      wipe.classList.add("go");
      window.setTimeout(() => router.push(href), 360);
    };
    // Capture phase so next/link does not navigate before the wipe has covered the page.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router, pathname]);
}

/** App-wide pieces that must survive navigation: scroll progress bar and page wipe (root layout). */
export function RuntimeChrome() {
  useProgressBar();
  usePageWipe();
  return null;
}

// React tags every node it has hydrated with a `__reactFiber$…` key; streamed page segments
// hydrate after the layout, so this is the only reliable "page is live" signal from here.
const isHydrated = (el: Element) => Object.keys(el).some((k) => k.startsWith("__reactFiber"));

/**
 * Per-page behaviour and motion. Waits until every top-level section of the page has
 * hydrated: GSAP's inline styles and the count-ups must never land on markup React
 * still has to match against the server HTML.
 */
export function Runtime() {
  const pathname = usePathname();
  useEffect(() => {
    let off: Off = () => {};
    let raf = 0;
    let tries = 0;
    const tick = () => {
      // Sections, not main's children: nested layouts (e.g. /en's <div lang>) hydrate before their page.
      const sections = Array.from(document.querySelectorAll("main section, main > :not(div)"));
      // ~5 s cap: never leave the page without its behaviour if the check misfires.
      if ((sections.length && sections.every(isHydrated)) || tries++ > 300) off = setup();
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      off();
    };
  }, [pathname]);
  return null;
}
