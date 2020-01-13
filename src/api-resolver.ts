import {Api, ApiDiff} from "./api";

export default interface ApiResolver {

  resolve(api: any): Api

  equals(from: any, to: any): boolean

  diff(from: any, to: any): Promise<Array<ApiDiff>>
}


