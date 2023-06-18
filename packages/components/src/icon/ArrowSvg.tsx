import React from "react";

export const ArrowSvg = ({
  l = 15,
  width: _,
  height: __,
  variant = "empty",
  stroke,
  strokeWidth = "1",
  strokeDasharray,
  fill,
  ...rest
}: React.SVGProps<SVGSVGElement> & {
  l?: number;
  variant?: "empty" | "full";
}) => {
  const strokeW = parseInt(`${strokeWidth}`, 10);
  const y = l * Math.cos(Math.PI * (30 / 180));
  const w = l + strokeW;
  const h = y + strokeW;
  const p1 = [0, 0];
  const p2 = [l, 0];
  const p3 = [l / 2, y];
  const d = `M ${p1[0]},${p1[1]}
L ${p2[0]},${p2[1]}
L ${p3[0]},${p3[1]}
L ${p1[0]},${p1[1]}`;
  const variantProps =
    variant === "full"
      ? { fill: fill || "black", stroke: stroke || "black", strokeDasharray }
      : {
          fill: fill || "none",
          stroke: stroke || "rgba(0,0,0, 0.4)",
          strokeDasharray: strokeDasharray || "3 1",
        };

  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      height={h}
      width={w}
      {...rest}
    >
      <g transform={`translate(${strokeW / 2} ${strokeW / 2})`}>
        <path d={d} {...variantProps} />
      </g>
    </svg>
  );
};
