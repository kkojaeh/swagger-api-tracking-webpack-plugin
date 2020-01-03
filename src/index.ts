import container from "./inversify.config";
import webpack from "webpack";
import TYPES from "./types";
import {Config} from "./config";


export default class implements webpack.Plugin {

  constructor(cfg?: Config) {
    container.bind<Config>(TYPES.Config).toConstantValue(cfg!)
  }

  apply(compiler: webpack.Compiler): void {
    const plugin = container.get<webpack.Plugin>(TYPES.Plugin);
    plugin.apply(compiler)
  }

}
