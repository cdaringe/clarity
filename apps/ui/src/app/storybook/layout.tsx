import * as fs from "fs/promises";
import * as path from "path";
const pwd = process.cwd();
const storyDirname = path.resolve(pwd, "src/app/storybook");

async function getStoryPathnames() {
  "use server";
  const files = await fs.readdir(storyDirname);
  return files
    .filter((it) => !it.endsWith("tsx"))
    .map((it) => `/storybook/${it}`);
}

import { NextPage } from "next";

import { StorybookNav } from "../../components/StorybookNav";

const Page: NextPage<{ children: any; params: number[] }> = async ({
  children,
  params,
  ...rest
}) => {
  return (
    <div>
      <StorybookNav {...{ pathnames: await getStoryPathnames() }} />
      <h1>Storybook</h1>
      <div id="components">{children}</div>
    </div>
  );
};

export default Page;
