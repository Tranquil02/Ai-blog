"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";

export default function NavbarWrapper() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <Navbar isScrolled={isScrolled} />;
}
