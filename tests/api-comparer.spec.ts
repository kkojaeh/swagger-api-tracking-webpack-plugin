import {Swagger2ApiComparer} from "../src/api-comparer";
import v1Api from './swagger-api/swagger2-v1.json'
import v1IgnoredDiffApi from './swagger-api/swagger2-v1-ignored-diff.json'
import invalidApi from './swagger-api/swagger2-invalid.json'
import v2Api from './swagger-api/swagger2-v2.json'
// TODO: test for registerSnoreToast

describe('api comparer', () => {

  const comparer = new Swagger2ApiComparer()
  it('swagger 버전을 확인해야 함', () => {
    expect(() => comparer.equals(v1Api, invalidApi)).toThrow("not swagger format")
  })

  it('무시되는 속성이 변경된 경우에는 동일로 판단', () => {
    expect(comparer.equals(v1Api, v1IgnoredDiffApi)).toBe(true)
  })

  it('무시되는 속성이 변경된 경우에는 동일로 판단', () => {
    expect(comparer.equals(v1Api, v1IgnoredDiffApi)).toBe(true)
  })

  it('동일한 swagger api 차이를 확인', async () => {
    const diff = await comparer.diff(v1Api, v1Api)
    expect(diff.length).toBe(0)
  })

  it('추가된 swagger api 차이를 확인', async () => {
    const diff = await comparer.diff(v1Api, v2Api)
    expect(diff.length).toBe(1)
  })
})
