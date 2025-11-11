export type ScenarioName = "load" | "stress" | "spike" | "soak";

export const config = {
  PRESET: (__ENV.TEST_TYPE || "load").toLowerCase() as ScenarioName,
  TARGET_HOST: __ENV.TARGET_HOST || "https://test.k6.io",
  TARGET_URL: __ENV.ENDPOINT || "/",
  HEADERS: __ENV.HEADERS ? JSON.parse(__ENV.HEADERS) : {},
  METHOD: __ENV.METHOD || "GET",
  BODY: __ENV.BODY ?? "",
  SLEEP: Number(__ENV.SLEEP ?? "1"),
  LOAD_VUS: Number(__ENV.LOAD_VUS ?? "20"),
  SPIKE_PRE_VUS: Number(__ENV.SPIKE_PRE_VUS ?? "100"),
  SPIKE_MAX_VUS: Number(__ENV.SPIKE_MAX_VUS ?? "1000"),
  SOAK_RATE: Number(__ENV.SOAK_RATE ?? "10"),
  SOAK_DURATION: __ENV.SOAK_DURATION || "30m",
  SOAK_PRE_VUS: Number(__ENV.SOAK_PRE_VUS ?? "50"),
  SOAK_MAX_VUS: Number(__ENV.SOAK_MAX_VUS ?? "200"),
};
