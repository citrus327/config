import path from "node:path";
import type { DirectoryResult } from "tmp-promise";
import type { TestContext } from "vitest";
import { beforeEach, afterEach } from "vitest";
import { dir } from "tmp-promise";
import fsx from "fs-extra";
import type { PackageJson, TsConfigJson } from "type-fest";

export interface Context {
  tmp: DirectoryResult;
  r: (p?: string) => string;
  maker: {
    makePackageJson: (options: PackageJson) => Promise<string>;
    makeTsConfig: (options: TsConfigJson) => Promise<string>;
    makeFile: (p: string, content: string) => Promise<string>;
  };
}

export const setupTmpDir = (options?: {
  before?: (ctx: TestContext & Context) => Promise<void>;
  after?: (ctx: TestContext & Context) => Promise<void>;
}) => {
  beforeEach<Context>(async (context) => {
    const result = await dir();
    context.tmp = result;
    context.r = (p?: string) =>
      p ? path.resolve(result.path, p) : result.path;

    context.maker = {
      makePackageJson: async (options) => {
        const filename = context.r("./package.json");
        await fsx.outputJSON(filename, options);
        return filename;
      },
      makeTsConfig: async (
        options: TsConfigJson = {
          compilerOptions: {
            module: "ESNext",
            target: "ESNext",
            moduleResolution: "Node",
          },
        }
      ) => {
        const filename = context.r("./tsconfig.json");
        await fsx.outputJSON(filename, options);
        return filename;
      },
      makeFile: async (p, content) => {
        await fsx.outputFile(p, content, "utf-8");
        return p;
      },
    } as Context["maker"];
    await options?.before?.(context);
  });

  afterEach<Context>(async (context) => {
    await fsx.emptyDir(context.tmp.path);
    context.tmp.cleanup();
    context.r = () => "";
    await options?.after?.(context);
  });
};
