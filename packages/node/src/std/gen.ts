import * as fs from "fs";
import * as jsyaml from "js-yaml";
import * as path from "path";

const stdyamlFilename = path.join(__dirname, "std.yaml");
const stdTsFilename = path.join(__dirname, "std.ts");
const stdstr = fs.readFileSync(stdyamlFilename, "utf-8");
const stdObj = jsyaml.load(stdstr, {
  filename: stdyamlFilename,
}) as Record<string, Record<string, string>>;

const kvs = Object.entries(stdObj).flatMap(([libName, methods]) =>
  Object.entries(methods).map(
    ([methodName, methodSig]) =>
      `"std/${libName}/${methodName}": ${
        methodSig === "JS_MATH" ? `Math.${methodName}` : methodSig
      }`
  )
);

const tsStr = `export const std = { ${kvs.join(",\n  ")}}`;

fs.writeFileSync(stdTsFilename, tsStr);
