"use client";

import {
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import { usePathname } from "next/navigation";
import "locomotive-scroll/dist/locomotive-scroll.css";

const ScrollContext = createContext(null);
export const useLocomotiveScroll = () => useContext(ScrollContext);

export default function LocomotiveProvider({ children }) {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const pathname = usePathname();

  const disableLocomotive =
    typeof pathname === "string" &&
    (
      pathname === "/" ||
      pathname === "/connect" ||
      pathname === "/blog" ||
      pathname.startsWith("/blog/")
    );

  // Init Locomotive AFTER DOM paint
  useEffect(() => {
    if (disableLocomotive) return;
    let mounted = true;

    const init = async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      if (!mounted || !containerRef.current) return;

      requestAnimationFrame(() => {
        const prefersReducedMotion =
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const isDesktop =
          typeof window !== "undefined" &&
          window.matchMedia("(min-width: 1024px)").matches;

        scrollRef.current = new LocomotiveScroll({
          el: containerRef.current,
          smooth: !prefersReducedMotion && isDesktop,
          smartphone: { smooth: false },
          tablet: { smooth: false },
        });

        scrollRef.current.update();
      });
    };

    init();

    return () => {
      mounted = false;
      scrollRef.current?.destroy();
      scrollRef.current = null;
    };
  }, [disableLocomotive]);

  // Route change update
  useEffect(() => {
    if (!scrollRef.current) return;
    const id = requestAnimationFrame(() => scrollRef.current?.update());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  if (disableLocomotive) {
    return (
      <ScrollContext.Provider value={scrollRef}>
        {children}
      </ScrollContext.Provider>
    );
  }

  return (
    <ScrollContext.Provider value={scrollRef}>
      <div data-scroll-container ref={containerRef}>
        <div data-scroll-section>
          {children}
        </div>
      </div>
    </ScrollContext.Provider>
  );
}
