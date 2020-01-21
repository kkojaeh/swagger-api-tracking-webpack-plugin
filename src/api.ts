export type Api = {
  id?: string
  name: string
  title: string
  version: string
  createdAt: Date
}

export type ApiDiff = {
  method: ApiMethod
  type: ApiDiffType
  location: string
  messages: Array<string>
  fromRef?: string
  toRef?: string
}

export enum ApiMethod {
  GET = 'GET',
  PUT = 'PUT',
  POST = 'POST',
  DELETE = 'DELETE'
}


export enum ApiDiffType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete'
}
