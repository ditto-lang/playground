import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { parser } from "./src/parser.js";
import { fileTests } from "@lezer/generator/dist/test";

const caseDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "tests"
);

for (const file of fs.readdirSync(caseDir)) {
  if (!/\.txt$/.test(file)) {
    continue;
  }

  const name = /^[^\.]*/.exec(file)[0];
  describe(name, () => {
    const tests = fileTests(
      fs.readFileSync(path.join(caseDir, file), "utf8"),
      file
    );
    for (const { name, run } of tests) {
      it(name, () => run(parser));
    }
  });
}
