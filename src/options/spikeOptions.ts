import { Options } from "k6/options";
import { baseThresholds } from "./baseThresholds";

export const spikeOptions: Options = {
  thresholds: baseThresholds,
  scenarios: {
    spike: {
      executor: "ramping-arrival-rate",
      startRate: 5,
      timeUnit: "1s",
      preAllocatedVUs: Number(__ENV.SPIKE_PRE_VUS) || 100,
      maxVUs: Number(__ENV.SPIKE_MAX_VUS) || 1000,
      stages: [
        { duration: "10s", target: 10 },
        { duration: "5s", target: 300 },
        { duration: "1m", target: 300 },
        { duration: "2m", target: 20 },
      ],
      exec: "main",
    },
  },
};
