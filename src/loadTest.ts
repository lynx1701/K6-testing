import { check, sleep } from "k6";
import http from "k6/http";
import type { Options } from "k6/options";

import { config } from "./config";
import { pickOptions, url } from "./utils";

const { METHOD, HEADERS, BODY, SLEEP, PRESET, TARGET_HOST, TARGET_URL } =
  config;

export const options: Options = pickOptions(PRESET);

export function main() {
  const u = url(TARGET_HOST, TARGET_URL);
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
