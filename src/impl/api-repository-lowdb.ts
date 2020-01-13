import Lowdb from "lowdb"
import LowdbFileSync from "lowdb/adapters/FileSync"
import {Api} from "../api"
import uuid from "uuid"
import ApiRepository from "../api-repository"
// @ts-ignore
import lodashId from 'lodash-id'
import {inject, injectable} from "inversify"
import TYPES from "../types";
import {Config} from "../config";

@injectable()
export default class ApiRepositoryLowdb implements ApiRepository {

  private db: Lowdb.LowdbSync<Schema>

  constructor(@inject(TYPES.Config) cfg: Config) {

    const adapter = new LowdbFileSync<Schema>(`${cfg.workSpace}/apis.json`)
    this.db = Lowdb(adapter)
    this.db._.mixin(lodashId)
    this.db.defaults({nextFireTime: -1, apis: []}).write();
  }

  getNextFireTime(): number {
    return this.db.get('nextFireTime').value();
  }

  setNextFireTime(time: number): void {
    this.db.set('nextFireTime', time)
      .write()
  }

  add(api: Api): Api {
    if (api.id) {
      throw new Error("already id exists")
    }
    api.id = uuid()
    this.db.get('apis')
      .push(api)
      .write()
    return api
  }

  get(id: string): Api {
    return this.db.get('apis')
      .filter({id})
      .value()[0] || null
  }

  getAll(name: string): Array<Api> {
    return this.db.get('apis')
      .filter({name})
      .sortBy('createdAt')
      .value()
      .reverse()
  }

  size(name: string): number {
    return this.db.get('apis')
      .filter({name})
      .value()
      .length
  }

  getLatest(name: string): Api {
    return this.db.get(`apis`)
      .filter({name})
      .sortBy('createdAt')
      .value()
      .reverse()[0] || null;
  }

  getOldest(name: string): Api {
    return this.db.get(`apis`)
      .filter({name})
      .sortBy('createdAt')
      .value()[0] || null;
  }

  remove(id: string): void {
    this.db.get('apis')
      // @ts-ignore
      .removeById(id)
      .write()
  }

  clear(): void {
    this.db.setState({nextFireTime: -1, apis: []})
  }
}

interface Schema {

  nextFireTime: number

  apis: Array<Api>

}
