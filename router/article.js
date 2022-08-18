const express = require('express')
const article_handler = require('../router_handler/article')
const expressJoi = require('@escook/express-joi')
const { add_article_schema, get_article_list_schema, delete_article_schema, get_article_info_schema, update_article_info_schema } = require('../schema/user')
// 导入解析 formdata 格式表单数据的包
// 将文件类型的数据，解析并挂载到 req.file 属性中
// 将文本类型的数据，解析并挂载到 req.body 属性中
const multer = require('multer')


const router = express.Router()

// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// dest:表示把文件上传到哪个目录下,默认以当前项目的根目录开始
// 下面的 single()内的参数 表示上传文件的字段的名称
// 注意：解析formdata格式的中间件放在验证规则的中间件(Joi)之前，因为只有解析完成后，才会把数据挂载到body上
router.post('/add', multer({dest: 'uploads/'}).single('cover_img'), expressJoi(add_article_schema), article_handler.addArticle)
router.get('/list', expressJoi(get_article_list_schema), article_handler.getArticleList)
router.get('/delete/:id', expressJoi(delete_article_schema), article_handler.deleteArticle)
router.get('/:id', expressJoi(get_article_info_schema), article_handler.getArticleInfo)
router.post('/edit', multer({dest: 'uploads/'}).single('cover_img'), expressJoi(update_article_info_schema), article_handler.updateArticleInfo)

module.exports = router
