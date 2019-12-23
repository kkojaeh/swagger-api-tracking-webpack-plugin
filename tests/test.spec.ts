import webpack from 'webpack';
import getWebpackConfig from './webpack.config';
import {TestApiLoader} from "./api-loader";

// TODO: test for registerSnoreToast

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
    webpack(getWebpackConfig({
      apis: [{
        name: "test",
        url: "http://test/api.json"
      }],
      apiLoader: new TestApiLoader()
    }), (err, stats) => {
      //expect(notifier.notify).not.toHaveBeenCalled();
      done();
    });
  });
});
