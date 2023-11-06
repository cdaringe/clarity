import React from "react";
import { ArrowSvg } from "./icon/ArrowSvg";
import { FcDiv } from "./util/dom-components";

type NodeGenericProps =
  | {
      kind: "standard";
      node: NodeStandardProps;
    }
  | {
      kind: "const";
      node: NodeConstProps;
    }
  | { kind: "group"; node: NodeGenericProps[] };

export const Node: FcDiv<NodeGenericProps> = ({ kind, node, ...rest }) =>
  "const" === kind ? (
    <ConstNode {...node} {...rest} />
  ) : kind === "group" ? (
    <>
      {node.map((child, i) => (
        <Node key={`${i}_${node.length}`} {...child} />
      ))}
    </>
  ) : (
    <StandardNode {...node} {...rest} />
  );

const IO_WIDTH = 10;
const IO_MIDPOINT = IO_WIDTH / 2;

export type NodeConstProps = {
  displayValue: string;
};

export const ConstNode: FcDiv<NodeConstProps> = ({
  // const props
  displayValue,

  // div props
  id,
  style,
  ...rest
}) => (
  <div
    style={{ display: "inline-block", width: "min-content", ...style }}
    {...rest}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
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
      <div>{displayValue}</div>
    </div>
    <div style={{ display: "flex", justifyContent: "center" }}>
      <svg viewBox="0 0 10 10" width={10} height={10}>
        <circle cx={5} cy={5} r={5} fill="black" />
      </svg>
    </div>
  </div>
);

export interface NodeStandardProps {
  name?: string;
  inputs?: React.ReactNode[];
  outputs?: React.ReactNode[];
}

export const StandardNode: FcDiv<NodeStandardProps> = (props) => {
  const {
    // node
    name,
    inputs,
    outputs,

    // react
    children,

    // dom
    style,
    ...restDomProps
  } = props;
  return (
    <div
      style={{ display: "flex", flexDirection: "column", ...style }}
      {...restDomProps}
    >
      {/* INPUTS */}
      <div
        style={{
          borderBottom: "1px black solid",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div style={{ display: "flex" }}>
          {inputs?.map((___, input_id) => (
            <ArrowSvg
              style={{ marginRight: 2 }}
              key={input_id}
              variant="full"
            />
          )) ?? null}
        </div>
        <div>
          {name && <span style={{ marginRight: 4 }}>{name}</span>}
          {/* <span>({processor[1]!.map((x) => x.type).join(", ")})</span> */}
        </div>
      </div>

      {/* GUTS */}
      <div
        style={{
          padding: 8,
          minHeight: 10,
          width: "100%",
          borderLeft: "1px rgba(0,0,0, 0.2) solid",
          borderRight: "1px rgba(0,0,0, 0.2) solid",
          borderBottom: "1px rgba(0,0,0, 0.2) solid",
        }}
      >
        {/* {embedded.map((embed) => {
          const key = `${id}_${embed.id}`;
          return <Node {...{ id: key, key, const: embed }} />;
        })}
        {embedded.length ? <br /> : null} */}
        {children}
        {name}
      </div>

      {/* OUTPUTS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div style={{ display: "flex" }}>
          {outputs?.map((____, i) => (
            <ArrowSvg style={{ marginRight: 2 }} key={i} variant="full" />
          )) ?? null}
        </div>
      </div>
    </div>
  );
};
