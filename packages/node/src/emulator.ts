/**
 * @usage node -r ts-node/register packages/node/src/emulator.ts
 */
import { Node, NodeConst, NodeGroup, NodeStandard, getInputIds } from "./index";
import { std } from "./std/std";

// @warn really dumb not real version of a clarity.System or clarity.Context (name tbd)
const context = {
  nodesById: {} as Record<string, Node>,
};

const hydrateCtx = <N extends Node>(node: N, ctx: typeof context) => {
  // console.log(`hydrating node id: ${node.id}`);
  if (ctx.nodesById[node.id]) {
    return;
  }
  ctx.nodesById[node.id] = node;
  if ("nodes" in node) {
    node.nodes.forEach((n) => hydrateCtx(n, ctx));
  }
};

export const process = <T, N extends Node>(
  node: N,
  handlers: {
    standard: (_: NodeStandard<"std/num/sum">) => T;
    const: (_: NodeConst) => T;
    group: (_: NodeGroup) => T;
  }
) => {
  if ("value" in node) {
    return handlers.const(node);
  } else if ("nodes" in node) {
    return handlers.group(node);
  } else {
    return handlers.standard(node);
  }
};

export function run<N extends Node>(node: N, ctx: typeof context): unknown {
  hydrateCtx(node, ctx);
  // maybe lazily hydrate the system, create an observable for this node
  return process(node, {
    const: (n) => n.value,
    standard: (n) => {
      const __ = getInputIds(n);
      // @warn this is total psuedo code. really, context should probably have _observables_ in it
      const inputValues = getInputIds(n).map((id) => {
        const inputNode = context.nodesById[id];
        if (!inputNode) {
          throw new Error(`missing input node for id ${id}`);
        }
        return run(inputNode, ctx);
      });
      // console.log(n);
      if (n.processorName.startsWith("std")) {
        const fn = std[n.processorName];
        if (!fn) {
          throw new Error(`std function not found: ${n.processorName}`);
        }
        return (fn as any)(...(inputValues as any[]));
      } else {
        throw new Error("!unimplemented");
      }
    },
    group: (n) => {
      const lastNode = n.nodes[n.nodes.length - 1];
      if (!lastNode) {
        throw new Error(`empty node group`);
      }
      return run(lastNode, ctx);
    },
  });
}

const node: Node = {
  id: "p1",
  nodes: [
    {
      id: "a",
      nodes: [
        { id: "c2", value: 2, type: "int" },
        { id: "c3", value: 3, type: "int" },
        {
          id: "summer",
          inputIds: ["c2", "c3"],
          processorName: "std/num/sum",
        },
      ],
    },
    { id: "c5", value: 5, type: "int" },
    {
      id: "subby",
      inputIds: ["a", "c5"],
      processorName: "std/num/mul",
    },
  ],
};

const summed = run(node, context);
console.log(summed);
