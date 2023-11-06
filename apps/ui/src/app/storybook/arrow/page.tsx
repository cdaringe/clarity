import { ArrowSvg } from "clarity-components";
import { NextPage } from "next";
import { StoriesContainer } from "../../../components/Stories";

const Page: NextPage = () => {
  return (
    <StoriesContainer>
      {[
        {
          name: "empty arrow",
          el: ArrowSvg,
        },
        {
          name: "filled",
          el: () => <ArrowSvg variant="full" />,
        },
        {
          name: "(l)ength 50",
          el: () => <ArrowSvg variant="full" l={50} />,
        },
      ]}
    </StoriesContainer>
  );
};

export default Page;
