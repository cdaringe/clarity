import { ProcessorName } from "./emulator/processor";

export interface NodeStandard<P extends ProcessorName> {
  /**
   * unique id of the node
   */
  id: string;
  inputIds?: string[];
  processorName: P;
}

export type NodeGroup = {
  id: string;
  nodes: Node[];
};
export type NodeConst<T = unknown> = {
  id: string;
  // kind: "const";
  value: T;
  type: string;
};
export type Node<T = unknown> = NodeStandard<any> | NodeConst | NodeGroup;

export const getInputIds = (node: Node<unknown>): string[] => {
  return ("inputIds" in node ? node.inputIds : null) || [];
};

export const getOutputsIds = (node: Node): string[] => {
  if ("processorName" in node) {
    return node.processorName[1];
  } else {
    return [node.id];
  }
};
