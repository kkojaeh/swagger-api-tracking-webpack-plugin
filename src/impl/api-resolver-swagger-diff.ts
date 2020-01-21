import {Api, ApiDiff, ApiDiffType, ApiMethod} from "../api";
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
    const resolver = new ApiDiffResolver(diff, from, to)
    return resolver.resolve();
  }

  equals(from: any, to: any): boolean {
    this.validate(from)
    this.validate(to)
    const diff = this.make(from, to)
    return diff.changedEndpoints.length == 0 && diff.missingEndpoints.length == 0 && diff.newEndpoints.length == 0
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

class ApiDiffResolver {

  private readonly output: DiffOutput
  private readonly from: any
  private readonly to: any

  constructor(output: DiffOutput, from: any, to: any) {
    this.output = output
    this.from = from
    this.to = to
  }

  public resolve(): Array<ApiDiff> {
    const created = this.output.newEndpoints.map(this.toCreate, this)
    const updated = this.output.changedEndpoints.flatMap(this.toUpdate, this)
    const deleted = this.output.missingEndpoints.map(this.toDelete, this)
    const result = [
      ...created,
      ...updated,
      ...deleted
    ]
    return result
  }

  private toRef(e: any): string {
    const tag = e.tags[0]
    const operationId = e.operationId
    return `#/${tag}/${operationId}`
  }

  private toCreate(e: any): ApiDiff {
    return {
      method: e.method,
      type: ApiDiffType.CREATE,
      location: e.pathUrl,
      messages: [],
      toRef: this.toRef(this.to.paths[e.pathUrl][e.method.toLowerCase()])
    }
  }

  private toUpdate(e: any): Array<ApiDiff> {
    return Object.entries(e.changedOperations)
      .map(([key, value]): ApiDiff => {
        const o = value as any;
        let messages = []
        if (o.diffParam) {
          messages.push(...o.addParameters.flatMap(this.withAddParameter, this))
          messages.push(...o.missingParameters.flatMap(this.withMissingParameter, this))
          messages.push(...o.changedParameter.flatMap(this.withChangedParameter, this))
        }
        if (o.diffProp) {
          messages.push(...o.addProps.flatMap(this.withAddProperty, this))
          messages.push(...o.missingProps.flatMap(this.withMissingProperty, this))
          messages.push(...o.changedProps.flatMap(this.withChangedProperty, this))
        }
        return {
          method: key as ApiMethod,
          type: ApiDiffType.UPDATE,
          location: e.pathUrl,
          messages: messages,
          fromRef: this.toRef(this.from.paths[e.pathUrl][key.toLowerCase()]),
          toRef: this.toRef(this.to.paths[e.pathUrl][key.toLowerCase()])
        }
      })
  }

  private withAddProperty(p: any): Array<string> {
    return [`Add ${p.el} // ${p.property.description || ''}`]
  }

  private withMissingProperty(p: any): Array<string> {
    return [`Delete ${p.el} // ${p.property.description || ''}`]
  }

  private withChangedProperty(p: any): Array<string> {
    return [`Modify ${p.el} // ${p.property.description || ''}`]
  }


  private withAddParameter(p: any): Array<string> {
    return [`Add ${p.name} // ${p.description || ''}`]
  }

  private withMissingParameter(p: any): Array<string> {
    return [`Delete ${p.name} // ${p.description || ''}`]
  }

  private withChangedParameter(p: any): Array<string> {
    const increased = p.increased.flatMap(this.withAddProperty, this)
    const changes = []
    const left = p.leftParameter
    const right = p.rightParameter
    if (p.changeRequired) {
      changes.push(`${right.name} change into ${right.required ? 'required' : 'not required'}`)
    }
    if (p.changeDescription) {
      changes.push(`${right.name} notes ${left.description} change into ${right.description}`)
    }
    const missing = p.missing.flatMap(this.withMissingProperty, this)
    const changed = p.changed.flatMap(this.withChangedProperty, this)
    return [...increased, ...changes, ...missing, ...changed]
  }


  private toDelete(e: any): ApiDiff {
    return {
      method: e.method,
      type: ApiDiffType.DELETE,
      location: e.pathUrl,
      messages: [],
      fromRef: this.toRef(this.from.paths[e.pathUrl][e.method.toLowerCase()])
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
