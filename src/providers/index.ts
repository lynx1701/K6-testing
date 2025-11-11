import { Provider, ProviderName } from "./types";
import { fileProvider } from "./file";
import { grafanaProvider } from "./grafana";

export { ProviderName } from "./types";

export function selectProvider(name: ProviderName): Provider {
  switch (name) {
    case "grafana":
      return grafanaProvider;
    default:
      return fileProvider;
  }
}
