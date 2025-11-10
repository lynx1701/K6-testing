import { Options } from "k6/options";

export const baseThresholds: Options["thresholds"] = {
  http_req_failed: ["rate<0.01"], // < 1% errors
  http_req_duration: ["p(95)<500"], // 95% under 500ms
};
