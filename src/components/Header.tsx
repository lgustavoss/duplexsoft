"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { siteConfig } from "@/lib/site";

const EDGE_PX = 28;
const OPEN_RATIO = 0.28;

export function Header() {
  const pathname = usePathname();
  const onContato = pathname === "/contato";
  const [open, setOpen] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const panelId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const mode = useRef<"idle" | "open" | "close">("idle");
  const widthRef = useRef(360);
  const openRef = useRef(open);
  openRef.current = open;

  const close = useCallback((restoreFocus = true) => {
    const wasOpen = openRef.current;
    setOpen(false);
    setDragX(0);
    setDragging(false);
    mode.current = "idle";
    if (restoreFocus && wasOpen) {
      queueMicrotask(() => menuButtonRef.current?.focus());
    }
  }, []);

  const openMenu = useCallback(() => {
    widthRef.current = typeof window !== "undefined" ? window.innerWidth : 360;
    setOpen(true);
    setDragX(0);
  }, []);

  useEffect(() => {
    close(false);
  }, [pathname, close]);

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const inertTargets = Array.from(
      document.querySelectorAll<HTMLElement>("main, footer, [data-site-chrome='header-bar']"),
    );
    inertTargets.forEach((node) => node.setAttribute("inert", ""));

    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previous;
      inertTargets.forEach((node) => node.removeAttribute("inert"));
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const onPanelKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab" || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const onTouchStart = (event: ReactTouchEvent, nextMode: "open" | "close") => {
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches) {
      return;
    }
    const touch = event.touches[0];
    if (!touch) return;
    if (nextMode === "open" && touch.clientX > EDGE_PX) return;

    mode.current = nextMode;
    startX.current = touch.clientX;
    startY.current = touch.clientY;
    widthRef.current = window.innerWidth;
    setDragging(true);
  };

  const onTouchMove = (event: ReactTouchEvent) => {
    if (mode.current === "idle" || !dragging) return;
    const touch = event.touches[0];
    if (!touch) return;

    const dx = touch.clientX - startX.current;
    const dy = touch.clientY - startY.current;
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 12) {
      mode.current = "idle";
      setDragging(false);
      setDragX(0);
      return;
    }

    const width = widthRef.current;
    if (mode.current === "open") {
      setDragX(Math.max(0, Math.min(width, dx)));
    } else {
      setDragX(Math.max(-width, Math.min(0, dx)));
    }
  };

  const onTouchEnd = () => {
    if (mode.current === "idle") {
      setDragging(false);
      setDragX(0);
      return;
    }

    const width = widthRef.current;
    const threshold = width * OPEN_RATIO;

    if (mode.current === "open") {
      if (dragX >= threshold) setOpen(true);
      setDragX(0);
    } else if (mode.current === "close") {
      if (Math.abs(dragX) >= threshold) close();
      else setDragX(0);
    }

    mode.current = "idle";
    setDragging(false);
  };

  const panelOffset = (() => {
    if (dragging && mode.current === "open") return dragX - widthRef.current;
    if (dragging && mode.current === "close") return dragX;
    return open ? 0 : -10000;
  })();

  const backdropOpacity = (() => {
    if (dragging && mode.current === "open") {
      return Math.min(0.45, (dragX / widthRef.current) * 0.45);
    }
    if (dragging && mode.current === "close") {
      return Math.max(0, 0.45 * (1 + dragX / widthRef.current));
    }
    return open ? 0.45 : 0;
  })();

  const panelVisible = open || dragging;

  return (
    <>
      <header
        data-site-chrome="header-bar"
        className="sticky top-0 z-40 border-b border-line bg-[color-mix(in_srgb,var(--background)_90%,transparent)] backdrop-blur-md"
      >
        <div className="site-shell flex h-16 items-center justify-between gap-3 md:h-[4.25rem] md:gap-4">
          <Link href="/" aria-label="DuplexSoft — início" className="shrink-0">
            <BrandLogo size="md" />
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Principal">
            {siteConfig.nav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm transition ${
                    active
                      ? "font-semibold text-brand-deep underline decoration-brand decoration-2 underline-offset-8"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            {!onContato ? (
              <Link href="/contato" className="btn-primary">
                Falar conosco
              </Link>
            ) : null}
            <a
              href={siteConfig.appUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Entrar no DX Web (abre em nova aba)"
              title="Abrir o aplicativo DX Web (clientes)"
              className="inline-flex min-h-11 items-center text-xs font-medium text-muted underline-offset-4 transition hover:text-brand-deep hover:underline"
            >
              Entrar no DX Web
            </a>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            {!onContato ? (
              <Link href="/contato" className="btn-primary h-10 px-3 text-sm">
                Falar conosco
              </Link>
            ) : null}
            <button
              ref={menuButtonRef}
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line"
              aria-expanded={open}
              aria-controls={panelId}
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              onClick={() => (open ? close(true) : openMenu())}
            >
              <span className="relative flex h-4 w-5 flex-col justify-between">
                <span
                  className={`h-0.5 w-full origin-center bg-foreground transition ${
                    open ? "translate-y-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`h-0.5 w-full bg-foreground transition ${open ? "opacity-0" : ""}`}
                />
                <span
                  className={`h-0.5 w-full origin-center bg-foreground transition ${
                    open ? "-translate-y-[7px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        className="fixed inset-y-0 left-0 z-40 w-7 touch-none md:hidden"
        aria-hidden="true"
        onTouchStart={(event) => onTouchStart(event, "open")}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      />

      {panelVisible ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            className="absolute inset-0 bg-ink transition-opacity duration-300 ease-out"
            style={{
              opacity: backdropOpacity,
              transitionProperty: dragging ? "none" : "opacity",
            }}
            onClick={() => close()}
          />

          <nav
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label="Menu principal"
            className="mobile-nav-panel absolute inset-0 flex w-full flex-col bg-surface"
            style={{
              transform: `translate3d(${panelOffset}px,0,0)`,
              transition: dragging ? "none" : "transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onKeyDown={onPanelKeyDown}
            onTouchStart={(event) => onTouchStart(event, "close")}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchEnd}
          >
            <div className="flex h-16 items-center justify-between border-b border-line px-4">
              <BrandLogo size="md" />
              <button
                ref={closeButtonRef}
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line"
                aria-label="Fechar menu"
                onClick={() => close(true)}
              >
                <svg
                  className="h-5 w-5 text-brand-deep"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 5l10 10M15 5L5 15"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6">
              {siteConfig.nav.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`display-font rounded-xl px-4 py-4 text-2xl font-semibold transition ${
                      active
                        ? "bg-surface-soft text-brand"
                        : "text-brand-deep active:bg-surface-soft"
                    }`}
                    onClick={() => close(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
              {!onContato ? (
                <Link
                  href="/contato"
                  className="btn-primary mt-6 w-full py-4 text-base"
                  onClick={() => close(false)}
                >
                  Falar conosco
                </Link>
              ) : null}
              <a
                href={siteConfig.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Entrar no DX Web (abre em nova aba)"
                title="Abrir o aplicativo DX Web"
                className={`inline-flex min-h-11 items-center px-4 text-sm font-medium text-muted underline-offset-4 hover:underline ${
                  onContato ? "mt-6" : "mt-3"
                }`}
                onClick={() => close()}
              >
                Entrar no DX Web
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
