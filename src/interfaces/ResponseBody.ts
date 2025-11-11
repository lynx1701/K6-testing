export interface ResponseBody {
  endpoint: string;
  exitCode: number;
  summaryPath?: string;
  summary?: any;
  logPath?: string;
  error?: string;
}
