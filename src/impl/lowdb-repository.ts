import Lowdb from "lowdb"
import LowdbFileSync from "lowdb/adapters/FileSync"
import {Api} from "../api"
import uuid from "uuid"
import Repository from "../repository"
// @ts-ignore
import lodashId from 'lodash-id'
import os from "os";
import {injectable} from "inversify"

const homedir = os.homedir();

@injectable()
export default class LowdbRepository implements Repository {

  private db: Lowdb.LowdbSync<Schema>

  constructor() {
    const adapter = new LowdbFileSync<Schema>(`${homedir}/.swagger-api-tracking-webpack-plugin.json`)
    this.db = Lowdb(adapter)
    this.db._.mixin(lodashId)
    this.db.defaults({nextFireTime: -1, apis: [], contents: {}}).write();
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

  getContent(id: string): any {
    return this.db.get(`contents.${id}`).value() || null;
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

  setContent(id: string, content: any): void {
    this.db.set(`contents.${id}`, content).write();
  }

  removeContent(id: string): void {
    this.db.unset(`contents.${id}`).write();
  }

  clear(): void {
    this.db.setState({nextFireTime: -1, apis: [], contents: {}})
  }
}

interface Schema {

  nextFireTime: number

  apis: Array<Api>

  contents: { [id: string]: any }

}


//  "version":"1.0.74-SNAPSHOT:1577065388056","title":"com.togle.waybill:cloud Api"
