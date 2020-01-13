import fs from "fs"
import ContentRepository from "../content-repository"
import {inject, injectable} from "inversify"
import TYPES from "../types"
import {Config} from "../config"

@injectable()
export default class ContentRepositoryFs implements ContentRepository {

  private readonly workSpace: String

  constructor(@inject(TYPES.Config) cfg: Config) {
    this.workSpace = cfg.workSpace!
  }

  getContent(id: string): any {

    const content = fs.readFileSync(this.getLocation(id), {encoding: 'utf-8'})
    if (content) {
      return JSON.parse(content)
    }
    return null
  }

  setContent(id: string, content: any): void {
    fs.writeFileSync(this.getLocation(id), JSON.stringify(content), {encoding: 'utf-8'})
  }

  removeContent(id: string): void {
    if (fs.existsSync(this.getLocation(id))) {
      fs.unlinkSync(this.getLocation(id))
    }
  }

  getLocation(id: string): string {
    return `${this.workSpace}/${id}.json`;
  }
}
