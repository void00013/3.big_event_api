const express = require('express')
const userinfo_handler = require('../router_handler/userinfo')
const expressJoi = require('@escook/express-joi')
const { update_userinfo_schema, update_password_schema, update_avatar_schema } = require('../schema/user')

// 创建路由模块
const router = express.Router()

// 挂载路由
router.get('/userinfo', userinfo_handler.getUserInfo)
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)
router.post('/updatepwd', expressJoi(update_password_schema), userinfo_handler.updatePassword)
router.post('/updateavatar', expressJoi(update_avatar_schema), userinfo_handler.updateAvatar)

module.exports = router
