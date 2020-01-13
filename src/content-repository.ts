export default interface ContentRepository {

  getContent(id: string): any

  setContent(id: string, content: any): void

  removeContent(id: string): void

  getLocation(id: string): string

}

