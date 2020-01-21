import {ApiConfig, Config} from "./config"
import webpack from 'webpack'
import ApiLoader from "./api-loader";
import ApiRepository from "./api-repository"
import express from 'express'
import net from 'net'
import open from 'open'
import ApiResolver from "./api-resolver"
import {Api} from "./api"
import {inject, injectable} from "inversify"
import TYPES from "./types"
import ContentRepository from "./content-repository"
// @ts-ignore


@injectable()
export default class implements webpack.Plugin {
  private readonly apis: Array<ApiConfig>
  @inject(TYPES.ApiLoader)
  private readonly loader: ApiLoader
  private readonly intervalSeconds: number
  private readonly keepSize: number

  @inject(TYPES.ApiRepository)
  private readonly apiRepository: ApiRepository

  @inject(TYPES.ContentRepository)
  private readonly contentRepository: ContentRepository

  @inject(TYPES.ApiResolver)
  private readonly resolver: ApiResolver

  private readonly server: net.Server

  private readonly port: number

  constructor(@inject(TYPES.Config) cfg: Config) {
    this.intervalSeconds = cfg.intervalSeconds!
    this.keepSize = cfg.keepSize!
    this.port = cfg.port!
    this.apis = cfg.apis
    this.server = this.setupServer()
    const address: any = this.server.address()
    console.info('swagger-api-tracking-webpack-plugin', `http://localhost:${address.port}/#/diff`)
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
      res.json(this.apiRepository.getAll(req.params.name))
    })
    app.get('/apis/:from/diff/:to', async (req, res) => {
      const from = this.contentRepository.getContent(req.params.from)
      const to = this.contentRepository.getContent(req.params.to)
      const diff = await this.resolver.diff(from, to)
      res.json(diff)
    })
    app.get('/apis/:id/content', async (req, res) => {
      const content = this.contentRepository.getContent(req.params.id)
      res.json(content)
    })
    return app.listen(this.port)
  }

  protected async notify(latestApi: Api, api: Api): Promise<void> {
    const address: any = this.server.address()
    await open(`http://localhost:${address.port}/#/diff?name=${api.name}&from-api-id=${latestApi.id}&to-api-id=${api.id}`)
  }

  private nextTracking(): void {
    const now = Date.now()
    const nextFireTime = now + this.intervalSeconds * 1000
    this.apiRepository.setNextFireTime(nextFireTime)
    setTimeout(this.tracking.bind(this), nextFireTime - now)
  }

  private firstTracking(): void {
    let nextFireTime = this.apiRepository.getNextFireTime()
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
        const latestApi = this.apiRepository.getLatest(name)
        let different = true
        if (latestApi) {
          const latestContent = this.contentRepository.getContent(latestApi.id!)
          const equals = this.resolver.equals(content, latestContent)
          if (equals) {
            different = false
            continue
          }
        }
        if (different) {
          if (this.apiRepository.size(name) >= this.keepSize) {
            const oldest = this.apiRepository.getOldest(name)
            this.apiRepository.remove(oldest.id!)
            this.contentRepository.removeContent(oldest.id!)
          }
          this.apiRepository.add(api)
          this.contentRepository.setContent(api.id!, content)
          if (latestApi) {
            await this.notify(latestApi, api)
          }
        }
      } catch (e) {
        console.error(e.message)
        continue
      }
    }
    this.nextTracking()
  }

}
