import axios from 'axios'

export class ApiConfig {

  private _name: string

  constructor(name: string) {
    this._name = name
  }
}

export class ApiConfigCollection {

  private _models: Array<ApiConfig>

  constructor(models: Array<ApiConfig>) {
    this._models = models
  }

  static async get(): Promise<ApiConfigCollection> {
    const response = await axios.get<Array<ApiConfig>>('/configs')
    return new ApiConfigCollection(response.data)
  }

}
