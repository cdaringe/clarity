import { NextPage } from "next";

const Page: NextPage<{ children: any }> = ({ children }) => {
  return (
    <main>
      <div>
        <p>whatever man</p>
        {children}
      </div>
    </main>
  );
};

export default Page;
