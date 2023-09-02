import type { Meta, StoryObj } from "@storybook/react";
import {
  SvgBounding as Component,
  Props,
  useResponsiveLineCoords,
} from "clarity-components";
import React from "react";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Component> = {
  title: "Example/SvgBounding",
  // component: Component,
  // tags: ["autodocs"],
  // argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

const useBoundingProps = <T extends HTMLElement>() => {
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

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Basic = () => {
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
      {props ? <Component {...props} /> : null}
    </div>
  );
};

export const EndBeforeStart = () => {
  const { endRef, startRef, props } = useBoundingProps();
  return (
    <div style={{ padding: 200, minWidth: 500 }}>
      <span ref={endRef} style={{ float: "right" }} id="end">
        end
      </span>
      <div style={{ height: 200, backgroundColor: "pink" }} />
      {props ? (
        <Component {...{ ...props, style: { border: "2px solid red" } }} />
      ) : null}
      <span ref={startRef} id="start">
        start
      </span>
    </div>
  );
};

export const WithLine = () => {
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
        <Component {...props}>
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
        </Component>
      ) : null}
      <div ref={startRef} id="start" style={{ padding: 4 }}>
        <svg id="start_dot" viewBox="0 0 10 10" width={10} height={10}>
          <circle cx={5} cy={5} r="5" fill="rgba(20,20,20,.2)"></circle>
        </svg>
      </div>
    </div>
  );
};
