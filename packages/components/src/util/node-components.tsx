import { Node, NodeGroup } from "clarity-node";
import { FcDiv } from "./dom-components";

export type NodeComponent = FcDiv<Node<any>>;

export type NodeGroupProps = NodeGroup;

export type NodeGroupComponent = FcDiv<NodeGroupProps>;
