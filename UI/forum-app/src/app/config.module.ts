export class Config {
  public static readonly isDev = true;

  public static readonly API_URL: string = Config.getURLAPI() + ":4001/api";
  public static API_WS: string = Config.getURLAPI() + ":4002/api";

  static getURLAPI(): string {
    if (Config.isDev) return "http://localhost";
    else return "http://51.210.181.145";
  }
}
