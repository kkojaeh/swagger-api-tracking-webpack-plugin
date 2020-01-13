import "reflect-metadata";
import ContentRepository from "../src/content-repository"
import container from "../src/inversify.config";
import {Config, DefaultConfig} from "../src/config";
import TYPES from "../src/types";

container.bind<Config>(TYPES.Config).toConstantValue(new DefaultConfig())

describe('content repository', () => {

  const repository: ContentRepository = container.get<ContentRepository>(TYPES.ApiRepository)

  beforeEach(() => {

  })

  it('first getContent is null', () => {
    expect(repository.getContent("test")).toBe(null)
  })

  it('setContent and getContent', () => {
    const content = {abc: [], bcd: '1'}
    repository.setContent("test", content)
    expect(repository.getContent("test")).toBe(content)
  })

  it('setContent and removeContent and getContent', () => {
    const content = {abc: [], bcd: '1'}
    repository.setContent("test", content)
    repository.removeContent("test")
    expect(repository.getContent("test")).toBe(null)
  })

})
