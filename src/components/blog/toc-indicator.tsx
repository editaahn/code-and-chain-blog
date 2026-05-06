"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ListTree } from "lucide-react";

interface HeadingItem {
  id: string;
  text: string;
  depth: number;
}

const DEPTH_WIDTH: Record<number, number> = {
  1: 22,
  2: 18,
  3: 14,
  4: 11,
  5: 9,
  6: 7,
};

const OFFSET_TOP = 120;

interface TocIndicatorProps {
  label?: string;
}

export function TocIndicator({ label = "Contents" }: TocIndicatorProps) {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(
        "article .mdx-content h1[id], article .mdx-content h2[id], article .mdx-content h3[id], article .mdx-content h4[id], article .mdx-content h5[id], article .mdx-content h6[id]",
      ),
    );

    const parsed = elements
      .map((element) => ({
        id: element.id,
        text: element.textContent?.trim() ?? "",
        depth: Number(element.tagName.substring(1)),
      }))
      .filter((heading) => heading.id && heading.text && heading.depth <= 2);

    setHeadings(parsed);

    if (parsed.length === 0) {
      return;
    }

    const updateActiveHeading = () => {
      let currentActive = parsed[0].id;

      for (const heading of parsed) {
        const el = document.getElementById(heading.id);
        if (!el) continue;

        const top = el.getBoundingClientRect().top;
        if (top <= OFFSET_TOP) {
          currentActive = heading.id;
        } else {
          break;
        }
      }

      setActiveId(currentActive);
    };

    updateActiveHeading();

    const onScroll = () => {
      updateActiveHeading();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const hasHeadings = useMemo(() => headings.length > 0, [headings.length]);

  // on desktop (mouse) keep the hover behavior, on mobile (touch) disable the hover behavior
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateCanHover = () => setCanHover(mediaQuery.matches);

    updateCanHover();
    mediaQuery.addEventListener("change", updateCanHover);

    return () => {
      mediaQuery.removeEventListener("change", updateCanHover);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!containerRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  if (!hasHeadings) {
    return null;
  }

  const moveToHeading = (headingId: string) => {
    const target = document.getElementById(headingId);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${headingId}`);
    setIsOpen(false);
  };

  return (
    <aside
      ref={containerRef}
      className="fixed bottom-6 right-2 z-40 md:bottom-auto md:right-4 md:top-1/2 md:-translate-y-1/2"
      onMouseEnter={() => {
        if (canHover) setIsOpen(true);
      }}
      onMouseLeave={() => {
        if (canHover) setIsOpen(false);
      }}
      aria-label="Table of contents indicator"
    >
      <div className="relative flex items-center justify-end">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex rounded-md border border-border/60 bg-background/90 p-2 shadow-sm backdrop-blur-sm md:hidden"
          aria-label={label}
          aria-expanded={isOpen}
        >
          <ListTree className="h-4 w-4 text-muted-foreground" />
        </button>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="hidden rounded-md bg-background/90 px-2 py-2 shadow-sm backdrop-blur-sm md:inline-flex"
          aria-label={label}
          aria-expanded={isOpen}
        >
          <ul className="flex flex-col gap-2">
            {headings.map((heading) => (
              <li key={heading.id} className="flex justify-end">
                <span
                  className={`block h-[3px] rounded-full transition-colors ${
                    heading.id === activeId
                      ? "bg-primary"
                      : "bg-muted-foreground/35"
                  }`}
                  style={{
                    width: `${DEPTH_WIDTH[heading.depth] ?? DEPTH_WIDTH[6]}px`,
                  }}
                />
              </li>
            ))}
          </ul>
        </button>

        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-72 max-w-[calc(100vw-1rem)] rounded-xl border border-border bg-background/95 p-3 shadow-xl backdrop-blur-sm md:bottom-auto md:top-0 md:mb-0 md:max-w-[calc(100vw-3rem)]">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <ul className="max-h-[min(22rem,calc(100vh-9rem))] space-y-1 overflow-y-auto pr-1 md:max-h-80">
              {headings.map((heading) => (
                <li key={`toc-${heading.id}`}>
                  <button
                    type="button"
                    onClick={() => moveToHeading(heading.id)}
                    className={`w-full truncate rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted ${
                      heading.id === activeId
                        ? "font-medium text-primary"
                        : "text-muted-foreground"
                    }`}
                    style={{
                      paddingLeft: `${0.5 + (heading.depth - 1) * 0.55}rem`,
                    }}
                  >
                    {heading.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}
