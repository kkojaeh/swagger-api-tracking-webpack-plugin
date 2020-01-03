import {Api, ApiDiff} from "./api";

export default interface ApiResolver {

  resolve(api: any): Api

  equals(a: any, b: any): boolean

  diff(a: any, b: any): Promise<Array<ApiDiff>>
}


