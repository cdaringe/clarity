import type { Meta, StoryObj } from "@storybook/react";

import { ArrowSvg } from "clarity-components";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof ArrowSvg> = {
  title: "Example/ArrowSvg",
  component: ArrowSvg,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      name: "variant",
      description: "variant",
      defaultValue: "empty",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ArrowSvg>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Empty: Story = {
  args: {
    variant: "empty",
  },
};

export const Full: Story = {
  args: {
    variant: "full",
  },
};
