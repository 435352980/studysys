# studysys
基于React+Nodejs的个人全栈学习项目
## 启动方式
1.开启后台mock server`cd ./api && yarn && yarn mock`<br/>
2.调试前需提前生成dll库文件`cd ./client && yarn && yarn build:dll`<br/>
调试 `yarn dev`<br/>
模拟打包上线 `yarn serve`<br/>
后端接口配置为http://localhost:3000<br/>
后端接口apidoc配置为http://localhost:3000/graphiql<br/>
前端地址为http://localhost:8080<br/>
## docker nginx启动(默认81端口)
`cd ./client && docker-compose up -d`

