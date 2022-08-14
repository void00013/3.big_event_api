const express = require('express')
const cors = require('cors')

// 创建服务器实例对象
const app = express()

// 注册cors中间件
app.use(cors())
// 配置解析x-www-form-urlencoded格式请求体的中间件
app.use(express.urlencoded({ extended: false }))

app.listen(100, () => {
  console.log('server runing http://127.0.0.1:100')
})
