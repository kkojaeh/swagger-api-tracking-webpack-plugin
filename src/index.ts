// @ts-ignore
import flatMap from 'array.prototype.flatmap';
import container from "./inversify.config";
import webpack from "webpack";
import TYPES from "./types";
import {Config, DefaultConfig} from "./config";

flatMap.shim()


class SwaggerApiTrackingWebpackPlugin implements webpack.Plugin {

  constructor(cfg: Config) {
    container.bind<Config>(TYPES.Config).toConstantValue(new DefaultConfig(cfg))
  }

  apply(compiler: webpack.Compiler): void {
    const plugin = container.get<webpack.Plugin>(TYPES.Plugin);
    plugin.apply(compiler)
  }

}


module.exports = SwaggerApiTrackingWebpackPlugin
