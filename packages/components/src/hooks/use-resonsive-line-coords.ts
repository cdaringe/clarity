import React from "react";
import { withRafDebounce } from "../util/with-raf-debounce";

export const useResponsiveLineCoords = (from: string, to: string) => {
  const [coords, setLineCoords] = React.useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    from: HTMLElement;
    to: HTMLElement;
  }>();
  React.useEffect(() => {
    const fn = withRafDebounce(() => {
      const fromEl = document.querySelector(from);
      const toEl = document.querySelector(to);
      if (fromEl && toEl) {
        const { left: x1, top: y1 } = fromEl.getBoundingClientRect();
        const { left: x2, top: y2 } = toEl.getBoundingClientRect();
        setLineCoords({
          x1,
          y1,
          x2,
          y2,
          from: fromEl as HTMLElement,
          to: toEl as HTMLElement,
        });
      }
    });
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, [from, to]);
  return coords;
};
