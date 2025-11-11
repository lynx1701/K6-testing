import express from "express";
import { spawn } from "child_process";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { ProviderName, selectProvider } from "./providers";
import { ConfigureParams } from "./providers/types";
import { ScenarioName } from "./config";
import { RunBody } from "./interfaces/RequestBody";
import { ResponseBody } from "./interfaces/ResponseBody";

const app = express();
app.use(express.json({ limit: "2mb" }));

const OUT_DIR = path.resolve(process.env.OUT_DIR || "./summaries");
const LOG_DIR = path.resolve(process.env.LOG_DIR || "./logs");

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(LOG_DIR, { recursive: true });

app.get("/health", (_, res) => res.json({ ok: true }));

app.post("/run", async (req, res) => {
  const b = req.body as RunBody;

  const method = (b?.method || "GET").toUpperCase();
  const host = (b?.host || "").trim();

  const endpoints =
    Array.isArray(b?.endpoints) && b.endpoints.length ? b.endpoints : ["/"];

  const scenario = (b?.scenario || "load") as ScenarioName;
  const providerName = (b?.logging?.provider || "file") as ProviderName;
  const dsn = (b?.logging?.dsn || "").trim();

  if (!host)
    return res.status(400).json({ ok: false, error: "host is required" });

  const results: Array<ResponseBody> = [];

  for (const ep of endpoints) {
    const timestamp = new Date()
      .toISOString()
      .replaceAll(":", "-")
      .replaceAll(".", "-");

    const endpointSafe = (ep || "root").replace(/[^\w.\-]/g, "_");

    const summaryPath = path.join(
      OUT_DIR,
      `summary_${endpointSafe}_${timestamp}.json`
    );

    const env: NodeJS.ProcessEnv = {
      ...process.env,
      TARGET_HOST: host,
      TARGET_URL: ep,
      METHOD: method,
      PRESET: scenario,
    };
    const args = [
      "run",
      "--summary-export",
      summaryPath,
      path.resolve("./dist/test.js"),
    ];

    const provider = selectProvider(providerName);
    const loggerParams: ConfigureParams = {
      dsn,
      endpointSafe,
      timestamp,
      outDir: OUT_DIR,
      logDir: LOG_DIR,
      summaryPath,
    };

    const logger = provider.configure(args, env, loggerParams);
    const { code, error } = await runK6(args, env, logger);

    let summary: any | undefined;
    try {
      const txt = await fsp.readFile(summaryPath, "utf8");
      summary = JSON.parse(txt);
    } catch {
      console.error("ERROR! no summary created");
    }

    results.push({
      endpoint: ep,
      exitCode: code ?? 0,
      summaryPath: fs.existsSync(summaryPath) ? summaryPath : undefined,
      logPath:
        logger.logPath && fs.existsSync(logger.logPath)
          ? logger.logPath
          : undefined,
      summary,
      error: error || undefined,
    });
  }

  res.json({ ok: true, runs: results });
});

function runK6(
  args: string[],
  env: NodeJS.ProcessEnv,
  logger: {
    logInformation?: (b: Buffer) => void;
    logError?: (b: Buffer) => void;
    onClose?: (code: number | null) => void;
  }
): Promise<{ code: number; error?: string }> {
  return new Promise((resolve) => {
    const child = spawn("k6", args, { env });
    let errBuf = "";

    //logs
    child.stdout.on("data", (d: Buffer) => {
      process.stdout.write(d);
      logger.logInformation?.(d);
    });
    //errors
    child.stderr.on("data", (d: Buffer) => {
      process.stderr.write(d);
      errBuf += d.toString();
      logger.logError?.(d);
    });

    child.on("close", (code) => {
      logger.onClose?.(code);
      resolve({ code: code ?? 0, error: errBuf || undefined });
    });
  });
}

const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST ?? "0.0.0.0";
app.listen(PORT, HOST, () => {
  console.log(`k6 HTTP runner listening on :${PORT}`);
  console.log(`Summaries -> ${OUT_DIR}`);
  console.log(`Logs      -> ${LOG_DIR} (only when provider="file")`);
});
