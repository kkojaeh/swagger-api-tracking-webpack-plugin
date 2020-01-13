import "reflect-metadata";
import ApiResolver from "../src/api-resolver";
import v1Api from './swagger-api/swagger2-v1.json'
import v1IgnoredDiffApi from './swagger-api/swagger2-v1-ignored-diff.json'
import invalidApi from './swagger-api/swagger2-invalid.json'
import v2Api from './swagger-api/swagger2-v2.json'
import container from "../src/inversify.config";
import {Config, DefaultConfig} from "../src/config";
import TYPES from "../src/types";

container.bind<Config>(TYPES.Config).toConstantValue(new DefaultConfig())


describe('api resolver', () => {
  const resolver = container.get<ApiResolver>(TYPES.ApiResolver)

  it('swagger 버전을 확인해야 함', () => {
    expect(() => resolver.equals(v1Api, invalidApi)).toThrow("not swagger format")
  })

  it('무시되는 속성이 변경된 경우에는 동일로 판단', () => {
    expect(resolver.equals(v1Api, v1IgnoredDiffApi)).toBe(true)
  })

  it('무시되는 속성이 변경된 경우에는 동일로 판단', () => {
    expect(resolver.equals(v1Api, v1IgnoredDiffApi)).toBe(true)
  })

  it('동일한 swagger api 차이를 확인', async () => {
    const diff = await resolver.diff(v1Api, v1Api)
    expect(diff.length).toBe(0)
  })

  it('추가된 swagger api 차이를 확인', async () => {
    const diff = await resolver.diff(v1Api, v2Api)
    expect(diff.length).toBe(1)
  })
})
