const express = require('express')
// 导入路由对应的函数
const user_handler = require('../router_handler/user')
// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const { reg_login_schema } = require('../schema/user')

const router = express.Router()

router.post('/reguser', expressJoi(reg_login_schema), user_handler.regUser)
router.post('/login', expressJoi(reg_login_schema), user_handler.login)

module.exports = router
