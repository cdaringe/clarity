import React from "react";
import {
  ConstNodeProps,
  FcDiv,
  NodeComponent,
  NodeProps,
  StandardNodeProps,
} from "../../node/mod";
import { ArrowSvg } from "./icon/ArrowSvg";

export const getNodeInputElementId = (id: string, inputId: string) =>
  `input_${id}_${inputId}`;

export const getNodeOutputElementId = (id: string, outputId: string) =>
  `output_${id}_${outputId}`;

export const Node: NodeComponent = (props) =>
  "const" in props ? (
    <ConstNode {...props} />
  ) : "nodes" in props ? (
    <NodeGroup {...props} />
  ) : (
    <StandardNode {...props} />
  );

const IO_WIDTH = 10;
const IO_MIDPOINT = IO_WIDTH / 2;

export const ConstNode: FcDiv<ConstNodeProps> = ({
  id,
  const: constt,
  style,
  ...rest
}) => (
  <div
    id={id}
    style={{ ...style, display: "inline-block", width: "min-content" }}
    {...rest}
  >
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
      <svg
        viewBox="0 0 10 10"
        id={getNodeOutputElementId(id, constt.id)}
        width={10}
        height={10}
      >
        <circle cx={5} cy={5} r={5} fill="black" />
      </svg>
    </div>
  </div>
);

export const StandardNode: FcDiv<StandardNodeProps> = ({
  id,
  children,
  name = "-",
  type,
  inputsIds: inputs = [],
  outputs = [],
  processor,
  ...rest
}) => {
  return (
    <div id={id} style={{ display: "flex", flexDirection: "column" }} {...rest}>
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
          {inputs.length ? (
            inputs.map((input_id) => (
              <ArrowSvg
                style={{ marginRight: 2 }}
                id={getNodeInputElementId(id, input_id)}
                key={input_id}
                variant="full"
              />
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
        {processor}
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
          {outputs.length ? (
            outputs.map((output, i) => (
              <ArrowSvg
                style={{ marginRight: 2 }}
                id={getNodeOutputElementId(id, output.id)}
                key={i}
                variant="full"
              />
            ))
          ) : (
            <ArrowSvg />
          )}
        </div>
      </div>
    </div>
  );
};

import { groupBy } from "lodash";
import { intersect } from "set-fns";
import { NodeGroupProps, getOutputs } from "../../node/mod";
import { DirectBus } from "./DirectBus";

export const NodeGroup: FcDiv<NodeGroupProps> = ({
  nodes,
  io = {},
  ...rest
}) => {
  let prevNodeProps: NodeProps[] = [];
  const children = React.useMemo(
    () =>
      nodes.map((node, i) => {
        const inputIds = new Set("inputs" in node ? node.inputsIds : []);
        const prev = nodes[i - 1];
        prev && prevNodeProps.push(prev);
        const directIo = prevNodeProps
          ? prevNodeProps.reduce((acc, outNode) => {
              const outputIds = getOutputs(outNode).map((o) => o.id);
              const [inputId, ...rest] = [...intersect(outputIds, inputIds)];
              if (inputId) {
                if (!("id" in outNode)) {
                  throw new Error(`id not found in ${outNode}`);
                }
                if (!("id" in node)) {
                  throw new Error(`id not found in ${node}`);
                }
                acc[getNodeOutputElementId(outNode.id, inputId)] =
                  getNodeInputElementId(node.id, inputId);
              }
              return acc;
            }, {} as Record</*from*/ string, /*to*/ string>)
          : null;
        const typ =
          "const" in node ? ("const" as const) : ("standard" as const);
        return {
          type: typ,
          element: (
            <React.Fragment key={i}>
              {directIo ? <DirectBus io={directIo} /> : null}
              <Node
                style={typ === "const" ? { marginRight: 4 } : {}}
                {...node}
              />
            </React.Fragment>
          ),
        };
      }),
    [nodes]
  );
  const nodesByType = groupBy(children, "type");
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row" }} {...rest}>
        {nodesByType.const?.map((n) => n.element)}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }} {...rest}>
        {nodesByType.standard?.map((n) => n.element)}
      </div>
    </div>
  );
};
