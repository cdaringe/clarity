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
      { id: "a", name: "foo", type: "foo" },
      { id: "b", name: "bar", type: "bar" },
    ],
  },
};

export const BasicDirectIo: Story = {
  args: {
    io: {
      n1_o1: new Set(["n3_i1"]),
    },
    nodes: [
      { const: { value: 9, type: "u8", id: "n2_o1" }, id: "n2" },
      { const: { value: 5, type: "u8", id: "n1_o1" }, id: "n1" },
      {
        id: "n3",
        io: {},
        nodes: [
          {
            id: "n4",
            name: "plus2",
            type: "whatever,man",
            inputs: {
              embeddedIds: ["n3_i0", "n3_i1"],
              externalIds: ["g1_p_sum"],
            },
            // {
            //   embedded: [{ value: 2, type: "u8", id: "n3_i0" }],
            //   external: [
            //     {
            //       id: "n3_i1",
            //       type: "u8",
            //     },
            //   ],
            // },
            // },
            // {
            //   id: "g1_p_sum",
            //   processor: "sum",
            // },
          },
        ],
      },
    ],
  },
};
