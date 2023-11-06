/* eslint-disable react/no-children-prop */
import { Node } from "clarity-components";
import { NextPage } from "next";
import { StoriesContainer } from "../../../components/Stories";

const Page: NextPage = () => (
  <StoriesContainer
    children={[
      {
        name: "const",
        el: () => <Node kind="const" node={{ displayValue: "123" }} />,
      },
      {
        name: "standard",
        el: () => (
          <Node
            {...{
              kind: "standard",
              node: {
                name: "My Node",
                inputs: ["i1", "i2", "i3"],
                outputs: ["o1", "o2"],
              },
            }}
          />
        ),
      },
      {
        name: "deep",
        el: () => (
          <Node
            {...{
              kind: "group",
              node: [
                {
                  kind: "const",
                  node: { displayValue: "value_uno" },
                },
                {
                  kind: "const",
                  node: { displayValue: "value_dos" },
                },
                {
                  kind: "standard",
                  node: {
                    name: "std/num/sum",
                    inputs: ["value_uno", "value_dos"],
                  },
                },
              ],
            }}
          />
        ),
      },
    ]}
  />
);

export default Page;
