"use client";
import { SvgBounding, useBoundingProps } from "./common";

export const Ex2: React.FC = () => {
  const { endRef, startRef, props } = useBoundingProps();
  return (
    <div style={{ padding: 200, minWidth: 500 }}>
      <span ref={endRef} style={{ float: "right" }} id="end">
        end
      </span>
      <div style={{ height: 200, backgroundColor: "pink" }} />
      {props ? (
        <SvgBounding {...{ ...props, style: { border: "2px solid red" } }} />
      ) : null}
      <span ref={startRef} id="start">
        start
      </span>
    </div>
  );
};
