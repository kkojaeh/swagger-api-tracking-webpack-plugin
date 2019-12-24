import {ApiLoader} from './api-loader'

export type ApiConfig = {
  name?: string,

  url: string,
}
export type Config = {

  /**
   * Api Name and Url mapping
   */
  apis: Array<ApiConfig>,

  apiLoader: ApiLoader

  /**
   * tracking interval seconds. defaults to `600`
   */
  intervalSeconds?: number;
}
