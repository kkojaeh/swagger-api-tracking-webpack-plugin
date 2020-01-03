export type ApiConfig = {
  name: string,

  url: string,
}
export type Config = {

  /**
   * Api Name and Url mapping
   */
  apis: Array<ApiConfig>,

  /**
   * tracking interval seconds. defaults to `600`
   */
  intervalSeconds?: number;

  /**
   * api keep size. defaults to `20`
   */
  keepSize?: number
}
