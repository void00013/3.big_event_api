const express = require('express')
const cors = require('cors')
const userRouter = require('./router/user')
const userinfoRouter = require('./router/userinfo')
const artCateRouter = require('./router/artcate')
const articleRouter = require('./router/article')
// 导入解析token的中间件
const {expressjwt: jwt} = require('express-jwt')
// 导入jwt配置对象
const config = require('./config')

// 创建服务器实例对象
const app = express()

// 托管静态资源 **************************************
app.use('/uploads', express.static('./uploads'))

// 注册cors中间件
app.use(cors())

// 配置解析x-www-form-urlencoded格式请求体的中间件
app.use(express.urlencoded({ extended: false }))
// 和解析json的中间件一样，因为urlencoded和json格式的数据都是text格式的数据，所以这两个中间件在解析完成后都直接把数据挂载在req.body中

// 注册一个全局中间件，封装res.cc函数，用来提示响应信息，一定要在路由模块之前封装
app.use((req, res, next) => {
  res.cc = function(err, status = 1) {
    res.send({
      status,
      // 判断err是否为错误对象，是则返回错误信息，不是则返回错误的字符串。也可以返回成功信息
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

// 注册解析token的中间件,设置不需要访问权限的路径,解析的token必须带有Bearer 的前缀，这个前缀不是token本身的，但是发送和解析时都需要在token前加上这个前缀
app.use(jwt({ secret: config.secret, algorithms: ["HS256"] }).unless({ path: [/^\/api/] }))
// expressjwt中间件解析token后把解析后的信息对象(有效荷载)挂载在请求对象req的auth属性上

// 注册路由模块
app.use('/api', userRouter)
app.use('/my', userinfoRouter)
app.use('/my/article', artCateRouter)
app.use('/my/article', articleRouter)

// 定义全局的错误级别中间件
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') { return res.cc('无效的token') }
  res.cc(err)
})

app.listen(100, () => {
  console.log('server runing http://127.0.0.1:100')
})
