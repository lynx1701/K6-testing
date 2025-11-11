import { ScenarioName } from "../config";
import { ProviderName } from "../providers/types";

export interface RunBody {
  method: string;
  host: string;
  endpoints: string[];
  scenario: ScenarioName;
  logging?: {
    provider?: ProviderName; // "file"  | "grafana" (default "file")
    dsn?: string; // optional DSN for influx/grafana
  };
}
