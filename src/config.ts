import fs from "fs"
import os from "os"

const homedir = os.homedir();

export type ApiConfig = {
  name: string,

  url: string,
}
export type Config = {

  /**
   * Api Name and Url mapping
   */
  apis: Array<ApiConfig>,

  /**
   * tracking interval seconds. defaults to `600`
   */
  intervalSeconds?: number;

  /**
   * api keep size. defaults to `20`
   */
  keepSize?: number

  /**
   * file location for persist. defaults to `[homedir]/.swagger-api-tracking-webpack-plugin`
   */
  workSpace?: string,

  /**
   * api server port. defaults to `50505`
   */
  port?: number,
}

export class DefaultConfig implements Config {

  apis: Array<ApiConfig>;
  intervalSeconds: number;
  keepSize: number;
  workSpace: string;
  port: number;

  constructor(cfg?: Config) {
    Object.assign(this, cfg)
    if (this.intervalSeconds == undefined) {
      this.intervalSeconds = 3600
    }
    if (this.keepSize == undefined) {
      this.keepSize = 20
    }
    if (this.workSpace == undefined) {
      this.workSpace = `${homedir}/.swagger-api-tracking-webpack-plugin`
    }
    if (this.port == undefined) {
      this.port = 50505
    }
    if (!fs.existsSync(this.workSpace)) {
      fs.mkdirSync(this.workSpace)
    }
  }

}
