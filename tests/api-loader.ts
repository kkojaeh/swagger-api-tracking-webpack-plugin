import {ApiLoader} from "../src/api-loader";

export class TestApiLoader implements ApiLoader {
  async load(url: string): Promise<object> {
    return {}
  }
}
