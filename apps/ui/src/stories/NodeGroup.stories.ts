import type { Meta, StoryObj } from "@storybook/react";

import { NodeGroup as Component } from "clarity-components";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Component> = {
  title: "Example/NodeGroup",
  component: Component,
  tags: ["autodocs"],
  argTypes: {
    nodes: {
      name: "nodes",
      description: "",
      defaultValue: [],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    nodes: [
      { name: "foo", type: "foo" },
      { name: "bar", type: "bar" },
    ],
  },
};

export const BasicDirectIo: Story = {
  args: {
    io: {
      n1_o1: new Set(["n2_i1"]),
    },
    nodes: [
      { const: { value: 5, type: "u8", id: "n1_o1" }, id: "n1" },
      {
        id: "n2",
        name: "plus2",
        type: "whatever,man",
        inputs: {
          external: [
            {
              id: "n2_i1",
              type: "u8",
            },
          ],
        },
      },
    ],
  },
};
