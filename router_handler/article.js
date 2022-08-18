const db = require('../db/index')

// 添加新文章
exports.addArticle = (req, res) => {
  // 将文件类型的数据，解析并挂载到 req.file 属性中
  // 将文本类型的数据，解析并挂载到 req.body 属性中
  // console.log(req.body) // 文本类型的数据
  // console.log(req.file) // 文件类型的数据
  if(!req.file || req.file.fieldname !== 'cover_img') { return res.cc('文章封面是必选参数！') }

  const articleInfo = {
    ...req.body,
    // 封面
    cover_img: '/uploads/' + req.file.filename,
    // 发布时间
    pub_date: new Date(),
    // 作者id
    author_id: req.auth.id
  }

  const sql = 'insert into ev_article set ?'

  db.query(sql, articleInfo, (err, results) => {
    if(err) { return res.cc(err) }
    if(results.affectedRows !== 1) { return res.cc('新增文章失败，请重试！') }
    res.cc('新增文章成功！')
  })
}

// 获取文章列表
exports.getArticleList = (req, res) => {
  const sql = 'select * from ev_article where cate_id=? and state=? and is_delete=0'
  db.query(sql, [req.query.cate_id, req.query.state], (err, results) => {
    if(err) { return res.cc(err) }
    // console.log(req.query)
    const arr = results.filter((item, index) => {
      return (index + 1) > (req.query.pagenum - 1) * req.query.pagesize && (index + 1) < (req.query.pagenum * req.query.pagesize + 1)
    })
    res.send({
      status: 0,
      message: '获取文章列表成功！',
      data: arr
    })
  })
}

// 根据id删除文章
exports.deleteArticle = (req, res) => {
  // console.log(req.params)
  const sql = 'update ev_article set is_delete=1 where id=?'
  db.query(sql, req.params.id, (err, results) => {
    if(err) { return res.cc(err) }
    if(results.affectedRows !== 1) { return res.cc('删除文章失败！') }
    res.cc('删除文章成功！', 0)
  })
}

// 通过id获取文章详情
exports.getArticleInfo = (req, res) => {
  const sql = 'select * from ev_article where id=?'
  db.query(sql, req.params.id, (err, results) => {
    if(err) { return res.cc(err) }
    if(results.length !== 1) { return res.cc('获取文章详情失败！') }
    res.send({
      status: 0,
      message: '获取文章详情成功！',
      data: results[0]
    })
  })
}

// 更新文章详情
exports.updateArticleInfo = (req, res) => {
  if(!req.file || req.file.fieldname !== 'cover_img') { return res.cc('文章封面是必选参数！') }
  const sql = 'select author_id from ev_article where id=?'
  db.query(sql, req.body.id, (err, results) => {
    if(err) { return res.cc(err) }
    if(results.length !== 1) { return res.cc('找不到该文章！') }
    // console.log(results[0].author_id)
    if(req.auth.id !== results[0].author_id) { return res.cc('不是作者本人，禁止修改！') }
    const articleInfo = {
      ...req.body,
      cover_img: '/uploads/' + req.file.filename,
      pub_date: new Date()
    }
    const sql = 'update ev_article set ? where id=?'
    db.query(sql, [articleInfo, req.body.id], (err, results) => {
      if(err) { return res.cc(err) }
      if(results.affectedRows !== 1) { return res.cc('修改文章失败！') }
      res.cc('修改文章成功！')
    })
  })
}
