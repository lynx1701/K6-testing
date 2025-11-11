import { Provider, ProviderRuntime, ConfigureParams } from "./types";

export const grafanaProvider: Provider = {
  name: "grafana",
  configure(
    args: string[],
    env: NodeJS.ProcessEnv,
    params: ConfigureParams
  ): ProviderRuntime {
    const url = params.dsn || "http://prometheus:9090/api/v1/write";
    // k6 requires this flag + env var
    args.unshift("--out", "experimental-prometheus-rw");
    env.K6_PROMETHEUS_RW_SERVER_URL = url;

    return {};
  },
};
