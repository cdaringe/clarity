import React from "react";
import { Node } from "./Node";
import { NodeProps, getInputIds, getOutputs } from "../../node/mod";
import { intersect } from "set-fns";
import { DirectBus } from "./DirectBus";

type IOid = string;

export const NodeGroup: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    nodes: NodeProps[];
    io: Record<IOid, Set<IOid>>;
  }
> = ({ nodes, io, ...rest }) => {
  const children = React.useMemo(
    () =>
      nodes.map((node, i) => {
        const inputIds = new Set(getInputIds(node));
        const prev = nodes[i - 1];
        const prevOutputs = prev ? getOutputs(prev) : null;
        // get outputs from prev
        // check which outputs from prev map directly to inputIds in node
        const directIo = prevOutputs
          ? prevOutputs.reduce((acc, out) => {
              const outIntoIds = io[out.id];
              const [inputId, ...rest] = [...intersect(outIntoIds, inputIds)];
              if (inputId) {
                acc[out.id] = inputId;
              }
              if (rest.length) {
                throw new Error(`impossible case`);
              }
              return acc;
            }, {} as Record</*from*/ string, /*to*/ string>)
          : null;
        return (
          <React.Fragment key={i}>
            {directIo ? <DirectBus io={directIo} /> : null}
            <Node {...node} />
          </React.Fragment>
        );
      }),
    [nodes]
  );
  return (
    <div style={{ display: "flex", flexDirection: "column" }} {...rest}>
      {children}
    </div>
  );
};
