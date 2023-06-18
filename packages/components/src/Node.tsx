import React from "react";
import { ArrowSvg } from "./icon/ArrowSvg";
import {
  NodeComponent,
  StandardNodeProps,
  FcDiv,
  ClarityConstInput,
  ConstNodeProps,
} from "../../node/mod";

export const Node: NodeComponent = (props) =>
  "const" in props ? <ConstNode {...props} /> : <StandardNode {...props} />;

const IO_WIDTH = 10;
const IO_MIDPOINT = IO_WIDTH / 2;

export const ConstNode: FcDiv<ConstNodeProps> = ({
  id,
  const: constt,
  style,
  ...rest
}) => (
  <div id={id} style={{ width: "min-content" }} {...rest}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        ...style,
      }}
    >
      <div
        style={{
          borderBottom: "1px black solid",
          borderTop: "1px black solid",
          height: 4,
          minWidth: IO_WIDTH,
          marginRight: 2,
        }}
      ></div>
      <div>{String(constt.value)}</div>
    </div>
    <div style={{ display: "flex", justifyContent: "center" }}>
      <svg viewBox="0 0 10 10" id={`${id}_o1`} width={10} height={10}>
        <circle cx={5} cy={5} r={5} fill="black" />
      </svg>
    </div>
  </div>
);

export const StandardNode: FcDiv<StandardNodeProps> = ({
  name = "-",
  type,
  inputs,
  id,
  ...rest
}) => {
  const { embedded = [], external = [] } = inputs ?? {};
  return (
    <div id={id} style={{ display: "flex", flexDirection: "column" }} {...rest}>
      <div
        style={{
          borderBottom: "1px black solid",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          {external.length ? (
            external.map((ex) => (
              <ArrowSvg id={ex.id} key={ex.id} variant="full" />
            ))
          ) : (
            <ArrowSvg />
          )}
        </div>
        <div>
          <span style={{ marginRight: 4 }}>{name}</span>
          <span>({type})</span>
        </div>
      </div>
      <div
        style={{
          minHeight: 10,
          width: "100%",
          borderLeft: "1px rgba(0,0,0, 0.2) solid",
          borderRight: "1px rgba(0,0,0, 0.2) solid",
          borderBottom: "1px rgba(0,0,0, 0.2) solid",
        }}
      ></div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <ArrowSvg />
        <div>
          <ArrowSvg />
        </div>
      </div>
    </div>
  );
};
