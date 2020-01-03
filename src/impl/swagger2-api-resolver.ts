import {Api, ApiDiff, ApiDiffLevel} from "../api";
import ApiResolver from "../api-resolver";
// @ts-ignore
import swaggerDiff from 'swagger-diff'
import {injectable} from "inversify";

@injectable()
export default class Swagger2ApiResolver implements ApiResolver {

  private ignoreProperties: Array<String> = ["swagger", "info", "host", "basePath", "tags"]

  resolve(api: any): Api {
    return {
      name: "",
      title: api.info.title,
      version: api.info.version,
      createdAt: new Date()
    }
  }

  async diff(oa: any, ob: any): Promise<Array<ApiDiff>> {
    this.validate(oa)
    this.validate(ob)
    const diff = await swaggerDiff(oa, ob, {});
    console.log(JSON.stringify(diff))
    const results = [
      ...diff.unmatchDiffs.map(this.toUnmatchDiffs(ApiDiffLevel.CRITICAL)),
      ...diff.errors.map(this.to(ApiDiffLevel.ERROR)),
      ...diff.warnings.map(this.to(ApiDiffLevel.WARNING)),
      ...diff.infos.map(this.to(ApiDiffLevel.INFO))
    ]
    return results;
  }

  equals(oa: any, ob: any): boolean {
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

  private toUnmatchDiffs(level: ApiDiffLevel): Function {
    const kinds: { [index: string]: any } = {
      "D": "deleted",
      "N": "new"
    }
    return (e: any): ApiDiff => {
      return {
        type: e.ruleId,
        location: e.path.join(" "),
        message: kinds[e.kind],
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
