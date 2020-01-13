import "reflect-metadata";
import webpack from 'webpack';
import getWebpackConfig from './webpack.config';
import ApiLoader from "../src/api-loader";
import v1 from './swagger-api/swagger2-v1.json'
import TYPES from "../src/types";
import Plugin from "../src/plugin";
import {Config} from "../src/config";
import {Container} from "inversify";
import ApiRepository from "../src/api-repository";
import ApiRepositoryLowdb from "../src/impl/api-repository-lowdb";
import ApiResolver from "../src/api-resolver";
import ApiResolverSwaggerDiff from "../src/impl/api-resolver-swagger2";


class TestApiLoader implements ApiLoader {
  public api: Object

  async load(url: string): Promise<object> {
    return this.api
  }
}


const testApiLoader = new TestApiLoader()
const container = new Container()
container.bind<ApiRepository>(TYPES.ApiRepository).to(ApiRepositoryLowdb)
container.bind<ApiResolver>(TYPES.ApiResolver).to(ApiResolverSwaggerDiff)
container.bind<webpack.Plugin>(TYPES.Plugin).to(Plugin)
container.bind<ApiLoader>(TYPES.ApiLoader).toConstantValue(testApiLoader)
container.bind<Config>(TYPES.Config).toConstantValue({
  apis: [{
    name: "test",
    url: "http://test/api.json"
  }],
  intervalSeconds: 5
})

let plugin = container.get<webpack.Plugin>(TYPES.Plugin)

describe('Test Webpack build', () => {

  beforeEach(() => {


  })

  it('Should not show an initial success notification when suppressSuccess is "initial"', (done) => {
    //expect.assertions(1);
    testApiLoader.api = v1
    const compiler = webpack(getWebpackConfig(plugin), (err, stats) => {
      //expect(notifier.notify).not.toHaveBeenCalled();
      done();
    });
  })
})
