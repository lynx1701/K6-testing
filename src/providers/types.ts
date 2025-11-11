export type ProviderName = "file" | "grafana";

export interface ConfigureParams {
  dsn?: string;
  endpointSafe: string;
  timestamp: string;
  outDir: string;
  logDir: string;
  summaryPath: string;
}

export interface ProviderRuntime {
  logPath?: string;
  onStdout?: (chunk: Buffer) => void;
  onStderr?: (chunk: Buffer) => void;
  onClose?: (code: number | null) => void;
}

export interface Provider {
  name: ProviderName;
  configure(
    args: string[],
    env: NodeJS.ProcessEnv,
    params: ConfigureParams
  ): ProviderRuntime;
}
