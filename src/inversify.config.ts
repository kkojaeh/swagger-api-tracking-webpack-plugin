import "reflect-metadata"
import {Container} from "inversify"
import TYPES from "./types"
import ApiLoader from "./api-loader"
import Repository from "./repository"
import ApiResolver from "./api-resolver"
import HttpApiLoader from "./impl/http-api-loader"
import LowdbRepository from "./impl/lowdb-repository"
import Swagger2ApiResolver from "./impl/swagger2-api-resolver"
import webpack from "webpack";
import Plugin from "./plugin";

const container = new Container()
container.bind<ApiLoader>(TYPES.ApiLoader).to(HttpApiLoader)
container.bind<Repository>(TYPES.Repository).to(LowdbRepository)
container.bind<ApiResolver>(TYPES.ApiResolver).to(Swagger2ApiResolver)
container.bind<webpack.Plugin>(TYPES.Plugin).to(Plugin)

export default container
