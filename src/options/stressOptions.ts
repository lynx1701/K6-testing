import { Options } from "k6/options";
import { baseThresholds } from "./baseThresholds";

export const stressOptions: Options = {
  thresholds: baseThresholds,
  scenarios: {
    stress: {
      executor: "ramping-vus",
      startVUs: 1,
      stages: [
        { duration: "2m", target: 50 },
        { duration: "2m", target: 100 },
        { duration: "2m", target: 200 },
        { duration: "2m", target: 300 },
        { duration: "2m", target: 0 },
      ],
      gracefulRampDown: "1m",
      exec: "main",
    },
  },
};
