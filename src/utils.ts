import { Options } from "k6/options";

import { baseThresholds } from "./options/baseThresholds";
import { loadOptions } from "./options/loadOptions";
import { soakOptions } from "./options/soakOptions";
import { spikeOptions } from "./options/spikeOptions";
import { stressOptions } from "./options/stressOptions";

export function url(host: string, url: string): string {
  const base = host.replace(/\/$/, "");
  return url.startsWith("/") ? base + url : `${base}/${url}`;
}

export function finalizeOptions(o: Options): Options {
  const out: Options = { ...o };

  out.thresholds = { ...baseThresholds, ...(o.thresholds || {}) };

  return out;
}

export function pickOptions(kind: string): Options {
  switch (kind) {
    case "load":
      return finalizeOptions(loadOptions);
    case "stress":
      return finalizeOptions(stressOptions);
    case "spike":
      return finalizeOptions(spikeOptions);
    case "soak":
      return finalizeOptions(soakOptions);
    default:
      throw new Error(
        `Unknown scenario "${kind}" (use load|stress|spike|soak)`
      );
  }
}
