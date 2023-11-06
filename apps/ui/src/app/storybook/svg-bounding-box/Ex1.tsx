"use client";
import { SvgBounding, useBoundingProps } from "./common";

export const Ex1: React.FC = () => {
  const { endRef, startRef, props } = useBoundingProps();
  return (
    <div style={{ padding: 200 }}>
      <span ref={startRef} id="start">
        start
      </span>
      <div style={{ height: 200, backgroundColor: "pink" }} />
      <span ref={endRef} id="end">
        end
      </span>
      {props ? <SvgBounding {...props} /> : null}
    </div>
  );
};
