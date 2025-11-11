import http from "k6/http";
import { check, sleep } from "k6";
import type { Options } from "k6/options";

import { loadOptions } from "./options/loadOptions";
import { stressOptions } from "./options/stressOptions";
import { spikeOptions } from "./options/spikeOptions";
import { soakOptions } from "./options/soakOptions";
import { config } from "./config";
import { finalizeOptions, url } from "./utils";

const { METHOD, HEADERS, BODY, SLEEP, PRESET } = config;

function pickOptions(kind: string): Options {
  switch (kind) {
    case "load":
      return finalizeOptions(loadOptions);
    case "stress":
      return finalizeOptions(stressOptions);
    case "spike":
      return finalizeOptions(spikeOptions);
    case "soak":
      return finalizeOptions(soakOptions);
    default:
      throw new Error(
        `Unknown scenario "${kind}" (use load|stress|spike|soak)`
      );
  }
}

export const options: Options = pickOptions(PRESET);

export function main() {
  const u = url();
  let res;

  switch (METHOD) {
    case "GET":
      res = http.get(u, { headers: HEADERS });
      break;
    case "POST":
      res = http.post(u, BODY, { headers: HEADERS });
      break;
    case "PUT":
      res = http.put(u, BODY, { headers: HEADERS });
      break;
    case "PATCH":
      res = http.patch(u, BODY, { headers: HEADERS });
      break;
    case "DELETE":
      res = http.del(u, null, { headers: HEADERS });
      break;
    default:
      res = http.request(METHOD, u, BODY, { headers: HEADERS });
  }

  check(res, { "status is 2xx/3xx": (r) => r.status >= 200 && r.status < 400 });
  if (SLEEP > 0) sleep(SLEEP);
}
