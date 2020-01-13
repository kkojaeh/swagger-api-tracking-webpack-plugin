import {Api, ApiDiff, ApiDiffType} from "../api";
import ApiResolver from "../api-resolver";
// @ts-ignore
import {inject, injectable} from "inversify"
import uuid from "uuid"
import execa from "execa"
import TYPES from "../types"
import {Config} from "../config"
import fs from "fs"

@injectable()
export default class ApiResolverSwaggerDiff implements ApiResolver {

  private ignoreProperties: Array<String> = ["swagger", "info", "host", "basePath", "tags"]

  private readonly workSpace: String

  constructor(@inject(TYPES.Config) cfg: Config) {
    this.workSpace = cfg.workSpace!
  }

  resolve(api: any): Api {
    return {
      name: "",
      title: api.info.title,
      version: api.info.version,
      createdAt: new Date()
    }
  }

  make(from: any, to: any): DiffOutput {
    const fromFile = `${this.workSpace}/${uuid()}.json`
    const toFile = `${this.workSpace}/${uuid()}.json`
    try {
      fs.writeFileSync(fromFile, JSON.stringify(from), {encoding: 'utf-8'})
      fs.writeFileSync(toFile, JSON.stringify(to), {encoding: 'utf-8'})
      const {stdout} = execa.sync('java', ['-jar', `${__dirname}/swagger-diff-1.2.1.jar`, '-old', fromFile, '-new', toFile, '-v', '2.0', '-output-mode', 'json']);
      const result = JSON.parse(stdout)
      return result
    } finally {
      if (fs.existsSync(fromFile)) {
        fs.unlinkSync(fromFile)
      }
      if (fs.existsSync(toFile)) {
        fs.unlinkSync(toFile)
      }
    }
  }

  async diff(from: any, to: any): Promise<Array<ApiDiff>> {
    this.validate(from)
    this.validate(to)
    const diff = this.make(from, to)
    const results = [
      ...diff.newEndpoints.map(this.toCreate),
      ...diff.changedEndpoints.map(this.toUpdate),
      ...diff.missingEndpoints.map(this.toDelete)
    ]
    return results;
  }

  equals(from: any, to: any): boolean {
    this.validate(from)
    this.validate(to)
    const diff = this.make(from, to)
    return diff.changedEndpoints.length == 0 && diff.missingEndpoints.length == 0 && diff.newEndpoints.length == 0
  }

  private toCreate(e: any): ApiDiff {
    return {
      method: e.method,
      type: ApiDiffType.CREATE,
      location: e.pathUrl,
      message: '',
    }
  }

  private toUpdate(e: any): ApiDiff {
    return {
      method: e.method,
      type: ApiDiffType.UPDATE,
      location: e.pathUrl,
      message: '',
    }
  }

  private toDelete(e: any): ApiDiff {
    return {
      method: e.method,
      type: ApiDiffType.DELETE,
      location: e.pathUrl,
      message: '',
    }
  }

  private deleteIgnores(o: any): void {
    this.ignoreProperties.forEach((p: string) => delete o[p])
  }

  private validate(o: any): void {
    if (!o) {
      throw new Error("cannot be null")
    }
    if (o.swagger != "2.0") {
      throw new Error("not swagger format")
    }
  }

}


interface DiffOutput {

  changedEndpoints: Array<any>
  missingEndpoints: Array<any>
  newEndpoints: Array<any>
  newVersion: string
  oldVersion: string

}
