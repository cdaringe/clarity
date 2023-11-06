import { Props } from "clarity-components";
import React from "react";
export { SvgBounding, useResponsiveLineCoords } from "clarity-components";

export const useBoundingProps = <T extends HTMLElement>() => {
  const startRef = React.useRef<T>(null);
  const endRef = React.useRef<T>(null);
  const [props, setProps] = React.useState<Props | null>(null);
  React.useEffect(() => {
    const startEl = startRef.current;
    const endEl = endRef.current;
    if (startEl && endEl) {
      setProps({ startEl, endEl });
    }
  }, [startRef.current, endRef.current]);
  return { startRef, endRef, props };
};
