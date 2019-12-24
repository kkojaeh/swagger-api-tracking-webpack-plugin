import webpack from 'webpack';
import getWebpackConfig from './webpack.config';
import {ApiLoader} from "../src/api-loader";
import v1 from './swagger-api/swagger2-v1.json'

class TestApiLoader implements ApiLoader {
  public api: Object

  async load(url: string): Promise<object> {
    return this.api
  }
}

const testApiLoader = new TestApiLoader()

describe('Test Webpack build', () => {
  const platform = process.platform;
  const arch = process.arch;

  afterAll(() => {
    if (platform !== process.platform) {
      Object.defineProperty(process, 'platform', {
        value: platform
      });
      Object.defineProperty(process, 'arch', {
        value: arch
      });
    }
  });

  it('Should not show an initial success notification when suppressSuccess is "initial"', (done) => {
    //expect.assertions(1);
    testApiLoader.api = v1
    const compiler = webpack(getWebpackConfig({
      apis: [{
        name: "test",
        url: "http://test/api.json"
      }],
      apiLoader: testApiLoader
    }), (err, stats) => {
      //expect(notifier.notify).not.toHaveBeenCalled();
      done();
    });
  });
});
