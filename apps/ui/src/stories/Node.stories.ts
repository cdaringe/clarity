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
    inputs: {},
  },
};

export default meta;
type Story = StoryObj<typeof Node>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    type: "middleware",
    inputs: {
      external: [],
    },
  },
};

export const Const: Story = {
  args: {
    const: { value: 12345, type: "u32", id: "x" },
  },
};
