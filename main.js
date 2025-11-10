import { check, sleep } from "k6";

export function main() {
  const TARGET_URL = ENV.TARGET_URL || "https://test.k6.io";
  const res = http.get(TARGET_URL);
  check(res, { "status is 200": (r) => r.status === 200 });
  sleep(Number(ENV.SLEEP) || 1);
}
