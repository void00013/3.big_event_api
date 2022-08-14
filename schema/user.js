// 导入定义验证规则的包
const Joi = require('joi')

// 定义用户名和密码的验证规则
const username = Joi.string().alphanum().min(1).max(10).required()
const password = Joi.string().required().pattern(/^[\S]{6,12}$/)

exports.reg_login_schema = {
  body: {
    username,
    password
  }
}
