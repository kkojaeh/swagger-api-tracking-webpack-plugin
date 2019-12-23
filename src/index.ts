import {ApiConfig, Config} from "./config"
import webpack from 'webpack'
import {ApiLoader, HttpApiLoader} from "./api-loader";
import {LowdbRepository, Repository} from "./repository";

export default class SwaggerApiTrackingWebpackPlugin {
  private readonly apis: Array<ApiConfig>
  private readonly apiLoader: ApiLoader
  private readonly intervalSeconds: number
  private readonly repository: Repository

  constructor(cfg?: Config) {
    Object.assign(this, cfg);
    if (!this.apiLoader) {
      this.apiLoader = new HttpApiLoader()
    }
    if (isNaN(this.intervalSeconds)) {
      this.intervalSeconds = 3600
    }
    this.repository = new LowdbRepository()
  }

  public apply(compiler: webpack.Compiler): void {
    let nextFireTime = this.repository.getNextFireTime()
    const now = Date.now()
    if (nextFireTime < now) {
      this.tracking()
    } else {
      setTimeout(this.tracking.bind(this), nextFireTime - now)
    }
  }

  private nextTracking(): void {
    const now = Date.now()
    const nextFireTime = now + this.intervalSeconds * 1000
    this.repository.setNextFireTime(nextFireTime)
    setTimeout(this.tracking.bind(this), nextFireTime - now)
  }

  private tracking(): void {
    this.repository
    console.log('name')
    this.nextTracking()
  }
}

/*
const homedir = require('os').homedir();
        const low = require('lowdb')
        const FileSync = require('lowdb/adapters/FileSync')

        const adapter = new FileSync(`${homedir}/.togle/api-inspector.json`)
        const db = low(adapter)

        db.defaults({ versions: [], swagger: {}, latestVersions: {}})
          .write()

        app.all('/_/api/latest-versions', (req, res) => {
          res.setHeader('Content-Type', 'application/json')
          res.send(db.get('latestVersions').value())
        });
 */
