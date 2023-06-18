export interface ClarityInput<T = unknown> {
  name?: string;
  type: T;
  id: string;
}

export interface ClarityConstInput<T = any> extends ClarityInput<T> {
  value: T;
}

export type StandardNodeProps = {
  /**
   * unique id of the node
   */
  id: string;
  name: string;
  type: string;
  inputs?: {
    embedded?: ClarityInput[];
    external: ClarityInput[];
  };
  outputs?: ClarityInput[];
};

export type FcDiv<P> = React.FC<React.HTMLAttributes<HTMLDivElement> & P>;

export type ConstNodeProps<T extends any = any> = T extends infer U
  ? { id: string; const: ClarityConstInput<U> }
  : never;

export type NodeProps<Const = any> = StandardNodeProps | ConstNodeProps<Const>;

export type NodeComponent<Const = any> = FcDiv<NodeProps<Const>>;

export const getInputIds = (node: NodeProps): ClarityInput["id"][] => {
  if ("const" in node) {
    return [];
  }
  return node.inputs?.external.map((i) => i.id) || [];
};

export const getOutputs = (node: NodeProps): ClarityInput[] => {
  if ("const" in node) {
    return [node.const];
  }
  return node.outputs || [];
};
