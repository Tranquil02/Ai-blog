"use client";

import { useEffect } from "react";

export default function NavObserver() {
  useEffect(() => {
    const sentinel = document.getElementById("nav-sentinel");
    const navbar = document.querySelector(".navbar");

    if (!sentinel || !navbar) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        navbar.classList.toggle("navbar--scrolled", !entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  return null;
}
