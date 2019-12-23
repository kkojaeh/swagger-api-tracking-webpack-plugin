import fetch from "node-fetch";

export interface ApiLoader {
  load(url: string): Promise<object>;
}

export class HttpApiLoader implements ApiLoader {
  async load(url: string): Promise<object> {
    const response = await fetch(url)
    return await response.json()
  }
}