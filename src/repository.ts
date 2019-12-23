import os from 'os'
import LowdbFileSync from 'lowdb/adapters/FileSync'
import Lowdb from "lowdb"
import {Schema} from "inspector";

const homedir = os.homedir();

export interface Repository {

  getNextFireTime(): number

  setNextFireTime(time: number): void

}

export class LowdbRepository implements Repository {

  private db: Lowdb.LowdbSync<Schema>

  constructor() {
    const adapter = new LowdbFileSync<Schema>(`${homedir}/.swagger-api-tracking-webpack-plugin.json`)
    this.db = Lowdb(adapter)
    const write: Schema = this.db.defaults({nextFireTime: -1}).write();
  }

  getNextFireTime(): number {
    return this.db.get('nextFireTime').value();
  }

  setNextFireTime(time: number): void {
    this.db.set('nextFireTime', time)
      .write()
  }
}

interface Schema {
  nextFireTime: number
}

interface ApiInfo {
  title: string
  version: string
  createdAt: Date
}

//  "version":"1.0.74-SNAPSHOT:1577065388056","title":"com.togle.waybill:cloud Api"

