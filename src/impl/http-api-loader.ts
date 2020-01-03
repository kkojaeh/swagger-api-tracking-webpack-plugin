import fetch from "node-fetch";
import ApiLoader from "../api-loader";
import {injectable} from "inversify";

@injectable()
export default class HttpApiLoader implements ApiLoader {
  async load(url: string): Promise<object> {
    const response = await fetch(url)
    return await response.json()
  }
}
