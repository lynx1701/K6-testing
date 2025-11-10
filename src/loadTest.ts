import { Options } from "k6/options";
import { loadOptions } from "./options/loadOptions";
import { stressOptions } from "./options/stressOptions";
import { spikeOptions } from "./options/spikeOptions";
import { soakOptions } from "./options/soakOptions";

export { main } from "./main";

const TEST_TYPE = (__ENV.TEST_TYPE || "load").toLowerCase(); // load|stress|soak|spike

const baseThresholds: Options["thresholds"] = {
  http_req_failed: ["rate<0.01"], // < 1% errors
  http_req_duration: ["p(95)<500"], // 95% under 500ms
};

function pickOptions(kind: string): Options {
  switch (kind) {
    case "load":
      return loadOptions;
    case "stress":
      return stressOptions;
    case "spike":
      return spikeOptions;
    case "soak":
      return soakOptions;
    default:
      throw new Error(
        `Unknown TEST_TYPE "${kind}" (use load|stress|spike|soak)`
      );
  }
}

export const options: Options = pickOptions(TEST_TYPE);
