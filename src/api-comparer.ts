// @ts-ignore
import swaggerDiff from 'swagger-diff'
import {ApiDiff, ApiDiffLevel} from "./api";

export interface ApiComparer {
  equals(a: object, b: object): boolean;

  diff(a: object, b: object): Promise<Array<ApiDiff>>;
}

export type Swagger2Diff = {
  errors: Array<any>,
  warnings: Array<any>,
  infos: Array<any>,
  unmatchDiffs: Array<any>
}


export class Swagger2ApiComparer implements ApiComparer {

  private ignoreProperties: Array<String> = ["swagger", "info", "host", "basePath", "tags"]

  async diff(oa: object, ob: object): Promise<Array<ApiDiff>> {
    this.validate(oa)
    this.validate(ob)
    const diff = await swaggerDiff(oa, ob, {});
    const results = [
      ...diff.unmatchDiffs.map(this.to(ApiDiffLevel.CRITICAL)),
      ...diff.errors.map(this.to(ApiDiffLevel.ERROR)),
      ...diff.warnings.map(this.to(ApiDiffLevel.WARNING)),
      ...diff.infos.map(this.to(ApiDiffLevel.INFO))
    ]
    return results;
  }

  equals(oa: object, ob: object): boolean {
    this.validate(oa)
    this.validate(ob)
    const a = JSON.parse(JSON.stringify(oa))
    const b = JSON.parse(JSON.stringify(ob))
    this.deleteIgnores(a)
    this.deleteIgnores(b)
    return JSON.stringify(a) == JSON.stringify(b);
  }

  private to(level: ApiDiffLevel): Function {
    return (e: any): ApiDiff => {
      return {
        type: e.ruleId,
        location: e.path,
        message: e.message,
        level: level
      }
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
