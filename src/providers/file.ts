import fs from "fs";
import path from "path";
import { Provider, ProviderRuntime, ConfigureParams } from "./types";

export const fileProvider: Provider = {
  name: "file",
  configure(
    _args: string[],
    _env: NodeJS.ProcessEnv,
    params: ConfigureParams
  ): ProviderRuntime {
    const logPath = path.join(
      params.logDir,
      `run_${params.endpointSafe}_${params.timestamp}.log`
    );
    const stream = fs.createWriteStream(logPath, { flags: "a" });

    return {
      logPath,
      onStdout: (buf: Buffer) => stream.write(buf),
      onStderr: (buf: Buffer) => stream.write(buf),
      onClose: () => stream.end(),
    };
  },
};
