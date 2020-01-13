import {Api} from "./api";

export default interface ApiRepository {

  getNextFireTime(): number

  setNextFireTime(time: number): void

  getLatest(name: string): Api

  getOldest(name: string): Api

  get(id: string): Api

  getAll(name: string): Array<Api>

  size(name: string): number

  add(api: Api): Api

  remove(id: string): void

  clear(): void

}

