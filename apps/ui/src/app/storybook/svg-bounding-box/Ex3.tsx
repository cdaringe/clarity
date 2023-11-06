"use client";
import {
  SvgBounding,
  useBoundingProps,
  useResponsiveLineCoords,
} from "./common";

export const Ex3: React.FC = () => {
  const { endRef, startRef, props } = useBoundingProps<HTMLDivElement>();
  const coords = useResponsiveLineCoords("#start_dot", "#end_dot");
  const r = 5;
  return (
    <div style={{ padding: 200, minWidth: 500 }}>
      <div
        ref={endRef}
        style={{
          float: "right",
          // padding: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        id="end"
      >
        <svg id="end_dot" viewBox="0 0 10 10" width={10} height={10}>
          <circle cx={5} cy={5} r={r} fill="rgba(20,20,20,.2)"></circle>
        </svg>
      </div>
      <div style={{ height: 200, backgroundColor: "rgba(10,10,10,0.1)" }} />
      {props ? (
        <SvgBounding {...props}>
          {({ top, left }) => {
            if (!coords) {
              return null;
            }
            const { x1, y1, x2, y2 } = coords;
            return (
              <line
                {...{
                  x1: x1 + r - left,
                  y1: y1 + r - top,
                  x2: x2 + r - left,
                  y2: y2 + r - top,
                  stroke: "black",
                  strokeWidth: 3,
                  strokeDasharray: `3,4`,
                }}
              />
            );
          }}
        </SvgBounding>
      ) : null}
      <div ref={startRef} id="start" style={{ padding: 4 }}>
        <svg id="start_dot" viewBox="0 0 10 10" width={10} height={10}>
          <circle cx={5} cy={5} r="5" fill="rgba(20,20,20,.2)"></circle>
        </svg>
      </div>
    </div>
  );
};
