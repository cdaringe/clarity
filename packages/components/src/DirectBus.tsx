import React, { useRef } from "react";
import { SvgBounding } from "./SvgBounding";
import { useResponsiveLineCoords } from "./hooks/use-resonsive-line-coords";
type Props = {
  io: Record<string, string>;
};

const DirectLine: React.FC<{ from: string; to: string }> = ({ from, to }) => {
  const [children, setChildren] = React.useState<React.JSX.Element | null>(
    null
  );
  const startElRef = useRef<HTMLElement>();
  const endElRef = useRef<HTMLElement>();
  const coords = useResponsiveLineCoords(`#${from}`, `#${to}`);

  React.useLayoutEffect(() => {
    if (!coords) {
      return;
    }
    const { x1, y1, x2, y2, from: startEl, to: endEl } = coords;
    if (startElRef.current === startEl || endElRef.current === endEl) {
      return;
    }
    if (startEl && endEl) {
      startElRef.current = startEl;
      endElRef.current = endEl;
      const nextChildren = (
        <SvgBounding {...{ startEl, endEl }}>
          {({ top, left }) => (
            <line
              {...{
                x1: x1 + 5 - left,
                y1: y1 + 5 - top,
                x2: x2 + 5 - left,
                y2: y2 + 5 - top,
                stroke: "black",
                strokeWidth: 2,
                // strokeDasharray: `3,4`,
              }}
            />
          )}
        </SvgBounding>
      );
      setChildren(nextChildren);
    }
  }, [children, coords]);
  return children;
};
export const DirectBus: React.FC<Props> = (props) => {
  return (
    <>
      {Object.entries(props.io).map(([from, to]) => (
        <DirectLine key={`${from}_${to}`} to={to} from={from} />
      ))}
    </>
  );
};
