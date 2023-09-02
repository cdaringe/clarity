import type { FCC } from "clarity-react";

export type ClarityInput<T = unknown> =
  | ClarityConstInput<T>
  | ClarityStandardInput<T>;

export interface ClarityStandardInput<T = unknown> {
  name?: string;
  type: T;
  id: string;
}

export interface ClarityConstInput<T = any> extends ClarityStandardInput<T> {
  value: T;
}

export type StandardNodeProps = {
  /**
   * unique id of the node
   */
  id: string;
  name: string;
  type: string;
  inputsIds?: string[]; // ClarityStandardInput[]; // {
  // embedded?: ClarityConstInput[];
  // external: ClarityStandardInput[];
  // };
  outputs?: ClarityStandardInput[];
  processor?: string;
};

export type FcDiv<P> = FCC<React.HTMLAttributes<HTMLDivElement> & P>;

export type ConstNodeProps<T extends any = any> = T extends infer U
  ? { id: string; const: ClarityConstInput<U> }
  : never;

export type NodeProps<Const = any> =
  | StandardNodeProps
  | ConstNodeProps<Const>
  | NodeGroupProps;

export type NodeGroupProps = {
  nodes: NodeProps[];
  io?: Record<IOid, Set<IOid>>;
};

type IOid = string;

export type NodeComponent = FcDiv<NodeProps<any>>;

export const getOutputs = (node: NodeProps): ClarityInput[] => {
  if ("outputs" in node) {
    return node.outputs || [];
  }
  if ("const" in node) {
    return [node.const];
  }
  return [];
};
