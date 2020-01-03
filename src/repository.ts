import {Api} from "./api";

export default interface Repository {

  getNextFireTime(): number

  setNextFireTime(time: number): void

  getLatest(name: string): Api

  getOldest(name: string): Api

  get(id: string): Api

  getAll(name: string): Array<Api>

  size(name: string): number

  getContent(id: string): any

  setContent(id: string, content: any): void

  removeContent(id: string): void

  add(api: Api): Api

  remove(id: string): void

  clear(): void

}

