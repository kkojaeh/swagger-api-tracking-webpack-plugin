import axios from 'axios'

type ApiConfigType = {
  name: string
}

const development = process.env.NODE_ENV !== "production"


export class ApiConfig {

  private _name: string

  constructor(type: ApiConfigType) {
    this._name = type.name
  }

  get name(): string {
    return this._name
  }
}

export class ApiConfigCollection {

  private _models: Array<ApiConfig>

  constructor(models: Array<ApiConfig>) {
    this._models = models
  }

  get models(): Array<ApiConfig> {
    return this._models
  }

  static async get(): Promise<ApiConfigCollection> {
    let url = "/configs"
    if (development) {
      url = "/configs.json"
    }
    const response = await axios.get<Array<ApiConfigType>>(url)
    return new ApiConfigCollection(response.data.map(type => new ApiConfig(type)))
  }

}

type ApiType = {
  name: string,
  title: string,
  version: string,
  createdAt: string,
  id: string
}

export class Api {

  private _name: string
  private _title: string
  private _id: string

  constructor(type: ApiType) {
    this._name = type.name
    this._title = type.title
    this._version = type.version
    this._id = type.id
    this._createdAt = new Date(Date.parse(type.createdAt))
  }

  private _version: string

  get version(): string {
    return this._name
  }

  private _createdAt: Date

  get createdAt(): Date {
    return this._createdAt
  }

  async diff(to: Api): Promise<ApiDiff> {
    let url = `/apis/${this._id}/diff/${to._id}`
    if (development) {
      url = "/diff.json"
    }
    const response = await axios.get<ApiDiff>(url)
    return response.data
  }
}

export type ApiDiff = {
  type: string
  location: string
  message: string
  level: ApiDiffLevel
}

export enum ApiDiffLevel {
  WARNING = 'warning',
  ERROR = 'error',
  INFO = 'info',
  CRITICAL = 'critical'
}


export class ApiCollection {

  constructor(models: Array<Api>) {
    this._models = models
  }

  private _models: Array<Api>

  get models(): Array<Api> {
    return this._models
  }

  static async get(name: string): Promise<ApiCollection> {
    let url = `/configs/${name}/apis`
    if (development) {
      url = "/apis.json"
    }
    const response = await axios.get<Array<ApiType>>(url)
    return new ApiCollection(response.data.map(data => new Api(data)))
  }

}
