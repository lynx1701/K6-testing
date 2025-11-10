import http from "k6/http";
import { check, sleep } from "k6";

/**
 * Main user flow (imported by scenarios and used via exec: 'main').
 * Reads configuration from __ENV.
 */
export function main(): void {
  const TARGET_URL = __ENV.TARGET_URL || "https://test.k6.io";
  const res = http.get(TARGET_URL);

  check(res, { "status is 200": (r) => r.status === 200 });

  const slp = Number(__ENV.SLEEP ?? "1");
  sleep(Number.isFinite(slp) ? slp : 1);
}
