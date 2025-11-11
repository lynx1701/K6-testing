import { Options } from "k6/options";

export const baseThresholds: NonNullable<Options["thresholds"]> = {
  http_req_failed: ["rate<0.01"],
  http_req_duration: ["p(95)<500"],
};
