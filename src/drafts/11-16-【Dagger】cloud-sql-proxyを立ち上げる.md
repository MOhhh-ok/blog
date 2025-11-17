```
dagger init --sdk=typescript --name=gcp
```


```ts
/**
 * Cloud SQL Proxyをサービスとして起動したコンテナを構築
 */
async function createProxyService(params: {
  credentials: Secret;
  env: Env;
}) {
  const { credentials, env } = params;
  const envVars = ENV_VARS[env];

  const { PROJECT_ID, REGION, DB_INSTANCE_NAME } = envVars;
  const CLOUD_SQL_PROXY_VERSION = "v2.19.0";
  const cloudSqlInstance = `${PROJECT_ID}:${REGION}:${DB_INSTANCE_NAME}`;
  const CREDENTIALS_PATH = "/tmp/gcp-key.json";

  return dag
    .container()
    .from("alpine:latest")  // gcloud SDKイメージすら不要
    .withMountedSecret(CREDENTIALS_PATH, credentials)
    .withEnvVariable("GOOGLE_APPLICATION_CREDENTIALS", CREDENTIALS_PATH)
    .withExec(["apk", "add", "--no-cache", "curl"])
    .withExec([
      "curl",
      "-o",
      "cloud-sql-proxy",
      `https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/${CLOUD_SQL_PROXY_VERSION}/cloud-sql-proxy.linux.amd64`,
    ])
    .withExec(["chmod", "+x", "cloud-sql-proxy"])
    .withExposedPort(5432)
    .asService({
      args: [
        "./cloud-sql-proxy",
        cloudSqlInstance,
        "--address",
        "0.0.0.0",
        "--port",
        "5432",
      ],
    });
}
```
