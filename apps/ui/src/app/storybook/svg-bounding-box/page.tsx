/* eslint-disable react/no-children-prop */
import { NextPage } from "next";
import { StoriesContainer } from "../../../components/Stories";
import { Ex1 } from "./Ex1";
import { Ex2 } from "./Ex2";
import { Ex3 } from "./Ex3";

const Page: NextPage = () => (
  <StoriesContainer
    children={[
      {
        name: "basic",
        el: Ex1,
      },
      {
        name: "end-before-start",
        el: Ex2,
      },
      {
        name: "with-line",
        el: Ex3,
      },
    ]}
  />
);

export default Page;
