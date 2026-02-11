"use client";

import Navbar from "@/components/navbar";
import useScrollState from "@/hooks/useScrollState";
import { useLocomotiveScroll } from "@/Provider/Locomotiveprovider";

export default function NavbarWrapper() {
  const scroll = useLocomotiveScroll();
  const isScrolled = useScrollState(scroll);

  return <Navbar isScrolled={isScrolled} />;
}
