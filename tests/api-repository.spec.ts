import "reflect-metadata";
import ApiRepository from "../src/api-repository"
import {Api} from "../src/api"
import container from "../src/inversify.config";
import {Config, DefaultConfig} from "../src/config";
import TYPES from "../src/types";

container.bind<Config>(TYPES.Config).toConstantValue(new DefaultConfig())

describe('api repository', () => {

  const now = new Date(Date.now())
  const later = new Date(Date.now() + 1000)
  let api1: Api
  let api2: Api

  const repository: ApiRepository = container.get<ApiRepository>(TYPES.ApiRepository)

  beforeEach(() => {
    api1 = {
      name: "test",
      title: "테스트1",
      version: "V1",
      createdAt: now
    }
    api2 = {
      name: "test",
      title: "테스트1",
      version: "V2",
      createdAt: later
    }
    repository.clear()
  })

  it('first getNextFireTime is -1', () => {
    expect(repository.getNextFireTime()).toBe(-1)
  })

  it('setNextFireTime and getNextFireTime', () => {
    const now = Date.now()
    repository.setNextFireTime(now)
    expect(repository.getNextFireTime()).toBe(now)
  })

  it('first getLatest is null', () => {
    expect(repository.getLatest("test")).toBe(null)
  })

  it('add twice', () => {
    repository.add(api1)
    expect(() => repository.add(api1)).toThrow("already id exists")
  })

  it('getLatest sorted by createdAt desc', () => {
    repository.add(api1)
    repository.add(api2)
    expect(repository.getLatest("test").version).toBe("V2")
  })

  it('getAll sorted by createdAt desc', () => {
    repository.add(api1)
    repository.add(api2)
    expect(repository.getAll("test").map(a => a.version).join("/")).toBe("V2/V1")
  })

  it('add and get', () => {
    repository.add(api1)
    expect(repository.get(api1.id!)).toBe(api1)
  })

  it('add and remove', () => {
    repository.add(api1)
    repository.remove(api1.id!)
    expect(repository.get(api1.id!)).toBe(null)
  })

})
