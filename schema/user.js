// 导入定义验证规则的包
const Joi = require('joi')

// 定义用户名和密码的验证规则
const username = Joi.string().alphanum().min(1).max(10).required()
const password = Joi.string().required().pattern(/^[\S]{6,12}$/)

// 定义 id, nickname, email 的验证规则
const id = Joi.number().integer().min(1).required()
const nickname = Joi.string().required()
const email = Joi.string().email().required()

// dataUri() 指的是如下格式的字符串数据：
// data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
// 定义图片的校验规则base64
const avatar = Joi.string().dataUri().required()

// 定义文章分类的验证规则
const name = Joi.string().required()
const alias = Joi.string().alphanum().required()

// 定义文章详情的验证规则
const title = Joi.string().required()
const content = Joi.string().required().allow('')
const state = Joi.string().required().valid('已发布', '草稿')
const cate_id = id

// 定义获取文章列表的验证规则
const pagenum = Joi.number().min(1).required()
const pagesize = pagenum

exports.reg_login_schema = {
  body: {
    username,
    password
  }
}

exports.update_userinfo_schema = {
  body: {
    id,
    nickname,
    email
  }
}

// 1. joi.ref('oldPwd') 表示 newPwd 的值必须和 oldPwd 的值保持一致
// 2. joi.not(joi.ref('oldPwd')) 表示 newPwd 的值不能等于 oldPwd 的值
// 3. .concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这两条验证规则
exports.update_password_schema = {
  body: {
    oldPwd: password,
    newPwd: Joi.not(Joi.ref('oldPwd')).concat(password)
  }
}

exports.update_avatar_schema = {
  body: {
    avatar
  }
}

exports.add_cate_schema = {
  body: {
    name,
    alias
  }
}

exports.delete_cate_schema = {
  params: {
    id
  }
}

exports.get_cate_schema = {
  params: {
    id
  }
}

exports.update_cate_schema = {
  body: {
    id,
    name,
    alias
  }
}

exports.add_article_schema = {
  body: {
    title,
    content,
    state,
    cate_id
  }
}

exports.get_article_list_schema = {
  query: {
    pagenum,
    pagesize,
    cate_id,
    state
  }
}

exports.delete_article_schema = {
  params: {
    id
  }
}

exports.get_article_info_schema = {
  params: {
    id
  }
}

exports.update_article_info_schema = {
  body: {
    id,
    title,
    content,
    state,
    cate_id
  }
}
