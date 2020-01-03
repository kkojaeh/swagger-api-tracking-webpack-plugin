import {ApiConfig, Config} from "./config"
import webpack from 'webpack'
import ApiLoader from "./api-loader";
import Repository from "./repository";
import express from 'express'
import net from 'net'
import open from 'open'
import ApiResolver from "./api-resolver";
import {Api} from "./api";
import {inject, injectable} from "inversify";
import TYPES from "./types";

@injectable()
export default class implements webpack.Plugin {
  private readonly apis: Array<ApiConfig>
  @inject(TYPES.ApiLoader)
  private readonly loader: ApiLoader
  private readonly intervalSeconds: number
  private readonly keepSize: number

  @inject(TYPES.Repository)
  private readonly repository: Repository
  private readonly server: net.Server
  @inject(TYPES.ApiResolver)
  private readonly resolver: ApiResolver

  constructor(@inject(TYPES.Config) cfg?: Config) {
    Object.assign(this, cfg);
    if (isNaN(this.intervalSeconds)) {
      this.intervalSeconds = 3600
    }
    if (isNaN(this.keepSize)) {
      this.keepSize = 20
    }
    this.server = this.setupServer()
    const address: any = this.server.address()
    console.info(`http://localhost:${address.port}/index.html`)
  }

  public apply(compiler: webpack.Compiler): void {
    this.firstTracking()
  }

  protected setupServer(): net.Server {
    const app = express()

    app.use(express.static(__dirname + '/ui'));

    app.get('/configs', (req, res) => {
      res.json(this.apis)
    })
    app.get('/configs/:name/apis', (req, res) => {
      res.json(this.repository.getAll(req.params.name))
    })
    app.get('/apis/:from/diff/:to', async (req, res) => {
      const from = this.repository.getContent(req.params.from)
      const to = this.repository.getContent(req.params.to)
      const diff = await this.resolver.diff(from, to)
      res.json(diff)
    })
    return app.listen()
  }

  protected async notify(api: Api): Promise<void> {
    await this.open()
  }

  private nextTracking(): void {
    const now = Date.now()
    const nextFireTime = now + this.intervalSeconds * 1000
    this.repository.setNextFireTime(nextFireTime)
    setTimeout(this.tracking.bind(this), nextFireTime - now)
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
        let different = true
        if (latestApi) {
          const latestContent = this.repository.getContent(latestApi.id!)
          const equals = this.resolver.equals(content, latestContent)
          if (equals) {
            different = false
            continue
          }
        }
        if (different) {
          if (this.repository.size(name) >= this.keepSize) {
            const oldest = this.repository.getOldest(name)
            this.repository.remove(oldest.id!)
            this.repository.removeContent(oldest.id!)
          }
          this.repository.add(api)
          this.repository.setContent(api.id!, content)
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
