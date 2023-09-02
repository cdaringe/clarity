import type { Meta, StoryObj } from "@storybook/react";

import { Node } from "clarity-components";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Node> = {
  title: "Example/Node",
  component: Node,
  tags: ["autodocs"],
  argTypes: {
    type: {
      name: "type",
      description: "name of the abstract type of a node",
      defaultValue: "foo",
    },
    inputsIds: {},
  },
};

export default meta;
type Story = StoryObj<typeof Node>;

export const Const: Story = {
  args: {
    const: { value: 12345, type: "u32", id: "x" },
  },
};

export const Processor: Story = {
  args: {
    processor: "sum",
    id: "x",
  },
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Standard: Story = {
  args: {
    type: "middleware",
    inputsIds: ["i1", "i2", "i3"],
    outputs: [
      { id: "o1", type: "u8" },
      { id: "o2", type: "u8" },
    ],
  },
};

export const SumConst: Story = {
  args: {
    nodes: [
      { id: "node_id_1", const: { id: "value_uno", value: 1, type: "u8" } },
      { id: "node_id_2", const: { id: "value_dos", value: 2, type: "u8" } },
      {
        id: "node_sum",
        processor: "sum",
        name: "node_sum",
        type: "std::sum",
        inputsIds: ["value_uno", "value_dos"],
      },
    ],
  },
};
