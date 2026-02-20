"use client";

import { useEffect, useState } from "react";

export default function useScrollState(scroll) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const instance = scroll?.current ?? scroll;
    if (!instance || typeof instance.on !== "function") return;

    const onScroll = ({ scroll: position }) => {
      setIsScrolled(position.y > 50);
    };

    instance.on("scroll", onScroll);

    return () => {
      if (typeof instance.off === "function") {
        instance.off("scroll", onScroll);
      }
    };
  }, [scroll]);

  return isScrolled;
}
