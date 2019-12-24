export type Api = {
  id?: string
  name: string
  title: string
  version: string
  createdAt: Date
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
