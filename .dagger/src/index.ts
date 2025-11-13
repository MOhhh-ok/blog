import { argument, dag, Directory, func, object } from "@dagger.io/dagger";

@object()
export class HelloDagger {
  /**
   * Build Astro site and return dist directory
   */
  @func()
  async build(
    @argument({ defaultPath: "/" }) source: Directory,
  ): Promise<Directory> {
    const pnpmCache = dag.cacheVolume("pnpm");

    return dag
      .container()
      .from("node:21-slim")
      .withExec(["corepack", "enable"])
      .withExec(["corepack", "prepare", "pnpm@latest", "--activate"])
      .withDirectory("/app", source)
      .withMountedCache("/root/.local/share/pnpm/store", pnpmCache)
      .withWorkdir("/app")
      .withEnvVariable("CI", "true")
      .withExec(["pnpm", "install"])
      .withExec(["pnpm", "run", "build"])
      .directory("/app/dist");
  }
}
