import { argument, dag, Directory, func, object } from "@dagger.io/dagger";

@object()
export class Blog {
  /**
   * Build Astro site and return dist directory
   */
  @func()
  async build(
    @argument({ defaultPath: "/" }) source: Directory,
  ): Promise<Directory> {
    const bunCache = dag.cacheVolume("bun");

    return dag
      .container()
      .from("oven/bun:latest")
      .withDirectory("/app", source)
      .withMountedCache("/root/.bun/install/cache", bunCache)
      .withWorkdir("/app")
      .withEnvVariable("CI", "true")
      .withExec(["bun", "install"])
      .withExec(["bun", "run", "build"])
      .directory("/app/dist");
  }
}
