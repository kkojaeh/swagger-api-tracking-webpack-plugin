import {ApiConfig, Config} from "./config"
import webpack from 'webpack'
import {ApiLoader, HttpApiLoader} from "./api-loader";
import {LowdbRepository, Repository} from "./repository";
import express from 'express'
import net from 'net'
import open from 'open'
import {ApiResolver, Swagger2ApiResolver} from "./api-resolver";
import {Api} from "./api";

export default class SwaggerApiTrackingWebpackPlugin {
  private readonly apis: Array<ApiConfig>
  private readonly loader: ApiLoader
  private readonly intervalSeconds: number
  private readonly repository: Repository
  private readonly server: net.Server
  private readonly resolver: ApiResolver

  constructor(cfg?: Config) {
    Object.assign(this, cfg);
    if (!this.loader) {
      this.loader = new HttpApiLoader()
    }
    if (isNaN(this.intervalSeconds)) {
      this.intervalSeconds = 3600
    }
    this.resolver = new Swagger2ApiResolver()
    this.repository = new LowdbRepository()
    this.server = this.setupServer()
  }

  public apply(compiler: webpack.Compiler): void {
    this.firstTracking()
  }

  protected setupServer(): net.Server {
    const app = express()

    app.use('/static', express.static(__dirname + '/html'));

    app.get('/', function (req, res) {
      res.send('Hello World')
    })
    return app.listen()
  }

  private nextTracking(): void {
    const now = Date.now()
    const nextFireTime = now + this.intervalSeconds * 1000
    this.repository.setNextFireTime(nextFireTime)
    setTimeout(this.tracking.bind(this), nextFireTime - now)
  }

  protected async notify(api: Api): Promise<void> {
    //await this.open()
  }

  private firstTracking(): void {
    let nextFireTime = this.repository.getNextFireTime()
    const now = Date.now()
    if (nextFireTime < now) {
      this.tracking().then()
    } else {
      setTimeout(this.tracking.bind(this), nextFireTime - now)
    }
  }

  private async tracking(): Promise<void> {
    for (const info of this.apis) {
      const name = info.name
      const url = info.url
      try {
        const content = await this.loader.load(url)
        const api = this.resolver.resolve(content)
        api.name = name
        const latestApi = this.repository.getLatest(name)
        let different = false
        if (latestApi) {
          const latestContent = this.repository.getContent(latestApi.id!)
          const equals = this.resolver.equals(content, latestContent)
          if (equals) {
            continue
          } else {
            different = true
          }
        }
        this.repository.add(api)
        this.repository.setContent(api.id!, content)
        if (different) {
          await this.notify(api)
        }
      } catch (e) {
        console.error(e)
        continue
      }
    }
    this.nextTracking()
  }

  private async open(): Promise<void> {
    const address: any = this.server.address()
    await open(`http://localhost:${address.port}/static/index.html`)
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
