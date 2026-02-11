"use client";

import { useEffect } from "react";


export default function SectionReveal({
  children,
  delay = 0,
  className = "",
}) {
  useEffect(() => {
    // Avoid forcing global updates on every reveal mount
    return () => {};
  }, []);

  return (
    <div
      data-scroll
      data-scroll-class="is-visible"
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal-up ${className}`}
    >
      {children}
    </div>
  );
}
