import { Options } from "k6/options";
import { baseThresholds } from "./baseThresholds";

export const loadOptions: Options = {
  thresholds: baseThresholds,
  scenarios: {
    load: {
      executor: "ramping-vus",
      startVUs: 1,
      stages: [
        { duration: "2m", target: Number(__ENV.LOAD_VUS) || 20 },
        { duration: "5m", target: Number(__ENV.LOAD_VUS) || 20 },
        { duration: "2m", target: 0 },
      ],
      gracefulRampDown: "30s",
      exec: "main",
    },
  },
};
