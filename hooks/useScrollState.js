"use client";

import { useEffect, useState } from "react";

export default function useScrollState(scroll) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!scroll) return;

    const onScroll = ({ scroll: position }) => {
      setIsScrolled(position.y > 50);
    };

    scroll.on("scroll", onScroll);

    return () => {
      scroll.off("scroll", onScroll);
    };
  }, [scroll]);

  return isScrolled;
}
