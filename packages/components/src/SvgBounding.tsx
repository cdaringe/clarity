import React from "react";
import { createPortal } from "react-dom";
import { withRafDebounce } from "./util/with-raf-debounce";

export type Props = Omit<React.HTMLAttributes<SVGSVGElement>, "children"> & {
  startEl: HTMLElement;
  endEl: HTMLElement;
  children?: (_: { top: number; left: number }) => React.ReactNode;
};

export const SvgBounding = ({
  startEl,
  endEl,
  children,
  style,
  ...rest
}: Props) => {
  const [svg, setSvg] = React.useState<SVGSVGElement | null>(null);
  const [svgStyle, setSvgStyle] = React.useState<React.CSSProperties>({});
  const [topLeft, setTopLeft] = React.useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  React.useLayoutEffect(
    function createBounds() {
      if (svg && startEl && endEl) {
        const updateBounds = withRafDebounce(() => {
          const startRect = startEl.getBoundingClientRect();
          const endRect = endEl.getBoundingClientRect();
          const x1 = Math.min(startRect.left, endRect.left);
          const y1 = Math.min(startRect.top, endRect.top);
          const x2 = Math.max(startRect.right, endRect.right);
          const y2 = Math.max(startRect.bottom, endRect.bottom);
          setTopLeft({
            top: y1,
            left: x1,
          });
          setSvgStyle({
            width: `${x2 - x1}px`,
            height: `${y2 - y1}px`,
            position: "absolute",
            // border: "2px solid red",
            // zIndex: -1,
          });
        });

        updateBounds();
        window.addEventListener("resize", updateBounds);

        return () => window.removeEventListener("resize", updateBounds);
      }
    },
    [startEl, endEl, svg]
  );

  return createPortal(
    <svg
      style={{
        ...svgStyle,
        left: topLeft.left + "px",
        top: topLeft.top + "px",
        ...style,
      }}
      id={`bounder_${startEl.id || "start"}_${endEl.id || "end"}`}
      {...rest}
      ref={(node) => setSvg(node)}
      children={children ? children(topLeft) : null}
    />,
    document.body
  );
};
