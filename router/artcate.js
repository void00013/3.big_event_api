const express = require('express')
const artcate_handler = require('../router_handler/artcate')
const { add_cate_schema, delete_cate_schema, get_cate_schema, update_cate_schema } = require('../schema/user')
const expressJoi = require('@escook/express-joi')

const router = express.Router()

router.get('/cates', artcate_handler.getArticleCates)
router.post('/addcates', expressJoi(add_cate_schema), artcate_handler.addArticleCates)
router.get('/deletecate/:id', expressJoi(delete_cate_schema), artcate_handler.deleteCateById)
router.get('/cates/:id', expressJoi(get_cate_schema), artcate_handler.getArtCateById)
router.post('/updatecate', expressJoi(update_cate_schema), artcate_handler.updateCateById)

module.exports = router
