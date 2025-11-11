import { Options } from "k6/options";

import { config } from "./config";
import { baseThresholds } from "./options/baseThresholds";

const { TARGET_HOST, TARGET_URL } = config;

export function url(): string {
  const base = TARGET_HOST.replace(/\/$/, "");
  return TARGET_URL.startsWith("/")
    ? base + TARGET_URL
    : `${base}/${TARGET_URL}`;
}

export function finalizeOptions(o: Options): Options {
  const out: Options = { ...o };

  out.thresholds = { ...baseThresholds, ...(o.thresholds || {}) };

  return out;
}
