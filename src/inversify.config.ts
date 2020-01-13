import "reflect-metadata"
import {Container} from "inversify"
import TYPES from "./types"
import ApiLoader from "./api-loader"
import ApiRepository from "./api-repository"
import ApiResolver from "./api-resolver"
import ApiLoaderHttp from "./impl/api-loader-http"
import ApiRepositoryLowdb from "./impl/api-repository-lowdb"
import ApiResolverSwaggerDiff from "./impl/api-resolver-swagger-diff"
import webpack from "webpack";
import Plugin from "./plugin";
import ContentRepository from "./content-repository";
import ContentRepositoryFs from "./impl/content-repository-fs";

const container = new Container()
container.bind<ApiLoader>(TYPES.ApiLoader).to(ApiLoaderHttp)
container.bind<ApiRepository>(TYPES.ApiRepository).to(ApiRepositoryLowdb)
container.bind<ApiResolver>(TYPES.ApiResolver).to(ApiResolverSwaggerDiff)
container.bind<ContentRepository>(TYPES.ContentRepository).to(ContentRepositoryFs)
container.bind<webpack.Plugin>(TYPES.Plugin).to(Plugin)

export default container
