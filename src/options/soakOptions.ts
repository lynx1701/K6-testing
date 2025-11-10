import { baseThresholds } from "./baseThresholds";
import { Options } from "k6/options";

export const soakOptions: Options = {
  thresholds: baseThresholds,
  scenarios: {
    soak: {
      executor: "constant-arrival-rate",
      rate: Number(__ENV.SOAK_RATE) || 10,
      timeUnit: "1s",
      duration: __ENV.SOAK_DURATION || "30m",
      preAllocatedVUs: Number(__ENV.SOAK_PRE_VUS) || 50,
      maxVUs: Number(__ENV.SOAK_MAX_VUS) || 200,
      exec: "main",
    },
  },
};
