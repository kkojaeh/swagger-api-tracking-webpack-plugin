[![npm][npm]][npm-url]
[![node][node]][node-url]

# Swagger API tracking Webpack Plugin

swagger API 를 통한 개발시 변경에 대한 추적 및 비교를 제공하는 plugin  입니다.

## Install

```
npm i --save-optional swagger-api-tracking-webpack-plugin
```

```
yarn add --optional swagger-api-tracking-webpack-plugin
```

## Requirements
- java 1.8

## Usage
아래와 같이 당신의  `webpack` 설정에 plugin 을 추가합니다.
```
const SwaggerApiTrackingWebpackPlugin = require('swagger-api-tracking-webpack-plugin')

module.exports = {
  //...
  plugins: [
    new SwaggerApiTrackingWebpackPlugin({
      apis: [
        { name: 'petstore',  url: https://petstore.swagger.io/v2/swagger.json' },
      ]
    })
  ]
}
```
### Options
| Name           | Type         | Description                       | Default |
|----------------|--------------|-----------------------------------|---------|
|apis            |Array<Object> |API List Object with name and url  |         |
|intervalSeconds |Number        |tracking interval seconds          | 600     |
|keepSize        |Number        |api keep size                      | 20      |
|workSpace       |String        |file location for persist          | [homedir]/.swagger-api-tracking-webpack-plugin |
|port            |Number        |server port                        | 50505   |

## Screenshots



<!---
npm publish :  배포
npm version patch : release
-->

[npm]: https://img.shields.io/npm/v/swagger-api-tracking-webpack-plugin.svg
[npm-url]: https://www.npmjs.com/package/swagger-api-tracking-webpack-plugin

[node]: https://img.shields.io/node/v/swagger-api-tracking-webpack-plugin.svg
[node-url]: https://nodejs.org
